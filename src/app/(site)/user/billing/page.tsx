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
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
								<svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
									<path d="M3 10H21M7 15H8M12 15H13M6 19H18C19.6569 19 21 17.6569 21 16V8C21 6.34315 19.6569 5 18 5H6C4.34315 5 3 6.34315 3 8V16C3 17.6569 4.34315 19 6 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>
							<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
								No Active Subscription
							</h2>
							<p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
								Get started with our subscription plans to access premium features and support.
							</p>
							<div className="flex items-center justify-center gap-4">
								<a
									href="/pricing"
									className="inline-flex items-center justify-center px-5 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
								>
									View Plans
								</a>
								<a
									href="/user/products"
									className="inline-flex items-center justify-center px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
								>
									Browse Products
								</a>
							</div>
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
					<div className="flex items-center gap-6 p-6">
						<div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
							<svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
								<path d="M3 10H21M7 15H8M12 15H13M6 19H18C19.6569 19 21 17.6569 21 16V8C21 6.34315 19.6569 5 18 5H6C4.34315 5 3 6.34315 3 8V16C3 17.6569 4.34315 19 6 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Management</h1>
							<p className="text-gray-600 dark:text-gray-300 mt-1">
								View and manage your active subscriptions, billing information, and payment history.
							</p>
						</div>
					</div>
				</Card>

				{/* Quick Actions */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Card>
						<a
							href={stripePortalUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-xl"
						>
							<div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
								<svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
									<path d="M3 10H21M7 15H8M12 15H13M6 19H18C19.6569 19 21 17.6569 21 16V8C21 6.34315 19.6569 5 18 5H6C4.34315 5 3 6.34315 3 8V16C3 17.6569 4.34315 19 6 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								Manage Payment Methods
							</h3>
							<p className="text-gray-600 dark:text-gray-300 text-sm">
								Update your payment information and billing preferences in Stripe's secure portal
							</p>
						</a>
					</Card>

					<Card>
						<a
							href="/user/support"
							className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-xl"
						>
							<div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
								<svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
									<path d="M8 10H8.01M12 10H12.01M16 10H16.01M9 16H5C3.89543 16 3 15.1046 3 14V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H15L12 19L9 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								Billing Support
							</h3>
							<p className="text-gray-600 dark:text-gray-300 text-sm">
								Get help with billing issues or subscription questions
							</p>
						</a>
					</Card>
				</div>

				{/* Subscription Details */}
				<Card>
					<div className="p-6">
						<SubscriptionDetails />
					</div>
				</Card>

				{/* Security Notice */}
				<Card>
					<div className="p-6">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
								<svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
									<path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
								</svg>
							</div>
							<div>
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Secure Billing Portal</h3>
								<p className="text-gray-600 dark:text-gray-300 mt-1">
									Your billing information is securely managed through Stripe's certified payment platform.
									All transactions are encrypted and processed with industry-standard security measures.
								</p>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</>
	);
};

export default BillingPage;
