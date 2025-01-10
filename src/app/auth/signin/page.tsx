import React from "react";
import Signin from "@/components/Auth/Signin";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
	title: `Sign in - ${process.env.SITE_NAME}`,
	description: `This is Sign in page for ${process.env.SITE_NAME}`,
};

const SigninPage = () => {
	return (
		<main className="min-h-screen bg-[#1A1F2D] relative overflow-hidden">
			{/* Background Design Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-primary/10 to-transparent rounded-full transform rotate-12" />
				<div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-primary/10 to-transparent rounded-full transform -rotate-12" />
				<div className="absolute top-0 left-0 w-full h-full">
					<Image
						src="/images/signin/signin-grid-01.svg"
						alt="Background Pattern"
						width={600}
						height={600}
						className="absolute -top-24 -right-24 opacity-[0.1]"
					/>
					<Image
						src="/images/signin/signin-grid-02.svg"
						alt="Background Pattern"
						width={600}
						height={600}
						className="absolute -bottom-24 -left-24 opacity-[0.1]"
					/>
				</div>
			</div>

			{/* Back Button */}
			<div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20">
				<Link
					href="/"
					className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
				>
					<svg
						className="w-5 h-5 transition-transform group-hover:-translate-x-1"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M19 12H5M5 12L12 19M5 12L12 5"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<span className="text-sm font-medium">Back to Home</span>
				</Link>
			</div>

			{/* Content */}
			<div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
				<div className="max-w-[420px] mx-auto">
					{/* Logo */}
					<div className="flex justify-center mb-12">
						<Link href="/" className="inline-flex items-center gap-3">
							<span className="text-2xl font-bold tracking-tight drop-shadow-sm">
								<span className="text-gray-900 dark:text-white">Code</span>
								<span className="text-primary hover:text-primary/90 transition-colors">Lumus</span>
							</span>
							{/* Only show dev tag in development */}
							{process.env.NODE_ENV === 'development' && (
								<span className="rounded border border-gray-200 dark:border-white/20 bg-gray-100/50 dark:bg-black/10 backdrop-blur-sm px-2 py-0.5 text-[10px] uppercase tracking-widest font-medium text-gray-600 dark:text-white/90">
									dev
								</span>
							)}
						</Link>
					</div>

					{/* Signin Form */}
					<div className="bg-[#1E2432]/80 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-white/10">
						<Signin />
					</div>

					{/* Agreement Text */}
					<div className="mt-8 text-center text-sm text-gray-300">
						By signing in, you agree to our{' '}
						<Link href="/terms" className="text-primary hover:text-primary-light transition-colors underline">Terms of Service</Link>
						{' '}and{' '}
						<Link href="/privacy" className="text-primary hover:text-primary-light transition-colors underline">Privacy Policy</Link>
					</div>
				</div>
			</div>
		</main>
	);
};

export default SigninPage;
