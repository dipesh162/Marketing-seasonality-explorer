// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // ✅ disables Turbopack
  },
};

module.exports = nextConfig;