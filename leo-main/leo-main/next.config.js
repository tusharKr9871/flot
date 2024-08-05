// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com', // Replace with your actual hostname
        // port: '', // Optional, include if needed
        // pathname: '/images/**', // Optional, include if needed
      },
    ],
  },
};

module.exports = nextConfig;
