import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		if (!email) {
			return new NextResponse("Email is required", { status: 400 });
		}

		// Check for invitation
		const invitation = await prisma.invitation.findFirst({
			where: {
				email: email,
			},
		});

		if (!invitation) {
			return new NextResponse("No valid invitation found", { status: 404 });
		}

		// Check if user exists
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (user) {
			return NextResponse.json({ user });
		}

		// Create new user
		const newUser = await prisma.user.create({
			data: {
				email: email,
				name: email.split("@")[0],
				role: "USER",
			},
		});

		return NextResponse.json({ user: newUser });
	} catch (error) {
		console.error("[INVITE_CHECK]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
} 