import Link from "next/link";
import Image from "next/image";

interface BlogItemProps {
	title: string;
	description: string;
	slug: string;
	image: string;
	date: string;
	author: {
		name: string;
		image: string;
	};
}

const BlogItem = ({ title, description, slug, image, date, author }: BlogItemProps) => {
	return (
		<article className="group overflow-hidden rounded-lg border border-stroke bg-white shadow-solid-3 dark:border-strokedark dark:bg-blacksection">
			<div className="relative block aspect-[37/22] w-full">
				<Image
					className="object-cover object-center transition duration-500 group-hover:scale-110"
					src={image}
					alt={title}
					fill
				/>
			</div>

			<div className="p-6 sm:p-8">
				<h3 className="mb-5">
					<Link
						href={`/blog/${slug}`}
						className="text-lg font-medium text-black hover:text-primary dark:text-white dark:hover:text-primary"
					>
						{title}
					</Link>
				</h3>
				<p className="mb-6 line-clamp-3">{description}</p>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4 xl:gap-6">
						<div className="h-10 w-10 overflow-hidden rounded-full">
							<Image
								src={author.image}
								alt={author.name}
								width={40}
								height={40}
								className="object-cover object-center"
							/>
						</div>
						<div>
							<h4 className="mb-1 text-sm font-medium text-black dark:text-white">
								{author.name}
							</h4>
							<p className="text-sm text-body-color">{date}</p>
						</div>
					</div>
				</div>
			</div>
		</article>
	);
};

export default BlogItem;
