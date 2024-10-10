import { ImageResponse } from 'next/og';

export const alt = 'goosewin.com';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#232323',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          position: 'relative',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/icon.png`}
          alt="goosewin.com icon"
          width={240}
          height={240}
        />        
      </div>
    ),
    {
      ...size,
    }
  );
}
