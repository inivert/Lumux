import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { stripe } from '@/libs/stripe';
import { prisma } from '@/libs/prisma';
import type { Stripe } from 'stripe';

export const dynamic = 'force-dynamic';

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

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user with subscription using email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                customerId: true,
                subscription: {
                    select: {
                        stripeCustomerId: true
                    }
                }
            }
        });

        const stripeCustomerId = user?.customerId || user?.subscription?.stripeCustomerId;

        if (!stripeCustomerId) {
            return NextResponse.json({
                hasSubscription: false,
                subscription: null,
                paymentMethods: [],
                invoices: [],
                upcomingInvoice: null
            });
        }

        let subscriptions: Stripe.ApiList<Stripe.Subscription>;
        try {
            subscriptions = await stripe.subscriptions.list({
                customer: stripeCustomerId,
                expand: ['data.default_payment_method', 'data.items.data.price.product']
            });
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
        }

        // Check if Stripe is properly initialized
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('Stripe secret key not found');
            return NextResponse.json(
                { error: 'Payment service configuration error' },
                { status: 500 }
            );
        }

        // Fetch all required data
        let paymentMethods;
        let invoices;
        let upcomingInvoice;

        try {
            // Then fetch remaining data in parallel
            [paymentMethods, invoices, upcomingInvoice] = await Promise.all([
                stripe.paymentMethods.list({
                    customer: stripeCustomerId,
                    type: 'card'
                }),
                stripe.invoices.list({
                    customer: stripeCustomerId,
                    limit: 5,
                    status: 'paid'
                }),
                stripe.invoices.retrieveUpcoming({
                    customer: stripeCustomerId,
                    expand: ['lines.data.price.product'],
                    subscription_items: subscriptions.data.flatMap(sub => 
                        sub.items.data.map(item => ({
                            subscription: sub.id,
                            price: item.price.id,
                            quantity: item.quantity
                        }))
                    )
                }).catch((error) => {
                    console.error('Error fetching upcoming invoice:', {
                        error,
                        customerId: stripeCustomerId,
                        subscriptionCount: subscriptions.data.length
                    });
                    return null;
                })
            ]);

            console.log('Stripe data fetched:', {
                subscriptionsCount: subscriptions.data.length,
                paymentMethodsCount: paymentMethods.data.length,
                invoicesCount: invoices.data.length,
                hasUpcomingInvoice: !!upcomingInvoice,
                upcomingInvoiceItems: upcomingInvoice?.lines.data.length
            });

        } catch (error: any) {
            console.error('Stripe API error:', {
                type: error.type,
                message: error.message,
                requestId: error.requestId,
                statusCode: error.statusCode,
                stack: error.stack
            });

            // Check for specific Stripe errors
            if (error.type === 'StripeAuthenticationError') {
                return NextResponse.json(
                    { error: 'Payment service authentication error' },
                    { status: 500 }
                );
            }

            if (error.type === 'StripeConnectionError') {
                return NextResponse.json(
                    { error: 'Payment service connection error' },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                { 
                    error: 'Payment service error',
                    details: error.message
                },
                { status: 500 }
            );
        }

        // Transform subscription data
        let subscriptionData = [];
        try {
            subscriptionData = subscriptions.data.map(subscription => {
                const detailedStatus = getDetailedSubscriptionStatus(subscription);
                
                return {
                    id: subscription.id,
                    status: detailedStatus,
                    currentPeriodStart: subscription.current_period_start,
                    currentPeriodEnd: subscription.current_period_end,
                    cancelAtPeriodEnd: subscription.cancel_at_period_end,
                    cancelAt: subscription.cancel_at,
                    trialEnd: subscription.trial_end,
                    defaultPaymentMethod: typeof subscription.default_payment_method === 'string' 
                        ? subscription.default_payment_method 
                        : subscription.default_payment_method?.id,
                    items: subscription.items.data.map(item => {
                        const product = typeof item.price.product === 'string'
                            ? { id: item.price.product, name: 'Unknown Product' }
                            : item.price.product;

                        return {
                            id: item.id,
                            priceId: item.price.id,
                            productId: product.id,
                            productName: typeof product === 'string' 
                                ? '' 
                                : 'name' in product 
                                    ? product.name 
                                    : '',
                            amount: item.price.unit_amount,
                            currency: item.price.currency,
                            interval: item.price.recurring?.interval || 'one-time',
                            intervalCount: item.price.recurring?.interval_count || 1
                        };
                    })
                };
            });

            console.log('Subscription data transformed:', {
                subscriptionsCount: subscriptionData.length,
                statuses: subscriptionData.map(s => s.status),
                totalItems: subscriptionData.reduce((acc, s) => acc + s.items.length, 0)
            });
        } catch (error) {
            console.error('Error transforming subscription data:', error);
            return NextResponse.json(
                { 
                    error: 'Error processing subscription data',
                    details: error instanceof Error ? error.message : 'Unknown error'
                },
                { status: 500 }
            );
        }

        // Transform payment methods and invoices
        const paymentMethodsData = paymentMethods.data.map(pm => ({
            id: pm.id,
            brand: pm.card?.brand || 'unknown',
            last4: pm.card?.last4 || '****',
            expMonth: pm.card?.exp_month || 0,
            expYear: pm.card?.exp_year || 0,
            isDefault: typeof pm === 'string' 
                ? false 
                : pm.id === (typeof subscriptions.data[0]?.default_payment_method === 'string' 
                    ? subscriptions.data[0]?.default_payment_method 
                    : subscriptions.data[0]?.default_payment_method?.id)
        }));

        const invoicesData = invoices.data.map(invoice => ({
            id: invoice.id,
            number: invoice.number || '',
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: invoice.status,
            date: invoice.created,
            pdfUrl: invoice.invoice_pdf || null
        }));

        // Transform upcoming invoice
        const upcomingInvoiceData = upcomingInvoice ? {
            amount: upcomingInvoice.amount_due,
            currency: upcomingInvoice.currency,
            date: upcomingInvoice.next_payment_attempt || upcomingInvoice.created,
            lineItems: upcomingInvoice.lines.data.map(item => ({
                description: item.description || '',
                amount: item.amount,
                currency: item.currency,
                period: {
                    start: item.period.start,
                    end: item.period.end
                }
            }))
        } : null;

        return NextResponse.json({
            hasSubscription: subscriptionData.length > 0,
            subscriptions: subscriptionData,
            paymentMethods: paymentMethodsData,
            invoices: invoicesData,
            upcomingInvoice: upcomingInvoiceData
        });

    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { 
                error: 'An unexpected error occurred',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 