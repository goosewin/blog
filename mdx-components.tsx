import type { MDXComponents } from 'mdx/types';
import AnimatedRules from './app/components/blog/animated-rules';
import PrincipleStatement from './app/components/blog/principle-statement';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    AnimatedRules,
    PrincipleStatement,
  };
}
