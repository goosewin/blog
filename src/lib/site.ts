export const SITE_NAME = 'Dan Goosewin';
export const SITE_DESCRIPTION =
  'Dan Goosewin builds AI-native systems and publishes signal-first writing on software, execution, and leverage.';
export const DEFAULT_PUBLIC_BASE_URL = 'https://goose.dev';

export function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.trim().replace(/\/+$/, '');
}

export function getPublicBaseUrl() {
  const baseUrl =
    import.meta.env.VITE_PUBLIC_BASE_URL || DEFAULT_PUBLIC_BASE_URL;
  return normalizeBaseUrl(baseUrl);
}
