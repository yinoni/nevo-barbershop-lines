/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.fallback = {
            fs: false,
            path: false,
            os: false,
        };
        return config;
    },
    reactStrictMode: true,
    output: 'export'
};

export default nextConfig;
