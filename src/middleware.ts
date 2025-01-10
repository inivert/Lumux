import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		const response = NextResponse.next();
		
		// Add security headers
		response.headers.set("X-Content-Type-Options", "nosniff");
		response.headers.set("X-Frame-Options", "DENY");
		response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
		
		// Add CORS headers for API routes
		if (req.nextUrl.pathname.startsWith('/api/')) {
			response.headers.set('Access-Control-Allow-Credentials', 'true');
			response.headers.set('Access-Control-Allow-Origin', process.env.NEXTAUTH_URL || 'http://localhost:3000');
			response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
			response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
		}
		
		return response;
	},
	{
		callbacks: {
			authorized: ({ token }) => {
				return !!token;
			},
		},
	}
);

export const config = {
	matcher: [
		"/api/user/:path*",
		"/user/:path*",
	],
};
