import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for mobile and PWA
  experimental: {
    optimizeCss: true,
  },
  
  // Better chunking strategy for mobile
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimize chunk loading for mobile
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },

  // Add headers for better caching
  async headers() {
    return [
      {
        source: '/_next/static/chunks/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
