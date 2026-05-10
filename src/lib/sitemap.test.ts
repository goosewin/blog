import { describe, expect, it } from 'vitest';
import { getAllBlogPosts } from './blog';
import { buildSitemapXml } from './sitemap';

describe('sitemap generation', () => {
  it('includes all canonical pages and every MDX post', async () => {
    const posts = await getAllBlogPosts();
    const xml = buildSitemapXml({ baseUrl: 'https://goose.dev/', posts });

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<loc>https://goose.dev</loc>');
    expect(xml).toContain('<loc>https://goose.dev/about</loc>');
    expect(xml).toContain('<loc>https://goose.dev/blog</loc>');
    expect(xml).toContain('<loc>https://goose.dev/partners</loc>');

    for (const post of posts) {
      expect(xml).toContain(`<loc>https://goose.dev/blog/${post.slug}</loc>`);
    }

    expect(xml).not.toContain('goosewin.com');
  });
});
