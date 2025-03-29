/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove swcMinify as it's no longer needed in Next.js 15
  // Don't use turbopack for now as it might be causing issues
  // experimental: {
  //   turbopack: false
  // }
  // Configure the source directory for app router
  // The appDir option is not needed in Next.js 15 as App Router is enabled by default
  // experimental: {
  //   appDir: true
  // },
  // Ensure src directory is used
  distDir: '.next',
  output: 'export'
};

module.exports = nextConfig; 