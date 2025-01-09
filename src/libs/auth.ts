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

export const getAuthSession = async () => {
	return getServerSession(authOptions);
};
