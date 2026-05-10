import type { BlogPost } from './blog';
import { normalizeBaseUrl } from './site';

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: 'daily' | 'weekly' | 'monthly';
  priority?: number;
}

const staticEntries: SitemapEntry[] = [
  { path: '/', changefreq: 'weekly', priority: 1 },
  { path: '/about', changefreq: 'monthly', priority: 0.7 },
  { path: '/blog', changefreq: 'weekly', priority: 0.9 },
  { path: '/partners', changefreq: 'monthly', priority: 0.7 },
];

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function normalizePath(path: string) {
  return path === '/' ? '' : path;
}

function dateOnlyToLastmod(date: string) {
  return `${date}T00:00:00.000Z`;
}

function renderEntry(baseUrl: string, entry: SitemapEntry) {
  const loc = `${baseUrl}${normalizePath(entry.path)}`;
  const parts = [`<loc>${escapeXml(loc)}</loc>`];

  if (entry.lastmod) {
    parts.push(`<lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
  }

  if (entry.changefreq) {
    parts.push(`<changefreq>${entry.changefreq}</changefreq>`);
  }

  if (entry.priority !== undefined) {
    parts.push(`<priority>${entry.priority.toFixed(1)}</priority>`);
  }

  return `<url>${parts.join('')}</url>`;
}

export function buildSitemapXml({
  baseUrl,
  posts,
}: {
  baseUrl: string;
  posts: BlogPost[];
}) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const postEntries = posts.map((post): SitemapEntry => {
    return {
      path: `/blog/${post.slug}`,
      lastmod: dateOnlyToLastmod(post.date),
      changefreq: 'monthly',
      priority: 0.8,
    };
  });
  const entries = [...staticEntries, ...postEntries];
  const urls = entries.map((entry) => renderEntry(normalizedBaseUrl, entry));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
  ].join('\n');
}
