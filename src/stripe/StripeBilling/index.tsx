import { pricingData } from "@/pricing/pricingData";
import PriceItem from "./PriceItem";
import SectionHeader from "@/components/Common/SectionHeader";

const Pricing = ({ isBilling }: { isBilling?: boolean }) => {
	const mainPlan = pricingData.find(plan => !plan.isAddon);
	const addons = pricingData.filter(plan => plan.isAddon);

	return (
		<>
			<section
				id='pricing'
				className='overflow-hidden rounded-10 bg-white py-15 dark:bg-[#131a2b] md:px-15'
			>
				{!isBilling && (
					<SectionHeader
						title={"Simple Pricing with Powerful Add-ons"}
						description='Choose our core plan and enhance it with the add-ons that suit your needs.'
					/>
				)}

				<div className='mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0'>
					{/* Main Plan */}
					{mainPlan && (
						<div className='mb-10'>
							<h3 className='mb-6 text-center font-satoshi text-2xl font-bold text-black dark:text-white'>
								Core Plan
							</h3>
							<div className='flex justify-center'>
								<div className='w-full max-w-[400px]'>
									<PriceItem
										plan={mainPlan}
										isBilling={isBilling}
									/>
								</div>
							</div>
						</div>
					)}

					{/* Add-ons */}
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
								/>
							))}
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Pricing;
