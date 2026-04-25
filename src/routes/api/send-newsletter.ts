import { createHash } from 'node:crypto';
import { createFileRoute } from '@tanstack/react-router';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import { createElement } from 'react';
import NewsletterEmail from '../../emails/newsletter';
import { getBlogPost } from '../../lib/blog';
import type { BlogPost } from '../../lib/blog';
import { getServerBaseUrl } from '../../lib/site.server';

const newsletterSendCacheTtlSeconds = 10 * 60;
const newsletterSendCacheTtlMs = newsletterSendCacheTtlSeconds * 1000;

interface NewsletterSendResult {
  broadcastId: string;
  postsCount: number;
}

interface CachedNewsletterSend {
  expiresAt: number;
  promise: Promise<NewsletterSendResult>;
}

interface NewsletterBroadcastOptions {
  resend: Resend;
  audienceId: string;
  posts: BlogPost[];
  baseUrl: string;
  subject: string;
}

class NewsletterBroadcastError extends Error {
  details: unknown;

  constructor(details: unknown) {
    super('Failed to create broadcast');
    this.details = details;
  }
}

// Resend broadcasts do not expose idempotency, so keep a warm-instance send guard without adding a database.
const newsletterSendCache = new Map<string, CachedNewsletterSend>();

function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isSlugArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function dedupeSlugs(slugs: string[]) {
  const seen = new Set<string>();
  const dedupedSlugs: string[] = [];

  for (const slug of slugs) {
    const normalizedSlug = slug.trim();

    if (seen.has(normalizedSlug)) continue;

    seen.add(normalizedSlug);
    dedupedSlugs.push(normalizedSlug);
  }

  return dedupedSlugs;
}

function getRequestedSlugs(body: Record<string, unknown>) {
  if (Object.hasOwn(body, 'slugs')) {
    return isSlugArray(body.slugs) ? dedupeSlugs(body.slugs) : [];
  }

  if (!Array.isArray(body.posts)) {
    return [];
  }

  const slugs: string[] = [];

  for (const post of body.posts) {
    if (
      typeof post !== 'object' ||
      post === null ||
      !isNonEmptyString((post as { slug?: unknown }).slug)
    ) {
      return [];
    }

    slugs.push((post as { slug: string }).slug);
  }

  return dedupeSlugs(slugs);
}

async function resolveNewsletterPosts(slugs: string[]) {
  const posts = await Promise.all(slugs.map((slug) => getBlogPost(slug)));
  return posts.filter((post) => post !== null);
}

function createNewsletterSendKey(audienceId: string, slugs: string[]) {
  return createHash('sha256')
    .update(JSON.stringify({ audienceId, slugs: [...slugs].sort() }))
    .digest('hex');
}

function pruneExpiredNewsletterSends(now = Date.now()) {
  for (const [sendKey, cachedSend] of newsletterSendCache) {
    if (cachedSend.expiresAt <= now) {
      newsletterSendCache.delete(sendKey);
    }
  }
}

function getCachedNewsletterSend(sendKey: string) {
  pruneExpiredNewsletterSends();
  return newsletterSendCache.get(sendKey)?.promise ?? null;
}

function rememberNewsletterSend(
  sendKey: string,
  promise: Promise<NewsletterSendResult>
) {
  newsletterSendCache.set(sendKey, {
    expiresAt: Date.now() + newsletterSendCacheTtlMs,
    promise,
  });

  return promise;
}

async function createNewsletterBroadcast({
  resend,
  audienceId,
  posts,
  baseUrl,
  subject,
}: NewsletterBroadcastOptions): Promise<NewsletterSendResult> {
  const emailHtml = await render(
    createElement(NewsletterEmail, { posts, baseUrl })
  );

  const createResponse = await resend.broadcasts.create({
    audienceId,
    from: 'Dan Goosewin <dan@goosewin.com>',
    subject,
    html: emailHtml,
    send: true,
  });

  if (createResponse.error) {
    throw new NewsletterBroadcastError(createResponse.error);
  }

  const broadcastId = createResponse.data.id;

  if (!broadcastId) {
    throw new NewsletterBroadcastError('Missing broadcast id from Resend');
  }

  return {
    broadcastId,
    postsCount: posts.length,
  };
}

function createNewsletterErrorResponse(error: unknown, deduped: boolean) {
  if (error instanceof NewsletterBroadcastError) {
    console.error('Error creating broadcast:', error.details);
    return Response.json(
      {
        error: error.message,
        details: error.details,
        deduped,
        retrySafe: true,
        retryAfterSeconds: newsletterSendCacheTtlSeconds,
      },
      { status: 500 }
    );
  }

  console.error('Newsletter error:', error);
  return Response.json(
    {
      error: 'Failed to send newsletter',
      deduped,
      retrySafe: true,
      retryAfterSeconds: newsletterSendCacheTtlSeconds,
    },
    { status: 500 }
  );
}

export const Route = createFileRoute('/api/send-newsletter')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get('authorization');
          const newsletterSecret = process.env.NEWSLETTER_SECRET;

          if (!newsletterSecret) {
            console.error('NEWSLETTER_SECRET environment variable is not set');
            return Response.json(
              { error: 'Newsletter service not configured' },
              { status: 500 }
            );
          }

          const expectedAuth = `Bearer ${newsletterSecret}`;

          if (!authHeader || authHeader !== expectedAuth) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
          }

          let body: unknown;

          try {
            body = await request.json();
          } catch {
            return Response.json({ error: 'Invalid JSON' }, { status: 400 });
          }

          if (typeof body !== 'object' || body === null) {
            return Response.json(
              { error: 'Invalid request body' },
              { status: 400 }
            );
          }

          const requestedSlugs = getRequestedSlugs(
            body as Record<string, unknown>
          );

          if (requestedSlugs.length === 0) {
            return Response.json(
              { error: 'No posts provided' },
              { status: 400 }
            );
          }

          const posts = await resolveNewsletterPosts(requestedSlugs);

          if (posts.length !== requestedSlugs.length) {
            return Response.json(
              { error: 'One or more posts could not be found' },
              { status: 400 }
            );
          }

          const apiKey = process.env.RESEND_API_KEY;
          const audienceId = process.env.RESEND_AUDIENCE_ID;

          if (!apiKey || !audienceId) {
            console.error('Resend newsletter environment is not configured');
            return Response.json(
              { error: 'Newsletter service not configured' },
              { status: 500 }
            );
          }

          const resend = new Resend(apiKey);
          const baseUrl = getServerBaseUrl();
          const subject =
            posts.length === 1
              ? `New post: ${posts[0].title}`
              : `${posts.length} new posts from Dan's blog`;
          const sendKey = createNewsletterSendKey(audienceId, requestedSlugs);
          const cachedSend = getCachedNewsletterSend(sendKey);
          const deduped = cachedSend !== null;

          let sendResult: NewsletterSendResult;

          try {
            sendResult = await (cachedSend ??
              rememberNewsletterSend(
                sendKey,
                createNewsletterBroadcast({
                  resend,
                  audienceId,
                  posts,
                  baseUrl,
                  subject,
                })
              ));
          } catch (error) {
            return createNewsletterErrorResponse(error, deduped);
          }

          return Response.json(
            {
              message: 'Newsletter broadcast sent successfully',
              broadcastId: sendResult.broadcastId,
              postsCount: sendResult.postsCount,
              deduped,
            },
            { status: 200 }
          );
        } catch (error) {
          console.error('Newsletter error:', error);
          return Response.json(
            { error: 'Failed to send newsletter' },
            { status: 500 }
          );
        }
      },
    },
  },
});
