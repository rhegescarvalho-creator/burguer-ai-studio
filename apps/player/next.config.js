/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@burger-ai/ui"],
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
