import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		if (!email) {
			return new NextResponse("Email is required", { status: 400 });
		}

		// Check for valid invitation
		const invitation = await prisma.invitation.findFirst({
			where: {
				email: email.toLowerCase(),
				accepted: false,
				expiresAt: { gt: new Date() }
			}
		});

		if (!invitation) {
			return new NextResponse("No valid invitation found for this email", { status: 404 });
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email: email.toLowerCase() }
		});

		if (existingUser) {
			return new NextResponse("User already exists", { status: 400 });
		}

		// Create user account
		const user = await prisma.user.create({
			data: {
				email: email.toLowerCase(),
				role: invitation.role,
				emailVerified: new Date(),
			}
		});

		// Mark invitation as accepted
		await prisma.invitation.update({
			where: { id: invitation.id },
			data: { accepted: true }
		});

		return NextResponse.json({
			message: "Account created successfully",
			role: user.role
		});
	} catch (error) {
		console.error("[VERIFY_INVITATION]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
} 