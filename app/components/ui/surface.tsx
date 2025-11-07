import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ElementType,
  type ForwardedRef,
  forwardRef,
} from 'react';

import { cn } from '@/lib/utils';

type SurfaceVariant = 'base' | 'muted' | 'elevated' | 'translucent';

type SurfaceProps<T extends ElementType = 'div'> = {
  as?: T;
  variant?: SurfaceVariant;
} & Omit<ComponentPropsWithoutRef<T>, 'as'>;

const variantClasses: Record<SurfaceVariant, string> = {
  base: 'border border-subtle bg-surface',
  muted: 'border border-subtle bg-elevated',
  elevated: 'border border-subtle bg-elevated shadow-soft',
  translucent: 'border border-transparent surface-translucent shadow-soft',
};

const Surface = forwardRef(
  <T extends ElementType = 'div'>(
    { as, variant = 'base', className, ...props }: SurfaceProps<T>,
    ref: ForwardedRef<ElementRef<T>>
  ) => {
    const Component = (as ?? 'div') as ElementType;

    return (
      <Component
        ref={ref}
        data-surface-variant={variant}
        className={cn(
          'relative rounded-[var(--radius-lg)] text-strong transition-colors duration-200',
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
) as <T extends ElementType = 'div'>(
  props: SurfaceProps<T> & { ref?: React.ComponentPropsWithRef<T>['ref'] }
) => React.ReactElement | null;

Surface.displayName = 'Surface';

export { Surface };
export type { SurfaceProps };
