import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { prisma } from "@/libs/prisma";
import { Prisma } from "@prisma/client";

export async function PATCH(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const body = await req.json();
		const { name, websiteName } = body;

		if (!name && !websiteName) {
			return new NextResponse("Missing required fields", { status: 400 });
		}

		const updateData: Prisma.UserUpdateInput = {};
		if (name) updateData.name = name;
		if (websiteName) updateData.websiteName = websiteName;

		console.log("[USER_PATCH] Updating user with data:", updateData);

		const user = await prisma.user.update({
			where: {
				email: session.user.email,
			},
			data: updateData,
		});

		console.log("[USER_PATCH] User updated successfully:", user);

		return NextResponse.json(user);
	} catch (error: any) {
		console.error("[USER_PATCH] Detailed error:", {
			message: error.message,
			code: error.code,
			stack: error.stack,
		});
		
		if (error.code === "P2002") {
			return new NextResponse("This value is already in use", { status: 409 });
		}
		
		return new NextResponse(error.message || "Internal error", { status: 500 });
	}
} 