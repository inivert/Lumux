"use client";
import axios from "axios";
import { Price } from "@/types/priceItem";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { integrations, messages } from "../../../integrations.config";
import toast from "react-hot-toast";
import { useEffect } from "react";
import getUpdatedData from "@/libs/getUpdatedData";

type Props = {
	plan: Price;
	isBilling?: boolean;
	subscriptionPlan?: any;
};

const PriceItem = ({ plan, isBilling }: Props) => {
	const { data: session, update, status } = useSession();
	const user = session?.user;

	useEffect(() => {
		const fetchAndUpdateSession = async () => {
			console.log(status, session);
			if (status === "loading") return;
			if (!user?.email) return;
			try {
				const data = await getUpdatedData(user.email);
				if (!data) return;

				await update({
					...session,
					user: {
						...session?.user,
						priceId: data.priceId,
						currentPeriodEnd: data.currentPeriodEnd,
						subscriptionId: data.subscriptionId,
					},
				});
				console.log("Updated session");
			} catch (error) {
				console.error("Couldn't update session");
			}
		};

		fetchAndUpdateSession();
	}, []);

	// stripe payment
	const handleSubscription = async () => {
		if (!session || !session.user?.id) {
			window.location.href = '/auth/signin';
			return;
		}

		if (!integrations?.isPaymentsEnabled) {
			toast.error(messages?.payment);
			return;
		}

		if (!plan.priceId) {
			toast.error("Invalid price configuration");
			return;
		}

		try {
			console.log("Initiating payment for:", {
				userId: session.user.id,
				priceId: plan.priceId
			});

			const res = await axios.post("/api/stripe/payment", {
				userId: session.user.id,
				priceId: plan.priceId
			});

			console.log("Payment response:", res.data);

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
			console.error("Payment error:", {
				message: err.message,
				response: err.response?.data
			});
			
			const errorMessage = err.response?.data?.details || 
								err.response?.data?.error || 
								"Failed to process payment. Please try again.";
			
			toast.error(errorMessage);
		}
	};

	const active = plan?.active;
	const isSubscribed = session && session?.user?.priceId === plan?.priceId;

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
			className={`relative rounded-[20px] p-6 shadow-dropdown ${
				plan.isAddon
					? 'bg-white dark:bg-gray-dark'
					: active && !isBilling
					? 'bg-primary'
					: 'bg-white dark:bg-gray-dark'
			}`}
		>
			{active && !plan.isAddon && (
				<span
					className={`absolute right-4.5 top-4.5 inline-flex rounded-[5px] px-3 py-[5px] font-satoshi font-medium  ${
						isBilling
							? 'bg-primary/10 text-primary dark:bg-white/10 dark:text-white'
							: 'bg-white/10 text-white'
					}`}
				>
					Popular
				</span>
			)}

			<div className='mb-5 flex items-center gap-4'>
				<div
					className={`flex h-14 w-full max-w-[56px] items-center justify-center rounded-xl ${
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
						width={28}
						height={28}
					/>
				</div>
				<div>
					<span
						className={`block text-base font-medium ${
							plan.isAddon
								? 'text-gray-600 dark:text-gray-400'
								: active && !isBilling
								? 'text-white'
								: 'dark:text-gray-4'
						}`}
					>
						{plan?.subtitle}
					</span>
					<h3
						className={`font-satoshi text-xl font-bold ${
							plan.isAddon
								? 'text-black dark:text-white'
								: active && !isBilling
								? 'text-white'
								: 'text-black dark:text-white'
						}`}
					>
						{plan.nickname}
					</h3>
				</div>
			</div>

			<p className={`text-sm ${
				plan.isAddon
					? 'text-gray-600 dark:text-gray-400'
					: active && !isBilling
					? 'text-white'
					: 'dark:text-gray-4'
			}`}>
				{plan?.description}
			</p>

			{/* <!-- divider --> */}
			<div
				className={`my-4 h-px w-full ${
					plan.isAddon
						? 'bg-gray-200 dark:bg-gray-700'
						: active && !isBilling
						? 'bg-white/30'
						: 'bg-stroke dark:bg-stroke-dark'
				}`}
			></div>

			<h4
				className={`mb-4 font-satoshi text-2xl font-bold ${
					plan.isAddon
						? 'text-black dark:text-white'
						: active && !isBilling
						? 'text-white'
						: 'text-[#170F49] dark:text-white'
				}`}
			>
				${plan?.unit_amount / 100}
				<span
					className={`ml-1 text-base font-medium ${
						plan.isAddon
							? 'text-gray-600 dark:text-gray-400'
							: active && !isBilling
							? 'text-white'
							: 'text-gray-6 dark:text-white'
					}`}
				>
					/month
				</span>
			</h4>

			<ul className='mb-6 flex flex-col gap-2'>
				{plan?.includes.map((feature, key) => (
					<li className='flex items-center gap-2 text-sm' key={key}>
						<svg
							width='16'
							height='16'
							viewBox='0 0 22 22'
							fill='none'
							className={
								plan.isAddon
									? 'text-primary'
									: active && !isBilling
									? 'text-white'
									: 'text-primary dark:text-white'
							}
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								fillRule='evenodd'
								clipRule='evenodd'
								d='M20.1668 11C20.1668 16.0626 16.0628 20.1667 11.0002 20.1667C5.93755 20.1667 1.8335 16.0626 1.8335 11C1.8335 5.9374 5.93755 1.83334 11.0002 1.83334C16.0628 1.83334 20.1668 5.9374 20.1668 11ZM14.6946 8.22221C14.9631 8.49069 14.9631 8.92599 14.6946 9.19448L10.1113 13.7778C9.84281 14.0463 9.40751 14.0463 9.13903 13.7778L7.30569 11.9445C7.03721 11.676 7.03721 11.2407 7.30569 10.9722C7.57418 10.7037 8.00948 10.7037 8.27797 10.9722L9.62516 12.3194L11.6738 10.2708L13.7224 8.22221C13.9908 7.95372 14.4261 7.95372 14.6946 8.22221Z'
								fill='currentColor'
							/>
						</svg>
						<span
							className={
								plan.isAddon
									? 'text-gray-600 dark:text-gray-400'
									: active && !isBilling
									? 'text-white'
									: 'dark:text-gray-4'
							}
						>
							{feature}
						</span>
					</li>
				))}
			</ul>

			<button
				onClick={handleSubscription}
				disabled={!session || isSubscribed}
				className={`w-full rounded-lg px-4 py-2 text-center font-medium transition-all ${getButtonStyle()}`}
			>
				{getButtonText()}
			</button>
		</div>
	);
};

export default PriceItem;
