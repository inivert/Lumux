import { Providers } from "./providers";
import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
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
