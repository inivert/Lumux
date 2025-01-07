import { prisma } from "@/libs/prismaDb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { email } = body;

	if (!email) {
		return new NextResponse("Missing Fields", { status: 400 });
	}

	try {
		const user = await prisma.user.findUnique({
			where: {
				email: email.toLowerCase(),
			},
		});
		return new NextResponse(
			JSON.stringify({
				priceId: user?.priceId,
				subscriptionId: user?.subscriptionId,
				currentPeriodEnd: user?.currentPeriodEnd,
			}),
			{
				status: 200,
			}
		);
	} catch (error) {
		return new NextResponse("Something went wrong", { status: 500 });
	}
}
