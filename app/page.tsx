import { getAllBlogPosts } from '@/lib/blog';
import BlogPostList from '@/app/components/blog-post-list';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Daniel Stolbov's Website",
  description:
    'Explore the work of Daniel Stolbov, a software developer and builder dedicated to creating innovative digital solutions and fostering entrepreneurial ventures.',
};

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
