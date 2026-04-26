import { createFileRoute } from '@tanstack/react-router';
import BackLink from '../components/back-link';
import BlogPostList from '../components/blog-post-list';
import SubscriptionForm from '../components/subscription-form';
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
    ],
    links: [{ rel: 'canonical', href: `${getPublicBaseUrl()}/blog` }],
  }),
  component: Blog,
});

function Blog() {
  const posts = Route.useLoaderData();

  return (
    <div className="space-y-10">
      <BackLink />
      <h1 className="text-3xl font-bold">Blog</h1>
      <BlogPostList posts={posts} showDate />
      <div className="pt-6">
        <SubscriptionForm />
      </div>
    </div>
  );
}
