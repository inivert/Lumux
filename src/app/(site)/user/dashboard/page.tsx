import React from "react";
import Breadcrumb from "@/components/Common/Dashboard/Breadcrumb";
import { getAuthSession } from "@/libs/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `User Dashboard - ${process.env.SITE_NAME}`,
	description: `User dashboard overview and statistics`,
};

export default async function DashboardPage() {
	const session = await getAuthSession();
	
	if (!session?.user) {
		redirect("/auth/signin");
	}

	return (
		<>
			<Breadcrumb pageTitle="Dashboard Overview" />
			
			<div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
				<div className="w-20 h-20 mb-6 text-primary">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="w-full h-full"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M4.5 3.75C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75H4.5ZM2.25 4.5C2.25 3.25736 3.25736 2.25 4.5 2.25H19.5C20.7426 2.25 21.75 3.25736 21.75 4.5V19.5C21.75 20.7426 20.7426 21.75 19.5 21.75H4.5C3.25736 21.75 2.25 20.7426 2.25 19.5V4.5Z M7.5 8.25C7.08579 8.25 6.75 8.58579 6.75 9V17C6.75 17.4142 7.08579 17.75 7.5 17.75C7.91421 17.75 8.25 17.4142 8.25 17V9C8.25 8.58579 7.91421 8.25 7.5 8.25Z M12 6.25C11.5858 6.25 11.25 6.58579 11.25 7V17C11.25 17.4142 11.5858 17.75 12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V7C12.75 6.58579 12.4142 6.25 12 6.25Z M16.5 11.25C16.0858 11.25 15.75 11.5858 15.75 12V17C15.75 17.4142 16.0858 17.75 16.5 17.75C16.9142 17.75 17.25 17.4142 17.25 17V12C17.25 11.5858 16.9142 11.25 16.5 11.25Z"
							fill="currentColor"
						/>
					</svg>
				</div>
				<h2 className="text-2xl font-bold text-dark dark:text-white mb-4">
					Welcome, {session.user.name || session.user.email}!
				</h2>
				<p className="text-body dark:text-gray-5 max-w-lg">
					Your website analytics dashboard is currently in development. 
					Soon you'll have access to valuable insights including visitor tracking, 
					engagement metrics, and performance analytics - all in one convenient place.
				</p>
			</div>
		</>
	);
} 