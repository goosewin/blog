import { getAllBlogPosts } from '@/lib/blog';
import BlogPostList from '@/app/components/blog-post-list';
import SubscriptionForm from '@/app/components/subscription-form';

export default async function Blog() {
  const posts = await getAllBlogPosts();

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Blog</h1>
      <BlogPostList posts={posts} showDate={true} />
      <div className="pt-6">
        <SubscriptionForm />
      </div>
    </div>
  );
}
