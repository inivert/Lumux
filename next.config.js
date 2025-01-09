/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
			{
				protocol: 'https',
				hostname: 'utfs.io',
			},
			{
				protocol: 'https',
				hostname: 'ui-avatars.com',
			},
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
