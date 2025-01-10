import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { stripe } from '@/libs/stripe';
import { prisma } from '@/libs/prisma';

export async function GET() {
    try {
        // Get session
        const session = await getServerSession(authOptions);
        console.log('Session:', { 
            exists: !!session, 
            hasUser: !!session?.user, 
            email: session?.user?.email 
        });
        
        if (!session?.user?.email) {
            return new NextResponse(
                JSON.stringify({ 
                    error: 'You must be signed in to view your products',
                    code: 'UNAUTHORIZED'
                }), 
                { 
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store, max-age=0',
                    }
                }
            );
        }

        // Get user by email
        let user;
        try {
            user = await prisma.user.findUnique({
                where: { email: session.user.email },
                include: { subscription: true }
            });
            console.log('User found:', { 
                exists: !!user, 
                hasCustomerId: !!user?.customerId,
                hasSubscription: !!user?.subscription 
            });
        } catch (error) {
            console.error('Prisma error finding user:', error);
            return NextResponse.json(
                { 
                    error: 'Database error while finding user',
                    code: 'DATABASE_ERROR'
                },
                { status: 503 }
            );
        }

        if (!user) {
            return new NextResponse(
                JSON.stringify({ 
                    error: 'User not found',
                    code: 'NOT_FOUND'
                }), 
                { status: 404 }
            );
        }

        const customerId = user.customerId || user.subscription?.stripeCustomerId;
        console.log('Customer ID:', { exists: !!customerId });

        if (!customerId) {
            // If user has no customer ID, they have no products
            return NextResponse.json(
                { products: [] },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store, max-age=0',
                    }
                }
            );
        }

        // Get Stripe data
        let subscriptions;
        let charges;
        try {
            [subscriptions, charges] = await Promise.all([
                stripe.subscriptions.list({
                    customer: customerId,
                    status: 'active',
                    expand: ['data.items.data.price']
                }),
                stripe.charges.list({
                    customer: customerId,
                    limit: 100,
                    expand: ['data.metadata']
                })
            ]);
            console.log('Stripe data fetched:', {
                subscriptionsCount: subscriptions.data.length,
                chargesCount: charges.data.length
            });
        } catch (error: any) {
            console.error('Stripe API error:', error);
            return NextResponse.json(
                { 
                    error: 'Payment service error',
                    code: 'STRIPE_ERROR',
                    details: error.message
                },
                { status: 503 }
            );
        }

        // Extract product IDs
        const productIds = new Set<string>();

        // Add subscription products
        subscriptions.data.forEach(subscription => {
            subscription.items.data.forEach(item => {
                if (item.price?.product && typeof item.price.product === 'string') {
                    productIds.add(item.price.product);
                }
            });
        });

        // Add one-time purchase products
        charges.data.forEach(charge => {
            if (charge.invoice) return; // Skip subscription charges
            if (charge.metadata?.productId) {
                productIds.add(charge.metadata.productId);
            }
        });

        console.log('Found products:', {
            count: productIds.size,
            ids: Array.from(productIds)
        });

        return NextResponse.json(
            { products: Array.from(productIds).map(id => ({ id })) },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store, max-age=0',
                }
            }
        );

    } catch (error: any) {
        console.error('Unhandled error in products API:', error);
        
        if (error.type === 'StripeError') {
            return NextResponse.json(
                { 
                    error: 'Payment service error',
                    code: 'STRIPE_ERROR',
                    details: error.message
                },
                { status: 503 }
            );
        }

        if (error.code?.startsWith('P')) {
            return NextResponse.json(
                { 
                    error: 'Database error',
                    code: 'DATABASE_ERROR',
                    details: error.message
                },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { 
                error: 'An error occurred while fetching your products',
                code: 'INTERNAL_ERROR',
                details: error.message
            },
            { status: 500 }
        );
    }
} 