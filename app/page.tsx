import { getAllBlogPosts } from '@/lib/blog';
import BlogPostList from '@/app/components/blog-post-list';
import SubscriptionForm from '@/app/components/subscription-form';
import Link from 'next/link';

export default async function Home() {
  const posts = await getAllBlogPosts();

  return (
    <>
      <p className="mb-12 text-balance">
        Founder working on a stealth startup. Building the next interface
        between humans and AI. Passionate about software, videogames, finance,
        entrepreneurship, and{' '}
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

      <div className="mt-12">
        <SubscriptionForm />
      </div>
    </>
  );
}
