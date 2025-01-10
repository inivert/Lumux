import "../styles/globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeLumus",
  description: "Professional Website Management Service",
  icons: {
    icon: [
      {
        url: "/images/favicon.svg",
        type: "image/svg+xml",
      }
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
