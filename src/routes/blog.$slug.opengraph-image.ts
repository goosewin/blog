import { createFileRoute } from '@tanstack/react-router';
import { getBlogPost } from '../lib/blog';

export const Route = createFileRoute('/blog/$slug/opengraph-image')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const post = await getBlogPost(params.slug);
        const { createBlogPostOgImageResponse } =
          await import('../lib/og-image.server');

        return createBlogPostOgImageResponse(post);
      },
    },
  },
});
