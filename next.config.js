/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			"avatars.githubusercontent.com",
			"lh3.googleusercontent.com",
			"res.cloudinary.com",
			"utfs.io",
		],
	},
	webpack: (config) => {
		config.resolve.alias.crypto = require.resolve('crypto-browserify');
		return config;
	},
};

module.exports = nextConfig;
