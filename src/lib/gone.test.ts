import { describe, expect, it } from 'vite-plus/test';
import { UNPUBLISHED_BLOG_SLUGS, goneResponse } from './gone';

describe('gone responses', () => {
  it('unpublishes leaving-san-francisco with a 410 and noindex', async () => {
    expect([...UNPUBLISHED_BLOG_SLUGS]).toEqual(['leaving-san-francisco']);

    const response = goneResponse();

    expect(response.status).toBe(410);
    expect(response.headers.get('content-type')).toBe(
      'text/plain; charset=utf-8'
    );
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
    expect(response.headers.get('cache-control')).toContain('must-revalidate');
    await expect(response.text()).resolves.toBe('Gone');
  });
});
