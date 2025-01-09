import "../styles/globals.css";
import "../styles/satoshi.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body>
				<Providers>
					<Toaster />
					{children}
				</Providers>
			</body>
		</html>
	);
}
