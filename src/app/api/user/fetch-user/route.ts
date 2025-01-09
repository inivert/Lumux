import { getAuthSession } from "@/libs/auth";
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Simple in-memory cache with 5-minute expiry
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

const rateLimit = new Map<string, { count: number; timestamp: number }>();

export async function POST() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Rate limiting
    const headersList = await headers();
    const clientIp = headersList.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const rateLimitInfo = rateLimit.get(clientIp) || { count: 0, timestamp: now };

    // Reset count if outside window
    if (now - rateLimitInfo.timestamp > RATE_LIMIT_WINDOW) {
      rateLimitInfo.count = 0;
      rateLimitInfo.timestamp = now;
    }

    // Check rate limit
    if (rateLimitInfo.count >= MAX_REQUESTS) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    // Update rate limit info
    rateLimitInfo.count++;
    rateLimit.set(clientIp, rateLimitInfo);

    // Check cache
    const cacheKey = session.user.email;
    const cachedData = cache.get(cacheKey);
    if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedData.data);
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        customerId: true,
        subscriptionId: true,
        priceId: true,
        currentPeriodEnd: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Update cache
    cache.set(cacheKey, { data: user, timestamp: now });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[FETCH_USER]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}