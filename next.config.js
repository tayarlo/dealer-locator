/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['static.wixstatic.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Some hosts inject a restrictive Permissions-Policy that silently
          // disables navigator.geolocation. Explicitly grant it to ourselves.
          { key: 'Permissions-Policy', value: 'geolocation=(self)' },
        ],
      },
    ];
  },
}

module.exports = nextConfig
