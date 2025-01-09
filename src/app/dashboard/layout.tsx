import { getAuthSession } from "@/libs/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Redirect based on user role
  if (session.user.role === "ADMIN") {
    redirect("/admin");
  } else {
    redirect("/user");
  }
} 