import { readFile } from 'node:fs/promises';
import { extname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { ImageResponse } from '@vercel/og';
import type { BlogPost } from './blog';

const size = {
  width: 1200,
  height: 630,
};

let iconSrcPromise: Promise<string> | null = null;
const imageSrcCache = new Map<string, Promise<string | null>>();
const publicDir = resolve(process.cwd(), 'public');

async function getIconSrc(): Promise<string> {
  if (!iconSrcPromise) {
    iconSrcPromise = (async () => {
      const candidates = [
        join(process.cwd(), 'app', 'icon.png'),
        join(process.cwd(), 'public', 'icon.png'),
      ];

      for (const candidate of candidates) {
        try {
          const buffer = await readFile(candidate);
          return `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
        } catch {
          continue;
        }
      }

      return '';
    })();
  }

  return iconSrcPromise;
}

function resolvePublicImagePath(pathname: string) {
  const normalizedPathname = pathname.replace(/\\/g, '/').replace(/^\/+/, '');
  const segments = normalizedPathname.split('/').filter(Boolean);

  if (segments.length === 0 || segments.some((segment) => segment === '..')) {
    return null;
  }

  const publicPathname = segments.join('/');
  const absolutePath = resolve(publicDir, publicPathname);
  const publicRelativePath = relative(publicDir, absolutePath);

  if (
    publicRelativePath === '' ||
    publicRelativePath === '..' ||
    publicRelativePath.startsWith(`..${sep}`) ||
    isAbsolute(publicRelativePath)
  ) {
    return null;
  }

  return { absolutePath, publicPathname };
}

function getImageSrc(pathname: string): Promise<string | null> {
  const publicImagePath = resolvePublicImagePath(pathname);
  if (!publicImagePath) return Promise.resolve(null);

  const cached = imageSrcCache.get(publicImagePath.publicPathname);
  if (cached) return cached;

  const srcPromise = readFile(publicImagePath.absolutePath)
    .then((buffer) => {
      const extension = extname(publicImagePath.publicPathname).toLowerCase();
      const mimeType =
        extension === '.png'
          ? 'image/png'
          : extension === '.jpg' || extension === '.jpeg'
            ? 'image/jpeg'
            : 'image/png';

      return `data:${mimeType};base64,${Buffer.from(buffer).toString('base64')}`;
    })
    .catch(() => null);

  imageSrcCache.set(publicImagePath.publicPathname, srcPromise);
  return srcPromise;
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export async function createSiteOgImageResponse() {
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
      <img src={iconSrc} alt="goosewin.com icon" width={240} height={240} />
    </div>,
    {
      ...size,
    }
  );
}

export async function createBlogPostOgImageResponse(post: BlogPost | null) {
  const iconSrc = await getIconSrc();
  const postImageSrc = post?.image ? await getImageSrc(post.image) : null;

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
      {postImageSrc && (
        <img
          src={postImageSrc}
          alt={post?.title || 'Blog Post'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.2,
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          position: 'relative',
        }}
      >
        <img
          src={iconSrc}
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
