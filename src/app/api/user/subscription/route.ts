import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import { stripe } from '@/libs/stripe';
import { prisma } from '@/libs/prisma';

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
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user with subscription
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { subscription: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const customerId = user.customerId || user.subscription?.stripeCustomerId;
        console.log('Customer ID:', { exists: !!customerId });

        if (!customerId) {
            return NextResponse.json({
                hasSubscription: false,
                subscription: null,
                paymentMethods: [],
                invoices: [],
                upcomingInvoice: null
            });
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
        let subscriptions;
        let paymentMethods;
        let invoices;
        let upcomingInvoice;

        try {
            // First, fetch subscriptions
            subscriptions = await stripe.subscriptions.list({
                customer: customerId,
                status: 'active',
                expand: ['data.default_payment_method', 'data.latest_invoice', 'data.plan.product']
            });

            // If we have subscriptions, fetch all product details
            if (subscriptions.data.length > 0) {
                // Get unique product IDs from all subscriptions
                const productIds = new Set(
                    subscriptions.data.flatMap(subscription =>
                        subscription.items.data.map(item =>
                            typeof item.price.product === 'string' ? item.price.product : item.price.product.id
                        )
                    )
                );

                // Fetch all products in parallel
                const products = await Promise.all(
                    Array.from(productIds).map(productId => stripe.products.retrieve(productId))
                );

                // Create a map of product details
                const productMap = new Map(
                    products.map(product => [product.id, product])
                );

                // Attach product details to all subscription items
                subscriptions.data.forEach(subscription => {
                    subscription.items.data.forEach(item => {
                        const productId = typeof item.price.product === 'string'
                            ? item.price.product
                            : item.price.product.id;
                        const product = productMap.get(productId);
                        if (product) {
                            item.price.product = product;
                        }
                    });
                });
            }

            // Then fetch remaining data in parallel
            [paymentMethods, invoices, upcomingInvoice] = await Promise.all([
                stripe.paymentMethods.list({
                    customer: customerId,
                    type: 'card'
                }),
                stripe.invoices.list({
                    customer: customerId,
                    limit: 5,
                    status: 'paid'
                }),
                stripe.invoices.retrieveUpcoming({
                    customer: customerId,
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
                        customerId,
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
                    defaultPaymentMethod: subscription.default_payment_method?.id,
                    items: subscription.items.data.map(item => {
                        const product = typeof item.price.product === 'string'
                            ? { id: item.price.product, name: 'Unknown Product' }
                            : item.price.product;

                        return {
                            id: item.id,
                            priceId: item.price.id,
                            productId: product.id,
                            productName: product.name,
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
        try {
            const response = {
                hasSubscription: subscriptionData.length > 0,
                subscriptions: subscriptionData,
                paymentMethods: paymentMethods.data.map(pm => ({
                    id: pm.id,
                    brand: pm.card?.brand,
                    last4: pm.card?.last4,
                    expMonth: pm.card?.exp_month,
                    expYear: pm.card?.exp_year,
                    isDefault: subscriptionData.some(s => s.defaultPaymentMethod === pm.id)
                })),
                invoices: invoices.data.map(invoice => ({
                    id: invoice.id,
                    number: invoice.number,
                    amount: invoice.amount_paid,
                    currency: invoice.currency,
                    status: invoice.status,
                    date: invoice.created,
                    pdfUrl: invoice.invoice_pdf
                })),
                upcomingInvoice: upcomingInvoice ? {
                    amount: upcomingInvoice.amount_due,
                    currency: upcomingInvoice.currency,
                    date: upcomingInvoice.next_payment_attempt,
                    lineItems: upcomingInvoice.lines.data.map(item => {
                        const product = typeof item.price?.product === 'string'
                            ? { name: 'Unknown Product' }
                            : item.price?.product;
                        
                        return {
                            description: product?.name || item.description,
                            amount: item.amount,
                            currency: item.currency,
                            period: {
                                start: item.period.start,
                                end: item.period.end
                            }
                        };
                    }).filter(item => item.amount > 0)
                } : null
            };

            console.log('Response prepared:', {
                hasSubscription: response.hasSubscription,
                paymentMethodsCount: response.paymentMethods.length,
                invoicesCount: response.invoices.length,
                hasUpcomingInvoice: !!response.upcomingInvoice
            });

            return NextResponse.json(response);
        } catch (error) {
            console.error('Error preparing response:', error);
            return NextResponse.json(
                { 
                    error: 'Error preparing response',
                    details: error instanceof Error ? error.message : 'Unknown error'
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { 
                error: 'Unexpected error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 