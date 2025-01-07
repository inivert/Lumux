import { Metadata } from "next";
import { integrations, messages } from "../../../../integrations.config";

export const metadata: Metadata = {
	title: `Blog - ${process.env.SITE_NAME}`,
	description: `This is Blog page for ${process.env.SITE_NAME}`,
};

export default async function BlogPage() {
	return (
		<main>
			<section className="relative z-1 overflow-hidden pb-17.5 pt-35 lg:pb-22.5 xl:pb-27.5">
				<div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
					<div className="flex flex-wrap gap-8">
						<div className="w-full">
							<div className="mb-15">
								<h2 className="mb-4 text-3xl font-medium text-black dark:text-white xl:text-hero">
									Blog Posts
								</h2>
								<p className="text-lg">Latest blog posts</p>
							</div>
							<div className="p-8">
								<p>Blog functionality is not enabled.</p>
								<p>To enable blog functionality, please implement your preferred blog solution.</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
