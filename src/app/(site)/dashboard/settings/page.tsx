import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import EditProfile from "@/components/User/AccountSettings/EditProfile";

export default async function SettingsPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/auth/signin");
	}

	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>Account Settings</h1>
			<EditProfile user={session.user} />
		</div>
	);
} 