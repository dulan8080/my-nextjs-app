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
  // Removed output: 'export' to enable Vercel deployment with dynamic routes
  // Add webpack configuration to handle missing modules
  webpack: (config, { isServer }) => {
    // Ignore missing modules during build
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Handle mysql2 module resolution
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'mysql2/promise': false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig; 
