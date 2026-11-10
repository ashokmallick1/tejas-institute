/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-*.r2.dev',
      },
    ],
  },
  allowedDevOrigins: ['tejas.bhashaai.in', '*.bhashaai.in', 'localhost:3002', '127.0.0.1:3002', 'localhost:3004', '127.0.0.1:3004'],
};

export default nextConfig;
