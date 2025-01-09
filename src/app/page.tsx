import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `Professional Website Management Service - CodeLumus`,
	description: `A complete website management service with all essential features, integrations, and tools you need to maintain and grow your website. Let us handle the technical details while you focus on your business.`,
	openGraph: {
		type: "website",
		title: `Professional Website Management Service - CodeLumus`,
		description: `A complete website management service with all essential features, integrations, and tools you need to maintain and grow your website. Let us handle the technical details while you focus on your business.`,
		images:
			"https://ucarecdn.com/4b0ffd0e-90b0-4a59-b63c-f5ecee0ae575/codelumus.jpg",
	},
	twitter: {
		card: "summary_large_image",
		title: `Professional Website Management Service - CodeLumus`,
		description: `A complete website management service with all essential features, integrations, and tools you need to maintain and grow your website. Let us handle the technical details while you focus on your business.`,
		images:
			"https://ucarecdn.com/4b0ffd0e-90b0-4a59-b63c-f5ecee0ae575/codelumus.jpg",
	},
};

export default function HomePage() {
	return (
		<main>
			<Home />
		</main>
	);
} 