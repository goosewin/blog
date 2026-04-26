import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/opengraph-image')({
  server: {
    handlers: {
      GET: async () => {
        const { createSiteOgImageResponse } =
          await import('../lib/og-image.server');

        return createSiteOgImageResponse();
      },
    },
  },
});
