import { getAllBlogPosts } from '@/lib/blog';
import BlogPostList from '@/app/components/blog-post-list';
import SubscriptionForm from '@/app/components/subscription-form';

export default async function Home() {
  const posts = await getAllBlogPosts();

  return (
    <>
      <BlogPostList posts={posts} showDate={true} />

      <div className="mt-12">
        <SubscriptionForm />
      </div>
    </>
  );
}
