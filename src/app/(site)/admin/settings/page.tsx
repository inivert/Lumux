import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/auth/signin");
	}

	if (session.user.role?.toLowerCase() !== "admin") {
		redirect("/user");
	}

	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>Admin Settings</h1>
			<p className='text-gray-600 dark:text-gray-400'>
				Welcome to admin settings, {session.user.email}
			</p>
		</div>
	);
} 