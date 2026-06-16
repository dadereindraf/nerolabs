/**
 * Basic Next.js config for App Router.
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  serverExternalPackages: ['cron-parser'],
};

module.exports = nextConfig;