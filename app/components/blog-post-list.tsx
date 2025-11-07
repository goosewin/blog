import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Surface } from '@/app/components/ui/surface';
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
    <Surface variant="muted" className="p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--color-text-muted)]">
          Recent Writing
        </h2>
        <Link
          href="/blog"
          className="text-sm font-medium text-accent hover:opacity-80"
        >
          View all
        </Link>
      </div>
      <ul className="divide-y divide-[var(--color-border)]">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-4 py-4 transition-colors sm:items-center sm:justify-between"
            >
              <span className="text-base font-medium text-strong transition-colors group-hover:text-accent">
                {post.title}
              </span>
              {showDate && (
                <span className="text-sm text-[var(--color-text-muted)]">
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
    </Surface>
  );
}
