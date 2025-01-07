import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		const { pathname } = req.nextUrl;

		// Allow email verification callback to proceed
		if (pathname.startsWith('/api/auth/callback/email')) {
			return NextResponse.next();
		}

		// Add security headers
		const response = NextResponse.next();
		response.headers.set("X-Frame-Options", "DENY");
		response.headers.set("X-Content-Type-Options", "nosniff");
		response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
		return response;
	},
	{
		callbacks: {
			authorized: ({ token, req }) => {
				// Allow email verification callback to proceed
				if (req.nextUrl.pathname.startsWith('/api/auth/callback/email')) {
					return true;
				}
				return !!token;
			},
		},
		pages: {
			signIn: "/auth/signin",
		},
	}
);

// Protect these paths with authentication
export const config = {
	matcher: [
		"/dashboard/:path*",
		"/user/:path*",
		"/admin/:path*",
		"/api/auth/callback/email",
	],
};
