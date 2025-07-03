import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID;    
    if (!audienceId) {
      console.error('RESEND_AUDIENCE_ID environment variable is not set');
      return NextResponse.json({ error: 'Subscription service not configured' }, { status: 500 });
    }

    await resend.contacts.create({
      email,
      audienceId,
    });

    await resend.emails.send({
      from: 'Dan Goosewin <dan@goosewin.com>',
      to: email,
      subject: 'Thanks for subscribing to my blog!',
      html: `
        <h2>Thanks for subscribing!</h2>
        <p>Howdy,</p>
        <p>Thanks for subscribing to my blog! I'm excited to share my thoughts on technology, business, entrepeneurship and more with you.</p>
        <p>You'll get notified whenever I publish new posts. In the meantime, feel free to check out my latest articles at <a href="https://goosewin.com/blog">goosewin.com/blog</a>.</p>
        <p>Best,<br>Dan Goosewin</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          You're receiving this email because you subscribed to Dan Goosewin's blog. 
          If you'd like to unsubscribe, you can do so by replying to this email.
        </p>
      `,
    });

    return NextResponse.json({ message: 'Subscription successful' }, { status: 200 });
  } catch (error: any) {
    console.error('Subscription error:', error);
    
    if (error.message?.includes('already exists')) {
      return NextResponse.json({ error: 'This email is already subscribed' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
} 