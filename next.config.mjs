/** @type {import('next').NextConfig} */
const nextConfig = {};
// next.config.js
export default {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3001/api/:path*', // Proxy to your backend
        },
      ];
    },
  };