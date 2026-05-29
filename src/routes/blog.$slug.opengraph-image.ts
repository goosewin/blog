import { createFileRoute } from '@tanstack/react-router';
import { getBlogPost } from '../lib/blog';

export const Route = createFileRoute('/blog/$slug/opengraph-image')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const [post, { createBlogPostOgImageResponse }] = await Promise.all([
          getBlogPost(params.slug),
          import('../lib/og-image.server'),
        ]);

        return createBlogPostOgImageResponse(post);
      },
    },
  },
});
