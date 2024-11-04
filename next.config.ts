import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import { withPlausibleProxy } from 'next-plausible';

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
  redirects: async () => {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'goosewin.me',
          },
          {
            type: 'host',
            value: 'goosew.in',
          },
          {
            type: 'host',
            value: 'goose.codes',
          },
        ],
        destination: 'https://goosewin.com/:path*',
        permanent: true,
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

export default withPlausibleProxy({
  customDomain: 'https://analytics.goosewin.com',
})(withMDX(nextConfig));
