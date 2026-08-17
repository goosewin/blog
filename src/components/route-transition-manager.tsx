'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getTransitionDirection } from '../lib/route-transition';

const CLEANUP_DELAY_MS = 500;

// The App Router does not expose a history index the way TanStack Router's
// `__TSR_index` did, so stamp one onto each history entry. Entries created by a
// push keep their index across back/forward, which is what tells the two apart.
const HISTORY_INDEX_KEY = '__blogRouteIndex';

function readHistoryIndex(): number | undefined {
  const state: unknown = window.history.state;
  if (typeof state !== 'object' || state === null) return undefined;

  const index = (state as Record<string, unknown>)[HISTORY_INDEX_KEY];
  return typeof index === 'number' ? index : undefined;
}

function writeHistoryIndex(index: number) {
  const state: unknown = window.history.state;
  const nextState =
    typeof state === 'object' && state !== null
      ? { ...(state as Record<string, unknown>), [HISTORY_INDEX_KEY]: index }
      : { [HISTORY_INDEX_KEY]: index };

  window.history.replaceState(nextState, '');
}

export default function RouteTransitionManager() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);
  const previousIndex = useRef<number | undefined>(undefined);
  const highestIndex = useRef(0);

  useEffect(() => {
    const isFirstCommit = previousPathname.current === null;
    const pathChanged = previousPathname.current !== pathname;
    previousPathname.current = pathname;

    // Next replaces `history.state` on navigation, so a missing index means
    // this entry was just pushed rather than revisited.
    let index = readHistoryIndex();
    if (index === undefined) {
      index = isFirstCommit ? 0 : highestIndex.current + 1;
      writeHistoryIndex(index);
    }

    highestIndex.current = Math.max(highestIndex.current, index);

    const fromIndex = previousIndex.current;
    previousIndex.current = index;

    if (isFirstCommit || !pathChanged) return;

    const direction = getTransitionDirection({ fromIndex, toIndex: index });
    const root = document.documentElement;
    root.dataset.routeTransition = direction;
    root.dataset.routeTransitionFallback = direction;

    const cleanupTimer = window.setTimeout(() => {
      delete root.dataset.routeTransition;
      delete root.dataset.routeTransitionFallback;
    }, CLEANUP_DELAY_MS);

    return () => {
      window.clearTimeout(cleanupTimer);
      delete root.dataset.routeTransition;
      delete root.dataset.routeTransitionFallback;
    };
  }, [pathname]);

  return null;
}
