import { ImageResponse } from 'next/og';
import { getBlogPost } from '@/lib/blog';

export const alt = 'goosewin.com blog post preview';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export default async function Image(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await getBlogPost(params.slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://goosewin.com';

  return new ImageResponse(
    <div
      style={{
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
      {post?.image && (
        <img
          src={`${baseUrl}${post.image}`}
          alt={post.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.2,
            zIndex: 0,
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <img
          src={`${baseUrl}/icon.png`}
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
          position: 'relative',
          zIndex: 1,
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
          position: 'relative',
          zIndex: 1,
        }}
      >
        <p style={{ fontSize: 24, opacity: 0.8 }}>
          Collection of thoughts by Dan Goosewin
        </p>
        <p style={{ fontSize: 24, opacity: 0.8 }}>Read more at goosewin.com</p>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
