import Link from 'next/link';

import { BlogPost } from '@/lib/blog';

import { Surface } from '@/app/components/ui/surface';

interface RelatedPostsProps {
  posts: BlogPost[];
  currentSlug: string;
}

export function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  const related = posts.filter((post) => post.slug !== currentSlug).slice(0, 3);

  if (related.length === 0) {
    return null;
  }

  return (
    <Surface variant="muted" className="mt-16 p-6 sm:p-8">
      <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
        Related reading
      </h2>
      <ul className="mt-6 space-y-4">
        {related.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-1"
            >
              <span className="text-base font-medium text-strong transition group-hover:text-accent">
                {post.title}
              </span>
              <span className="text-sm text-[var(--color-text-muted)]">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Surface>
  );
}
