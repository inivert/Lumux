/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            }
        ],
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack']
        });
        return config;
    }
}

module.exports = nextConfig 