import type { ComponentPropsWithoutRef, ElementType } from 'react';

import { cn } from '@/lib/utils';

export type ContainerProps<T extends ElementType = 'div'> = {
  as?: T;
  className?: string;
} & ComponentPropsWithoutRef<T>;

export function Container<T extends ElementType = 'div'>({
  as,
  className,
  style,
  ...props
}: ContainerProps<T>) {
  const Component = (as ?? 'div') as ElementType;

  return (
    <Component
      style={{
        paddingLeft:
          'calc(clamp(1rem, 4vw, 2.5rem) + env(safe-area-inset-left))',
        paddingRight:
          'calc(clamp(1rem, 4vw, 2.5rem) + env(safe-area-inset-right))',
        ...style,
      }}
      className={cn('mx-auto w-full max-w-5xl', className)}
      {...props}
    />
  );
}
