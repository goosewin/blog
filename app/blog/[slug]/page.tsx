import { getAllBlogPosts, getBlogPost } from '@/lib/blog';
import { notFound, redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import Link from 'next/link';
import StructuredData from '@/app/components/structured-data';
import SubscriptionForm from '@/app/components/subscription-form';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = await getBlogPost(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description || 'A blog post by Dan Goosewin',
    openGraph: {
      title: post.title,
      description: post.description || 'A blog post by Dan Goosewin',
      type: 'article',
      publishedTime: post.date,
      authors: ['Dan Goosewin'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || 'A blog post by Dan Goosewin',
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const MDXContent = dynamic(() => import('@/app/components/mdx-content'), {
  ssr: true,
});

export default async function Article(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const posts = await getAllBlogPosts();
  if (posts.length === 0) {
    redirect('/');
  }

  const post = await getBlogPost(params.slug);
  if (!post) notFound();

  // Find current post index and get previous/next posts
  const currentIndex = posts.findIndex((p) => p.slug === params.slug);
  const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'Dan Goosewin',
    },
    description: post.description || 'A blog post by Dan Goosewin',
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <article className="prose dark:prose-invert max-w-none">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
            <span>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            |
            <span>
              <Link
                href="https://x.com/dan_goosewin"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                @dan_goosewin
              </Link>
            </span>
          </div>
        </div>
        <MDXContent slug={params.slug} />
      </article>

      {/* Navigation buttons */}
      <nav className="mt-12 flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-8">
        <div className="flex-1">
          {previousPost && (
            <Link
              href={`/blog/${previousPost.slug}`}
              className="flex items-center gap-3 p-4 rounded-lg hover:opacity-80 transition-opacity duration-200 bg-gray-50 dark:bg-[#1c1c1c]/60"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <div className="text-left">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Previous
                </div>
                <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {previousPost.title}
                </div>
              </div>
            </Link>
          )}
        </div>

        <div className="flex-1 flex justify-end">
          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="flex items-center gap-3 p-4 rounded-lg hover:opacity-80 transition-opacity duration-200 bg-gray-50 dark:bg-[#1c1c1c]/60"
            >
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Next
                </div>
                <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {nextPost.title}
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>
      </nav>

      <div className="mt-12">
        <SubscriptionForm />
      </div>
    </>
  );
}
