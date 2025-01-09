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

		// Check if there's a valid invitation for this email
		const invitation = await prisma.invitation.findFirst({
			where: {
				email: email.toLowerCase(),
				accepted: false,
				expiresAt: {
					gt: new Date(), // Not expired
				},
			},
		});

		return NextResponse.json({
			hasInvitation: !!invitation,
		});
	} catch (error) {
		console.error("Error checking invitation:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
} 