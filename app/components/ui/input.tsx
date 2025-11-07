'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'h-10 w-full rounded-[var(--radius-sm)] border border-subtle bg-white px-3 text-sm text-strong shadow-sm transition placeholder:text-[var(--color-text-muted)] focus-visible:border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:bg-gray-950',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
