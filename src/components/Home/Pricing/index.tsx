"use client";
import dynamic from "next/dynamic";

const LandingPricing = dynamic(() => import("./LandingPricing"), {
	ssr: false,
});

const HomePricing = () => {
	return (
		<>
			<LandingPricing />
		</>
	);
};

export default HomePricing;
