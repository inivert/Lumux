"use client";
import { useState, useEffect } from "react";
import PriceItem from "./PriceItem";
import SectionHeader from "../../components/Common/SectionHeader";
import { Price } from "../../types/priceItem";
import axios from "axios";

type StripeBillingProps = {
	isBilling?: boolean;
};

const StripeBilling = ({ isBilling }: StripeBillingProps) => {
	const [showYearly, setShowYearly] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pricingData, setPricingData] = useState<Price[]>([]);

	useEffect(() => {
		const fetchPrices = async () => {
			try {
				setLoading(true);
				console.log('Fetching prices from Stripe...');
				const response = await axios.get('/api/stripe/prices');
				console.log('Raw API Response:', response.data);
				
				if (!response.data.products) {
					console.error('No products found in response');
					setError('No products available');
					return;
				}
				
				// Transform the Stripe data to match our Price type
				const transformedData = response.data.products.map((product: any) => {
					console.log('Processing product:', {
						id: product.id,
						name: product.name,
						isAddon: product.isAddon,
						monthlyPrice: product.monthlyPrice,
						yearlyPrice: product.yearlyPrice
					});

					const transformed = {
						priceId: product.monthlyPrice?.id || "",
						yearlyPriceId: product.yearlyPrice?.id || "",
						monthly_unit_amount: product.monthlyPrice?.amount || 0,
						yearly_unit_amount: product.yearlyPrice?.amount || 0,
						nickname: product.name,
						description: product.description || '',
						subtitle: product.isAddon ? "Add-on" : "Core Features",
						includes: Array.isArray(product.features) ? product.features : [],
						icon: `/images/pricing/pricing-icon-${product.isAddon ? "02" : "01"}.svg`,
						isAddon: product.isAddon,
						active: product.isStarter || !product.isAddon,
					};

					console.log('Transformed product data:', transformed);
					return transformed;
				});

				console.log('Final transformed data:', transformedData);
				setPricingData(transformedData);
			} catch (err: any) {
				console.error('Error fetching prices:', err);
				console.error('Error details:', err.response?.data);
				setError(err.response?.data?.error || 'Failed to load pricing data. Please try again later.');
			} finally {
				setLoading(false);
			}
		};

		fetchPrices();
	}, []);

	const mainPlan = pricingData.find(plan => !plan.isAddon);
	const addons = pricingData.filter(plan => plan.isAddon);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="text-center text-red-500">{error}</div>
			</div>
		);
	}

	if (!mainPlan) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="text-center text-gray-500">No pricing plans available</div>
			</div>
		);
	}

	return (
		<section
			id='pricing'
			className='overflow-hidden rounded-10 bg-white py-15 dark:bg-[#131a2b] md:px-15'
		>
			{!isBilling && (
				<>
					<SectionHeader
						title={"Simple Pricing with Powerful Add-ons"}
						description='Choose a core plan and enhance it with add-ons that suit your needs.'
					/>
					<div className="flex items-center justify-center mb-8">
						<div className="relative flex items-center p-1 bg-gray-100 rounded-full">
							<button
								onClick={() => setShowYearly(false)}
								className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
									!showYearly
										? "bg-white text-primary shadow-sm"
										: "text-gray-500 hover:text-gray-700"
								}`}
							>
								Monthly
							</button>
							<button
								onClick={() => setShowYearly(true)}
								className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
									showYearly
										? "bg-white text-primary shadow-sm"
										: "text-gray-500 hover:text-gray-700"
								}`}
							>
								Yearly
								<span className="ml-1 text-xs text-green-500">Save 20%</span>
							</button>
						</div>
					</div>
				</>
			)}

			<div className='mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0'>
				{/* Main Plan */}
				<div className='mb-10'>
					<h3 className='mb-6 text-center font-satoshi text-2xl font-bold text-black dark:text-white'>
						Core Plan
					</h3>
					<div className='flex justify-center'>
						<div className='w-full max-w-[400px]'>
							<PriceItem
								plan={mainPlan}
								isBilling={isBilling}
								showYearly={showYearly}
							/>
						</div>
					</div>
				</div>

				{/* Add-ons */}
				{addons.length > 0 && (
					<div>
						<h3 className='mb-6 text-center font-satoshi text-2xl font-bold text-black dark:text-white'>
							Available Add-ons
						</h3>
						<div className='grid grid-cols-1 gap-7.5 md:grid-cols-2 xl:grid-cols-4'>
							{addons.map((addon, key) => (
								<PriceItem
									plan={addon}
									key={key}
									isBilling={isBilling}
									showYearly={showYearly}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default StripeBilling;
