import React from "react";
import { getAuthSession } from "@/libs/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { stripe } from "@/libs/stripe";
import { prisma } from "@/libs/prisma";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Card from "@/components/Common/Card";
import SubscriptionDetails from "@/components/User/Billing/SubscriptionDetails";

export const metadata: Metadata = {
	title: "Billing - Dashboard",
	description: "Manage your billing and subscription",
};

const BillingPage = async () => {
	const session = await getAuthSession();

	if (!session) {
		redirect("/auth/signin");
	}

	// Get user's subscription to find customer ID
	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		include: { subscription: true }
	});

	if (!user) {
		redirect("/auth/signin");
	}

	const customerId = user.customerId || user.subscription?.stripeCustomerId;

	if (!customerId) {
		return (
			<>
				<Breadcrumb pageTitle="Billing" />
				<div className="grid gap-8">
					<Card>
						<div className="p-6 text-center">
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
								No Active Subscription
							</h2>
							<p className="text-gray-600 dark:text-gray-300">
								You don't have any active subscriptions. Visit our products page to get started.
							</p>
							<a
								href="/user/products"
								className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
							>
								View Products
							</a>
						</div>
					</Card>
				</div>
			</>
		);
	}

	// Create a billing portal session
	const portalSession = await stripe.billingPortal.sessions.create({
			customer: customerId,
			return_url: `${process.env.NEXT_PUBLIC_APP_URL}/user/billing`,
	});

	const stripePortalUrl = portalSession.url;

	return (
		<>
			<Breadcrumb pageTitle="Billing" />

			<div className="grid gap-8">
				{/* Welcome Card */}
				<Card>
					<div className="flex items-center gap-6 p-2">
						<div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
							<svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
								<path d="M3 10H21M7 15H8M12 15H13M6 19H18C19.6569 19 21 17.6569 21 16V8C21 6.34315 19.6569 5 18 5H6C4.34315 5 3 6.34315 3 8V16C3 17.6569 4.34315 19 6 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Management</h1>
							<p className="text-gray-600 dark:text-gray-300 mt-1">
								View and manage your active subscriptions and billing information.
							</p>
						</div>
					</div>
				</Card>

				{/* Subscription Status */}
				<Card>
					<div className="space-y-8">
						<div className="border-b border-gray-200 dark:border-gray-700 pb-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
									<svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
										<path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</div>
								<div>
									<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Subscriptions</h2>
									<p className="text-gray-600 dark:text-gray-300">
										Current subscription status and details
									</p>
								</div>
							</div>

							<SubscriptionDetails />
						</div>

						{/* Billing Portal Link */}
						<div className="space-y-4">
							<a 
								href={stripePortalUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="group flex items-center justify-between rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary dark:hover:ring-primary transition-all duration-200 hover:shadow-md"
							>
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
										<svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
											<path d="M11 17L6 12M6 12L11 7M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
									</div>
									<div>
										<h3 className="font-medium text-gray-900 dark:text-white">Stripe Billing Portal</h3>
										<p className="text-sm text-gray-600 dark:text-gray-300">
											Manage payment methods, view invoices, and update subscription
										</p>
									</div>
								</div>
								<div className="opacity-0 group-hover:opacity-100 transition-opacity">
									<svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none">
										<path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</div>
							</a>
						</div>

						{/* Security Notice */}
						<div className="mt-8 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-6">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
									<svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
										<path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
									</svg>
								</div>
								<div>
									<h3 className="font-medium text-gray-900 dark:text-white">Secure Billing Portal</h3>
									<p className="text-sm text-gray-600 dark:text-gray-300">
										Your billing information is securely managed through Stripe's certified payment platform.
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

export default BillingPage;
