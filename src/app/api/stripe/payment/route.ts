import { NextResponse } from 'next/server';
import { getAuthSession } from '@/libs/auth';
import { stripe } from '@/libs/stripe';
import { CartItem } from '@/types/product';

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { items } = body as { items: CartItem[] };

        if (!items?.length) {
            return NextResponse.json(
                { error: 'No items in cart' },
                { status: 400 }
            );
        }

        // Create Stripe checkout session
        const stripeSession = await stripe.checkout.sessions.create({
            customer_email: session.user.email || undefined,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: items.map((item) => ({
                price: item.priceId,
                quantity: 1,
            })),
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/user/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/user/products?canceled=true`,
            metadata: {
                userId: session.user.id,
            },
        });

        return NextResponse.json({ url: stripeSession.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
} 