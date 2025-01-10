"use client";

import { usePathname } from "next/navigation";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-grow">
      {children}
    </main>
  );
}
