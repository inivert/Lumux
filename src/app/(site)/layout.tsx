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
		<>
			<Loader />
			<>
				<ToastContext />
				<Providers>
					<NextTopLoader
						color='#635BFF'
						crawlSpeed={300}
						showSpinner={false}
						shadow='none'
					/>
					<HeaderWrapper />
					<div className="pt-16 sm:pt-16 md:pt-16 lg:pt-16 xl:pt-16">
						{children}
					</div>
					<FooterWrapper />
				</Providers>
			</>
		</>
	);
}
