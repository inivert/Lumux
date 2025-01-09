"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorPage() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	const getErrorMessage = () => {
		switch (error) {
			case "OAuthAccountNotLinked":
				return {
					title: "Account Already Exists",
					message: "An account with this email already exists. Please sign in using your original sign-in method or use the magic link option.",
				};
			case "AccessDenied":
				return {
					title: "Access Denied",
					message: "You don't have permission to access this resource.",
				};
			default:
				return {
					title: "Authentication Error",
					message: "An error occurred during authentication. Please try again.",
				};
		}
	};

	const errorInfo = getErrorMessage();

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="max-w-md w-full space-y-8 text-center">
				<div>
					<h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
						{errorInfo.title}
					</h2>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						{errorInfo.message}
					</p>
				</div>
				<div className="mt-4">
					<Link
						href="/auth/signin"
						className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Return to Sign In
					</Link>
				</div>
			</div>
		</div>
	);
} 