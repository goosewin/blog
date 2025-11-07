'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Search, X } from 'lucide-react';

import { buttonClassNames } from '@/app/components/ui/button';
import { Surface } from '@/app/components/ui/surface';
import { cn } from '@/lib/utils';

interface SearchPost {
  slug: string;
  title: string;
  description?: string;
  date?: string;
}

interface SearchContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const isModifier = event.metaKey || event.ctrlKey;
      if (isModifier && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        open();
      }
      if (event.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [open, close]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/search');
        if (!response.ok) {
          throw new Error(`Search request failed: ${response.statusText}`);
        }
        const data = (await response.json()) as SearchPost[];
        if (!cancelled) {
          setPosts(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Unable to load search data.'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isOpen || posts.length > 0 || isLoading || error) {
      return;
    }

    let cancelled = false;

    const retry = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/search');
        if (!response.ok) {
          throw new Error(`Search request failed: ${response.statusText}`);
        }
        const data = (await response.json()) as SearchPost[];
        if (!cancelled) {
          setPosts(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Unable to load search data.'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    retry();

    return () => {
      cancelled = true;
    };
  }, [isOpen, posts.length, isLoading, error]);

  const results = useMemo(() => {
    if (!query) {
      return posts.slice(0, 8);
    }

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

    if (terms.length === 0) {
      return posts.slice(0, 8);
    }

    return posts
      .map((post) => {
        const title = post.title.toLowerCase();
        const description = (post.description ?? '').toLowerCase();
        const slug = post.slug.toLowerCase();

        let score = 0;
        for (const term of terms) {
          if (title.includes(term)) score += 4;
          if (description.includes(term)) score += 2;
          if (slug.includes(term)) score += 1;
        }

        return { post, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((entry) => entry.post);
  }, [posts, query]);

  const handleSelect = useCallback(
    (post: SearchPost) => {
      const path = post.slug.startsWith('/') ? post.slug : `/blog/${post.slug}`;
      router.push(path);
      close();
    },
    [router, close]
  );

  const value = useMemo(
    () => ({
      open,
      close,
      isOpen,
    }),
    [open, close, isOpen]
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-24 sm:px-6 sm:py-32">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={close}
            aria-label="Close search overlay"
          />
          <Surface
            variant="muted"
            className="relative z-10 w-full max-w-2xl overflow-hidden border border-subtle shadow-soft"
          >
            <div className="flex items-center gap-3 border-b border-subtle px-4 py-3">
              <Search
                className="h-5 w-5 text-[var(--color-text-muted)]"
                aria-hidden
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search blog posts…"
                className="flex-1 border-none bg-transparent text-base text-strong placeholder:text-[var(--color-text-muted)] focus:outline-none"
              />
              <button
                type="button"
                onClick={close}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-muted)] transition hover:text-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                aria-label="Close search"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {isLoading && (
                <div className="flex items-center gap-2 px-4 py-6 text-sm text-[var(--color-text-muted)]">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />{' '}
                  Loading posts…
                </div>
              )}
              {error && (
                <div className="px-4 py-6 text-sm text-[var(--color-text-muted)]">
                  {error}
                </div>
              )}
              {!isLoading && !error && results.length === 0 && (
                <div className="px-4 py-6 text-sm text-[var(--color-text-muted)]">
                  No matches yet. Try searching by topic or keyword.
                </div>
              )}
              <ul className="divide-y divide-[var(--color-border)]">
                {results.map((post) => (
                  <li key={post.slug}>
                    <button
                      type="button"
                      onClick={() => handleSelect(post)}
                      className="flex w-full flex-col gap-1 px-4 py-3 text-left transition hover:bg-[var(--color-accent-soft)]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                    >
                      <span className="text-sm font-semibold text-strong">
                        {post.title}
                      </span>
                      {post.description ? (
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {post.description}
                        </span>
                      ) : null}
                      {post.date ? (
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {new Date(post.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between border-t border-subtle px-4 py-2 text-xs text-[var(--color-text-muted)]">
              <div>Navigate with ↑ ↓ • Press Enter to open</div>
              <div className="hidden items-center gap-1 sm:flex">
                <kbd className="rounded border border-subtle bg-elevated px-1.5 py-0.5 text-[0.7rem]">
                  ⌘
                </kbd>
                <kbd className="rounded border border-subtle bg-elevated px-1.5 py-0.5 text-[0.7rem]">
                  K
                </kbd>
              </div>
            </div>
          </Surface>
        </div>
      ) : null}
    </SearchContext.Provider>
  );
}

export function SearchTrigger({
  variant = 'desktop',
  className,
}: {
  variant?: 'desktop' | 'mobile' | 'icon';
  className?: string;
}) {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error('SearchTrigger must be used within a SearchProvider');
  }

  const baseClasses =
    variant === 'icon'
      ? 'inline-flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-surface text-[var(--color-text)] shadow-soft transition hover:bg-elevated'
      : buttonClassNames({
          variant: 'ghost',
          size: variant === 'mobile' ? 'lg' : 'md',
          fullWidth: variant === 'mobile',
          className:
            'justify-start border border-subtle bg-surface/80 text-[var(--color-text-muted)] hover:text-strong',
        });

  return (
    <button
      type="button"
      onClick={ctx.open}
      className={cn(baseClasses, className)}
    >
      <Search className="h-4 w-4 text-[var(--color-text-muted)]" aria-hidden />
      {variant !== 'icon' ? (
        <span className="ml-2 text-sm text-[var(--color-text-muted)]">
          Search…
          <span className="hidden sm:inline"> (⌘K)</span>
        </span>
      ) : null}
    </button>
  );
}
