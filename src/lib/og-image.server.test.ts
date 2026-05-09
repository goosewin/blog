import { describe, expect, it, vi } from 'vitest';
import { getBlogPost } from './blog';
import {
  createBlogPostOgImageResponse,
  createSiteOgImageResponse,
} from './og-image.server';

const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];

vi.mock('@vercel/og', () => {
  class ImageResponse extends Response {
    constructor(..._args: unknown[]) {
      super(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1]), {
        headers: {
          'content-type': 'image/png',
          'cache-control': 'no-cache, no-store',
        },
      });
    }
  }

  return { ImageResponse };
});

async function expectPngResponse(response: Response) {
  expect(response.headers.get('content-type')).toBe('image/png');

  const body = new Uint8Array(await response.arrayBuffer());
  expect(body.length).toBeGreaterThan(0);
  expect(Number(response.headers.get('content-length'))).toBe(body.length);
  expect(Array.from(body.slice(0, pngSignature.length))).toEqual(pngSignature);
}

describe('Open Graph image generation', () => {
  it('returns materialized PNG bytes for the site image', async () => {
    await expectPngResponse(await createSiteOgImageResponse());
  });

  it('returns materialized PNG bytes for a blog post image', async () => {
    const post = await getBlogPost('leaving-san-francisco');

    await expectPngResponse(await createBlogPostOgImageResponse(post));
  });
});
