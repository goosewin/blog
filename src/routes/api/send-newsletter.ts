import { Buffer } from 'node:buffer';
import { createHash, timingSafeEqual } from 'node:crypto';
import { mkdir, open, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
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
const newsletterSendLockWaitMs = 30 * 1000;
const newsletterSendLockPollMs = 100;

interface NewsletterSendResult {
  broadcastId: string;
  postsCount: number;
}

interface StoredNewsletterSend {
  expiresAt: number;
  result: NewsletterSendResult;
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

function getNewsletterSendCacheDir() {
  return (
    process.env.NEWSLETTER_SEND_CACHE_DIR ??
    join(tmpdir(), 'goosewin-blog-newsletter-sends')
  );
}

function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isSlugArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function isExpectedAuthHeader(authHeader: string | null, expectedAuth: string) {
  if (!authHeader) return false;

  const authHeaderBuffer = Buffer.from(authHeader);
  const expectedAuthBuffer = Buffer.from(expectedAuth);

  if (authHeaderBuffer.length !== expectedAuthBuffer.length) {
    timingSafeEqual(
      Buffer.alloc(expectedAuthBuffer.length),
      expectedAuthBuffer
    );
    return false;
  }

  return timingSafeEqual(authHeaderBuffer, expectedAuthBuffer);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error;
}

function isNewsletterSendResult(value: unknown): value is NewsletterSendResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    isNonEmptyString((value as { broadcastId?: unknown }).broadcastId) &&
    typeof (value as { postsCount?: unknown }).postsCount === 'number'
  );
}

function isStoredNewsletterSend(value: unknown): value is StoredNewsletterSend {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { expiresAt?: unknown }).expiresAt === 'number' &&
    isNewsletterSendResult((value as { result?: unknown }).result)
  );
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

