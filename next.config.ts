/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'boxandbuy.com',
        pathname: '/api/images/**',
      },
    ],
  },
};

module.exports = nextConfig;