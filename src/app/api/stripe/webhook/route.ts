import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { CartItem } from "@/types/product";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function handleSubscriptionCreated(subscription: any) {
    const metadata = subscription.metadata;
    if (!metadata?.userId || !metadata?.items) {
        console.error('Missing metadata in subscription:', subscription.id);
        return;
    }

    const items = JSON.parse(metadata.items) as CartItem[];
    const mainPlan = items.find(item => !item.isAddon);
    const addons = items.filter(item => item.isAddon);

    // Update user's products in the database
    await prisma.user.update({
        where: { id: metadata.userId },
        data: {
            products: {
                upsert: {
                    create: {
                        mainPlan: mainPlan ? {
                            productId: mainPlan.productId,
                            priceId: mainPlan.priceId,
                            isYearly: mainPlan.isYearly,
                            status: 'active'
                        } : undefined,
                        addons: addons.map(addon => ({
                            productId: addon.productId,
                            priceId: addon.priceId,
                            isYearly: addon.isYearly,
                            status: 'active'
                        }))
                    },
                    update: {
                        mainPlan: mainPlan ? {
                            productId: mainPlan.productId,
                            priceId: mainPlan.priceId,
                            isYearly: mainPlan.isYearly,
                            status: 'active'
                        } : undefined,
                        addons: {
                            push: addons.map(addon => ({
                                productId: addon.productId,
                                priceId: addon.priceId,
                                isYearly: addon.isYearly,
                                status: 'active'
                            }))
                        }
                    }
                }
            }
        }
    });
}

async function handleSubscriptionUpdated(subscription: any) {
    // Handle subscription updates (e.g., plan changes, cancellations)
    const metadata = subscription.metadata;
    if (!metadata?.userId) {
        console.error('Missing userId in subscription:', subscription.id);
        return;
    }

    // Update subscription status based on the event
    const status = subscription.status === 'active' ? 'active' : 'inactive';

    await prisma.user.update({
        where: { id: metadata.userId },
        data: {
            products: {
                update: {
                    mainPlan: {
                        status
                    },
                    addons: {
                        updateMany: {
                            where: {},
                            data: { status }
                        }
                    }
                }
            }
        }
    });
}

async function handleSubscriptionDeleted(subscription: any) {
    const metadata = subscription.metadata;
    if (!metadata?.userId) {
        console.error('Missing userId in subscription:', subscription.id);
        return;
    }

    // Mark all products as cancelled
    await prisma.user.update({
        where: { id: metadata.userId },
        data: {
            products: {
                update: {
                    mainPlan: {
                        status: 'cancelled'
                    },
                    addons: {
                        updateMany: {
                            where: {},
                            data: { status: 'cancelled' }
                        }
                    }
                }
            }
        }
    });
}

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get('stripe-signature')!;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret
        );
    } catch (error: any) {
        console.error('Webhook signature verification failed:', error.message);
        return NextResponse.json(
            { message: 'Webhook signature verification failed' },
            { status: 400 }
        );
    }

    try {
        switch (event.type) {
            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;
            default:
                console.log('Unhandled event type:', event.type);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook handler failed:', error);
        return NextResponse.json(
            { message: 'Webhook handler failed' },
            { status: 500 }
        );
    }
} 