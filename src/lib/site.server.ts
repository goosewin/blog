import { getPublicBaseUrl, normalizeBaseUrl } from './site';

export function getServerBaseUrl() {
  const siteUrl = process.env.SITE_URL?.trim();
  const baseUrl = siteUrl ? siteUrl : getPublicBaseUrl();
  return normalizeBaseUrl(baseUrl);
}
