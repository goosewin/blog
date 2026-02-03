import { readFile } from 'fs/promises';
import { join } from 'path';
import { ImageResponse } from 'next/og';

export const alt = 'goosewin.com';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

let iconSrcPromise: Promise<string> | null = null;

async function getIconSrc(): Promise<string> {
  if (!iconSrcPromise) {
    iconSrcPromise = readFile(join(process.cwd(), 'public', 'icon.png')).then(
      (buffer) =>
        `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`
    );
  }

  return iconSrcPromise;
}

export default async function Image() {
  const iconSrc = await getIconSrc();

  return new ImageResponse(
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
      {}
      <img src={iconSrc} alt="goosewin.com icon" width={240} height={240} />
    </div>,
    {
      ...size,
    }
  );
}
