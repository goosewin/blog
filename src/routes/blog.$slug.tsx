import { Suspense } from 'react';
import {
  Link,
  createFileRoute,
  notFound,
  redirect,
} from '@tanstack/react-router';
import BackLink from '../components/back-link';
import StructuredData from '../components/structured-data';
import SubscriptionForm from '../components/subscription-form';
import { getAllBlogPosts, getBlogPost, getBlogPostContent } from '../lib/blog';
import { formatPostDate } from '../lib/dates';
import { getPublicBaseUrl } from '../lib/site';

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const posts = await getAllBlogPosts();

    if (posts.length === 0) {
      throw redirect({ to: '/' });
    }

    const post = await getBlogPost(params.slug);

    if (!post) {
      throw notFound();
    }

    return { post, posts };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return {};

    const baseUrl = getPublicBaseUrl();
    const image = post.image
      ? `${baseUrl}${post.image}`
      : `${baseUrl}/blog/${post.slug}/opengraph-image`;

    return {
      meta: [
        { title: `${post.title} | Dan Goosewin` },
        {
          name: 'description',
          content: post.description || 'A blog post by Dan Goosewin',
        },
        { property: 'og:title', content: post.title },
        {
          property: 'og:description',
          content: post.description || 'A blog post by Dan Goosewin',
        },
        { property: 'og:type', content: 'article' },
        { property: 'article:published_time', content: post.date },
        { property: 'article:author', content: 'Dan Goosewin' },
        { property: 'og:image', content: image },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: post.title },
        {
          name: 'twitter:description',
          content: post.description || 'A blog post by Dan Goosewin',
        },
        { name: 'twitter:image', content: image },
      ],
      links: [{ rel: 'canonical', href: `${baseUrl}/blog/${post.slug}` }],
    };
  },
  component: Article,
});

function Article() {
  const { post, posts } = Route.useLoaderData();
  const Content = getBlogPostContent(post.slug);
  const currentIndex = posts.findIndex((entry) => entry.slug === post.slug);
  const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const baseUrl = getPublicBaseUrl();

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
        <Suspense fallback={null}>
          <Content />
        </Suspense>
      </article>

      <nav className="mt-12 flex items-center justify-between border-t border-gray-200 pt-8 dark:border-gray-600">
        <div className="flex-1">
          {previousPost ? (
            <Link
              to="/blog/$slug"
              params={{ slug: previousPost.slug }}
              className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 transition-opacity duration-200 hover:opacity-80 dark:bg-[#1c1c1c]/60"
            >
              <svg
                className="h-5 w-5 text-gray-600 dark:text-gray-400"
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
          ) : null}
        </div>

        <div className="flex flex-1 justify-end">
          {nextPost ? (
            <Link
              to="/blog/$slug"
              params={{ slug: nextPost.slug }}
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
                className="h-5 w-5 text-gray-600 dark:text-gray-400"
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
          ) : null}
        </div>
      </nav>

      <div className="mt-12">
        <SubscriptionForm />
      </div>
    </>
  );
}
