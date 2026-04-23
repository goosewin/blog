import { createFileRoute } from '@tanstack/react-router';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import { createElement } from 'react';
import WelcomeEmail from '../../emails/welcome';
import { getServerBaseUrl } from '../../lib/site.server';

function getEmailFromBody(body: unknown) {
  if (typeof body !== 'object' || body === null || !('email' in body)) {
    return null;
  }

  const email = body.email;
  return typeof email === 'string' ? email.trim() : null;
}

export const Route = createFileRoute('/api/subscribe')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          let body: unknown;

          try {
            body = await request.json();
          } catch {
            return Response.json({ error: 'Invalid JSON' }, { status: 400 });
          }

          const email = getEmailFromBody(body);

          if (!email) {
            return Response.json(
              { error: 'Email is required' },
              { status: 400 }
            );
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            return Response.json(
              { error: 'Invalid email format' },
              { status: 400 }
            );
          }

          const apiKey = process.env.RESEND_API_KEY;
          const audienceId = process.env.RESEND_AUDIENCE_ID;

          if (!apiKey || !audienceId) {
            console.error('Resend subscription environment is not configured');
            return Response.json(
              { error: 'Subscription service not configured' },
              { status: 500 }
            );
          }

          const resend = new Resend(apiKey);

          await resend.contacts.create({
            email,
            audienceId,
          });

          const baseUrl = getServerBaseUrl();
          const emailHtml = await render(
            createElement(WelcomeEmail, { baseUrl })
          );

          await resend.emails.send({
            from: 'Dan Goosewin <dan@goosewin.com>',
            to: email,
            subject: 'Thanks for subscribing to my blog!',
            html: emailHtml,
          });

          return Response.json(
            { message: 'Subscription successful' },
            { status: 200 }
          );
        } catch (error) {
          console.error('Subscription error:', error);

          if (
            error instanceof Error &&
            error.message.includes('already exists')
          ) {
            return Response.json(
              { message: 'Subscription successful' },
              { status: 200 }
            );
          }

          return Response.json(
            { error: 'Failed to subscribe' },
            { status: 500 }
          );
        }
      },
    },
  },
});
