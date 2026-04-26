import { getPublicBaseUrl, normalizeBaseUrl } from './site';

export const EMAIL_FROM = 'Dan Goosewin <dan@goosewin.com>';

export function getServerBaseUrl() {
  const siteUrl = process.env.SITE_URL?.trim();
  const baseUrl = siteUrl ? siteUrl : getPublicBaseUrl();
  return normalizeBaseUrl(baseUrl);
}
