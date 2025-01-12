import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import { stripe } from "@/lib/stripe";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        session: async ({ session, user }) => {
            if (session.user) {
                session.user.id = user.id;

                // Get or create Stripe customer
                const customer = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: {
                        id: true,
                        email: true,
                        customerId: true,
                        subscription: {
                            select: {
                                stripeCustomerId: true
                            }
                        }
                    }
                });

                const stripeCustomerId = customer?.customerId || customer?.subscription?.stripeCustomerId;

                if (!stripeCustomerId) {
                    // Create new Stripe customer
                    const stripeCustomer = await stripe.customers.create({
                        email: session.user.email!,
                        name: session.user.name || undefined,
                        metadata: {
                            userId: user.id
                        }
                    });

                    // Update user with Stripe customer ID
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { customerId: stripeCustomer.id }
                    });
                }
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    session: {
        strategy: 'database'
    },
    secret: process.env.NEXTAUTH_SECRET,
}; 