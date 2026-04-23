import { getPublicBaseUrl, normalizeBaseUrl } from './site';

export function getServerBaseUrl() {
  const baseUrl = process.env.SITE_URL || getPublicBaseUrl();
  return normalizeBaseUrl(baseUrl);
}
