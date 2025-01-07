import { prisma } from "@/libs/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import crypto from "crypto";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: User & DefaultSession["user"];
	}
}

export const authOptions: NextAuthOptions = {
	pages: {
		signIn: "/auth/signin",
		error: "/auth/error",
		verifyRequest: "/auth/verify-request",
	},
	adapter: PrismaAdapter(prisma),
	secret: process.env.NEXTAUTH_SECRET!,
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},

	providers: [
		CredentialsProvider({
			name: "credentials",
			id: "credentials",
			credentials: {
				email: { label: "Email", type: "text", placeholder: "Jhondoe" },
				password: { label: "Password", type: "password" },
				username: { label: "Username", type: "text", placeholder: "Jhon Doe" },
			},

			async authorize(credentials, req) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Please enter an email and password");
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email.toLowerCase(),
					},
				});

				if (!user || !user?.password) {
					throw new Error("No user found with this email");
				}

				const passwordMatch = await bcrypt.compare(
					credentials.password,
					user.password
				);

				if (!passwordMatch) {
					throw new Error("Incorrect password");
				}

				return user;
			},
		}),

		CredentialsProvider({
			name: "impersonate",
			id: "impersonate",
			credentials: {
				adminEmail: {
					label: "Admin Email",
					type: "text",
					placeholder: "Jhondoe@gmail.com",
				},
				userEmail: {
					label: "User Email",
					type: "text",
					placeholder: "Jhondoe@gmail.com",
				},
			},

			async authorize(credentials) {
				// check to see if eamil and password is there
				if (!credentials?.adminEmail || !credentials?.userEmail) {
					throw new Error("User email or Admin email is missing");
				}

				const admin = await prisma.user.findUnique({
					where: {
						email: credentials.adminEmail.toLocaleLowerCase(),
					},
				});

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.userEmail.toLocaleLowerCase(),
					},
				});

				if (!admin || admin.role !== "ADMIN") {
					throw new Error("Access denied");
				}

				// if user was not found
				if (!user) {
					throw new Error("No user found");
				}
				return user;
			},
		}),
		CredentialsProvider({
			name: "fetchSession",
			id: "fetchSession",
			credentials: {
				email: {
					label: "User Email",
					type: "text",
					placeholder: "Jhondoe@gmail.com",
				},
			},

			async authorize(credentials) {
				// check to see if eamil and password is there
				if (!credentials?.email) {
					throw new Error("User email is missing");
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email.toLocaleLowerCase(),
					},
				});

				// if user was not found
				if (!user) {
					throw new Error("No user found");
				}
				return user;
			},
		}),

		EmailProvider({
			server: {
				host: process.env.EMAIL_SERVER_HOST,
				port: Number(process.env.EMAIL_SERVER_PORT),
				auth: {
					user: process.env.EMAIL_SERVER_USER,
					pass: process.env.EMAIL_SERVER_PASSWORD,
				},
			},
			from: process.env.EMAIL_FROM,
			maxAge: 24 * 60 * 60, // 24 hours
		}),

		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID || "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
		}),

		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		}),
	],

	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			// Skip invitation check for impersonation and fetchSession
			if (credentials && (credentials.adminEmail || credentials.email)) {
				return true;
			}

			const userEmail = user.email?.toLowerCase();
			if (!userEmail) return false;

			// Check if user exists
			const existingUser = await prisma.user.findUnique({
				where: { email: userEmail },
				include: { invitation: true }
			});

			if (existingUser) return true; // Allow existing users to sign in

			// Only check for invitation if using email provider
			if (account?.provider === 'email') {
				// Check for valid invitation
				const invitation = await prisma.invitation.findFirst({
					where: {
						email: userEmail,
						accepted: false,
						expiresAt: { gt: new Date() }
					}
				});

				if (!invitation) {
					throw new Error("You need an invitation to sign up. Please check your email invitation.");
				}

				// If we have a valid invitation, allow sign in and update the invitation
				await prisma.invitation.update({
					where: { id: invitation.id },
					data: { accepted: true }
				});

				return true;
			} else {
				// Block other providers if user doesn't exist
				throw new Error("This is a private application. Please use your invitation email to sign in.");
			}
		},

		async redirect({ url, baseUrl }) {
			// Handle email verification callback
			if (url.includes('/api/auth/callback/email')) {
				const callbackUrl = new URL(url).searchParams.get('callbackUrl');
				if (callbackUrl && callbackUrl.startsWith(baseUrl)) {
					// Get user role from session
					const session = await getAuthSession();
					if (session?.user) {
						return session.user.role === "ADMIN" ? `${baseUrl}/admin` : `${baseUrl}/user`;
					}
				}
				// Default to user dashboard if no session yet
				return `${baseUrl}/user`;
			}
			
			// Handle error pages
			if (url.startsWith('/auth/error')) {
				return url;
			}
			
			// Default redirect rules
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},

		async jwt({ token, user, account, profile, trigger, session }) {
			if (trigger === "update" && session?.user) {
				return {
					...token,
					...session.user,
					picture: session.user.image,
					image: session.user.image,
					priceId: session.user.priceId,
					currentPeriodEnd: session.user.currentPeriodEnd,
					subscriptionId: session.user.subscriptionId,
					customerId: session.user.customerId,
				};
			}

			if (user) {
				return {
					...token,
					id: user.id,
					priceId: user.priceId,
					currentPeriodEnd: user.currentPeriodEnd,
					subscriptionId: user.subscriptionId,
					role: user.role,
					picture: user.image,
					image: user.image,
				};
			}
			return token;
		},

		async session({ session, token, user }) {
			if (session?.user) {
				return {
					...session,
					user: {
						...session.user,
						id: token.id || token.sub,
						priceId: token.priceId,
						currentPeriodEnd: token.currentPeriodEnd,
						subscriptionId: token.subscriptionId,
						role: token.role,
						image: token.picture || token.image,
					},
				};
			}
			return session;
		},
	},
};

export const getAuthSession = async () => {
	return getServerSession(authOptions);
};
