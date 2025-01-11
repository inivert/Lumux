import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: `Contact - ${process.env.SITE_NAME}`,
	description: `Get in touch and schedule a call to discuss your project needs.`,
};

const ContactPage = () => {
	return (
		<main>
			<Contact />
		</main>
	);
};

export default ContactPage; 