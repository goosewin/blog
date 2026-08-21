export const UNPUBLISHED_BLOG_SLUGS = ['leaving-san-francisco'] as const;

export function goneResponse(): Response {
  return new Response('Gone', {
    status: 410,
    headers: {
      'cache-control': 'public, max-age=0, must-revalidate',
      'content-type': 'text/plain; charset=utf-8',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}
