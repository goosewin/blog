import { ImageResponse } from 'next/og';
import { getBlogPost } from '@/lib/blog';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

export const alt = 'Blog Post';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          fontFamily: spaceGrotesk.style.fontFamily,
          fontSize: 32,
          background: '#232323',
          color: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="http://localhost:3000/icon.png"
            alt="goosewin.com icon"
            width={80}
            height={80}
            style={{ marginRight: 20 }}
          />
        </div>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            marginBottom: 40,
            maxWidth: '90%',
            lineHeight: 1.2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {truncateText(post?.title || 'Blog Post', 80)}
        </h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            width: '100%',
          }}
        >
          <p style={{ fontSize: 24, opacity: 0.8 }}>
            Software Development & Entrepreneurship
          </p>
          <p style={{ fontSize: 24, opacity: 0.8 }}>
            Read more at goosewin.com
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
