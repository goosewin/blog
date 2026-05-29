import { createFileRoute } from '@tanstack/react-router';
import BackLink from '../components/back-link';
import BlogPostList from '../components/blog-post-list';
import SubscriptionForm from '../components/subscription-form';
import StructuredData from '../components/structured-data';
import { getAllBlogPosts } from '../lib/blog';
import { getPublicBaseUrl } from '../lib/site';

export const Route = createFileRoute('/blog/')({
  loader: () => getAllBlogPosts(),
  head: () => ({
    meta: [
      { title: 'Blog | Dan Goosewin' },
      {
        name: 'description',
        content: 'Opinionated writing on software, execution, and leverage.',
      },
      { property: 'og:url', content: `${getPublicBaseUrl()}/blog` },
    ],
    links: [{ rel: 'canonical', href: `${getPublicBaseUrl()}/blog` }],
  }),
  component: Blog,
});

function Blog() {
  const posts = Route.useLoaderData();
  const baseUrl = getPublicBaseUrl();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${baseUrl}/blog`,
    url: `${baseUrl}/blog`,
    name: 'Dan Goosewin',
    description: 'Opinionated writing on software, execution, and leverage.',
    author: { '@type': 'Person', name: 'Dan Goosewin', url: baseUrl },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${baseUrl}/blog/${post.slug}`,
      datePublished: post.date,
    })),
  };

  return (
    <div className="space-y-10">
      <StructuredData data={structuredData} />
      <BackLink />
      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Blog</h1>
      <BlogPostList posts={posts} showDate />
      <div className="pt-6">
        <SubscriptionForm />
      </div>
    </div>
  );
}
