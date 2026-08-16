import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  // Post bodies and OG assets are read from disk at request time, which the
  // tracer cannot follow through `process.cwd()`.
  outputFileTracingIncludes: {
    '/api/send-newsletter': ['./posts/**/*.mdx'],
  },
};

export default nextConfig;
