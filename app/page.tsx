import Link from 'next/link';

import BlogPostList from '@/app/components/blog-post-list';
import { PageHeader } from '@/app/components/page-header';
import SubscriptionForm from '@/app/components/subscription-form';
import { ButtonLink } from '@/app/components/ui/button';
import { getAllBlogPosts } from '@/lib/blog';

export default async function Home() {
  const posts = await getAllBlogPosts();

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Welcome"
        title="Designing humane developer experiences and partnerships."
        description={
          <>
            DevRel & Partnerships Lead @{' '}
            <Link href="https://vapi.ai" className="nav-link" target="_blank">
              vapi.ai
            </Link>
            . Passionate about software, videogames, finance, entrepreneurship,
            and{' '}
            <Link
              href="/blog/wonders-of-rubber-duck-debugging"
              rel="noopener noreferrer"
              className="underline-link"
            >
              ducks
            </Link>
            .
          </>
        }
        actions={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <ButtonLink href="/work" size="lg">
              Explore work
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary" size="lg">
              Start a project
            </ButtonLink>
          </div>
        }
      />

      <BlogPostList posts={posts} showDate={true} />

      <SubscriptionForm className="mt-12" />
    </div>
  );
}
