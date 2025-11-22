import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import AnimatedRules from './app/components/blog/animated-rules';
import CommitmentCard from './app/components/blog/commitment-card';
import PrincipleStatement from './app/components/blog/principle-statement';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Image,
    AnimatedRules,
    PrincipleStatement,
    CommitmentCard,
  };
}
