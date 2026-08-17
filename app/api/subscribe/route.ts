import { createElement } from 'react';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import WelcomeEmail from '#/emails/welcome';
import { subscribeRateLimiter } from '#/lib/rate-limit';
import { getClientIp } from '#/lib/request-ip';
import type { ResendRequestOptions } from '#/lib/resend-request';
import { EMAIL_FROM, getServerBaseUrl } from '#/lib/site.server';
import {
  getEmailFromBody,
  getResendErrorMessage,
  isDuplicateSubscriberError,
  isValidEmail,
} from '#/lib/subscription';

const RESEND_TIMEOUT_MS = 10_000;

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const email = getEmailFromBody(body);

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return Response.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const clientIp = getClientIp(request);
    if (!subscribeRateLimiter.consume(clientIp)) {
      return Response.json({ error: 'Too many requests' }, { status: 429 });
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
    const createResendTimeout = (): ResendRequestOptions => ({
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
    });

    const createContactResponse = await resend.contacts.create(
      {
        email,
        audienceId,
      },
      createResendTimeout()
    );

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
    const emailHtml = await render(createElement(WelcomeEmail, { baseUrl }));

    const welcomeEmailResponse = await resend.emails.send(
      {
        from: EMAIL_FROM,
        to: email,
        subject: 'Thanks for subscribing to my blog!',
        html: emailHtml,
      },
      createResendTimeout()
    );

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

    return Response.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
