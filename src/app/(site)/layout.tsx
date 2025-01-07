import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { adminMenuData, userMenuData } from "@/staticData/sidebarData";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/auth/signin");
	}

	const menuData = session.user.role === "admin" ? adminMenuData : userMenuData;

	return (
		<div className='flex h-screen overflow-hidden'>
			<Sidebar menuData={menuData} />
			<div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
				<Header />
				<main className='mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10'>
					{children}
				</main>
			</div>
		</div>
	);
}
