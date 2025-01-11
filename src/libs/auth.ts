import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, DefaultSession } from "next-auth";
import type { Adapter, AdapterUser } from "next-auth/adapters";
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
const PROTECTED_ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

// Custom adapter to protect admin user
const prismaAdapter = PrismaAdapter(prisma);
const customAdapter: Adapter = {
	...prismaAdapter,
	deleteUser: async (userId: string) => {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { email: true }
		});

		if (user?.email === PROTECTED_ADMIN_EMAIL) {
			throw new Error('Cannot delete protected admin user');
		}

		await prisma.user.delete({ where: { id: userId } });
	},
	createUser: async (data: Omit<AdapterUser, "id">) => {
		// Ensure email is never null as required by AdapterUser
		const userData = {
			...data,
			email: data.email || '',
			role: "USER" as const,
		};

		const user = await prisma.user.create({ data: userData });
		
		// Ensure admin user exists
		await prisma.user.upsert({
			where: { email: PROTECTED_ADMIN_EMAIL },
			update: { role: 'ADMIN' as const },
			create: {
				email: PROTECTED_ADMIN_EMAIL,
				name: 'Carlos',
				role: 'ADMIN' as const,
			},
		});

		// Convert to AdapterUser format
		return {
			id: user.id,
			email: user.email || '',
			emailVerified: user.emailVerified,
			name: user.name,
			image: user.image,
		} as AdapterUser;
	}
};

type UserRole = "USER" | "ADMIN";

interface User {
	id: string;
	email: string;
	name?: string | null;
	image?: string | null;
	password?: string | null;
	role?: UserRole | null;
	websiteName?: string | null;
}

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: User & DefaultSession["user"] & {
			hasInvitation?: boolean;
			role?: string;
			websiteName?: string | null;
		};
	}

	interface JWT {
		hasInvitation?: boolean;
		role?: string;
		websiteName?: string | null;
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
		maxAge: 48 * 60 * 60, // 48 hours
	},
	providers: [
		EmailProvider({
			server: process.env.RESEND_API_KEY,
			from: process.env.EMAIL_FROM,
			sendVerificationRequest: async ({ identifier, url, provider }) => {
				const { host } = new URL(url);
				const siteName = process.env.SITE_NAME || "CodeLumus";
				
				// Modify the URL to redirect to the correct dashboard path
				const callbackUrl = new URL(url);
				callbackUrl.searchParams.set('callbackUrl', '/user/dashboard');
				
				const emailHtml = `
					<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
						<h2 style="color: #333; margin-bottom: 20px;">Sign in to ${siteName}</h2>
						<p style="color: #666; margin-bottom: 20px;">Click the button below to sign in to your account.</p>
						<a href="${callbackUrl.toString()}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin-bottom: 20px;">Sign in</a>
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
			
			// Always allow admin email
			if (userEmail === PROTECTED_ADMIN_EMAIL) {
				return true;
			}

			// Check if user already exists in the database
			const existingUser = await prisma.user.findUnique({
				where: { email: userEmail }
			});

			if (existingUser) {
				return true; // Allow existing users to sign in
			}

			// For new users, check for valid invitation
			const invitation = await prisma.invitation.findFirst({
				where: { 
					email: userEmail,
					accepted: false,
					expiresAt: {
						gt: new Date()
					}
				}
			});

			if (!invitation) {
				console.log('No valid invitation found for:', userEmail);
				throw new Error(
					'This is a private website. Access is granted only after a personal meeting with the admin. ' +
					'Please schedule a meeting to discuss your needs.'
				);
			}

			// If this is the first sign in with a valid invitation, mark it as accepted
			await prisma.invitation.update({
				where: { id: invitation.id },
				data: { 
					accepted: true,
					userId: user.id
				}
			});

			return true;
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
					websiteName: dbUser.websiteName,
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
						websiteName: token.websiteName,
					},
				};
			}
			return session;
		},

		async redirect({ url, baseUrl }) {
			// Ensure users are redirected to the dashboard after sign in
			if (url.startsWith(baseUrl)) {
				if (url.includes('callbackUrl')) {
					const callbackUrl = new URL(url).searchParams.get('callbackUrl');
					if (callbackUrl) {
						return `${baseUrl}${callbackUrl}`;
					}
				}
				// Redirect to the correct dashboard path
				return `${baseUrl}/user/dashboard`;
			} else if (url.startsWith('/')) {
				return `${baseUrl}${url}`;
			}
			return url;
		},
	},
};

export const getAuthSession = () => getServerSession(authOptions);
