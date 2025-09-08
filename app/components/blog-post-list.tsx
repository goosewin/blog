import Link from 'next/link';
import { BlogPost } from '@/lib/blog';

interface BlogPostListProps {
  posts: BlogPost[];
  showDate?: boolean;
}

export default function BlogPostList({
  posts,
  showDate = true,
}: BlogPostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">No blog posts found</h2>
        <p className="text-gray-600 dark:text-gray-400">
          No posts found. Check back later for new content!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-sm text-gray-500 dark:text-gray-400 mb-4 uppercase">
        Blog
      </h2>
      <ul className="border-t border-gray-200 dark:border-gray-700">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="text-base border-b border-gray-200 dark:border-gray-700"
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col sm:flex-row sm:justify-between sm:items-center py-4"
            >
              <span className="group-hover:opacity-80 transition-opacity mb-2 sm:mb-0">
                {post.title}
              </span>
              {showDate && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
