import { NextResponse } from 'next/server';
import { getAuthSession } from '@/libs/auth';
import { stripe } from '@/libs/stripe';
import { CartItem } from '@/types/product';
import { prisma } from '@/libs/prisma';
import Stripe from 'stripe';

// Validate environment variables
const requiredEnvVars = [
    'STRIPE_BUY_WEBSITE_PRODUCT_ID',
    'NEXT_PUBLIC_STRIPE_BUY_WEBSITE_PRICE',
    'STRIPE_STARTER_PRODUCT_ID',
    'NEXT_PUBLIC_STRIPE_STARTER_PRICE_MONTHLY',
    'NEXT_PUBLIC_STRIPE_STARTER_PRICE_YEARLY',
    'STRIPE_EXTRA_CHANGES_PRODUCT_ID',
    'NEXT_PUBLIC_STRIPE_EXTRA_CHANGES_PRICE_MONTHLY',
    'NEXT_PUBLIC_STRIPE_EXTRA_CHANGES_PRICE_YEARLY',
    'STRIPE_BOOKING_PRODUCT_ID',
    'NEXT_PUBLIC_STRIPE_BOOKING_PRICE_MONTHLY',
    'NEXT_PUBLIC_STRIPE_BOOKING_PRICE_YEARLY',
    'STRIPE_CONTENT_MANAGER_PRODUCT_ID',
    'NEXT_PUBLIC_STRIPE_CONTENT_MANAGER_PRICE_MONTHLY',
    'NEXT_PUBLIC_STRIPE_CONTENT_MANAGER_PRICE_YEARLY',
    'STRIPE_USER_ACCOUNTS_PRODUCT_ID',
    'NEXT_PUBLIC_STRIPE_USER_ACCOUNTS_PRICE_MONTHLY',
    'NEXT_PUBLIC_STRIPE_USER_ACCOUNTS_PRICE_YEARLY',
    'STRIPE_ECOMMERCE_PRODUCT_ID',
    'NEXT_PUBLIC_STRIPE_ECOMMERCE_PRICE_MONTHLY',
    'NEXT_PUBLIC_STRIPE_ECOMMERCE_PRICE_YEARLY',
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

interface ProductPrice {
    id: string;
    amount: number;
}

interface Product {
    id: string;
    name: string;
    isSubscription: boolean;
    oneTimePrice?: ProductPrice;
    monthlyPrice?: ProductPrice;
    yearlyPrice?: ProductPrice;
}

// Get product data
const products: Product[] = [
    // Buy Website Product
    {
        id: process.env.STRIPE_BUY_WEBSITE_PRODUCT_ID!,
        name: "BUY A WEBSITE",
        isSubscription: false,
        oneTimePrice: {
            id: process.env.NEXT_PUBLIC_STRIPE_BUY_WEBSITE_PRICE!,
            amount: 589,
        },
    },
    // Starter Plan
    {
        id: process.env.STRIPE_STARTER_PRODUCT_ID!,
        name: "STARTER PLAN",
        isSubscription: true,
        monthlyPrice: {
            id: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_MONTHLY!,
            amount: 59,
        },
        yearlyPrice: {
            id: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_YEARLY!,
            amount: 590,
        },
    },
    // Add-ons
    {
        id: process.env.STRIPE_EXTRA_CHANGES_PRODUCT_ID!,
        name: "Extra Changes Add-on",
        isSubscription: true,
        monthlyPrice: {
            id: process.env.NEXT_PUBLIC_STRIPE_EXTRA_CHANGES_PRICE_MONTHLY!,
            amount: 15,
        },
        yearlyPrice: {
            id: process.env.NEXT_PUBLIC_STRIPE_EXTRA_CHANGES_PRICE_YEARLY!,
            amount: 150,
        },
    },
    {
        id: process.env.STRIPE_BOOKING_PRODUCT_ID!,
        name: "Booking System Add-on",
        isSubscription: true,
        monthlyPrice: {
            id: process.env.NEXT_PUBLIC_STRIPE_BOOKING_PRICE_MONTHLY!,
            amount: 25,
        },
        yearlyPrice: {
            id: process.env.NEXT_PUBLIC_STRIPE_BOOKING_PRICE_YEARLY!,
            amount: 250,
        },
    },
    {
        id: process.env.STRIPE_CONTENT_MANAGER_PRODUCT_ID!,
        name: "Content Manager Add-on",
        isSubscription: true,
        monthlyPrice: {
            id: process.env.NEXT_PUBLIC_STRIPE_CONTENT_MANAGER_PRICE_MONTHLY!,
            amount: 20,
        },
        yearlyPrice: {
            id: process.env.NEXT_PUBLIC_STRIPE_CONTENT_MANAGER_PRICE_YEARLY!,
            amount: 200,
        },
    },
    {
        id: process.env.STRIPE_USER_ACCOUNTS_PRODUCT_ID!,
        name: "User Accounts Add-on",
        isSubscription: true,
        monthlyPrice: {
            id: process.env.NEXT_PUBLIC_STRIPE_USER_ACCOUNTS_PRICE_MONTHLY!,
            amount: 25,
        },
        yearlyPrice: {
            id: process.env.NEXT_PUBLIC_STRIPE_USER_ACCOUNTS_PRICE_YEARLY!,
            amount: 250,
        },
    },
    {
        id: process.env.STRIPE_ECOMMERCE_PRODUCT_ID!,
        name: "E-Commerce Add-on",
        isSubscription: true,
        monthlyPrice: {
            id: process.env.NEXT_PUBLIC_STRIPE_ECOMMERCE_PRICE_MONTHLY!,
            amount: 35,
        },
        yearlyPrice: {
            id: process.env.NEXT_PUBLIC_STRIPE_ECOMMERCE_PRICE_YEARLY!,
            amount: 350,
        },
    },
];

interface UserProduct {
    productId: string;
    priceId: string;
    status: string;
}

interface UserProducts {
    mainPlan?: UserProduct;
    addons?: UserProduct[];
}

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
        console.log('Request body:', body);
        
        const { items } = body as { items: CartItem[] };

        if (!items?.length) {
            return NextResponse.json(
                { error: 'No items in cart' },
                { status: 400 }
            );
        }

        console.log('Cart items:', items);

        // Get user and their subscription
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

        // Get or create Stripe customer
        let customerId = user.customerId || user.subscription?.stripeCustomerId;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email || undefined,
                name: user.name || undefined,
                metadata: {
                    userId: user.id
                }
            });
            customerId = customer.id;

            // Update user with customer ID
            await prisma.user.update({
                where: { id: user.id },
                data: { customerId: customer.id }
            });
        }

        // Get user's existing products
        const userProductsRecord = await prisma.userProducts.findUnique({
            where: { userId: session.user.id }
        });

        console.log('User products record:', userProductsRecord);

        // Parse JSON fields
        const userProducts: UserProducts = {
            mainPlan: userProductsRecord?.mainPlan ? JSON.parse(userProductsRecord.mainPlan as string) : undefined,
            addons: userProductsRecord?.addons?.map(addon => JSON.parse(addon as string)) || []
        };

        console.log('Parsed user products:', userProducts);

        // Validate items and calculate total
        let hasSubscription = false;
        let hasOneTime = false;
        let calculatedTotal = 0;

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
        const itemsMetadata: Array<{
            productId: string;
            priceId: string;
            isYearly?: boolean;
            isSubscription: boolean;
        }> = [];

        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                console.error('Invalid product:', item.productId);
                console.log('Available products:', products.map(p => ({ id: p.id, name: p.name })));
                return NextResponse.json(
                    { error: `Invalid product: ${item.productId}` },
                    { status: 400 }
                );
            }

            // Check if user already has this product
            if (userProducts) {
                if (product.isSubscription) {
                    const hasMainPlan = userProducts.mainPlan && 
                        userProducts.mainPlan.productId === product.id &&
                        userProducts.mainPlan.status === 'active';
                    
                    const hasAddon = userProducts.addons?.some(
                        addon => addon.productId === product.id && addon.status === 'active'
                    );

                    if (hasMainPlan || hasAddon) {
                        return NextResponse.json(
                            { error: `You already have the ${product.name}` },
                            { status: 400 }
                        );
                    }
                } else {
                    // One-time purchase validation
                    const hasProduct = userProducts.mainPlan && 
                        userProducts.mainPlan.productId === product.id;
                    
                    if (hasProduct) {
                        return NextResponse.json(
                            { error: `You already purchased ${product.name}` },
                            { status: 400 }
                        );
                    }
                }
            }

            // Get price based on billing type
            let price: ProductPrice | undefined;
            if (product.isSubscription) {
                hasSubscription = true;
                price = item.isYearly ? product.yearlyPrice : product.monthlyPrice;
            } else {
                hasOneTime = true;
                price = product.oneTimePrice;
            }

            if (!price) {
                console.error('Invalid price for product:', {
                    product: product.name,
                    isSubscription: product.isSubscription,
                    isYearly: item.isYearly,
                    monthlyPrice: product.monthlyPrice,
                    yearlyPrice: product.yearlyPrice,
                    oneTimePrice: product.oneTimePrice
                });
                return NextResponse.json(
                    { error: `Invalid price for product: ${product.name}` },
                    { status: 400 }
                );
            }

            calculatedTotal += price.amount;
            lineItems.push({
                price: price.id,
                quantity: 1,
            });

            itemsMetadata.push({
                productId: product.id,
                priceId: price.id,
                isYearly: item.isYearly,
                isSubscription: product.isSubscription,
            });
        }

        // Can't mix subscription and one-time purchases
        if (hasSubscription && hasOneTime) {
            return NextResponse.json(
                { error: 'Cannot mix subscription and one-time purchases' },
                { status: 400 }
            );
        }

        console.log('Creating Stripe session with:', {
            lineItems,
            mode: hasSubscription ? 'subscription' : 'payment',
            metadata: {
                userId: session.user.id,
                items: itemsMetadata,
                calculatedTotal
            }
        });

        // Create Stripe checkout session
        try {
            if (!process.env.NEXT_PUBLIC_APP_URL) {
                throw new Error('NEXT_PUBLIC_APP_URL is not set');
            }

            const stripeSession = await stripe.checkout.sessions.create({
                customer: customerId,
                mode: hasSubscription ? 'subscription' : 'payment',
                payment_method_types: ['card'],
                line_items: lineItems,
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/user/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/user/products?canceled=true`,
                metadata: {
                    userId: session.user.id,
                    items: JSON.stringify(itemsMetadata),
                    calculatedTotal: calculatedTotal.toString(),
                },
            });

            return NextResponse.json({ url: stripeSession.url });
        } catch (stripeError: any) {
            console.error('Stripe error:', stripeError);
            return NextResponse.json(
                { error: stripeError.message || 'Failed to create checkout session' },
                { status: stripeError.statusCode || 500 }
            );
        }
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
} 