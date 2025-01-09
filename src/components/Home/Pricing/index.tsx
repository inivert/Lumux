"use client";
import Pricing from "@/stripe/StripeBilling";

const HomePricing = () => {
	return (
		<>
			<Pricing isBilling={false} />
		</>
	);
};

export default HomePricing;