function getNewsletterSendPaths(sendKey: string) {
  const cacheDir = getNewsletterSendCacheDir();
  return {
    cacheDir,
    lockPath: join(cacheDir, `${sendKey}.lock`),
    statePath: join(cacheDir, `${sendKey}.json`),
  };
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

async function getStoredNewsletterSend(sendKey: string) {
  const { statePath } = getNewsletterSendPaths(sendKey);

  try {
    const state = JSON.parse(await readFile(statePath, 'utf8')) as unknown;

    if (!isStoredNewsletterSend(state)) {
      await rm(statePath, { force: true });
      return null;
    }

    if (state.expiresAt <= Date.now()) {
      await rm(statePath, { force: true });
      return null;
    }

    return state.result;
  } catch {
    return null;
  }
}

async function rememberStoredNewsletterSend(
  sendKey: string,
  result: NewsletterSendResult
) {
  const { cacheDir, statePath } = getNewsletterSendPaths(sendKey);
  const temporaryStatePath = `${statePath}.${process.pid}.${Date.now()}.tmp`;

  try {
    await mkdir(cacheDir, { recursive: true });
    await writeFile(
      temporaryStatePath,
      JSON.stringify({
        expiresAt: Date.now() + newsletterSendCacheTtlMs,
        result,
      }),
      'utf8'
    );
    await rename(temporaryStatePath, statePath);
  } catch (error) {
    await rm(temporaryStatePath, { force: true });
    console.warn('Unable to persist newsletter send cache:', error);
  }
}

async function isNewsletterSendLockActive(lockPath: string) {
  try {
    const expiresAt = Number(await readFile(lockPath, 'utf8'));

    if (Number.isFinite(expiresAt) && expiresAt <= Date.now()) {
      await rm(lockPath, { force: true });
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

async function tryAcquireNewsletterSendLock(sendKey: string) {
  const { cacheDir, lockPath } = getNewsletterSendPaths(sendKey);

  try {
    await mkdir(cacheDir, { recursive: true });
  } catch (error) {
    console.warn('Unable to prepare newsletter send cache:', error);
    return true;
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const lock = await open(lockPath, 'wx');

      try {
        await lock.writeFile(String(Date.now() + newsletterSendCacheTtlMs));
      } finally {
        await lock.close();
      }

      return true;
    } catch (error) {
      if (isNodeError(error) && error.code === 'EEXIST') {
        if (await isNewsletterSendLockActive(lockPath)) {
          return false;
        }

        continue;
      }

      console.warn('Unable to acquire newsletter send lock:', error);
      return true;
    }
  }

  return false;
}

async function releaseNewsletterSendLock(sendKey: string) {
  const { lockPath } = getNewsletterSendPaths(sendKey);

  try {
    await rm(lockPath, { force: true });
  } catch (error) {
    console.warn('Unable to release newsletter send lock:', error);
  }
}

async function waitForStoredNewsletterSend(sendKey: string) {
  const { lockPath } = getNewsletterSendPaths(sendKey);
  const deadline = Date.now() + newsletterSendLockWaitMs;

  while (Date.now() < deadline) {
    const storedSend = await getStoredNewsletterSend(sendKey);
    if (storedSend) return storedSend;

    if (!(await isNewsletterSendLockActive(lockPath))) {
      return null;
    }

    await sleep(newsletterSendLockPollMs);
  }

  return null;
}

function rememberNewsletterSend(
  sendKey: string,
  promise: Promise<NewsletterSendResult>
) {
  promise.catch(() => {
    const cachedSend = newsletterSendCache.get(sendKey);
    if (cachedSend?.promise === promise) {
      newsletterSendCache.delete(sendKey);
    }
  });

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

function createNewsletterSuccessResponse(
  sendResult: NewsletterSendResult,
  deduped: boolean
) {
  return Response.json(
    {
      message: 'Newsletter broadcast sent successfully',
      broadcastId: sendResult.broadcastId,
      postsCount: sendResult.postsCount,
      deduped,
    },
    { status: 200 }
  );
}

function createNewsletterErrorResponse(error: unknown, deduped: boolean) {
  if (error instanceof NewsletterBroadcastError) {
    console.error('Error creating broadcast:', error.details);
    return Response.json(
      {
        error: error.message,
        details: error.details,
        deduped,
        retrySafe: false,
      },
      { status: 500 }
    );
  }

  console.error('Newsletter error:', error);
  return Response.json(
    {
      error: 'Failed to send newsletter',
      deduped,
      retrySafe: false,
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

          if (!isExpectedAuthHeader(authHeader, expectedAuth)) {
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
              { error: 'One or more posts could not be found.' },
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
          const storedSend = await getStoredNewsletterSend(sendKey);

          if (storedSend) {
            return createNewsletterSuccessResponse(storedSend, true);
          }

          const cachedSend = getCachedNewsletterSend(sendKey);

          if (cachedSend) {
            try {
              const sendResult = await cachedSend;
              return createNewsletterSuccessResponse(sendResult, true);
            } catch (error) {
              return createNewsletterErrorResponse(error, true);
            }
          }

          const lockAcquired = await tryAcquireNewsletterSendLock(sendKey);

          if (!lockAcquired) {
            const lockedSend = await waitForStoredNewsletterSend(sendKey);

            if (lockedSend) {
              return createNewsletterSuccessResponse(lockedSend, true);
            }

            return Response.json(
              {
                error: 'Newsletter send already in progress',
                deduped: true,
                retrySafe: true,
                retryAfterSeconds: 1,
              },
              { status: 409 }
            );
          }

          try {
            const sendResult = await rememberNewsletterSend(
              sendKey,
              createNewsletterBroadcast({
                resend,
                audienceId,
                posts,
                baseUrl,
                subject,
              })
            );

            await rememberStoredNewsletterSend(sendKey, sendResult);
            return createNewsletterSuccessResponse(sendResult, false);
          } catch (error) {
            return createNewsletterErrorResponse(error, false);
          } finally {
            await releaseNewsletterSendLock(sendKey);
          }
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
