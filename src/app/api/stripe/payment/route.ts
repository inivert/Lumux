import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/libs/prisma";

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("Missing STRIPE_SECRET_KEY");
  throw new Error("Stripe secret key is required");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, priceId } = body;

    console.log("[Payment Route] Request received:", { userId, priceId });

    if (!userId) {
      return NextResponse.json(
        { error: "Missing user ID" },
        { status: 400 }
      );
    }

    // Find user
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true },
      });

      console.log("[Payment Route] User found:", {
        email: existingUser?.email,
        hasSubscription: !!existingUser?.subscription,
      });
    } catch (error) {
      console.error("[Payment Route] Database error:", error);
      return NextResponse.json(
        { error: "Database error", details: "Failed to fetch user data" },
        { status: 500 }
      );
    }

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!existingUser.email) {
      return NextResponse.json(
        { error: "User email required" },
        { status: 400 }
      );
    }

    try {
      // If user doesn't have a Stripe customer ID, create one
      if (!existingUser.subscription?.stripeCustomerId) {
        console.log("[Payment Route] Creating new Stripe customer");
        const customer = await stripe.customers.create({
          email: existingUser.email,
          metadata: { userId },
        });

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          customer: customer.id,
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          success_url: `${process.env.SITE_URL || 'http://localhost:3000'}/user/billing?success=true`,
          cancel_url: `${process.env.SITE_URL || 'http://localhost:3000'}/user/billing?success=false`,
          subscription_data: {
            metadata: {
              userId,
            },
          },
        });

        console.log("[Payment Route] Checkout session created:", session.id);
        return NextResponse.json({ url: session.url });
      }

      // If user has a Stripe customer ID, create a billing portal session
      console.log("[Payment Route] Creating billing portal session");
      const session = await stripe.billingPortal.sessions.create({
        customer: existingUser.subscription.stripeCustomerId,
        return_url: `${process.env.SITE_URL || 'http://localhost:3000'}/user/billing`,
      });

      console.log("[Payment Route] Portal session created");
      return NextResponse.json({ url: session.url });
    } catch (error: any) {
      console.error("[Payment Route] Stripe error:", {
        type: error.type,
        message: error.message,
        code: error.code,
      });

      // Handle specific Stripe errors
      if (error.type === 'StripeInvalidRequestError') {
        return NextResponse.json(
          { error: "Invalid request to Stripe", details: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Payment processing error", details: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[Payment Route] Unexpected error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
} 