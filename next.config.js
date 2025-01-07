/** @type {import('next').NextConfig} */

const nextConfig = {
	images: {
		domains: ["localhost"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
				port: "",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
				port: "",
			},
		],
	},
	webpack: (config) => {
		config.resolve.fallback = {
			fs: false,
			net: false,
			tls: false,
			crypto: require.resolve('crypto-browserify'),
		};
		return config;
	}
};

module.exports = nextConfig;
