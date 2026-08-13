/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@burger-ai/ui', '@burger-ai/types', '@burger-ai/database'],
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
