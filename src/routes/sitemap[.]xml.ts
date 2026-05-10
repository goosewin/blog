import { createFileRoute } from '@tanstack/react-router';
import { getAllBlogPosts } from '../lib/blog';
import { buildSitemapXml } from '../lib/sitemap';
import { getPublicBaseUrl } from '../lib/site';

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const posts = await getAllBlogPosts();
        const sitemap = buildSitemapXml({
          baseUrl: getPublicBaseUrl(),
          posts,
        });

        return new Response(sitemap, {
          headers: {
            'content-type': 'application/xml; charset=utf-8',
            'cache-control': 'public, max-age=3600',
          },
        });
      },
    },
  },
});
