import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/auth/signin");
	}

	if (session.user.role === "admin") {
		redirect("/admin");
	}

	redirect("/dashboard");
} 