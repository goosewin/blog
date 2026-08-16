import type { ImgHTMLAttributes } from 'react';
import type { MDXComponents } from 'mdx/types';

// The hero renders full-bleed up to the prose column (max-w-3xl = 768px).
export const HERO_IMAGE_SIZES = '(max-width: 768px) 100vw, 768px';

// Small variants are generated alongside each hero as `<name>-768.<ext>`.
export function heroSrcSet(src: string): string {
  const small = src.replace(/(\.[a-z]+)$/i, '-768$1');
  return `${small} 768w, ${src} 1600w`;
}

// `heroImage` is the post's LCP element. The matching inline image loads eagerly
// with high priority and a responsive srcset; every other image stays lazy.
// The hero is known on the server, so it is bound here instead of travelling
// through a client context.
export function createMdxComponents(heroImage?: string): MDXComponents {
  function MdxImage({
    alt = '',
    ...props
  }: ImgHTMLAttributes<HTMLImageElement>) {
    const isHero =
      heroImage != null &&
      typeof props.src === 'string' &&
      props.src === heroImage;

    if (isHero && typeof props.src === 'string') {
      return (
        <img
          {...props}
          alt={alt}
          loading="eager"
          fetchPriority="high"
          srcSet={heroSrcSet(props.src)}
          sizes={HERO_IMAGE_SIZES}
        />
      );
    }

    return <img {...props} alt={alt} loading="lazy" />;
  }

  return {
    Image: MdxImage,
    img: MdxImage,
  };
}
