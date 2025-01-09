"use client";
import Pricing from "@/stripe/StripeBilling";

const Billing = () => {
	return (
		<>
			<Pricing isBilling={true} />
		</>
	);
};

export default Billing;
