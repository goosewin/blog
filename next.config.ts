import bundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 512, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24,
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

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
  analyzerMode: 'static',
  generateStatsFile: true,
});

export default withBundleAnalyzer(withMDX(nextConfig));
