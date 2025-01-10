import React from "react";
import Breadcrumb from "@/components/Common/Dashboard/Breadcrumb";
import { getAuthSession } from "@/libs/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Card from "@/components/Common/Dashboard/Card";
import Image from "next/image";

export const metadata: Metadata = {
	title: `Support - ${process.env.SITE_NAME}`,
	description: `Get help and support for your account`,
};

const SupportPage = async () => {
	const session = await getAuthSession();

	if (!session) {
		redirect("/auth/signin");
	}

	const userName = session.user?.name || "Anonymous User";
	const websiteName = session.user?.websiteName || "Not Set";

	// Clean phone number and create base WhatsApp URL
	const phoneNumber = "4013476461".replace(/\D/g, "");
	const baseUrl = `https://wa.me/${phoneNumber}?text=`;

	// Create message templates
	const messages = {
		siteFeature: encodeURIComponent(`Hi, I'd like to request a feature for CodeLumus.\n\nName: ${userName}`),
		siteProblem: encodeURIComponent(`Hi, I'm experiencing a problem with CodeLumus.\n\nName: ${userName}`),
		siteOther: encodeURIComponent(`Hi, I need help with CodeLumus.\n\nName: ${userName}`),
		clientFeature: encodeURIComponent(`Hi, I'd like to request a feature for my website.\n\nName: ${userName}\nWebsite: ${websiteName}`),
		clientProblem: encodeURIComponent(`Hi, I'm experiencing a problem with my website.\n\nName: ${userName}\nWebsite: ${websiteName}`),
		clientOther: encodeURIComponent(`Hi, I need help with my website.\n\nName: ${userName}\nWebsite: ${websiteName}`),
	};

	return (
		<>
			<Breadcrumb pageTitle="Support" />

			<div className="grid gap-8">
				{/* Welcome Card */}
				<Card>
					<div className="flex items-center gap-6 p-2">
						<div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
							<svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
								<path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
								<path d="M12 12V8M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
							</svg>
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">How can I help you today?</h1>
							<p className="text-gray-600 dark:text-gray-300 mt-1">
								Choose a category below and I'll respond within 24 hours via WhatsApp, please provide as much detail as possible and include screenshots if possible.
							</p>
						</div>
					</div>
				</Card>

				{/* CodeLumus Support Section */}
				<Card>
					<div className="space-y-8">
						<div className="border-b border-gray-200 dark:border-gray-700 pb-6">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
									<svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
										<path d="M4 7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V7Z" stroke="currentColor" strokeWidth="2"/>
										<path d="M8 5V3C8 2.44772 8.44772 2 9 2H15C15.5523 2 16 2.44772 16 3V5" stroke="currentColor" strokeWidth="2"/>
										<path d="M8 11H16M8 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
									</svg>
								</div>
								<div>
									<h2 className="text-xl font-semibold text-gray-900 dark:text-white">CodeLumus Platform Support</h2>
									<p className="text-gray-600 dark:text-gray-300">
										Get help with the CodeLumus platform
									</p>
								</div>
							</div>

							<div className="grid gap-6 sm:grid-cols-3">
								<div className="space-y-4">
									<a 
										href={baseUrl + messages.siteFeature}
										target="_blank"
										rel="noopener noreferrer"
										className="group relative flex flex-col gap-2 rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary dark:hover:ring-primary transition-all duration-200 hover:shadow-md"
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
												<svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none">
													<path d="M12 6V18M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
												</svg>
											</div>
											<span className="font-medium text-gray-900 dark:text-white">Request Feature</span>
										</div>
										<p className="text-sm text-gray-600 dark:text-gray-400">Suggest new features or improvements</p>
										<div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
											<svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none">
												<path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</div>
									</a>
								</div>

								<div className="space-y-4">
									<a 
										href={baseUrl + messages.siteProblem}
										target="_blank"
										rel="noopener noreferrer"
										className="group relative flex flex-col gap-2 rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary dark:hover:ring-primary transition-all duration-200 hover:shadow-md"
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
												<svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none">
													<path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
												</svg>
											</div>
											<span className="font-medium text-gray-900 dark:text-white">Report Problem</span>
										</div>
										<p className="text-sm text-gray-600 dark:text-gray-400">Report bugs or technical issues</p>
										<div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
											<svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none">
												<path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</div>
									</a>
								</div>

								<div className="space-y-4">
									<a 
										href={baseUrl + messages.siteOther}
										target="_blank"
										rel="noopener noreferrer"
										className="group relative flex flex-col gap-2 rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary dark:hover:ring-primary transition-all duration-200 hover:shadow-md"
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
												<svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none">
													<path d="M8.22766 9C8.77678 7.83481 10.2584 7 12.0001 7C14.2092 7 16.0001 8.34315 16.0001 10C16.0001 11.3994 14.7224 12.5751 12.9943 12.9066C12.4519 13.0106 12.0001 13.4477 12.0001 14M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
												</svg>
											</div>
											<span className="font-medium text-gray-900 dark:text-white">Other Issues</span>
										</div>
										<p className="text-sm text-gray-600 dark:text-gray-400">Get help with other inquiries</p>
										<div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
											<svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none">
												<path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</div>
									</a>
								</div>
							</div>
						</div>

						{/* Your Website Support Section */}
						<div className="space-y-6">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
									<svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
										<path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
										<path d="M3.6001 9H20.4001" stroke="currentColor" strokeWidth="2"/>
										<path d="M3.6001 15H20.4001" stroke="currentColor" strokeWidth="2"/>
										<path d="M12 20.4C14.5 20.4 16.5 16.5 16.5 12C16.5 7.5 14.5 3.6 12 3.6C9.5 3.6 7.5 7.5 7.5 12C7.5 16.5 9.5 20.4 12 20.4Z" stroke="currentColor" strokeWidth="2"/>
									</svg>
								</div>
								<div>
									<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Website Support</h2>
									<p className="text-gray-600 dark:text-gray-300">
										Get help with your website
									</p>
								</div>
							</div>

							<div className="grid gap-6 sm:grid-cols-3">
								<div className="space-y-4">
									<a 
										href={baseUrl + messages.clientFeature}
										target="_blank"
										rel="noopener noreferrer"
										className="group relative flex flex-col gap-2 rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary dark:hover:ring-primary transition-all duration-200 hover:shadow-md"
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
												<svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none">
													<path d="M12 6V18M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
												</svg>
											</div>
											<span className="font-medium text-gray-900 dark:text-white">Request Feature</span>
										</div>
										<p className="text-sm text-gray-600 dark:text-gray-400">Request new website features</p>
										<div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
											<svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none">
												<path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</div>
									</a>
								</div>

								<div className="space-y-4">
									<a 
										href={baseUrl + messages.clientProblem}
										target="_blank"
										rel="noopener noreferrer"
										className="group relative flex flex-col gap-2 rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary dark:hover:ring-primary transition-all duration-200 hover:shadow-md"
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
												<svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none">
													<path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
												</svg>
											</div>
											<span className="font-medium text-gray-900 dark:text-white">Report Problem</span>
										</div>
										<p className="text-sm text-gray-600 dark:text-gray-400">Report website issues</p>
										<div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
											<svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none">
												<path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</div>
									</a>
								</div>

								<div className="space-y-4">
									<a 
										href={baseUrl + messages.clientOther}
										target="_blank"
										rel="noopener noreferrer"
										className="group relative flex flex-col gap-2 rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary dark:hover:ring-primary transition-all duration-200 hover:shadow-md"
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
												<svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none">
													<path d="M8.22766 9C8.77678 7.83481 10.2584 7 12.0001 7C14.2092 7 16.0001 8.34315 16.0001 10C16.0001 11.3994 14.7224 12.5751 12.9943 12.9066C12.4519 13.0106 12.0001 13.4477 12.0001 14M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
												</svg>
											</div>
											<span className="font-medium text-gray-900 dark:text-white">Other Issues</span>
										</div>
										<p className="text-sm text-gray-600 dark:text-gray-400">Get help with other inquiries</p>
										<div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
											<svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none">
												<path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</div>
									</a>
								</div>
							</div>
						</div>

						{/* WhatsApp Info Section */}
						<div className="mt-8 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-6">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 flex-shrink-0">
									<Image
										src="/images/whatsapp-logo.svg"
										alt="WhatsApp"
										width={48}
										height={48}
										className="w-full h-full object-contain"
									/>
								</div>
								<div>
									<h3 className="font-medium text-gray-900 dark:text-white">WhatsApp Support</h3>
									<p className="text-sm text-gray-600 dark:text-gray-300">
										Messages will be sent via WhatsApp for faster response. Typical response time is within 24 hours.
									</p>
								</div>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</>
	);
};

export default SupportPage; 