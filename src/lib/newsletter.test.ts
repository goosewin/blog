import { describe, expect, it } from 'vitest';
import {
  dedupeSlugs,
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
        slugs: ['leaving-san-francisco', ' leaving-san-francisco '],
      })
    ).toEqual(['leaving-san-francisco']);
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
});
