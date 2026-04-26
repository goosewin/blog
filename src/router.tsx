import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { getTransitionDirection } from './lib/route-transition';

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultViewTransition: {
      types: ({ fromLocation, toLocation, pathChanged }) => {
        if (!pathChanged) return false;

        const direction = getTransitionDirection({
          fromIndex: fromLocation?.state.__TSR_index,
          toIndex: toLocation.state.__TSR_index,
        });

        return [`route-${direction}`];
      },
    },
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
