"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard');

  return (
    <main className="flex-grow">
      {isDashboard && <Header />}
      {children}
    </main>
  );
}
