import type { Metadata } from 'next';

export const SITE_NAME = 'Dan Goosewin';
export const SITE_DESCRIPTION =
  'Dan Goosewin builds AI-native systems and publishes signal-first writing on software, execution, and leverage.';
const DEFAULT_PUBLIC_BASE_URL = 'https://www.goose.dev';

export function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.trim().replace(/\/+$/, '');
}

export function getPublicBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_PUBLIC_BASE_URL;
  return normalizeBaseUrl(baseUrl);
}

export function createPageOpenGraph({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): NonNullable<Metadata['openGraph']> {
  const baseUrl = getPublicBaseUrl();

  return {
    type: 'website',
    locale: 'en_US',
    url: `${baseUrl}${path}`,
    siteName: SITE_NAME,
    title,
    description,
    images: [`${baseUrl}/opengraph-image`],
  };
}
