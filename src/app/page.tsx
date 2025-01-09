import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `Professional Website Management Service - CodeLumus`,
	description: `A complete website management service with all essential features, integrations, and tools to maintain and grow your website. Focus on your business while your website is expertly managed.`,
	openGraph: {
		type: "website",
		title: `Professional Website Management Service - CodeLumus`,
		description: `A complete website management service with all essential features, integrations, and tools to maintain and grow your website. Focus on your business while your website is expertly managed.`,
		images: ["/images/og-image.png"],
	},
	twitter: {
		card: "summary_large_image",
		title: `Professional Website Management Service - CodeLumus`,
		description: `A complete website management service with all essential features, integrations, and tools to maintain and grow your website. Focus on your business while your website is expertly managed.`,
		images: ["/images/og-image.png"],
	},
};

export default function HomePage() {
	return (
		<main>
			<Home />
		</main>
	);
} 