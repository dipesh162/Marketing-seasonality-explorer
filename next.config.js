// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      enabled: false, // ✅ correct structure
    },
  },
};

module.exports = nextConfig;
