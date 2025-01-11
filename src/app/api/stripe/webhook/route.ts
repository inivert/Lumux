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
    const customerId = subscription.customer as string;
    if (!customerId) {
        console.error('Missing customer ID in subscription:', subscription.id);
        return;
    }

    try {
        // Find user by customer ID
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { customerId: customerId },
                    { subscription: { stripeCustomerId: customerId } }
                ]
            }
        });

        if (!user) {
            console.error('No user found for customer:', customerId);
            return;
        }

        // Get subscription items
        const items = subscription.items.data.map(item => ({
            productId: typeof item.price.product === 'string' ? item.price.product : item.price.product.id,
            priceId: item.price.id,
            isSubscription: true,
            isYearly: item.price.recurring?.interval === 'year'
        }));

        // Get detailed subscription status
        const detailedStatus = getDetailedSubscriptionStatus(subscription);

        // Transform items into mainPlan and addons
        const transformedItems = items.map(item => ({
            productId: item.productId,
            priceId: item.priceId,
            status: detailedStatus,
            isYearly: item.isYearly,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            purchaseDate: new Date()
        }));

        // Find main plan and addons
        const mainPlanItem = transformedItems.find(item => !item.productId.toLowerCase().includes('addon'));
        const addonItems = transformedItems.filter(item => item.productId.toLowerCase().includes('addon'));

        // Update user's products in the database
        await prisma.userProducts.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
                mainPlan: mainPlanItem ? JSON.stringify(mainPlanItem) : null,
                addons: addonItems.map(addon => JSON.stringify(addon))
            },
            update: {
                mainPlan: mainPlanItem ? JSON.stringify(mainPlanItem) : null,
                addons: addonItems.map(addon => JSON.stringify(addon))
            }
        });

        console.log('Successfully processed subscription:', {
            userId: user.id,
            subscriptionId: subscription.id,
            status: detailedStatus,
            mainPlan: mainPlanItem?.productId,
            addons: addonItems.map(a => a.productId)
        });
    } catch (error) {
        console.error('Error handling subscription created:', {
            error,
            subscriptionId: subscription.id,
            customerId
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
    const customerId = subscription.customer as string;
    if (!customerId) {
        console.error('Missing customer ID in subscription:', subscription.id);
        return;
    }

    try {
        // Find user by customer ID
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { customerId: customerId },
                    { subscription: { stripeCustomerId: customerId } }
                ]
            }
        });

        if (!user) {
            console.error('No user found for customer:', customerId);
            return;
        }

        // Get current user products
        const userProducts = await prisma.userProducts.findUnique({
            where: { userId: user.id }
        });

        if (!userProducts) {
            console.error('No user products found for user:', user.id);
            return;
        }

        // Get detailed status
        const detailedStatus = getDetailedSubscriptionStatus(subscription);

        // Get subscription items
        const items = subscription.items.data.map(item => ({
            productId: typeof item.price.product === 'string' ? item.price.product : item.price.product.id,
            priceId: item.price.id,
            status: detailedStatus,
            isYearly: item.price.recurring?.interval === 'year',
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        }));

        // Transform items into mainPlan and addons
        const mainPlanItem = items.find(item => !item.productId.toLowerCase().includes('addon'));
        const addonItems = items.filter(item => item.productId.toLowerCase().includes('addon'));

        // Update user's products in the database
        await prisma.userProducts.update({
            where: { userId: user.id },
            data: {
                mainPlan: mainPlanItem ? JSON.stringify(mainPlanItem) : null,
                addons: addonItems.map(addon => JSON.stringify(addon))
            }
        });

        console.log('Successfully updated subscription:', {
            userId: user.id,
            subscriptionId: subscription.id,
            status: detailedStatus,
            mainPlan: mainPlanItem?.productId,
            addons: addonItems.map(a => a.productId)
        });
    } catch (error) {
        console.error('Error handling subscription updated:', {
            error,
            subscriptionId: subscription.id,
            customerId
        });
        throw error;
    }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    if (!customerId) {
        console.error('Missing customer ID in subscription:', subscription.id);
        return;
    }

    try {
        // Find user by customer ID
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { customerId: customerId },
                    { subscription: { stripeCustomerId: customerId } }
                ]
            }
        });

        if (!user) {
            console.error('No user found for customer:', customerId);
            return;
        }

        // Get subscription items
        const subscriptionProductIds = subscription.items.data.map(item => 
            typeof item.price.product === 'string' ? item.price.product : item.price.product.id
        );

        // Get current user products
        const userProducts = await prisma.userProducts.findUnique({
            where: { userId: user.id }
        });

        if (!userProducts) {
            console.error('No user products found for user:', user.id);
            return;
        }

        // Parse current products
        const currentMainPlan = userProducts.mainPlan ? JSON.parse(userProducts.mainPlan as string) : null;
        const currentAddons = userProducts.addons.map(addon => JSON.parse(addon as string));

        // Remove products that were in the canceled subscription
        const updatedMainPlan = currentMainPlan && subscriptionProductIds.includes(currentMainPlan.productId)
            ? null
            : currentMainPlan;
        const updatedAddons = currentAddons.filter(addon => !subscriptionProductIds.includes(addon.productId));

        // Update user's products in the database
        await prisma.userProducts.update({
            where: { userId: user.id },
            data: {
                mainPlan: updatedMainPlan ? JSON.stringify(updatedMainPlan) : null,
                addons: updatedAddons.map(addon => JSON.stringify(addon))
            }
        });

        console.log('Successfully processed subscription deletion:', {
            userId: user.id,
            subscriptionId: subscription.id,
            removedProducts: subscriptionProductIds,
            remainingMainPlan: updatedMainPlan?.productId,
            remainingAddons: updatedAddons.map(a => a.productId)
        });
    } catch (error) {
        console.error('Error handling subscription deleted:', {
            error,
            subscriptionId: subscription.id,
            customerId
        });
        throw error;
    }
}

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature || !webhookSecret) {
        return new NextResponse("Webhook Error: Missing signature or secret", { status: 400 });
    }

    try {
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret
        );

        console.log('Processing webhook event:', event.type);

        switch (event.type) {
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

        return new NextResponse(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error('Webhook error:', err);
        return new NextResponse(
            JSON.stringify({ error: 'Webhook handler failed' }),
            { status: 400 }
        );
    }
} 