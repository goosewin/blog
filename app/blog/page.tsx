import type { Metadata } from 'next';
import BackLink from '#/components/back-link';
import BlogPostList from '#/components/blog-post-list';
import SubscriptionForm from '#/components/subscription-form';
import StructuredData from '#/components/structured-data';
import { getAllBlogPosts } from '#/lib/blog';
import { createPageOpenGraph, getPublicBaseUrl } from '#/lib/site';

const title = 'Blog';
const description = 'Opinionated writing on software, execution, and leverage.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: createPageOpenGraph({ title, description, path: '/blog' }),
  alternates: { canonical: `${getPublicBaseUrl()}/blog` },
};

export default async function Blog() {
  const posts = await getAllBlogPosts();
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
