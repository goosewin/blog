import { createFileRoute } from '@tanstack/react-router';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import { createElement } from 'react';
import NewsletterEmail from '../../emails/newsletter';
import { getBlogPost } from '../../lib/blog';
import { EMAIL_FROM, getServerBaseUrl } from '../../lib/site.server';

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

          const posts = await Promise.all(
            requestedSlugs.map((slug) => getBlogPost(slug))
          );

          if (posts.some((post) => post === null)) {
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

          const resolvedPosts = posts.filter((post) => post !== null);
          const baseUrl = getServerBaseUrl();
          const subject =
            resolvedPosts.length === 1
              ? `New post: ${resolvedPosts[0].title}`
              : `${resolvedPosts.length} new posts from Dan's blog`;
          const emailHtml = await render(
            createElement(NewsletterEmail, { posts: resolvedPosts, baseUrl })
          );

          const resend = new Resend(apiKey);
          const createResponse = await resend.broadcasts.create({
            audienceId,
            from: EMAIL_FROM,
            subject,
            html: emailHtml,
            send: true,
          });

          if (createResponse.error) {
            console.error('Error creating broadcast:', createResponse.error);
            return Response.json(
              {
                error: 'Failed to create broadcast',
                details: createResponse.error,
                retrySafe: false,
              },
              { status: 500 }
            );
          }

          const broadcastId = createResponse.data.id;

          if (!broadcastId) {
            return Response.json(
              {
                error: 'Failed to create broadcast',
                details: 'Missing broadcast id from Resend',
                retrySafe: false,
              },
              { status: 500 }
            );
          }

          return Response.json(
            {
              message: 'Newsletter broadcast sent successfully',
              broadcastId,
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
      },
    },
  },
});
