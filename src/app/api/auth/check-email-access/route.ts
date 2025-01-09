import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json(
				{ error: "Email is required" },
				{ status: 400 }
			);
		}

		// Check if user exists in users table
		const existingUser = await prisma.user.findUnique({
			where: {
				email: email.toLowerCase(),
			},
		});

		if (existingUser) {
			return NextResponse.json({
				hasAccess: true,
			});
		}

		// If not in users table, check invitations
		const invitation = await prisma.invitation.findFirst({
			where: {
				email: email.toLowerCase(),
				expiresAt: {
					gt: new Date(), // Not expired
				},
			},
		});

		return NextResponse.json({
			hasAccess: !!invitation,
		});
	} catch (error) {
		console.error("Error checking email access:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
} 