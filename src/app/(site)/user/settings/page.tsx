import React from "react";
import Breadcrumb from "@/components/Common/Dashboard/Breadcrumb";
import { getAuthSession } from "@/libs/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import EditProfile from "@/components/User/AccountSettings/EditProfile";
import Image from "next/image";

export const metadata: Metadata = {
	title: `Profile Settings - ${process.env.SITE_NAME}`,
	description: `Manage your profile settings and preferences`,
};

const SettingsPage = async () => {
	const session = await getAuthSession();
	
	if (!session) {
		redirect("/auth/signin");
	}

	const profilePic = session.user?.image
		? session.user.image.includes("http")
			? session.user.image
			: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${session.user.image}`
		: "/images/dashboard/profile-avatar.png";

	return (
		<>
			<Breadcrumb pageTitle="Profile Settings" />
			
			<div className="max-w-4xl mx-auto">
				{/* Profile Summary Card */}
				<div className="bg-white dark:bg-gray-dark p-6 rounded-xl shadow-sm mb-8">
					<div className="flex items-center gap-6">
						<div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-800">
							<Image
								src={profilePic}
								alt={session.user?.name || "Profile"}
								fill
								className="object-cover"
							/>
						</div>
						<div>
							<h2 className="text-2xl font-bold text-dark dark:text-white mb-2">
								{session.user?.name || "Your Name"}
							</h2>
							<p className="text-body dark:text-gray-5">
								{session.user?.email}
							</p>
						</div>
					</div>
				</div>

				{/* Edit Profile Form */}
				<div className="bg-white dark:bg-gray-dark rounded-xl shadow-sm">
					<div className="p-6 border-b border-stroke dark:border-stroke-dark">
						<h3 className="text-lg font-semibold text-dark dark:text-white">
							Edit Profile Information
						</h3>
						<p className="text-sm text-body dark:text-gray-5 mt-1">
							Update your profile information and preferences
						</p>
					</div>
					<div className="p-6">
						<EditProfile />
					</div>
				</div>
			</div>
		</>
	);
};

export default SettingsPage; 