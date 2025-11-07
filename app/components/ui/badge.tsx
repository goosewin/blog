import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline';
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const base =
    'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide';
  const styles =
    variant === 'outline'
      ? 'border border-strong text-[var(--color-text)]'
      : 'bg-accent text-[var(--color-accent-foreground)]';

  return <span className={cn(base, styles, className)} {...props} />;
}
