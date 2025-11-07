'use client';

import { startTransition, useEffect, useState } from 'react';

import { slugify } from '@/lib/utils';

export interface HeadingEntry {
  id: string;
  text: string;
  level: number;
  offsetTop: number;
}

export function useHeadings(targetSelector: string) {
  const [headings, setHeadings] = useState<HeadingEntry[]>([]);

  useEffect(() => {
    const container = document.querySelector(targetSelector);
    if (!container) {
      return;
    }

    const nodes = Array.from(
      container.querySelectorAll<HTMLHeadingElement>('h2, h3')
    );
    const entries = nodes.map((node, index) => {
      if (!node.id) {
        const generated = slugify(node.textContent ?? '') || `heading-${index}`;
        node.id = generated;
      }

      return {
        id: node.id,
        text: node.textContent ?? '',
        level: node.tagName.toLowerCase() === 'h3' ? 3 : 2,
        offsetTop: node.getBoundingClientRect().top + window.scrollY,
      } as HeadingEntry;
    });

    startTransition(() => setHeadings(entries));

    const handleResize = () => {
      startTransition(() =>
        setHeadings((prev) =>
          prev.map((entry, idx) => {
            const element = document.getElementById(entry.id);
            if (!element) {
              const fallback = nodes[idx];
              return {
                ...entry,
                offsetTop: fallback
                  ? fallback.getBoundingClientRect().top + window.scrollY
                  : entry.offsetTop,
              };
            }

            return {
              ...entry,
              offsetTop: element.getBoundingClientRect().top + window.scrollY,
            };
          })
        )
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [targetSelector]);

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      const topLevelHeadings = headings.filter(
        (heading) => heading.level === 2
      );
      const source = topLevelHeadings.length > 0 ? topLevelHeadings : headings;

      const sorted = [...source].sort((a, b) => a.offsetTop - b.offsetTop);
      const current = sorted.reduce<HeadingEntry | null>((acc, heading) => {
        if (heading.offsetTop <= scrollPosition) {
          return heading;
        }
        return acc;
      }, null);

      setActiveId(current?.id ?? sorted[0].id);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  return { headings, activeId } as const;
}
