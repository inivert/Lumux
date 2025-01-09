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
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				crypto: require.resolve('crypto-browserify'),
				buffer: require.resolve('buffer/'),
				stream: require.resolve('stream-browserify'),
				util: require.resolve('util/'),
				process: require.resolve('process/browser'),
			};

			config.plugins = [
				...config.plugins,
				new (require('webpack').ProvidePlugin)({
					Buffer: ['buffer', 'Buffer'],
					process: 'process/browser',
				}),
			];
		}
		return config;
	},
};

module.exports = nextConfig;
