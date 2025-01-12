import { Metadata } from 'next';
import HeaderWrapper from "@/components/Header/HeaderWrapper";
import FooterWrapper from "@/components/Footer/FooterWrapper";

export const metadata: Metadata = {
	title: 'Codelumus',
	description: 'Codelumus Application',
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
