import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

interface PurchaseItem {
    productId: string;
    priceId: string;
    isYearly?: boolean;
    isSubscription: boolean;
}

interface UserProduct {
    productId: string;
    priceId: string;
    status: string;
    isYearly?: boolean;
    currentPeriodEnd?: Date;
    purchaseDate?: Date;
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
    const metadata = subscription.metadata;
    if (!metadata?.userId || !metadata?.items) {
        console.error('Missing metadata in subscription:', subscription.id);
        return;
    }

    try {
        const items = JSON.parse(metadata.items) as PurchaseItem[];
        const mainPlan = items.find(item => !item.isSubscription);
        const addons = items.filter(item => item.isSubscription);

        // Get detailed subscription status
        const detailedStatus = getDetailedSubscriptionStatus(subscription);

        // Update user's products in the database
        await prisma.user.update({
            where: { id: metadata.userId },
            data: {
                products: {
                    upsert: {
                        create: {
                            mainPlan: mainPlan ? JSON.stringify({
                                productId: mainPlan.productId,
                                priceId: mainPlan.priceId,
                                status: detailedStatus,
                                currentPeriodEnd: subscription.current_period_end
                                    ? new Date(subscription.current_period_end * 1000)
                                    : undefined,
                                trialEnd: subscription.trial_end
                                    ? new Date(subscription.trial_end * 1000)
                                    : undefined,
                                cancelAt: subscription.cancel_at
                                    ? new Date(subscription.cancel_at * 1000)
                                    : undefined
                            }) : undefined,
                            addons: addons.map(addon => JSON.stringify({
                                productId: addon.productId,
                                priceId: addon.priceId,
                                isYearly: addon.isYearly,
                                status: detailedStatus,
                                currentPeriodEnd: subscription.current_period_end
                                    ? new Date(subscription.current_period_end * 1000)
                                    : undefined,
                                trialEnd: subscription.trial_end
                                    ? new Date(subscription.trial_end * 1000)
                                    : undefined,
                                cancelAt: subscription.cancel_at
                                    ? new Date(subscription.cancel_at * 1000)
                                    : undefined
                            }))
                        },
                        update: {
                            mainPlan: mainPlan ? JSON.stringify({
                                productId: mainPlan.productId,
                                priceId: mainPlan.priceId,
                                status: detailedStatus,
                                currentPeriodEnd: subscription.current_period_end
                                    ? new Date(subscription.current_period_end * 1000)
                                    : undefined,
                                trialEnd: subscription.trial_end
                                    ? new Date(subscription.trial_end * 1000)
                                    : undefined,
                                cancelAt: subscription.cancel_at
                                    ? new Date(subscription.cancel_at * 1000)
                                    : undefined
                            }) : undefined,
                            addons: {
                                push: addons.map(addon => JSON.stringify({
                                    productId: addon.productId,
                                    priceId: addon.priceId,
                                    isYearly: addon.isYearly,
                                    status: detailedStatus,
                                    currentPeriodEnd: subscription.current_period_end
                                        ? new Date(subscription.current_period_end * 1000)
                                        : undefined,
                                    trialEnd: subscription.trial_end
                                        ? new Date(subscription.trial_end * 1000)
                                        : undefined,
                                    cancelAt: subscription.cancel_at
                                        ? new Date(subscription.cancel_at * 1000)
                                        : undefined
                                }))
                            }
                        }
                    }
                }
            }
        });

        console.log('Successfully updated subscription:', {
            userId: metadata.userId,
            subscriptionId: subscription.id,
            status: detailedStatus,
            mainPlan: mainPlan?.productId,
            addonsCount: addons.length
        });
    } catch (error) {
        console.error('Error handling subscription created:', {
            error,
            subscriptionId: subscription.id,
            userId: metadata.userId
        });
        throw error;
    }
}

