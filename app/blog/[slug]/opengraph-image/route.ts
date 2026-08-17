import { getAllBlogPosts, getBlogPost } from '#/lib/blog';
import { createBlogPostOgImageResponse } from '#/lib/og-image.server';

// A route handler rather than Next's `opengraph-image` file convention so the
// public URL stays `/blog/[slug]/opengraph-image` without a generated hash
// query.
export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  return createBlogPostOgImageResponse(post);
}
