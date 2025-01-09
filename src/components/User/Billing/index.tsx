"use client";
import dynamic from "next/dynamic";
import { ComponentType } from "react";

interface StripeBillingProps {
	isBilling?: boolean;
}

const StripeBilling = dynamic<StripeBillingProps>(() => import("@/stripe/StripeBilling"), {
	ssr: false,
}) as ComponentType<StripeBillingProps>;

const Billing = () => {
	return (
		<>
			<StripeBilling isBilling={true} />
		</>
	);
};

export default Billing;
