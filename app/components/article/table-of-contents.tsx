'use client';

import { useHeadings } from '@/app/hooks/use-headings';

interface TableOfContentsProps {
  targetSelector: string;
}

export function TableOfContents({ targetSelector }: TableOfContentsProps) {
  const { headings, activeId } = useHeadings(targetSelector);

  if (headings.length === 0) {
    return null;
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const yOffset = 96;
    const y = element.getBoundingClientRect().top + window.scrollY - yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav aria-label="Table of contents" className="space-y-4">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
          On this page
        </span>
      </div>
      <ul className="space-y-3 text-sm">
        {headings
          .filter((heading) => heading.level === 2)
          .map((heading, index) => (
            <li key={`${heading.id}-${index}`}>
              <button
                type="button"
                onClick={() => handleClick(heading.id)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left transition-colors ${
                  activeId === heading.id
                    ? 'bg-[color:var(--color-accent-soft)]/60 text-strong'
                    : 'text-[var(--color-text-muted)] hover:text-strong'
                }`}
              >
                <span
                  className="h-1 w-1 rounded-full bg-[color:var(--color-accent)]"
                  aria-hidden
                />
                {heading.text}
              </button>
            </li>
          ))}
      </ul>
    </nav>
  );
}
