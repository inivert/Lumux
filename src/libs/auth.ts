import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { prisma } from "@/libs/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
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
		}),
	],
	callbacks: {
		async signIn({ user, account }) {
			// For Google sign-in, check invitation
			if (account?.provider === "google") {
				const invitation = await prisma.invitation.findFirst({
					where: {
						email: user.email!,
					},
				});

				if (!invitation) {
					throw new Error("No valid invitation found");
				}
			}
			return true;
		},
		async jwt({ token, user }) {
			if (user) {
				return {
					...token,
					id: user.id,
					role: user.role,
				};
			}
			return token;
		},
		async session({ session, token }) {
			return {
				...session,
				user: {
					...session.user,
					id: token.id,
					role: token.role,
				},
			};
		},
	},
};
