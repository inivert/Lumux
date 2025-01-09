import { getAuthSession } from "@/libs/auth";
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import z from "zod";

const schema = z
  .object({
    password: z
      .string()
      .min(8)
      .refine((val) => /[A-Z]/.test(val))
      .refine((val) => /[a-z]/.test(val))
      .refine((val) => /\d/.test(val))
      .refine((val) => /[@$!%*?&]/.test(val)),
    email: z.string().email(),
  });

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return new NextResponse("Invalid request data", { status: 400 });
    }

    const { password, email } = body;

    // Verify the user exists and matches the session
    if (email !== session.user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user with the new password
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        hasPassword: true,
      },
    });

    return new NextResponse("Password set successfully", { status: 200 });
  } catch (error) {
    console.error("[SETUP_PASSWORD]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 