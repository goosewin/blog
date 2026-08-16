import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { preload } from 'react-dom';
import BackLink from '#/components/back-link';
import StructuredData from '#/components/structured-data';
import SubscriptionForm from '#/components/subscription-form';
import { getAllBlogPosts, getBlogPost, getBlogPostContent } from '#/lib/blog';
import { formatPostDate } from '#/lib/dates';
import { getPublicBaseUrl } from '#/lib/site';
import {
  HERO_IMAGE_SIZES,
  createMdxComponents,
  heroSrcSet,
} from '#/mdx-components';

const defaultBlogPostDescription = 'A blog post by Dan Goosewin';

function getBlogPostDescription(post: { description?: string }) {
  return post.description || defaultBlogPostDescription;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  const baseUrl = getPublicBaseUrl();
  const image = `${baseUrl}/blog/${post.slug}/opengraph-image`;
  const description = getBlogPostDescription(post);

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.date,
      authors: ['Dan Goosewin'],
      url: `${baseUrl}/blog/${post.slug}`,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [image],
    },
    alternates: { canonical: `${baseUrl}/blog/${post.slug}` },
  };
}

export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [posts, post] = await Promise.all([
    getAllBlogPosts(),
    getBlogPost(slug),
  ]);

  if (posts.length === 0) {
    redirect('/');
  }

  if (!post) {
    notFound();
  }

  const Content = await getBlogPostContent(post.slug);

  // The hero is the LCP element, so hint it before the body streams. Rendering
  // a bare <link> here would emit both a hoisted and an inline copy.
  if (post.heroImage) {
    preload(post.heroImage, {
      as: 'image',
      imageSrcSet: heroSrcSet(post.heroImage),
      imageSizes: HERO_IMAGE_SIZES,
      fetchPriority: 'high',
    });
  }

  const currentIndex = posts.findIndex((entry) => entry.slug === post.slug);
  const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const baseUrl = getPublicBaseUrl();
  const description = getBlogPostDescription(post);

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
    description,
    image: post.image ? `${baseUrl}${post.image}` : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <BackLink />
      <StructuredData data={structuredData} />
      <article className="prose max-w-none dark:prose-invert">
        <div className="mb-12">
          <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>|
            <span>
              <a
                href="https://x.com/goosewin"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                @goosewin
              </a>
            </span>
          </div>
        </div>
        <Content components={createMdxComponents(post.heroImage)} />
      </article>

      <nav className="mt-12 flex items-center justify-between border-t border-gray-200 pt-8 dark:border-gray-600">
        <div className="flex-1">
          {previousPost ? (
            <Link
              href={`/blog/${previousPost.slug}`}
              className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 transition-opacity duration-200 hover:opacity-80 dark:bg-[#1c1c1c]/60"
            >
              <svg
                className="size-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
          ) : null}
        </div>

        <div className="flex-1 flex justify-end">
          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 transition-opacity duration-200 hover:opacity-80 dark:bg-[#1c1c1c]/60"
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
                className="size-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ) : null}
        </div>
      </nav>

      <div className="mt-12">
        <SubscriptionForm />
      </div>
    </>
  );
}
