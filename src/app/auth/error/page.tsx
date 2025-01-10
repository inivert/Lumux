"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/app/components/common/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
	const router = useRouter();
	const calendlyUrl = "https://calendly.com/codelumusa";

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
			<div className="max-w-md w-full space-y-8 text-center">
				<div className="space-y-4">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Private Access Only
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						This is a private website. Access is granted only after a personal meeting with the admin. 
						Please schedule a meeting to discuss your needs and get access.
					</p>
					<div className="space-y-4 mt-8">
						<Button
							onClick={() => window.open(calendlyUrl, '_blank')}
							className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
						>
							<Calendar className="w-4 h-4" />
							Schedule a Meeting
						</Button>
						<Button
							onClick={() => router.push('/')}
							variant="outline"
							className="w-full flex items-center justify-center gap-2"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to Home
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
} 