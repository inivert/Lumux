import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		const token = req.nextauth.token;
		const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
		const isDashboardPath = req.nextUrl.pathname.startsWith("/dashboard");

		if (!token) {
			return NextResponse.redirect(new URL("/auth/signin", req.url));
		}

		if (isAdminPath && token.role !== "admin") {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}

		if (isDashboardPath && token.role === "admin") {
			return NextResponse.redirect(new URL("/admin", req.url));
		}

		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	}
);

export const config = {
	matcher: ["/admin/:path*", "/dashboard/:path*"],
};
