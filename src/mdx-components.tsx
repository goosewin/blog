import { createContext, useContext } from 'react';
import type { ImgHTMLAttributes } from 'react';
import type { MDXComponents } from 'mdx/types';

// Carries the post's hero image src (the LCP element). The matching inline
// image loads eagerly with high priority and a responsive srcset; every other
// image stays lazy.
export const PriorityImageContext = createContext<string | undefined>(
  undefined
);

// The hero renders full-bleed up to the prose column (max-w-3xl = 768px).
export const HERO_IMAGE_SIZES = '(max-width: 768px) 100vw, 768px';

// Small variants are generated alongside each hero as `<name>-768.<ext>`.
export function heroSrcSet(src: string): string {
  const small = src.replace(/(\.[a-z]+)$/i, '-768$1');
  return `${small} 768w, ${src} 1600w`;
}

function MdxImage({ alt = '', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const prioritySrc = useContext(PriorityImageContext);
  const isPriority =
    prioritySrc != null &&
    typeof props.src === 'string' &&
    props.src === prioritySrc;

  if (isPriority && typeof props.src === 'string') {
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

export const mdxComponents: MDXComponents = {
  Image: MdxImage,
  img: MdxImage,
};
