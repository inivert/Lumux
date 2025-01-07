import { Price } from "@/types/priceItem";

export const pricingData: Price[] = [
	{
		priceId: process.env.STRIPE_STARTER_PRICE_MONTHLY || "",
		unit_amount: 59 * 100, // $59/month
		nickname: "Starter",
		description: "Everything you need to start your SaaS project",
		subtitle: "Core Features",
			includes: [
				"Essential SaaS Features",
				"User Authentication",
				"Basic Dashboard",
				"Email Integration",
				"Payment Processing",
			],
			icon: `/images/pricing/pricing-icon-01.svg`,
			active: true,
	},
	{
		priceId: process.env.STRIPE_EXTRA_CHANGES_PRICE_MONTHLY || "",
		unit_amount: 15 * 100, // $15/month
		nickname: "Extra Changes",
		description: "Additional customization capabilities",
		subtitle: "Add-on",
		includes: [
			"Additional Customizations",
			"Priority Support",
			"Extended Features",
			"Custom Integrations",
		],
		icon: `/images/pricing/pricing-icon-02.svg`,
		isAddon: true,
	},
	{
		priceId: process.env.STRIPE_CONTENT_MANAGER_PRICE_MONTHLY || "",
		unit_amount: 20 * 100, // $20/month
		nickname: "Content Manager",
		description: "Advanced content management features",
		subtitle: "Add-on",
		includes: [
			"Content Management System",
			"Media Library",
			"Content Analytics",
			"SEO Tools",
		],
		icon: `/images/pricing/pricing-icon-03.svg`,
		isAddon: true,
	},
	{
		priceId: process.env.STRIPE_USER_ACCOUNTS_PRICE_MONTHLY || "",
		unit_amount: 25 * 100, // $25/month
		nickname: "User Accounts",
		description: "Enhanced user management capabilities",
		subtitle: "Add-on",
		includes: [
			"Multiple User Roles",
			"Team Management",
			"Access Controls",
			"User Analytics",
		],
		icon: `/images/pricing/pricing-icon-02.svg`,
		isAddon: true,
	},
	{
		priceId: process.env.STRIPE_BOOKING_PRICE_MONTHLY || "",
		unit_amount: 25 * 100, // $25/month
		nickname: "Booking System",
		description: "Complete booking and scheduling system",
		subtitle: "Add-on",
		includes: [
			"Calendar Integration",
			"Automated Scheduling",
			"Reminder System",
			"Booking Analytics",
		],
		icon: `/images/pricing/pricing-icon-03.svg`,
		isAddon: true,
	},
];
