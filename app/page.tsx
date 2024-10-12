import { getAllBlogPosts } from '@/lib/blog';
import BlogPostList from '@/app/components/blog-post-list';
import Link from 'next/link';

export default async function Home() {
  const posts = await getAllBlogPosts();

  return (
    <>
      <p className="mb-12 text-balance">
        SDE Manager{' '}
        <Link href="https://deaglo.com" className="nav-link" target="_blank">
          @DeagloInc
        </Link>
        . Passionate about software, videogames, finance, entrepreneurship, and{' '}
        <Link
          href="/blog/wonders-of-rubber-duck-debugging"
          rel="noopener noreferrer"
          className="underline-link"
        >
          ducks
        </Link>
        .
      </p>
      <BlogPostList posts={posts} showDate={true} />
    </>
  );
}
