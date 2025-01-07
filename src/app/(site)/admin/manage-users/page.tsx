import { Metadata } from "next";
import ManageUsersClient from "./ManageUsersClient";
import { getAuthSession } from "@/libs/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Manage Users",
	description: "Manage users and invitations",
};

export default async function ManageUsersPage() {
	const session = await getAuthSession();
	
	if (!session?.user || session.user.role !== "ADMIN") {
		redirect("/");
	}

	return (
		<div className="w-full px-4 py-8">
			<div className="mx-auto max-w-7xl">
				<h1 className="mb-8 text-3xl font-bold">Manage Users & Invitations</h1>
				<ManageUsersClient />
			</div>
		</div>
	);
}
