import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Middleware function to handle both auth and root redirects
export default withAuth(
	async function middleware(req) {
		const token = req.nextauth.token;
		const { pathname, search } = req.nextUrl;
		const isAuthPage = pathname.startsWith("/auth");
		const isSignInPage = pathname === "/auth/signin";
		const isCallbackPage = pathname.startsWith("/api/auth/callback");
		const isVerifyRequestPage = pathname === "/auth/verify-request";
		const isRootPage = pathname === "/";

		// Handle root page - no need to rewrite, Next.js will handle the route group
		if (isRootPage) {
			return NextResponse.next();
		}

		// Allow access to auth-related pages without redirection
		if (isCallbackPage || isVerifyRequestPage) {
			return NextResponse.next();
		}

		// If user is not logged in and trying to access protected routes
		if (!token && !isAuthPage) {
			return NextResponse.redirect(new URL("/auth/signin", req.url));
		}

		// If user is logged in and trying to access auth pages
		if (token && isAuthPage) {
			// Don't redirect if it's a sign-in page with a callback URL
			if (isSignInPage && search.includes("callbackUrl")) {
				return NextResponse.next();
			}

			if (token.role === "ADMIN") {
				return NextResponse.redirect(new URL("/admin", req.url));
			}
			return NextResponse.redirect(new URL("/user", req.url));
		}

		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ token, req }) => {
				const { pathname } = req.nextUrl;
				// Allow access to root and auth-related pages without authorization
				if (
					pathname === "/" ||
					pathname.startsWith("/auth") ||
					pathname.startsWith("/api/auth/callback")
				) {
					return true;
				}
				return !!token;
			},
		},
	}
);

export const config = {
	matcher: [
		"/",
		"/admin/:path*",
		"/user/:path*",
		"/auth/:path*",
		"/api/user/:path*",
		"/api/admin/:path*",
		"/api/auth/callback/:path*",
	],
};
