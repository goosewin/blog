import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BlogPostData {
  title: string;
  slug: string;
  description?: string;
  date: string;
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
      return NextResponse.json({ error: 'Newsletter service not configured' }, { status: 500 });
    }

    // Get all contacts from the audience
    const contactsResponse = await resend.contacts.list({ audienceId });
    
    if (!contactsResponse.data || !Array.isArray(contactsResponse.data) || contactsResponse.data.length === 0) {
      return NextResponse.json({ message: 'No subscribers found' }, { status: 200 });
    }

    // Send email to all subscribers
    const emailPromises = contactsResponse.data.map(async (contact: { email: string; id: string }) => {
      const emailContent = generateEmailContent(posts);
      
      return resend.emails.send({
        from: 'Dan Goosewin <dan@goosewin.com>',
        to: contact.email,
        subject: posts.length === 1 
          ? `New post: ${posts[0].title}` 
          : `${posts.length} new posts from Dan's blog`,
        html: emailContent,
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json({ 
      message: `Newsletter sent to ${contactsResponse.data.length} subscribers`,
      postsCount: posts.length 
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 });
  }
}

function generateEmailContent(posts: BlogPostData[]): string {
  const baseUrl = 'https://goosewin.com';
  
  if (posts.length === 1) {
    const post = posts[0];
    return `
      <h2>New post: ${post.title}</h2>
      <p>Howdy!</p>
      <p>I just published a new blog post that I think you'll enjoy:</p>
      
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; background-color: #f9fafb;">
        <h3 style="margin: 0 0 10px 0;">
          <a href="${baseUrl}/blog/${post.slug}" style="color: #1f2937; text-decoration: none;">
            ${post.title}
          </a>
        </h3>
        ${post.description ? `<p style="color: #6b7280; margin: 0;">${post.description}</p>` : ''}
        <p style="margin: 10px 0 0 0;">
          <a href="${baseUrl}/blog/${post.slug}" style="color: #2563eb; text-decoration: underline;">
            Read the full post →
          </a>
        </p>
      </div>
      
      <p>As always, thanks for reading and feel free to share your thoughts!</p>
      <p>Best,<br>Dan Goosewin</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #666;">
        You're receiving this email because you subscribed to Dan Goosewin's blog. 
        If you'd like to unsubscribe, you can do so by replying to this email.
      </p>
    `;
  } else {
    const postsList = posts.map(post => `
      <div style="border-bottom: 1px solid #e5e7eb; padding: 15px 0;">
        <h4 style="margin: 0 0 5px 0;">
          <a href="${baseUrl}/blog/${post.slug}" style="color: #1f2937; text-decoration: none;">
            ${post.title}
          </a>
        </h4>
        ${post.description ? `<p style="color: #6b7280; margin: 5px 0;">${post.description}</p>` : ''}
        <p style="margin: 5px 0 0 0;">
          <a href="${baseUrl}/blog/${post.slug}" style="color: #2563eb; text-decoration: underline;">
            Read more →
          </a>
        </p>
      </div>
    `).join('');

    return `
      <h2>${posts.length} new posts from Dan's blog</h2>
      <p>Howdy!</p>
      <p>I've been busy writing and just published ${posts.length} new posts:</p>
      
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; background-color: #f9fafb;">
        ${postsList}
      </div>
      
      <p>Hope you enjoy the reads!</p>
      <p>Best,<br>Dan Goosewin</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #666;">
        You're receiving this email because you subscribed to Dan Goosewin's blog. 
        If you'd like to unsubscribe, you can do so by replying to this email.
      </p>
    `;
  }
} 