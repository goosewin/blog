import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    viewTransition: true,
  },
  // Post bodies and OG assets are read from disk at request time, which the
  // tracer cannot follow through `process.cwd()`.
  outputFileTracingIncludes: {
    '/api/send-newsletter': ['./posts/**/*.mdx'],
    '/blog/[slug]': ['./posts/**/*.mdx'],
    '/blog/[slug]/opengraph-image': ['./posts/**/*.mdx'],
  },
};

export default nextConfig;
