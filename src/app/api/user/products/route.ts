import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { stripe } from '@/libs/stripe';
import { prisma } from '@/libs/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
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

        // Get user's Stripe customer ID
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { subscription: true }
        });

        const customerId = user?.customerId || user?.subscription?.stripeCustomerId;

        if (!customerId) {
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

        // Get all subscriptions with minimal expansion
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
            expand: ['data.items.data.price']
        });

        // Get one-time purchases
        const charges = await stripe.charges.list({
            customer: customerId,
            limit: 100,
            expand: ['data.metadata']
        });

        // Extract product IDs from subscriptions and charges
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
            if (charge.invoice) {
                return; // Skip subscription charges
            }
            if (charge.metadata?.productId) {
                productIds.add(charge.metadata.productId);
            }
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

    } catch (error) {
        console.error('Error fetching user products:', error);
        return NextResponse.json(
            { 
                error: 'An error occurred while fetching your products',
                code: 'INTERNAL_ERROR'
            },
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store, max-age=0',
                }
            }
        );
    }
} 