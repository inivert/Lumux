import React from "react";
import { getAuthSession } from "@/libs/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import ProductsGrid from "@/components/User/Products/ProductsGrid";

export const metadata: Metadata = {
	title: "Products - Dashboard",
	description: "Browse and manage your products",
};

const ProductsPage = async () => {
	const session = await getAuthSession();

	if (!session) {
		redirect("/auth/signin");
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-1">
					Browse available products and add-ons
				</p>
			</div>
			
			<ProductsGrid />
		</div>
	);
};

export default ProductsPage; 