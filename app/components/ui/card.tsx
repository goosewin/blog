import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ElementType,
  type ForwardedRef,
  forwardRef,
} from 'react';

import { cn } from '@/lib/utils';

import { Surface, type SurfaceProps } from './surface';

type CardPadding = 'sm' | 'md' | 'lg';

const paddingClasses: Record<CardPadding, string> = {
  sm: 'p-4 sm:p-5',
  md: 'p-6',
  lg: 'p-6 sm:p-8',
};

type CardProps<T extends ElementType = 'div'> = SurfaceProps<T> & {
  padding?: CardPadding;
};

const Card = forwardRef(
  <T extends ElementType = 'div'>(
    {
      as,
      variant = 'elevated',
      padding = 'lg',
      className,
      ...props
    }: CardProps<T>,
    ref: ForwardedRef<ElementRef<T>>
  ) => {
    return (
      <Surface
        ref={ref}
        as={as}
        variant={variant}
        className={cn(
          'flex flex-col gap-6',
          paddingClasses[padding],
          className
        )}
        {...props}
      />
    );
  }
) as <T extends ElementType = 'div'>(
  props: CardProps<T> & { ref?: React.ComponentPropsWithRef<T>['ref'] }
) => React.ReactElement | null;

Card.displayName = 'Card';

type CardSectionProps = ComponentPropsWithoutRef<'div'>;

const CardHeader = ({ className, ...props }: CardSectionProps) => (
  <div className={cn('space-y-2', className)} {...props} />
);
CardHeader.displayName = 'CardHeader';

const CardTitle = ({ className, ...props }: ComponentPropsWithoutRef<'h3'>) => (
  <h3
    className={cn(
      'text-2xl font-semibold tracking-tight text-strong sm:text-[1.75rem]',
      className
    )}
    {...props}
  />
);
CardTitle.displayName = 'CardTitle';

const CardDescription = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'p'>) => (
  <p
    className={cn('text-sm text-[var(--color-text-muted)]', className)}
    {...props}
  />
);
CardDescription.displayName = 'CardDescription';

const CardContent = ({ className, ...props }: CardSectionProps) => (
  <div className={cn('space-y-4', className)} {...props} />
);
CardContent.displayName = 'CardContent';

const CardFooter = ({ className, ...props }: CardSectionProps) => (
  <div
    className={cn('flex items-center justify-between gap-4', className)}
    {...props}
  />
);
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
