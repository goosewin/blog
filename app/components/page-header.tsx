import type { ReactNode } from 'react';

import { Surface } from '@/app/components/ui/surface';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <Surface
      as="header"
      variant="muted"
      className={cn(
        'flex flex-col gap-5 p-5 supports-[backdrop-filter]:backdrop-blur-sm sm:gap-6 sm:p-8',
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {eyebrow ? (
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)] sm:text-xs">
            {eyebrow}
          </span>
        ) : null}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <h1
              className="font-semibold text-strong"
              style={{ fontSize: 'clamp(2.25rem, 1.8rem + 1.5vw, 3.25rem)' }}
            >
              {title}
            </h1>
            {description ? (
              <div className="max-w-3xl text-[clamp(1rem,0.95rem+0.3vw,1.1rem)] text-[var(--color-text-muted)] leading-relaxed">
                {description}
              </div>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center justify-start sm:justify-end">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </Surface>
  );
}
