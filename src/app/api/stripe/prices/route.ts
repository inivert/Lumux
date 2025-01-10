import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function GET() {
  try {
    // Fetch all active products first
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    console.log('Products:', JSON.stringify(products.data.map(p => ({
      id: p.id,
      name: p.name,
      default_price: p.default_price,
    })), null, 2));

    // Fetch all prices for these products
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
      limit: 100, // Increase limit to get all prices
    });

    console.log('Prices:', JSON.stringify(prices.data.map(p => ({
      id: p.id,
      product: (p.product as Stripe.Product).id,
      amount: p.unit_amount,
      currency: p.currency,
      type: p.type,
      recurring: p.recurring,
    })), null, 2));

    // Transform the data to include both one-time and subscription prices
    const productsMap = new Map();

    // First, process all products to ensure we have their metadata
    products.data.forEach((product) => {
      const defaultPrice = product.default_price as Stripe.Price;
      
      // Determine if it's an addon based on the product name or metadata
      const isAddon = !(
        product.name.toLowerCase().includes('starter') ||
        product.name.toLowerCase().includes('basic') ||
        (product.metadata.isAddon === "false")
      );

      // Determine if it's a subscription based on the default price or metadata
      const isSubscription = 
        (defaultPrice?.type === 'recurring') ||
        (product.metadata.isSubscription === "true");

      // Parse features from metadata or create default features based on description
      let features = [];
      try {
        if (product.metadata.features) {
          features = JSON.parse(product.metadata.features);
        } else if (product.description) {
          // Create features from description if available
          features = [product.description];
        }
      } catch (e) {
        console.error('Error parsing features for product:', product.id);
        features = product.metadata.features ? [product.metadata.features] : [];
      }
      
      productsMap.set(product.id, {
        id: product.id,
        name: product.name,
        description: product.description,
        features,
        isAddon,
        isSubscription,
        defaultPrice: defaultPrice ? {
          id: defaultPrice.id,
          amount: defaultPrice.unit_amount,
          currency: defaultPrice.currency,
          type: defaultPrice.type,
          recurring: defaultPrice.recurring ? {
            interval: defaultPrice.recurring.interval,
            interval_count: defaultPrice.recurring.interval_count,
          } : null,
        } : null,
        monthlyPrice: null,
        yearlyPrice: null,
        oneTimePrice: null,
      });
    });

    // Then process all prices to add them to the corresponding products
    prices.data.forEach((price) => {
      const product = price.product as Stripe.Product;
      if (!productsMap.has(product.id)) return;

      const priceData = {
        id: price.id,
        amount: price.unit_amount,
        currency: price.currency,
        type: price.type,
        recurring: price.recurring ? {
          interval: price.recurring.interval,
          interval_count: price.recurring.interval_count,
        } : null,
      };

      // If this is the default price, make sure it's set as one of the categorized prices
      const isDefaultPrice = productsMap.get(product.id).defaultPrice?.id === price.id;
      
      if (price.type === 'one_time' || !price.recurring) {
        productsMap.get(product.id).oneTimePrice = priceData;
      } else if (price.recurring) {
        if (price.recurring.interval === 'month') {
          productsMap.get(product.id).monthlyPrice = priceData;
        } else if (price.recurring.interval === 'year') {
          productsMap.get(product.id).yearlyPrice = priceData;
        }
      }

      // If this is the default price and we haven't categorized it yet, set it as oneTimePrice
      if (isDefaultPrice && !productsMap.get(product.id).oneTimePrice && 
          !productsMap.get(product.id).monthlyPrice && !productsMap.get(product.id).yearlyPrice) {
        productsMap.get(product.id).oneTimePrice = priceData;
      }
    });

    // Convert to array and sort (starter pack first, then addons)
    const finalProducts = Array.from(productsMap.values()).sort((a, b) => {
      // Sort by isAddon first
      if (!a.isAddon && b.isAddon) return -1;
      if (a.isAddon && !b.isAddon) return 1;
      
      // Then sort by name
      return a.name.localeCompare(b.name);
    });

    console.log('Final Products with Prices:', JSON.stringify(finalProducts.map(p => ({
      name: p.name,
      defaultPrice: p.defaultPrice,
      oneTimePrice: p.oneTimePrice,
      monthlyPrice: p.monthlyPrice,
      yearlyPrice: p.yearlyPrice,
    })), null, 2));

    return NextResponse.json({ products: finalProducts });
  } catch (error) {
    console.error("Error fetching prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
} 