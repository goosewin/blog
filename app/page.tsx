import { getAllBlogPosts } from '@/lib/blog';
import BlogPostList from '@/app/components/blog-post-list';
import SubscriptionForm from '@/app/components/subscription-form';
import Link from 'next/link';

export default async function Home() {
  const posts = await getAllBlogPosts();

  return (
    <>
      <p className="mb-12 text-balance">
        DevRel Lead @{' '}
        <Link href="https://vapi.ai" className="nav-link" target="_blank">
          vapi.ai
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
      <BlogPostList
        posts={posts}
        showDate={true}
        limit={5}
        showViewAllLink={true}
      />

      <div className="mt-12">
        <SubscriptionForm />
      </div>
    </>
  );
}
