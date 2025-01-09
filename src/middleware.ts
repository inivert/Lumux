import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	async function middleware(req) {
		const token = req.nextauth.token;
		const { pathname, search } = req.nextUrl;
		const isAuthPage = pathname.startsWith("/auth");
		const isNoInvitationPage = pathname === "/auth/no-invitation";
		const isSignInPage = pathname === "/auth/signin";
		const isCallbackPage = pathname.startsWith("/api/auth/callback");
		const isVerifyRequestPage = pathname === "/auth/verify-request";

		// Allow access to auth-related pages without redirection
		if (isCallbackPage || isVerifyRequestPage) {
			return NextResponse.next();
		}

		// If user is not logged in and trying to access protected routes
		if (!token && !isAuthPage) {
			return NextResponse.redirect(new URL("/auth/signin", req.url));
		}

		// If user is logged in but has no invitation
		if (token && !isAuthPage && !token.hasInvitation && !isNoInvitationPage) {
			return NextResponse.redirect(new URL("/auth/no-invitation", req.url));
		}

		// If user is logged in and trying to access auth pages
		if (token && isAuthPage && !isNoInvitationPage) {
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
				// Allow access to auth-related pages without authorization
				if (
					req.nextUrl.pathname.startsWith("/auth") ||
					req.nextUrl.pathname.startsWith("/api/auth/callback")
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
		"/admin/:path*",
		"/user/:path*",
		"/auth/:path*",
		"/api/user/:path*",
		"/api/admin/:path*",
		"/api/auth/callback/:path*",
	],
};
