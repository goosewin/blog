'use client';

import { track } from '@vercel/analytics';
import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import type { LinkItem } from './links';

interface LinksClientProps {
  links: LinkItem[];
}

function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.startsWith('www.') ? domain.slice(4) : domain;
  } catch {
    return url;
  }
}

function readUtmParams(query: string): Record<string, string> {
  const params = new URLSearchParams(query);
  const payload: Record<string, string> = {};

  const source = params.get('utm_source')?.trim();
  const medium = params.get('utm_medium')?.trim();
  const content = params.get('utm_content')?.trim();

  if (source) payload.utm_source = source;
  if (medium) payload.utm_medium = medium;
  if (content) payload.utm_content = content;

  return payload;
}

export default function LinksClient({ links }: LinksClientProps) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const utmPayload = useMemo(() => readUtmParams(query), [query]);
  const lastTrackedQuery = useRef<string | null>(null);

  useEffect(() => {
    if (lastTrackedQuery.current === query) return;
    lastTrackedQuery.current = query;
    track('links_view', utmPayload);
  }, [query, utmPayload]);

  return (
    <div className="space-y-6">
      {links.map((link) => (
        <div
          key={link.url}
          className="border-t border-gray-200 dark:border-gray-700 pt-6 first:border-t-0 first:pt-0"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
            <h2 className="text-xl font-semibold mb-2 sm:mb-0">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                onClick={() =>
                  track('links_click', {
                    ...utmPayload,
                    link_url: link.url,
                    link_label: link.title,
                  })
                }
              >
                {link.title}
              </a>
            </h2>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 dark:text-gray-400 hover:opacity-80 transition-opacity"
              onClick={() =>
                track('links_click', {
                  ...utmPayload,
                  link_url: link.url,
                  link_label: link.title,
                })
              }
            >
              {extractDomain(link.url)}
            </a>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{link.description}</p>
        </div>
      ))}
    </div>
  );
}
