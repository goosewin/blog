import { createElement } from 'react';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import NewsletterEmail from '#/emails/newsletter';
import { getBlogPost } from '#/lib/blog';
import {
  getNewsletterRequestId,
  getRequestedNewsletterSlugs,
  isNewsletterDryRun,
} from '#/lib/newsletter';
import {
  findBroadcastIdByName,
  runExclusiveNewsletterOperation,
} from '#/lib/newsletter-operations';
import type { ResendRequestOptions } from '#/lib/resend-request';
import { EMAIL_FROM, getServerBaseUrl } from '#/lib/site.server';

export async function POST(request: Request) {
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

    if (authHeader !== expectedAuth) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (typeof body !== 'object' || body === null) {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const requestBody = body as Record<string, unknown>;
    const requestedSlugs = getRequestedNewsletterSlugs(requestBody);
    const dryRun = isNewsletterDryRun(requestBody);

    if (requestedSlugs.length === 0) {
      return Response.json({ error: 'No posts provided' }, { status: 400 });
    }

    const posts = await Promise.all(
      requestedSlugs.map((slug) => getBlogPost(slug))
    );

    if (posts.some((post) => post === null)) {
      return Response.json(
        { error: 'One or more posts could not be found.' },
        { status: 400 }
      );
    }

    const resolvedPosts = posts.filter((post) => post !== null);
    const baseUrl = getServerBaseUrl();
    const subject =
      resolvedPosts.length === 1
        ? `New post: ${resolvedPosts[0].title}`
        : `${resolvedPosts.length} new posts from Dan's blog`;
    const emailHtml = await render(
      createElement(NewsletterEmail, { posts: resolvedPosts, baseUrl })
    );

    if (dryRun) {
      return Response.json(
        {
          message: 'Newsletter dry run successful',
          postsCount: resolvedPosts.length,
          slugs: requestedSlugs,
          subject,
          htmlLength: emailHtml.length,
        },
        { status: 200 }
      );
    }

    const requestId = getNewsletterRequestId({
      body: requestBody,
      headerValue: request.headers.get('idempotency-key'),
    });

    if (!requestId) {
      return Response.json(
        { error: 'requestId is required', retrySafe: true },
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
    const sendResult = await runExclusiveNewsletterOperation(
      requestId,
      async () => {
        const existingBroadcastId = await findBroadcastIdByName(
          async (cursor) => {
            const listed = await resend.broadcasts.list(
              cursor ? { after: cursor, limit: 100 } : { limit: 100 }
            );

            if (listed.error || !listed.data) {
              throw new Error('Failed to list broadcasts');
            }

            return {
              items: listed.data.data.map((item) => ({
                id: item.id,
                name: item.name,
              })),
              hasMore: listed.data.has_more,
            };
          },
          requestId
        );

        if (existingBroadcastId) {
          return { broadcastId: existingBroadcastId, reused: true };
        }

        const createOptions: ResendRequestOptions = {
          idempotencyKey: requestId,
        };
        const createResponse = await resend.broadcasts.create(
          {
            audienceId,
            from: EMAIL_FROM,
            subject,
            html: emailHtml,
            name: requestId,
            send: true,
          },
          createOptions
        );

        if (createResponse.error) {
          throw new Error('Failed to create broadcast');
        }

        const broadcastId = createResponse.data.id;

        if (!broadcastId) {
          throw new Error('Missing broadcast id from Resend');
        }

        return { broadcastId, reused: false };
      }
    );

    return Response.json(
      {
        message: sendResult.reused
          ? 'Newsletter broadcast already sent'
          : 'Newsletter broadcast sent successfully',
        broadcastId: sendResult.broadcastId,
        postsCount: resolvedPosts.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter error:', error);
    return Response.json(
      { error: 'Failed to send newsletter', retrySafe: false },
      { status: 500 }
    );
  }
}
