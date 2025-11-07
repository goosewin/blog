'use client';

import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/app/components/ui/button';
import { Surface } from '@/app/components/ui/surface';
import { cn } from '@/lib/utils';

const INTEREST_OPTIONS = [
  { id: 'devrel', label: 'Developer relations' },
  { id: 'partnerships', label: 'Strategic partnerships' },
  { id: 'product', label: 'Product building' },
  { id: 'growth', label: 'Growth experiments' },
  { id: 'ai', label: 'Voice AI & automation' },
];

type Status = 'idle' | 'saving' | 'saved' | 'error';

export function NewsletterPreferencesForm() {
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    let cancelled = false;
    const loadPreferences = async () => {
      try {
        const response = await fetch('/api/preferences', { cache: 'no-store' });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (!cancelled && Array.isArray(data?.interests)) {
          setInterests(data.interests);
        }
      } catch {
        // ignore
      }
    };

    loadPreferences();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleInterest = (id: string) => {
    setStatus('idle');
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('saving');
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interests }),
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
      setStatus('saved');
    } catch (error) {
      console.error('Failed to save preferences', error);
      setStatus('error');
    }
  };

  const helperText = useMemo(() => {
    switch (status) {
      case 'saving':
        return 'Saving your preferences…';
      case 'saved':
        return 'Saved! Expect more of what you picked.';
      case 'error':
        return 'Something went wrong. Please try again.';
      default:
        return 'Pick topics you want more of in your inbox.';
    }
  }, [status]);

  return (
    <Surface variant="muted" className="space-y-4 p-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-strong">
          Personalize the newsletter
        </h3>
        <p className="text-sm text-[var(--color-text-muted)]">{helperText}</p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((option) => {
            const isActive = interests.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleInterest(option.id)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
                  isActive
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]/60 text-strong'
                    : 'border-subtle text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/60 hover:text-strong'
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-[var(--color-text-muted)]">
            Your selections are stored locally so future issues focus on them.
          </span>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={status === 'saving'}
          >
            {status === 'saving' ? 'Saving…' : 'Save preferences'}
          </Button>
        </div>
      </form>
    </Surface>
  );
}
