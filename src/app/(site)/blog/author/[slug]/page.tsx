import { Metadata } from "next";

export const metadata: Metadata = {
	title: `Blog Author - ${process.env.SITE_NAME}`,
	description: `Blog author page for ${process.env.SITE_NAME}`,
};

export default async function BlogAuthorPage() {
	return (
		<main>
			<section className="relative z-1 overflow-hidden pb-17.5 pt-35 lg:pb-22.5 xl:pb-27.5">
				<div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
					<div className="flex flex-wrap gap-8">
						<div className="w-full">
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
