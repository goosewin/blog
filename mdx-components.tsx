import type { ComponentProps } from 'react';
import type { MDXComponents } from 'mdx/types';

import { LinkIcon } from 'lucide-react';

import { cn, slugify } from '@/lib/utils';

function flattenText(children: React.ReactNode): string {
  if (typeof children === 'string') {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map(flattenText).join(' ');
  }

  if (
    typeof children === 'object' &&
    children !== null &&
    'props' in children
  ) {
    // @ts-expect-error - accessing props of React element
    return flattenText(children.props.children);
  }

  return '';
}

const createHeading = (Tag: 'h2' | 'h3') => {
  const Heading = ({
    id,
    className,
    children,
    ...props
  }: ComponentProps<typeof Tag>) => {
    const content = flattenText(children);
    const headingId = id ?? slugify(content);

    return (
      <Tag
        id={headingId}
        className={cn(
          'group scroll-mt-28 font-semibold tracking-tight text-strong',
          Tag === 'h2' && 'mt-12 text-2xl sm:text-[1.75rem]',
          Tag === 'h3' && 'mt-10 text-xl sm:text-[1.35rem]',
          className
        )}
        {...props}
      >
        <span className="relative inline-flex items-center gap-2">
          {children}
          <a
            href={`#${headingId}`}
            aria-label="Copy heading link"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--color-accent-soft)]/0 text-[color:var(--color-text-muted)] opacity-0 transition group-hover:bg-[color:var(--color-accent-soft)]/70 group-hover:opacity-100"
          >
            <LinkIcon className="h-3.5 w-3.5" aria-hidden />
          </a>
        </span>
      </Tag>
    );
  };

  Heading.displayName = `Heading${Tag.toUpperCase()}`;
  return Heading;
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: createHeading('h2'),
    h3: createHeading('h3'),
    ul: ({ className, ...props }) => (
      <ul
        className={cn(
          'list-disc space-y-2 pl-6 text-[var(--color-text-muted)]',
          className
        )}
        {...props}
      />
    ),
    ol: ({ className, ...props }) => (
      <ol
        className={cn(
          'list-decimal space-y-2 pl-6 text-[var(--color-text-muted)]',
          className
        )}
        {...props}
      />
    ),
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn(
          'border-l-4 border-[color:var(--color-accent)]/50 bg-[color:var(--color-accent-soft)]/40 p-4 text-[var(--color-text)] italic',
          className
        )}
        {...props}
      />
    ),
    code: ({ className, ...props }) => (
      <code
        className={cn(
          'rounded-md bg-[color:var(--color-accent-soft)]/60 px-1.5 py-0.5 text-[0.95em] text-[color:var(--color-text)] shadow-inner',
          className
        )}
        {...props}
      />
    ),
    pre: ({ className, ...props }) => (
      <pre
        className={cn(
          'overflow-x-auto rounded-[var(--radius-md)] bg-[#0f172a] p-5 text-sm text-slate-100 shadow-soft',
          className
        )}
        {...props}
      />
    ),
    ...components,
  };
}
