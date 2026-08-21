import { describe, expect, it } from 'vite-plus/test';
import {
  dedupeSlugs,
  getNewsletterRequestId,
  getRequestedNewsletterSlugs,
  isNewsletterDryRun,
} from './newsletter';

describe('newsletter validation', () => {
  it('trims and deduplicates requested slugs', () => {
    expect(dedupeSlugs([' first ', 'second', 'first'])).toEqual([
      'first',
      'second',
    ]);
  });

  it('accepts current slugs payloads and legacy posts payloads', () => {
    expect(
      getRequestedNewsletterSlugs({
        slugs: ['first-post', ' first-post '],
      })
    ).toEqual(['first-post']);
    expect(
      getRequestedNewsletterSlugs({
        posts: [{ slug: 'devrel-the-goose-way' }],
      })
    ).toEqual(['devrel-the-goose-way']);
  });

  it('rejects malformed post payloads and detects dry runs', () => {
    expect(getRequestedNewsletterSlugs({ slugs: ['valid', ''] })).toEqual([]);
    expect(getRequestedNewsletterSlugs({ posts: [{ slug: '' }] })).toEqual([]);
    expect(isNewsletterDryRun({ dryRun: true })).toBe(true);
    expect(isNewsletterDryRun({ dryRun: 'true' })).toBe(false);
  });

  it('reads a request ID from the body or the idempotency header', () => {
    expect(
      getNewsletterRequestId({
        body: { requestId: ' send-1 ' },
        headerValue: 'header-id',
      })
    ).toBe('send-1');
    expect(
      getNewsletterRequestId({
        body: {},
        headerValue: ' header-id ',
      })
    ).toBe('header-id');
    expect(getNewsletterRequestId({ body: {}, headerValue: null })).toBeNull();
  });
});