// Helper function to get detailed subscription status
function getDetailedSubscriptionStatus(subscription: Stripe.Subscription): string {
    if (subscription.status === 'active') {
        if (subscription.cancel_at_period_end) {
            return 'active_canceling';
        }
        if (subscription.trial_end && subscription.trial_end > Math.floor(Date.now() / 1000)) {
            return 'active_trial';
        }
        return 'active';
    }
    if (subscription.status === 'past_due') {
        return 'payment_overdue';
    }
    if (subscription.status === 'unpaid') {
        return 'payment_failed';
    }
    if (subscription.status === 'canceled') {
        return 'canceled';
    }
    return subscription.status;
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const metadata = subscription.metadata;
    if (!metadata?.userId) {
        console.error('Missing userId in subscription:', subscription.id);
        return;
    }

    try {
        // Get current user products
        const userProductsRecord = await prisma.userProducts.findUnique({
            where: { userId: metadata.userId }
        });

        if (!userProductsRecord) {
            console.error('No user products found for user:', metadata.userId);
            return;
        }

        // Parse existing products
        const mainPlan = userProductsRecord.mainPlan ? JSON.parse(userProductsRecord.mainPlan as string) : undefined;
        const addons = userProductsRecord.addons?.map(addon => JSON.parse(addon as string)) || [];

        // Get detailed status
        const detailedStatus = getDetailedSubscriptionStatus(subscription);

        // Update the records
        await prisma.userProducts.update({
            where: { userId: metadata.userId },
            data: {
                mainPlan: mainPlan ? JSON.stringify({
                    ...mainPlan,
                    status: detailedStatus,
                    currentPeriodEnd: subscription.current_period_end
                        ? new Date(subscription.current_period_end * 1000)
                        : undefined,
                    trialEnd: subscription.trial_end
                        ? new Date(subscription.trial_end * 1000)
                        : undefined,
                    cancelAt: subscription.cancel_at
                        ? new Date(subscription.cancel_at * 1000)
                        : undefined
                }) : undefined,
                addons: addons.map(addon => JSON.stringify({
                    ...addon,
                    status: detailedStatus,
                    currentPeriodEnd: subscription.current_period_end
                        ? new Date(subscription.current_period_end * 1000)
                        : undefined,
                    trialEnd: subscription.trial_end
                        ? new Date(subscription.trial_end * 1000)
                        : undefined,
                    cancelAt: subscription.cancel_at
                        ? new Date(subscription.cancel_at * 1000)
                        : undefined
                }))
            }
        });

        console.log('Successfully updated subscription:', {
            userId: metadata.userId,
            subscriptionId: subscription.id,
            status: detailedStatus,
            mainPlan: mainPlan?.productId,
            addonsCount: addons.length
        });
    } catch (error) {
        console.error('Error handling subscription updated:', {
            error,
            subscriptionId: subscription.id,
            userId: metadata.userId
        });
        throw error;
    }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const metadata = subscription.metadata;
    if (!metadata?.userId) {
        console.error('Missing userId in subscription:', subscription.id);
        return;
    }

    try {
        // Get current user products
        const userProductsRecord = await prisma.userProducts.findUnique({
            where: { userId: metadata.userId }
        });

        if (!userProductsRecord) {
            console.error('No user products found for user:', metadata.userId);
            return;
        }

        // Parse existing products
        const mainPlan = userProductsRecord.mainPlan ? JSON.parse(userProductsRecord.mainPlan as string) : undefined;
        const addons = userProductsRecord.addons?.map(addon => JSON.parse(addon as string)) || [];

        // Update the records
        await prisma.userProducts.update({
            where: { userId: metadata.userId },
            data: {
                mainPlan: mainPlan ? JSON.stringify({
                    ...mainPlan,
                    status: 'cancelled'
                }) : undefined,
                addons: addons.map(addon => JSON.stringify({
                    ...addon,
                    status: 'cancelled'
                }))
            }
        });
    } catch (error) {
        console.error('Error handling subscription deleted:', error);
        throw error;
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    console.log('Processing checkout completed webhook:', {
        sessionId: session.id,
        metadata: session.metadata,
        customerId: session.customer,
        mode: session.mode
    });

    const metadata = session.metadata;
    if (!metadata?.userId || !metadata?.items) {
        console.error('Missing metadata in checkout session:', session.id);
        return;
    }

    try {
        const items = JSON.parse(metadata.items) as PurchaseItem[];
        
        // For one-time purchases
        if (session.mode === 'payment') {
            const mainProduct = items[0]; // One-time purchases only have one item
            
            // First, ensure the user exists
            const user = await prisma.user.findUnique({
                where: { id: metadata.userId },
                include: { products: true }
            });

            if (!user) {
                console.error('User not found:', metadata.userId);
                return;
            }

            console.log('Creating/updating user products:', {
                userId: metadata.userId,
                productId: mainProduct.productId,
                priceId: mainProduct.priceId
            });

            // Create or update user products
            await prisma.userProducts.upsert({
                where: { userId: metadata.userId },
                create: {
                    userId: metadata.userId,
                    mainPlan: JSON.stringify({
                        productId: mainProduct.productId,
                        priceId: mainProduct.priceId,
                        status: 'completed',
                        purchaseDate: new Date()
                    }),
                    addons: []
                },
                update: {
                    mainPlan: JSON.stringify({
                        productId: mainProduct.productId,
                        priceId: mainProduct.priceId,
                        status: 'completed',
                        purchaseDate: new Date()
                    })
                }
            });

            // Update user's Stripe customer ID if not already set
            if (session.customer && !user.customerId) {
                await prisma.user.update({
                    where: { id: metadata.userId },
                    data: { customerId: session.customer.toString() }
                });
            }

            console.log('Successfully processed one-time purchase for user:', metadata.userId);
        }
        // For subscriptions, we'll handle it in the subscription.created event
    } catch (error) {
        console.error('Error handling checkout completed:', error);
        throw error;
    }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    // If there's a customer ID, we can get their email for notifications
    if (paymentIntent.customer) {
        try {
            const customer = await stripe.customers.retrieve(paymentIntent.customer as string);
            console.log('Payment failed for customer:', {
                customerId: paymentIntent.customer,
                email: customer.email,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency
            });
            
            // Here you could send an email notification about the failed payment
            // Or update the user's status in your database
        } catch (error) {
            console.error('Error handling payment failure:', error);
        }
    }
}

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
        return NextResponse.json(
            { error: 'Missing stripe-signature header' },
            { status: 400 }
        );
    }

    if (!webhookSecret) {
        console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
        return NextResponse.json(
            { error: 'Webhook secret not configured' },
            { status: 500 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret
        );

        console.log('Received webhook event:', {
            type: event.type,
            id: event.id
        });

        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
                break;
            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
                break;
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
                break;
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                break;
            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
                break;
            case 'payment_intent.requires_action':
                // Handle cases where additional authentication is required
                console.log('Payment requires additional action:', event.data.object);
                break;
            case 'payment_intent.succeeded':
                // Payment was successful
                console.log('Payment succeeded:', event.data.object);
                break;
            default:
                console.log('Unhandled event type:', event.type);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json(
            { error: 'Webhook error' },
            { status: 400 }
        );
    }
} 