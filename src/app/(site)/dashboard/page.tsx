import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/auth/signin");
	}

	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>Welcome to your Dashboard</h1>
			<p className='text-gray-600 dark:text-gray-400'>
				You are signed in as {session.user.email}
			</p>
		</div>
	);
} 