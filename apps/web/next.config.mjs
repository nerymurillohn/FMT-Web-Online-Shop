/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days for product images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'forestalmt.com',
      },
    ],
  },
  output: 'standalone',
};

export default nextConfig;