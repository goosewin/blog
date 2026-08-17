import { createSiteOgImageResponse } from '#/lib/og-image.server';

// A route handler rather than Next's `opengraph-image` file convention so the
// public URL stays `/opengraph-image` without a generated hash query.
export const dynamic = 'force-static';

export async function GET() {
  return createSiteOgImageResponse();
}
