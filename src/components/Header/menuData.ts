import { Menu } from "@/types/menu";

export const publicMenuData: Menu[] = [
	{
		id: 1,
		title: "Features",
		newTab: false,
		path: "#features",
	},
	{
		id: 2,
		title: "Pricing",
		newTab: false,
		path: "#pricing",
	}
];

export const userMenuData: Menu[] = [
	{
		id: 1,
		title: "Dashboard",
		newTab: false,
		path: "/user",
	},
	{
		id: 2,
		title: "Settings",
		newTab: false,
		path: "/user/settings",
	},
	{
		id: 3,
		title: "Billing",
		newTab: false,
		path: "/user/billing",
	},
	{
		id: 4,
		title: "Support",
		newTab: false,
		path: "/user/support",
	}
];

export const adminMenuData: Menu[] = [
	{
		id: 1,
		title: "Dashboard",
		newTab: false,
		path: "/admin",
	},
	{
		id: 2,
		title: "Settings",
		newTab: false,
		path: "/admin/settings",
	}
];

export const getMenuData = (role?: string | null): Menu[] => {
	if (!role) return publicMenuData;
	return role === "USER" ? [...publicMenuData, ...userMenuData] : [...publicMenuData, ...adminMenuData];
};
