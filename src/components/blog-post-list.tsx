import { Link } from '@tanstack/react-router';
import type { BlogPost } from '#/lib/blog';
import { formatPostDate } from '../lib/dates';

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
      <div className="py-8">
        <h2 className="mb-2 text-xl font-bold">No posts yet</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Check back later for new writing.
        </p>
      </div>
    );
  }

  return (
    <ul>
      {posts.map((post) => (
        <li
          key={post.slug}
          className="border-t border-gray-200 last:border-b dark:border-gray-700"
        >
          <Link
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="group flex items-baseline gap-4 py-4"
          >
            <span className="flex-1 text-lg font-semibold leading-snug transition-colors group-hover:text-orange-deep dark:group-hover:text-orange">
              {post.title}
            </span>
            {showDate && (
              <time
                dateTime={post.date}
                className="whitespace-nowrap pt-1 font-mono text-xs text-gray-500 dark:text-gray-400"
              >
                {formatPostDate(post.date, 'short')}
              </time>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
