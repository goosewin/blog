import { NextResponse } from 'next/server';

import { getAllBlogPosts } from '@/lib/blog';

export async function GET() {
  const posts = await getAllBlogPosts();

  const payload = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description ?? '',
    date: post.date,
  }));

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 's-maxage=600, stale-while-revalidate=86400',
    },
  });
}
