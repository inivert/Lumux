import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { getAuthSession } from "@/libs/auth";
import { sendInvitationEmail } from "@/libs/resend";
import crypto from "crypto";

// Helper function to generate invitation token
const generateToken = () => crypto.randomBytes(32).toString("hex");

// GET - List all invitations
export async function GET() {
  try {
    const session = await getAuthSession();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const invitations = await prisma.invitation.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true }
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("[INVITATIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST - Create new invitation
export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { email, role = "USER" } = body;

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    // Check if there's already a pending invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email: email.toLowerCase(),
        accepted: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (existingInvitation) {
      return new NextResponse("Invitation already sent", { status: 400 });
    }

    console.log("Creating invitation for:", email);

    // Create new invitation
    const invitation = await prisma.invitation.create({
      data: {
        email: email.toLowerCase(),
        role,
        token: generateToken(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    console.log("Invitation created:", invitation);

    try {
      // Send invitation email
      const emailResult = await sendInvitationEmail({
        email: email.toLowerCase(),
        role,
      });

      console.log("Email sent successfully:", emailResult);

      return NextResponse.json({
        ...invitation,
        emailSent: true
      });
    } catch (emailError) {
      console.error("Failed to send invitation email:", emailError);
      
      // Delete the invitation if email fails
      await prisma.invitation.delete({
        where: { id: invitation.id }
      });

      return new NextResponse("Failed to send invitation email", { status: 500 });
    }
  } catch (error) {
    console.error("[INVITATION_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE - Remove invitation
export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const invitationId = searchParams.get("id");

    if (!invitationId) {
      return new NextResponse("Invitation ID required", { status: 400 });
    }

    await prisma.invitation.delete({
      where: { id: invitationId }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[INVITATION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 