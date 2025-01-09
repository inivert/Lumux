import "../styles/globals.css";
import "../styles/satoshi.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

const HeaderWrapper = dynamic(() => import("@/components/Header/HeaderWrapper"), {
	ssr: false,
});

const FooterWrapper = dynamic(() => import("@/components/Footer/FooterWrapper"), {
	ssr: false,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={inter.className}>
				<Providers>
					<div className='flex min-h-screen flex-col'>
						<HeaderWrapper />
						<main className='flex-grow'>
							<Toaster />
							{children}
						</main>
						<FooterWrapper />
					</div>
				</Providers>
			</body>
		</html>
	);
}
