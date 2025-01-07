import React from "react";
import Breadcrumb from "@/components/Common/Dashboard/Breadcrumb";
import AccountSettings from "@/components/User/AccountSettings";
import SetupPassword from "@/components/User/AccountSettings/SetupPassword";
import { getAuthSession } from "@/libs/auth";
import { prisma } from "@/libs/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `User Dashboard - ${process.env.SITE_NAME}`,
	description: `This is User Dashboard page for ${process.env.SITE_NAME}`,
	// other discriptions
};

const page = async () => {
	const session = await getAuthSession();
	
	// Get user details including hasPassword field
	const user = await prisma.user.findUnique({
		where: {
			email: session?.user?.email || "",
		},
		select: {
			hasPassword: true,
		},
	});

	const needsPasswordSetup = !user?.hasPassword;

	return (
		<>
			<Breadcrumb pageTitle='Account Settings' />
			{needsPasswordSetup ? (
				<div className="flex justify-center items-center min-h-[50vh]">
					<SetupPassword />
				</div>
			) : (
				<AccountSettings />
			)}
		</>
	);
};

export default page;
