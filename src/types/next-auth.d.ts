import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string | null;
      customerId: string | null;
      subscriptionId: string | null;
      priceId: string | null;
      currentPeriodEnd: Date | null;
      createdAt: Date;
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: string | null;
    customerId: string | null;
    subscriptionId: string | null;
    priceId: string | null;
    currentPeriodEnd: Date | null;
    createdAt: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string | null;
    customerId: string | null;
    subscriptionId: string | null;
    priceId: string | null;
    currentPeriodEnd: Date | null;
    createdAt: Date;
  }
} 