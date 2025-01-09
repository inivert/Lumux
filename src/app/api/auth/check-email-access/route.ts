import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json(
				{ 
					hasAccess: false,
					reason: 'invalid_request',
					error: "Email is required" 
				},
				{ status: 400 }
			);
		}

		const normalizedEmail = email.toLowerCase().trim();
		console.log('Checking access for email:', normalizedEmail);

		// Check if email is in ADMIN_EMAILS
		const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim().toLowerCase());
		const isAdminEmail = adminEmails.includes(normalizedEmail);

		// Check if user exists in users table
		let existingUser = await prisma.user.findUnique({
			where: {
				email: normalizedEmail,
			},
		});

		// If it's an admin email and user doesn't exist, create the user
		if (isAdminEmail && !existingUser) {
			console.log('Creating admin user:', normalizedEmail);
			existingUser = await prisma.user.create({
				data: {
					email: normalizedEmail,
					name: normalizedEmail.split('@')[0],
					role: 'ADMIN',
				},
			});
		}

		if (existingUser || isAdminEmail) {
			console.log('Access granted for user/admin:', normalizedEmail);
			return NextResponse.json({
				hasAccess: true,
				reason: isAdminEmail ? 'admin_email' : 'user_exists'
			});
		}

		console.log('User not found, checking invitations:', normalizedEmail);

		// If not in users table, check invitations
		const invitation = await prisma.invitation.findFirst({
			where: {
				email: normalizedEmail,
				expiresAt: {
					gt: new Date(), // Not expired
				},
			},
		});

		if (invitation) {
			console.log('Valid invitation found:', normalizedEmail);
			
			// Create user from invitation if they don't exist
			if (!existingUser) {
				console.log('Creating user from invitation:', normalizedEmail);
				existingUser = await prisma.user.create({
					data: {
						email: normalizedEmail,
						name: normalizedEmail.split('@')[0],
						role: invitation.role,
					},
				});

				// Update invitation to mark as accepted and link to user
				await prisma.invitation.update({
					where: { id: invitation.id },
					data: {
						accepted: true,
						userId: existingUser.id,
					},
				});
			}

			return NextResponse.json({
				hasAccess: true,
				reason: 'has_invitation'
			});
		}

		console.log('No access granted for:', normalizedEmail);
		// No user and no invitation
		return NextResponse.json({
			hasAccess: false,
			reason: 'no_user'
		});
	} catch (error) {
		console.error("Error checking email access:", error);
		return NextResponse.json(
			{ 
				hasAccess: false,
				reason: 'server_error',
				error: "Internal server error" 
			},
			{ status: 500 }
		);
	}
} 