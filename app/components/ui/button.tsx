'use client';

import Link from 'next/link';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[color:var(--color-accent)] text-[color:var(--color-accent-foreground)] hover:bg-[color:var(--color-accent)]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)]',
  secondary: 'border border-subtle bg-elevated text-strong hover:border-strong',
  outline:
    'border border-subtle bg-transparent text-strong hover:border-strong',
  ghost:
    'bg-transparent text-[var(--color-text-muted)] hover:bg-[color:var(--color-accent-soft)]/60',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-9 w-9 p-0',
};

interface ButtonClassNamesOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export function buttonClassNames({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
}: ButtonClassNamesOptions = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={buttonClassNames({ variant, size, fullWidth, className })}
      {...props}
    />
  )
);

Button.displayName = 'Button';

interface ButtonLinkProps extends React.ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

function ButtonLink({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={buttonClassNames({ variant, size, fullWidth, className })}
    >
      {children}
    </Link>
  );
}

export { Button, ButtonLink };
export type { ButtonVariant, ButtonSize, ButtonLinkProps };
