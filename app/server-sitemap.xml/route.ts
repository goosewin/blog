import { getServerSideSitemap } from 'next-sitemap';
import { getAllBlogPosts } from '@/lib/blog';

export async function GET() {
  const posts = await getAllBlogPosts();

  const fields = posts.map((post) => ({
    loc: `https://goosewin.com/blog/${post.slug}`,
    lastmod: new Date().toISOString(),
  }));

  return getServerSideSitemap(fields);
}
