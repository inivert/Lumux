import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, DefaultSession } from "next-auth";
import { prisma } from "@/libs/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { sendEmail } from "./email";

// @ts-ignore
const bcryptjs = require("bcryptjs");

// Protected admin email
const PROTECTED_ADMIN_EMAIL = 'mejiacarlos634@gmail.com';

// Custom adapter to protect admin user
const customAdapter = {
	...PrismaAdapter(prisma),
	deleteUser: async (userId: string): Promise<void> => {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { email: true }
		});

		if (user?.email === PROTECTED_ADMIN_EMAIL) {
			throw new Error('Cannot delete protected admin user');
		}

		await prisma.user.delete({ where: { id: userId } });
	},
	createUser: async (data: any) => {
		const user = await prisma.user.create({ data });
		
		// Ensure admin user exists
		await prisma.user.upsert({
			where: { email: PROTECTED_ADMIN_EMAIL },
			update: { role: 'ADMIN' },
			create: {
				email: PROTECTED_ADMIN_EMAIL,
				name: 'Carlos',
				role: 'ADMIN',
			},
		});

		return user;
	}
} as const;

type UserRole = "USER" | "ADMIN";

interface User {
	id: string;
	email: string;
	name?: string | null;
	image?: string | null;
	password?: string | null;
	role?: UserRole | null;
}

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
	adapter: customAdapter,
	secret: process.env.NEXTAUTH_SECRET!,
	session: {
		strategy: "jwt",
	},
	providers: [
		EmailProvider({
			server: {
				host: "smtp.resend.com",
				port: 465,
				auth: {
					user: "resend",
					pass: process.env.RESEND_API_KEY
				},
				secure: true,
			},
			from: process.env.EMAIL_FROM,
			sendVerificationRequest: async ({ identifier, url, provider }) => {
				const { host } = new URL(url);
				const siteName = process.env.SITE_NAME || "CodeLumus";
				
				const emailHtml = `
					<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
						<h2 style="color: #333; margin-bottom: 20px;">Sign in to ${siteName}</h2>
						<p style="color: #666; margin-bottom: 20px;">Click the button below to sign in to your account.</p>
						<a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin-bottom: 20px;">Sign in</a>
						<p style="color: #999; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
						<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
						<p style="color: #999; font-size: 12px;">This link was sent to ${identifier} and will expire in 24 hours.</p>
					</div>
				`;

				try {
					await sendEmail({
						to: identifier,
						subject: `Sign in to ${siteName}`,
						html: emailHtml,
					});
				} catch (error) {
					console.error('Error sending verification email', error);
					throw new Error('Failed to send verification email');
				}
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
					scope: "openid email profile"
				}
			}
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
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
							role: "USER",
						},
					});
					return newUser;
				}

				// For existing users, check password if provided
				if (credentials.password) {
					if (!user.password) {
						throw new Error("Please set up your password in settings");
					}

					const isPasswordValid = await bcryptjs.compare(
						credentials.password,
						user.password
					);

					if (!isPasswordValid) {
						throw new Error("Invalid credentials");
					}
				}

				return user;
			},
		}),
	],
	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			const userEmail = user.email?.toLowerCase();
			
			// Always allow admin email regardless of provider
			if (userEmail === PROTECTED_ADMIN_EMAIL) {
				// If signing in with OAuth, link the account
				if (account && account.provider !== 'email') {
					const existingUser = await prisma.user.findUnique({
						where: { email: userEmail },
						include: { accounts: true }
					});

					if (existingUser) {
						// Link this OAuth account to the existing user
						await prisma.account.create({
							data: {
								userId: existingUser.id,
								type: account.type,
								provider: account.provider,
								providerAccountId: account.providerAccountId,
								access_token: account.access_token,
								expires_at: account.expires_at,
								token_type: account.token_type,
								scope: account.scope,
								id_token: account.id_token,
								session_state: account.session_state,
							},
						});
					}
				}
				return true;
			}

			// For non-admin users, check if user exists
			if (!userEmail) return false;

			const existingUser = await prisma.user.findUnique({
				where: { email: userEmail }
			});

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

export const getAuthSession = () => getServerSession(authOptions);
