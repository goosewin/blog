import { createFileRoute } from '@tanstack/react-router';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import { createElement } from 'react';
import NewsletterEmail from '../../emails/newsletter';
import { getBlogPost } from '../../lib/blog';
import { getServerBaseUrl } from '../../lib/site.server';

function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isSlugArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function getRequestedSlugs(body: Record<string, unknown>) {
  if (isSlugArray(body.slugs)) {
    return body.slugs;
  }

  if (!Array.isArray(body.posts)) {
    return [];
  }

  return body.posts
    .map((post) =>
      typeof post === 'object' &&
      post !== null &&
      isNonEmptyString((post as { slug?: unknown }).slug)
        ? (post as { slug: string }).slug
        : null
    )
    .filter((slug): slug is string => slug !== null);
}

async function resolveNewsletterPosts(slugs: string[]) {
  const posts = await Promise.all(slugs.map((slug) => getBlogPost(slug)));
  return posts.filter((post) => post !== null);
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
            console.error('Error creating broadcast:', createResponse.error);
            return Response.json(
              {
                error: 'Failed to create broadcast',
                details: createResponse.error,
              },
              { status: 500 }
            );
          }

          const broadcastId = createResponse.data.id;

          return Response.json(
            {
              message: 'Newsletter broadcast sent successfully',
              broadcastId,
              postsCount: posts.length,
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
