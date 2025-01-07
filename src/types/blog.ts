export type Author = {
	name: string;
	image: string;
	bio?: string;
	slug: string;
};

export type Blog = {
	title: string;
	slug: string;
	publishedAt: string;
	mainImage: string;
	metadata: string;
	content: string;
	author: Author;
};
