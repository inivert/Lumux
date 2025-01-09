import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import DataStatsCard from "@/components/Admin/Dashboard/DataStatsCard";
import GraphCard from "@/components/Admin/Dashboard/GraphCard";
import { dataStats, overviewData } from "@/staticData/statsData";
import Breadcrumb from "@/components/Common/Dashboard/Breadcrumb";

export default async function AdminDashboardPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/auth/signin");
	}

	if (session.user.role?.toLowerCase() !== "admin") {
		redirect("/user");
	}

	return (
		<>
			<Breadcrumb pageTitle="Admin Dashboard" />

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
				{dataStats.map((item) => (
					<DataStatsCard key={item.id} data={item} />
				))}
			</div>

			<div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
				<div className="col-span-12">
					<GraphCard data={overviewData[0]} />
				</div>
			</div>
		</>
	);
}
