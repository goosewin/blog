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

function getResendErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return '';
}

function isDuplicateSubscriberError(error: unknown) {
  const message = getResendErrorMessage(error).toLowerCase();
  return (
    message.includes('already exists') ||
    message.includes('already subscribed') ||
    message.includes('duplicate') ||
    message.includes('contact already')
  );
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

          const createContactResponse = await resend.contacts.create({
            email,
            audienceId,
          });

          if (createContactResponse.error) {
            if (isDuplicateSubscriberError(createContactResponse.error)) {
              return Response.json(
                { message: 'Subscription successful' },
                { status: 200 }
              );
            }

            throw new Error(getResendErrorMessage(createContactResponse.error));
          }

          const baseUrl = getServerBaseUrl();
          const emailHtml = await render(
            createElement(WelcomeEmail, { baseUrl })
          );

          const welcomeEmailResponse = await resend.emails.send({
            from: 'Dan Goosewin <dan@goosewin.com>',
            to: email,
            subject: 'Thanks for subscribing to my blog!',
            html: emailHtml,
          });

          if (welcomeEmailResponse.error) {
            throw new Error(getResendErrorMessage(welcomeEmailResponse.error));
          }

          return Response.json(
            { message: 'Subscription successful' },
            { status: 200 }
          );
        } catch (error) {
          console.error('Subscription error:', error);

          if (isDuplicateSubscriberError(error)) {
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
