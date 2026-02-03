import StructuredData from '@/app/components/structured-data';
import SubscriptionForm from '@/app/components/subscription-form';
import BackLink from '@/app/components/back-link';
import { getAllBlogPosts, getBlogPost } from '@/lib/blog';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = await getBlogPost(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description || 'A blog post by Dan Goosewin',
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description || 'A blog post by Dan Goosewin',
      type: 'article',
      publishedTime: post.date,
      authors: ['Dan Goosewin'],
      images: [
        {
          url: `/blog/${post.slug}/opengraph-image`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || 'A blog post by Dan Goosewin',
      images: [`/blog/${post.slug}/opengraph-image`],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

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
    image: post.image
      ? `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://goosewin.com'}${post.image}`
      : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://goosewin.com'}/blog/${post.slug}`,
    },
  };

  const PostContent = (await import(`@/posts/${params.slug}.mdx`)).default;

  return (
    <>
      <BackLink />
      <StructuredData data={structuredData} />
      <article className="prose dark:prose-invert max-w-none">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            |
            <span>
              <Link
                href="https://x.com/goosewin"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                @goosewin
              </Link>
            </span>
          </div>
        </div>
        <PostContent />
      </article>

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
