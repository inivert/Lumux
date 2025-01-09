"use client";
import axios from "axios";
import { Price } from "../../types/priceItem";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { integrations, messages } from "../../../integrations.config";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import getUpdatedData from "../../libs/getUpdatedData";
import AnimatedPrice from "./AnimatedPrice";

type Props = {
	plan: Price;
	isBilling?: boolean;
	showYearly?: boolean;
	subscriptionPlan?: any;
};

const PriceItem = ({ plan, isBilling, showYearly }: Props) => {
	const { data: session, update, status } = useSession();
	const user = session?.user;
	const lastUpdate = useRef<number>(0);

	useEffect(() => {
		const fetchAndUpdateSession = async () => {
			if (status === "loading") return;
			if (!user?.email) return;

			// Prevent updates more frequent than every 5 seconds
			const now = Date.now();
			if (now - lastUpdate.current < 5000) return;

			try {
				const data = await getUpdatedData(user.email);
				if (!data) return;

				// Only update if data has changed
				if (
					data.priceId !== user.priceId ||
					data.currentPeriodEnd !== user.currentPeriodEnd ||
					data.subscriptionId !== user.subscriptionId
				) {
					lastUpdate.current = now;
					await update({
						...session,
						user: {
							...session?.user,
							priceId: data.priceId,
							currentPeriodEnd: data.currentPeriodEnd,
							subscriptionId: data.subscriptionId,
						},
					});
				}
			} catch (error) {
				console.error("Couldn't update session:", error);
			}
		};

		fetchAndUpdateSession();
	}, [status, user?.email, update]); // Removed session from dependencies

	const handleSubscription = async () => {
		if (!session || !session.user?.id) {
			window.location.href = '/auth/signin';
			return;
		}

		if (!integrations?.isPaymentsEnabled) {
			toast.error(messages?.payment || "Payments are not enabled");
			return;
		}

		const priceId = showYearly ? plan.yearlyPriceId : plan.priceId;

		if (!priceId) {
			toast.error("Invalid price configuration");
			return;
		}

		try {
			const res = await axios.post("/api/stripe/payment", {
				userId: session.user.id,
				priceId
			});

			if (res.data.error) {
				toast.error(res.data.error.details || res.data.error);
				return;
			}

			if (!res.data.url) {
				toast.error("No checkout URL received");
				return;
			}

			window.location.href = res.data.url;
		} catch (err: any) {
			const errorMessage = err.response?.data?.details || 
							   err.response?.data?.error || 
							   "Failed to process payment. Please try again.";
			
			toast.error(errorMessage);
		}
	};

	const active = plan?.active;
	const isSubscribed = Boolean(session?.user?.priceId && session.user.priceId === (showYearly ? plan?.yearlyPriceId : plan?.priceId));

	const getButtonText = () => {
		if (!session) return 'Sign in to Subscribe';
		if (isSubscribed) return 'Current Plan';
		return plan.isAddon ? 'Add to Plan' : 'Get Started';
	};

	const getButtonStyle = () => {
		if (!session) {
			return 'bg-gray-300 text-gray-600 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400';
		}
		if (isSubscribed) {
			return 'bg-gray-100 text-gray-900 cursor-not-allowed dark:bg-gray-800 dark:text-white';
		}
		if (plan.isAddon) {
			return 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700';
		}
		return active && !isBilling
			? 'bg-white text-black hover:bg-gray-100'
			: 'bg-primary text-white hover:bg-primary-dark';
	};

	return (
		<div
			className={`relative flex flex-col h-full rounded-2xl p-8 transition-all duration-200 hover:shadow-lg ${
				plan.isAddon
					? 'bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-700'
					: active && !isBilling
					? 'bg-primary border-2 border-primary'
					: 'bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-700'
			}`}
		>
			{active && !plan.isAddon && (
				<span
					className={`absolute -top-3 left-1/2 transform -translate-x-1/2 inline-flex rounded-full px-4 py-1 text-sm font-medium ${
						isBilling
							? 'bg-primary text-white'
							: 'bg-white text-primary shadow-sm border border-primary'
					}`}
				>
					Most Popular
				</span>
			)}

			<div className='mb-6 space-y-4'>
				<div className='flex items-center gap-4'>
					<div
						className={`flex h-12 w-12 items-center justify-center rounded-xl ${
							plan.isAddon
								? 'bg-primary/10'
								: active && !isBilling
								? 'bg-white/10'
								: 'bg-primary/10'
						}`}
					>
						<Image
							src={plan?.icon}
							alt={plan?.nickname}
							width={24}
							height={24}
							className="opacity-90"
						/>
					</div>
					<div>
						<h3
							className={`font-satoshi text-xl font-bold mb-0.5 ${
								plan.isAddon
									? 'text-black dark:text-white'
									: active && !isBilling
									? 'text-white'
									: 'text-black dark:text-white'
							}`}
						>
							{plan.nickname}
						</h3>
						<span
							className={`block text-sm font-medium ${
								plan.isAddon
									? 'text-gray-600 dark:text-gray-400'
									: active && !isBilling
									? 'text-white/80'
									: 'text-gray-600 dark:text-gray-400'
							}`}
						>
							{plan?.subtitle}
						</span>
					</div>
				</div>

				<p className={`text-sm leading-relaxed ${
					plan.isAddon
						? 'text-gray-600 dark:text-gray-400'
						: active && !isBilling
						? 'text-white/90'
						: 'text-gray-600 dark:text-gray-400'
				}`}>
					{plan?.description}
				</p>
			</div>

			<div className="mb-6">
				<div className="flex items-baseline mb-1">
					<h4
						className={`font-satoshi text-3xl font-bold tracking-tight ${
							plan.isAddon
								? 'text-black dark:text-white'
								: active && !isBilling
								? 'text-white'
								: 'text-black dark:text-white'
						}`}
					>
						<AnimatedPrice 
							value={showYearly ? plan.yearly_unit_amount / 100 : plan.monthly_unit_amount / 100}
							className="mr-0"
						/>
					</h4>
					<span
						className={`ml-2 text-sm font-medium ${
							plan.isAddon
								? 'text-gray-500 dark:text-gray-400'
								: active && !isBilling
								? 'text-white/80'
								: 'text-gray-500 dark:text-gray-400'
						}`}
					>
						/{showYearly ? 'year' : 'month'}
					</span>
				</div>
				{showYearly && (
					<p className={`text-sm font-medium ${
						plan.isAddon
							? 'text-primary'
							: active && !isBilling
							? 'text-white/90'
							: 'text-primary'
					}`}>
						Save 20% with yearly billing
					</p>
				)}
			</div>

			<div className="flex-grow">
				<ul className='mb-6 space-y-3'>
					{plan?.includes.map((feature, key) => (
						<li className='flex items-start gap-3 text-sm' key={key}>
							<svg
								width='20'
								height='20'
								viewBox='0 0 20 20'
								fill='none'
								xmlns="http://www.w3.org/2000/svg"
								className={`mt-0.5 flex-shrink-0 ${
									plan.isAddon
										? 'text-primary'
										: active && !isBilling
										? 'text-white'
										: 'text-primary'
								}`}
							>
								<path
									d="M16.6663 5L7.49967 14.1667L3.33301 10"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span
								className={
									plan.isAddon
										? 'text-gray-700 dark:text-gray-300'
										: active && !isBilling
										? 'text-white/90'
										: 'text-gray-700 dark:text-gray-300'
								}
							>
								{feature}
							</span>
						</li>
					))}
				</ul>
			</div>

			<button
				onClick={handleSubscription}
				disabled={!session || isSubscribed}
				className={`w-full rounded-xl px-6 py-3.5 text-sm font-semibold transition-colors duration-200 ${getButtonStyle()}`}
			>
				{getButtonText()}
			</button>
		</div>
	);
};

export default PriceItem;
