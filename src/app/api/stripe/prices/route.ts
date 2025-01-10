import { NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

interface PriceData {
  id: string;
  amount: number;
  currency: string;
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
}

// Product definitions
const products: TransformedProduct[] = [
  // Buy Website Product
  {
    id: process.env.STRIPE_BUY_WEBSITE_PRODUCT_ID!,
    name: "BUY A WEBSITE",
    description: "Get a professionally designed and custom-coded website tailored to your specific needs. One-time payment includes full ownership of all website files and source code.",
    features: ["Custom website development", "One-time payment", "Full website files delivery"],
    isAddon: false,
    isSubscription: false,
    monthlyPrice: null,
    yearlyPrice: null,
    oneTimePrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_BUY_WEBSITE_PRICE!,
      amount: 589,
      currency: 'usd'
    },
    defaultPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_BUY_WEBSITE_PRICE!,
      amount: 589,
      currency: 'usd'
    },
    metadata: {
      type: 'one-time'
    }
  },
  // Starter Plan
  {
    id: process.env.STRIPE_STARTER_PRODUCT_ID!,
    name: "STARTER PLAN",
    description: "Keep your website running smoothly with our essential maintenance package. Includes regular updates, security monitoring, and professional support when you need it.",
    features: ["Monthly updates", "Basic support", "Security patches"],
    isAddon: false,
    isSubscription: true,
    monthlyPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_MONTHLY!,
      amount: 59,
      currency: 'usd'
    },
    yearlyPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_YEARLY!,
      amount: 590,
      currency: 'usd'
    },
    oneTimePrice: null,
    defaultPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_MONTHLY!,
      amount: 59,
      currency: 'usd'
    },
    metadata: {
      type: 'subscription'
    }
  },
  // Extra Changes Add-on
  {
    id: process.env.STRIPE_EXTRA_CHANGES_PRODUCT_ID!,
    name: "Extra Changes Add-on",
    description: "Get priority access to more website updates each month. Perfect for businesses that need frequent content updates or design tweaks.",
    features: ["Additional monthly changes", "Priority handling", "Faster turnaround"],
    isAddon: true,
    isSubscription: true,
    monthlyPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_EXTRA_CHANGES_PRICE_MONTHLY!,
      amount: 15,
      currency: 'usd'
    },
    yearlyPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_EXTRA_CHANGES_PRICE_YEARLY!,
      amount: 150,
      currency: 'usd'
    },
    oneTimePrice: null,
    defaultPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_EXTRA_CHANGES_PRICE_MONTHLY!,
      amount: 15,
      currency: 'usd'
    },
    metadata: {
      type: 'addon',
      addonId: 'extra-changes'
    }
  },
  // Booking System Add-on
  {
    id: process.env.STRIPE_BOOKING_PRODUCT_ID!,
    name: "Booking System Add-on",
    description: "Transform your website into a 24/7 booking machine. Allow customers to schedule appointments, make reservations, and manage their bookings automatically.",
    features: ["Online booking system", "Calendar management", "Automated confirmations"],
    isAddon: true,
    isSubscription: true,
    monthlyPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_BOOKING_PRICE_MONTHLY!,
      amount: 25,
      currency: 'usd'
    },
    yearlyPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_BOOKING_PRICE_YEARLY!,
      amount: 250,
      currency: 'usd'
    },
    oneTimePrice: null,
    defaultPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_BOOKING_PRICE_MONTHLY!,
      amount: 25,
      currency: 'usd'
    },
    metadata: {
      type: 'addon',
      addonId: 'booking'
    }
  },
  // Content Manager Add-on
  {
    id: process.env.STRIPE_CONTENT_MANAGER_PRODUCT_ID!,
    name: "Content Manager Add-on",
    description: "Take control of your website content with our powerful content management system. Update text, images, and pages without technical knowledge.",
    features: ["Content management system", "Easy updates", "Media library"],
    isAddon: true,
    isSubscription: true,
    monthlyPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_CONTENT_MANAGER_PRICE_MONTHLY!,
      amount: 20,
      currency: 'usd'
    },
    yearlyPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_CONTENT_MANAGER_PRICE_YEARLY!,
      amount: 200,
      currency: 'usd'
    },
    oneTimePrice: null,
    defaultPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_CONTENT_MANAGER_PRICE_MONTHLY!,
      amount: 20,
      currency: 'usd'
    },
    metadata: {
      type: 'addon',
      addonId: 'content-manager'
    }
  },
  // User Accounts Add-on
  {
    id: process.env.STRIPE_USER_ACCOUNTS_PRODUCT_ID!,
    name: "User Accounts Add-on",
    description: "Create exclusive content and personalized experiences with a secure user authentication system. Perfect for membership sites, premium content, and user communities.",
    features: ["User authentication", "Member areas", "User management"],
    isAddon: true,
    isSubscription: true,
    monthlyPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_USER_ACCOUNTS_PRICE_MONTHLY!,
      amount: 25,
      currency: 'usd'
    },
    yearlyPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_USER_ACCOUNTS_PRICE_YEARLY!,
      amount: 250,
      currency: 'usd'
    },
    oneTimePrice: null,
    defaultPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_USER_ACCOUNTS_PRICE_MONTHLY!,
      amount: 25,
      currency: 'usd'
    },
    metadata: {
      type: 'addon',
      addonId: 'user-accounts'
    }
  },
  // E-Commerce Add-on
  {
    id: process.env.STRIPE_ECOMMERCE_PRODUCT_ID!,
    name: "E-Commerce Add-on",
    description: "Transform your website into a powerful online store. Sell products 24/7 with a complete e-commerce solution including secure payments, inventory tracking, and order management.",
    features: ["Shopping cart", "Payment processing", "Inventory management", "Order tracking"],
    isAddon: true,
    isSubscription: true,
    monthlyPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_ECOMMERCE_PRICE_MONTHLY!,
      amount: 35,
      currency: 'usd'
    },
    yearlyPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_ECOMMERCE_PRICE_YEARLY!,
      amount: 350,
      currency: 'usd'
    },
    oneTimePrice: null,
    defaultPrice: {
      id: process.env.NEXT_PUBLIC_STRIPE_ECOMMERCE_PRICE_MONTHLY!,
      amount: 35,
      currency: 'usd'
    },
    metadata: {
      type: 'addon',
      addonId: 'ecommerce'
    }
  }
];

export async function GET() {
  try {
    // Filter and sort products
    const finalProducts = products
      .filter((product: TransformedProduct) => {
        const hasPrice = product.monthlyPrice || product.yearlyPrice || product.oneTimePrice;
        return hasPrice;
      })
      .sort((a: TransformedProduct, b: TransformedProduct) => {
        // Buy Website first
        if (a.name.toLowerCase().includes('buy a website')) return -1;
        if (b.name.toLowerCase().includes('buy a website')) return 1;
        // Then Starter Plan
        if (a.name.toLowerCase().includes('starter')) return -1;
        if (b.name.toLowerCase().includes('starter')) return 1;
        // Then sort by name
        return a.name.localeCompare(b.name);
      });

    if (!finalProducts.length) {
      return NextResponse.json(
        { error: "No products available" },
        { status: 404 }
      );
    }

    return NextResponse.json({ products: finalProducts });
  } catch (error: any) {
    console.error("Error in /api/stripe/prices:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch prices",
        details: error.message 
      },
      { status: 500 }
    );
  }
} 