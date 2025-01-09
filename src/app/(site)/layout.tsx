import { Metadata } from 'next';
import HeaderWrapper from "@/components/Header/HeaderWrapper";
import FooterWrapper from "@/components/Footer/FooterWrapper";

export const metadata: Metadata = {
	title: 'Lumux',
	description: 'Lumux Application',
};

export default function SiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col">
			<HeaderWrapper />
			{children}
			<FooterWrapper />
		</div>
	);
}
