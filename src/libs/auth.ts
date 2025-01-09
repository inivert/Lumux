import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { prisma } from "@/libs/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import crypto from "crypto";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: User & DefaultSession["user"] & {
			hasInvitation?: boolean;
			role?: string;
		};
	}

	interface JWT {
		hasInvitation?: boolean;
		role?: string;
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
	},
	pages: {
		signIn: "/auth/signin",
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email) {
					throw new Error("Email is required");
				}

				// Check for invitation first
				const invitation = await prisma.invitation.findFirst({
					where: {
						email: credentials.email,
					},
				});

				if (!invitation) {
					throw new Error("No valid invitation found");
				}

				// Check if user exists
				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				// If no user exists, create one for first-time login
				if (!user) {
					const newUser = await prisma.user.create({
						data: {
							email: credentials.email,
							name: credentials.email.split("@")[0],
							role: "user",
						},
					});
					return newUser;
				}

				// For existing users, check password if provided
				if (credentials.password) {
					if (!user.password) {
						throw new Error("Please set up your password in settings");
					}

					const isPasswordValid = await compare(
						credentials.password,
						user.password
					);

					if (!isPasswordValid) {
						throw new Error("Invalid credentials");
					}
				}

				return user;
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
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
					scope: "openid email profile"
				}
			}
		}),
	],
	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			// Skip checks for impersonation and fetchSession
			if (credentials && (credentials.adminEmail || credentials.email)) {
				return true;
			}

			const userEmail = user.email?.toLowerCase();
			if (!userEmail) return false;

			// Check if user exists in users table
			const existingUser = await prisma.user.findUnique({
				where: { email: userEmail }
			});

			// Only allow sign in if user exists
			return !!existingUser;
		},

		async jwt({ token, user, account, profile, trigger, session }) {
			if (trigger === "update" && session?.user) {
				return {
					...token,
					...session.user,
				};
			}

			if (user) {
				const dbUser = user as User;
				return {
					...token,
					id: dbUser.id,
					role: dbUser.role,
					email: dbUser.email,
					name: dbUser.name,
					picture: dbUser.image,
				};
			}
			return token;
		},

		async session({ session, token }) {
			if (session?.user) {
				return {
					...session,
					user: {
						...session.user,
						id: token.id,
						role: token.role,
					},
				};
			}
			return session;
		},

		async redirect({ url, baseUrl }) {
			const decodedUrl = decodeURIComponent(url);
			
			// For magic link authentication
			if (decodedUrl.includes('/api/auth/callback/email')) {
				const session = await getServerSession(authOptions);
				if (session?.user?.role === "ADMIN") {
					return `${baseUrl}/admin`;
				}
				return `${baseUrl}/user`;
			}

			if (decodedUrl.startsWith('/auth/error')) {
				return decodedUrl;
			}

			if (decodedUrl.includes('callbackUrl=')) {
				const urlObj = new URL(decodedUrl);
				const callbackUrl = urlObj.searchParams.get('callbackUrl');
				if (callbackUrl) {
					if (callbackUrl.includes('/auth/signin')) {
						return baseUrl;
					}
					if (callbackUrl.startsWith(baseUrl)) {
						return callbackUrl;
					}
				}
			}

			if (decodedUrl.startsWith(baseUrl)) return decodedUrl;
			if (decodedUrl.startsWith("/")) return `${baseUrl}${decodedUrl}`;
			return baseUrl;
		},
	},
};
