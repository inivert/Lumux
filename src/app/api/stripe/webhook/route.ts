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
                                status: 'active',
                                currentPeriodEnd: subscription.current_period_end
                                    ? new Date(subscription.current_period_end * 1000)
                                    : undefined
                            }) : undefined,
                            addons: addons.map(addon => JSON.stringify({
                                productId: addon.productId,
                                priceId: addon.priceId,
                                isYearly: addon.isYearly,
                                status: 'active',
                                currentPeriodEnd: subscription.current_period_end
                                    ? new Date(subscription.current_period_end * 1000)
                                    : undefined
                            }))
                        },
                        update: {
                            mainPlan: mainPlan ? JSON.stringify({
                                productId: mainPlan.productId,
                                priceId: mainPlan.priceId,
                                status: 'active',
                                currentPeriodEnd: subscription.current_period_end
                                    ? new Date(subscription.current_period_end * 1000)
                                    : undefined
                            }) : undefined,
                            addons: {
                                push: addons.map(addon => JSON.stringify({
                                    productId: addon.productId,
                                    priceId: addon.priceId,
                                    isYearly: addon.isYearly,
                                    status: 'active',
                                    currentPeriodEnd: subscription.current_period_end
                                        ? new Date(subscription.current_period_end * 1000)
                                        : undefined
                                }))
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error handling subscription created:', error);
        throw error;
    }
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

        // Update status and period end
        const status = subscription.status === 'active' ? 'active' : 'inactive';
        const currentPeriodEnd = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : undefined;

        // Update the records
        await prisma.userProducts.update({
            where: { userId: metadata.userId },
            data: {
                mainPlan: mainPlan ? JSON.stringify({
                    ...mainPlan,
                    status,
                    currentPeriodEnd
                }) : undefined,
                addons: addons.map(addon => JSON.stringify({
                    ...addon,
                    status,
                    currentPeriodEnd
                }))
            }
        });
    } catch (error) {
        console.error('Error handling subscription updated:', error);
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
            
            await prisma.userProducts.upsert({
                where: { userId: metadata.userId },
                create: {
                    userId: metadata.userId,
                    mainPlan: JSON.stringify({
                        productId: mainProduct.productId,
                        priceId: mainProduct.priceId,
                        status: 'completed',
                        purchaseDate: new Date()
                    })
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
        }
        // For subscriptions, we'll handle it in the subscription.created event
    } catch (error) {
        console.error('Error handling checkout completed:', error);
        throw error;
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
    } catch (error: any) {
        console.error('Webhook signature verification failed:', error.message);
        return NextResponse.json(
            { error: 'Webhook signature verification failed' },
            { status: 400 }
        );
    }

    try {
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
            default:
                console.log('Unhandled event type:', event.type);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Webhook handler failed:', error);
        return NextResponse.json(
            { error: error.message || 'Webhook handler failed' },
            { status: 500 }
        );
    }
} 