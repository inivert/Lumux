"use client";
import dynamic from "next/dynamic";
import { ComponentType } from "react";

const ProductsGrid = dynamic(() => import("@/components/User/Products/ProductsGrid"), {
	ssr: false,
});

const HomePricing = () => {
	return (
		<>
			<ProductsGrid />
		</>
	);
};

export default HomePricing;
