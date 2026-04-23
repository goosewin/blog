import type { ImgHTMLAttributes } from 'react';
import type { MDXComponents } from 'mdx/types';

function MdxImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  return <img loading="lazy" {...props} />;
}

export const mdxComponents: MDXComponents = {
  Image: MdxImage,
  img: MdxImage,
};
