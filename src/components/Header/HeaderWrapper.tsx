"use client";
import Header from ".";
import { usePathname } from "next/navigation";

const HeaderWrapper = () => {
	const pathname = usePathname();
	
	// Show header everywhere except in dashboards and auth pages
	const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");
	const isUserDashboard = pathname.startsWith("/user");
	const isAuthPage = pathname.startsWith("/auth");
	
	// Don't show header in dashboards and auth pages
	if (isDashboard || isUserDashboard || isAuthPage) {
		return null;
	}

	// Always show header on landing page and other public pages
	return <Header />;
};

export default HeaderWrapper;
