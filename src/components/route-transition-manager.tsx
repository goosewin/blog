'use client';

import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { getTransitionDirection } from '../lib/route-transition';

export default function RouteTransitionManager() {
  const router = useRouter();

  useEffect(() => {
    let cleanupTimer: number | undefined;
    const root = document.documentElement;
    const clearCleanupTimer = () => {
      if (cleanupTimer !== undefined) {
        window.clearTimeout(cleanupTimer);
        cleanupTimer = undefined;
      }
    };

    const unsubscribe = router.subscribe('onBeforeNavigate', (event) => {
      if (!event.pathChanged) return;

      clearCleanupTimer();

      const direction = getTransitionDirection({
        fromIndex: event.fromLocation?.state.__TSR_index,
        toIndex: event.toLocation.state.__TSR_index,
      });

      if (typeof document.startViewTransition === 'function') {
        root.dataset.routeTransition = direction;
      } else {
        root.dataset.routeTransitionFallback = direction;
      }
    });

    const unsubscribeResolved = router.subscribe('onResolved', () => {
      clearCleanupTimer();
      cleanupTimer = window.setTimeout(() => {
        delete root.dataset.routeTransition;
        delete root.dataset.routeTransitionFallback;
      }, 500);
    });

    return () => {
      clearCleanupTimer();
      unsubscribe();
      unsubscribeResolved();
    };
  }, [router]);

  return null;
}
