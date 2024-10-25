import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        hostname: 'github.com',
        protocol: 'https',
      },
      {
        hostname: 'api.github.com',
        protocol: 'https',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/js/script.js',
        destination: 'https://analytics.goosewin.com/js/script.js',
      },
      {
        source: '/api/event',
        destination: 'https://analytics.goosewin.com/api/event',
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
