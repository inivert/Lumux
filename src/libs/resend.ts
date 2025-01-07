import { Resend } from "resend";
import { InvitationEmail } from "@/emails/InvitationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInvitationEmail = async ({
  email,
  role,
}: {
  email: string;
  role: string;
}) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY environment variable");
  }

  try {
    const data = await resend.emails.send({
      from: "Carlos @ CodeLumus <carlos@codelumus.com>",
      reply_to: "carlos@codelumus.com",
      to: email,
      subject: "You've been invited to join CodeLumus! 🎉",
      react: InvitationEmail({ email, role }),
    });

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error sending invitation email:", error);
    throw error;
  }
}; 