import { getAllBlogPosts } from '#/lib/blog';
import { getPublicBaseUrl } from '#/lib/site';
import { buildSitemapXml } from '#/lib/sitemap';

// A route handler rather than Next's `app/sitemap.ts` convention so the emitted
// XML keeps the existing changefreq/priority entries byte for byte.
export const dynamic = 'force-static';

export async function GET() {
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
}
