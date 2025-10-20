import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import NewsletterEmail from '@/app/emails/newsletter';
import { createElement } from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BlogPostData {
  title: string;
  slug: string;
  description?: string;
  date: string;
  image?: string;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.NEWSLETTER_SECRET}`;

    if (!authHeader || authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { posts }: { posts: BlogPostData[] } = await request.json();

    if (!posts || posts.length === 0) {
      return NextResponse.json({ error: 'No posts provided' }, { status: 400 });
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!audienceId) {
      console.error('RESEND_AUDIENCE_ID environment variable is not set');
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 500 }
      );
    }

    const baseUrl = process.env.SITE_URL || 'https://goosewin.com';
    const subject =
      posts.length === 1
        ? `New post: ${posts[0].title}`
        : `${posts.length} new posts from Dan's blog`;

    // Render React Email component to HTML
    const emailHtml = await render(
      createElement(NewsletterEmail, { posts, baseUrl })
    );

    console.log('Creating broadcast for audience:', audienceId);

    // Create broadcast
    const createResponse = await resend.broadcasts.create({
      audienceId,
      from: 'Dan Goosewin <dan@goosewin.com>',
      subject,
      html: emailHtml,
    });

    if (createResponse.error) {
      console.error('Error creating broadcast:', createResponse.error);
      return NextResponse.json(
        { error: 'Failed to create broadcast', details: createResponse.error },
        { status: 500 }
      );
    }

    const broadcastId = createResponse.data?.id;
    console.log('Broadcast created:', broadcastId);

    // Send broadcast
    const sendResponse = await resend.broadcasts.send(broadcastId);

    if (sendResponse.error) {
      console.error('Error sending broadcast:', sendResponse.error);
      return NextResponse.json(
        { error: 'Failed to send broadcast', details: sendResponse.error },
        { status: 500 }
      );
    }

    console.log('Broadcast sent successfully:', sendResponse.data);

    return NextResponse.json(
      {
        message: 'Newsletter broadcast sent successfully',
        broadcastId,
        postsCount: posts.length,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}
