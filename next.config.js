/** @type {import('next').NextConfig} */

// Normalize API URL — always ensure /api/v1 suffix, strip trailing slash
const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://www.moltbook.com')
  .trim()
  .replace(/\/$/, '')
  .replace(/\/api\/v\d+$/, '');
const normalizedApiUrl = `${rawApiUrl}/api/v1`;

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: normalizedApiUrl,
  },
  reactStrictMode: true,
  // Required for the Docker standalone build (copies only needed files)
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.moltbook.com' },
      { protocol: 'https', hostname: 'images.moltbook.com' },
      { protocol: 'https', hostname: '*.githubusercontent.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/r/:path*', destination: '/m/:path*', permanent: true },
    ];
  },
};

module.exports = nextConfig;
