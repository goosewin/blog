import { getAllBlogPosts } from '@/lib/blog';
import BlogPostList from '@/app/components/blog-post-list';

export default async function Home() {
  const posts = await getAllBlogPosts();

  return <BlogPostList posts={posts} showDate={true} />;
}
