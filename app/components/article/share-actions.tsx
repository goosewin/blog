'use client';

import { Link2, Linkedin, Twitter } from 'lucide-react';

interface ShareActionsProps {
  title: string;
  url: string;
}

function openWindow(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
}

export function ShareActions({ title, url }: ShareActionsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error('Failed to copy link', error);
    }
  };

  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
        Share
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() =>
            openWindow(
              `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-full border border-subtle text-[var(--color-text-muted)] transition hover:border-strong hover:text-strong"
          aria-label="Share on X"
        >
          <Twitter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            openWindow(
              `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-full border border-subtle text-[var(--color-text-muted)] transition hover:border-strong hover:text-strong"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-subtle text-[var(--color-text-muted)] transition hover:border-strong hover:text-strong"
          aria-label="Copy link"
        >
          <Link2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
