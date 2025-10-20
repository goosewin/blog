import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import WelcomeEmail from '@/app/emails/welcome';
import { createElement } from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!audienceId) {
      console.error('RESEND_AUDIENCE_ID environment variable is not set');
      return NextResponse.json(
        { error: 'Subscription service not configured' },
        { status: 500 }
      );
    }

    await resend.contacts.create({
      email,
      audienceId,
    });

    const baseUrl = process.env.SITE_URL || 'https://goosewin.com';
    const emailHtml = await render(createElement(WelcomeEmail, { baseUrl }));

    await resend.emails.send({
      from: 'Dan Goosewin <dan@goosewin.com>',
      to: email,
      subject: 'Thanks for subscribing to my blog!',
      html: emailHtml,
    });

    return NextResponse.json(
      { message: 'Subscription successful' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Subscription error:', error);

    if (error instanceof Error && error.message?.includes('already exists')) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
