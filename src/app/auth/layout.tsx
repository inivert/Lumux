import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Authentication",
	description: "Authentication pages for the application",
};

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);

	// If user is already authenticated, redirect to appropriate dashboard
	if (session) {
		if (session.user.role === "ADMIN") {
			redirect("/admin");
		}
		redirect("/user");
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{children}
		</div>
	);
} 