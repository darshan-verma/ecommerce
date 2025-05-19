/** @type {import('next').NextConfig} */
import type { Configuration } from "webpack";

const nextConfig = {
	reactStrictMode: true,
	env: {
		MONGODB_URI: process.env.MONGODB_URI,
	},
	images: {
		domains: ["localhost"],
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: process.env.PORT || "3000",
				pathname: "/uploads/**",
			},
		],
	},
	webpack: (config: Configuration) => {
		config.resolve = config.resolve || {};
		config.resolve.fallback = { fs: false, path: false };
		return config;
	},
};

export default nextConfig;
