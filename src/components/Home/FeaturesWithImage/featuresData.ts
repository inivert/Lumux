import { FeatureWithImg } from "@/types/featureWithImg";

const featureItemData: FeatureWithImg[] = [
	{
		title: "Professional Web Development by CodeLumus",
		description:
			"As an experienced independent developer, I build modern, high-performance web applications tailored to your specific business requirements.",
		checklist: [
			"Custom authentication and user systems",
			"Secure payment integration setup",
			"Professional deployment and maintenance",
		],
		image: "/images/features/features-01.svg",
		id: 1,
	},
	{
		title: "Complete Website Management Solution",
		description:
			"I personally handle every aspect of your website's operation, from hosting to maintenance, allowing you to focus entirely on your business.",
		checklist: [
			"24/7 monitoring and maintenance",
			"Regular security updates and backups",
			"Direct, personalized support",
		],
		image: "/images/features/features-02.svg",
		id: 2,
	},
];

export default featureItemData;
