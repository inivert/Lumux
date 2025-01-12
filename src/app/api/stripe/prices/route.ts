import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { prisma } from "@/libs/prisma";
import { stripe } from "@/libs/stripe";

interface PriceData {
  id: string;
  amount: number;
  currency: string;
  interval?: string;
}

interface TransformedProduct {
  id: string;
  name: string;
  description: string;
  features: string[];
  isAddon: boolean;
  isSubscription: boolean;
  monthlyPrice: PriceData | null;
  yearlyPrice: PriceData | null;
  oneTimePrice: PriceData | null;
  defaultPrice: PriceData | null;
  metadata: {
    features?: string;
    addonId?: string;
    type?: string;
  };
  isOwned?: boolean;
}

export async function GET() {
  try {
    console.log('Starting /api/stripe/prices request');
    
    // Verify Stripe is initialized
    if (!stripe) {
      console.error('Stripe is not initialized');
      return NextResponse.json(
        { error: 'Stripe configuration error' },
        { status: 500 }
      );
    }

    // Get the current session
    let session;
    try {
      session = await getServerSession(authOptions);
      console.log('Session retrieved:', session ? 'exists' : 'null');
    } catch (error) {
      console.error('Error getting session:', error);
      // Continue without session
    }

    // Fetch all products from Stripe
    let stripeProducts;
    try {
      console.log('Fetching Stripe products...');
      stripeProducts = await stripe.products.list({
        active: true,
        expand: ['data.default_price']
      });
      console.log(`Retrieved ${stripeProducts.data.length} products from Stripe`);
    } catch (error: any) {
      console.error('Error fetching Stripe products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products from Stripe' },
        { status: 500 }
      );
    }

    // Fetch all prices
    let stripePrices;
    try {
      console.log('Fetching Stripe prices...');
      stripePrices = await stripe.prices.list({
        active: true,
        expand: ['data.product']
      });
      console.log(`Retrieved ${stripePrices.data.length} prices from Stripe`);
    } catch (error: any) {
      console.error('Error fetching Stripe prices:', error);
      return NextResponse.json(
        { error: 'Failed to fetch prices from Stripe' },
        { status: 500 }
      );
    }

    // Get user's owned products if authenticated
    let userProducts: any[] = [];
    if (session?.user?.email) {
      try {
        console.log('Fetching user products for:', session.user.email);
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          include: { products: true }
        });
        
        if (user?.products) {
          // Convert products to array format
          userProducts = [
            ...(user.products.mainPlan ? [user.products.mainPlan] : []),
            ...user.products.addons
          ].filter(Boolean);
        }
        
        console.log(`Retrieved ${userProducts.length} user products`);
      } catch (error) {
        console.error('Error fetching user products:', error);
      }
    }

    // Transform products
    const transformedProducts = stripeProducts.data.map(product => {
      try {
        // Get all prices for this product
        const productPrices = stripePrices.data.filter(price => 
          typeof price.product === 'string' 
            ? price.product === product.id 
            : price.product.id === product.id
        );

        // Categorize prices
        const monthlyPrice = productPrices.find(price => 
          price.recurring?.interval === 'month' && 
          price.recurring.interval_count === 1
        );
        const yearlyPrice = productPrices.find(price => 
          price.recurring?.interval === 'year' && 
          price.recurring.interval_count === 1
        );
        const oneTimePrice = productPrices.find(price => !price.recurring);

        // Check if product is owned
        const isOwned = userProducts.some(up => up.productId === product.id);

        // Set descriptions based on product name
        let description = '';
        let features: string[] = [];
        
        switch (product.name) {
          case 'BUY A WEBSITE':
            description = "I create and code the website to your needs, no monthly subscription, you will only receive the folder of the website.";
            features = [
              "Custom coded website",
              "One-time payment",
              "Full source code",
              "Basic SEO setup",
              "Mobile responsive"
            ];
            break;
          case 'STARTER PLAN':
            description = "Everything you need to get started with a professional website";
            features = [
              "Essential Website Features",
              "User Authentication",
              "Basic Dashboard",
              "Email Integration",
              "Payment Processing"
            ];
            break;
          case 'Extra Changes Add-on':
            description = "Need more frequent updates? Get additional monthly changes with priority handling";
            features = [
              "Additional monthly changes",
              "Priority support",
              "Quick turnaround",
              "Flexible updates"
            ];
            break;
          case 'Booking System Add-on':
            description = "Let your customers book appointments and services directly through your website";
            features = [
              "Online booking system",
              "Calendar integration",
              "Automated scheduling",
              "Email notifications"
            ];
            break;
          case 'Content Manager Add-on':
            description = "Easily manage your website content with a powerful content management system";
            features = [
              "Content Management System",
              "Media Library",
              "Content Analytics",
              "SEO Tools"
            ];
            break;
          case 'User Accounts Add-on':
            description = "Add member-only areas and user authentication to your website";
            features = [
              "User authentication",
              "Member profiles",
              "Role management",
              "Secure access control"
            ];
            break;
          case 'E-Commerce Add-on':
            description = "Turn your website into a full-featured online store with shopping cart, payment processing, and inventory management";
            features = [
              "Product management",
              "Shopping cart",
              "Secure payments",
              "Inventory tracking",
              "Order management"
            ];
            break;
        }

        return {
          id: product.id,
          name: product.name,
          description: description || product.description || '',
          features,
          isAddon: product.metadata?.type === 'addon',
          isSubscription: !!monthlyPrice || !!yearlyPrice,
          monthlyPrice: monthlyPrice ? {
            id: monthlyPrice.id,
            amount: monthlyPrice.unit_amount ? monthlyPrice.unit_amount / 100 : 0,
            currency: monthlyPrice.currency
          } : null,
          yearlyPrice: yearlyPrice ? {
            id: yearlyPrice.id,
            amount: yearlyPrice.unit_amount ? yearlyPrice.unit_amount / 100 : 0,
            currency: yearlyPrice.currency
          } : null,
          oneTimePrice: oneTimePrice ? {
            id: oneTimePrice.id,
            amount: oneTimePrice.unit_amount ? oneTimePrice.unit_amount / 100 : 0,
            currency: oneTimePrice.currency
          } : null,
          defaultPrice: product.default_price ? {
            id: typeof product.default_price === 'string' 
              ? product.default_price 
              : product.default_price.id,
            amount: typeof product.default_price === 'string'
              ? 0
              : (product.default_price.unit_amount || 0) / 100,
            currency: typeof product.default_price === 'string'
              ? 'usd'
              : product.default_price.currency
          } : null,
          metadata: product.metadata || {},
          isOwned
        };
      } catch (error) {
        console.error('Error transforming product:', product.id, error);
        return null;
      }
    }).filter(Boolean);

    // Sort products: BUY A WEBSITE first, then STARTER PLAN, then add-ons
    const sortedProducts = transformedProducts.sort((a, b) => {
      if (a.name === 'BUY A WEBSITE') return -1;
      if (b.name === 'BUY A WEBSITE') return 1;
      if (a.name === 'STARTER PLAN') return -1;
      if (b.name === 'STARTER PLAN') return 1;
      return 0;
    });

    return NextResponse.json(sortedProducts);
  } catch (error) {
    console.error('Unhandled error in prices endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 