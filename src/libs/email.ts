import nodemailer from "nodemailer";
import { Resend } from 'resend';

type EmailPayload = {
	to: string;
	subject: string;
	html: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (data: EmailPayload) => {
	try {
		const result = await resend.emails.send({
			from: process.env.EMAIL_FROM!,
			...data,
		});

		return result;
	} catch (error) {
		console.error('Error sending email:', error);
		throw error;
	}
};

export const formatEmail = (email: string) => {
	return email.replace(/\s+/g, "").toLowerCase().trim();
};
