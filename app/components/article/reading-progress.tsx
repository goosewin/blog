'use client';

import { useReadingProgress } from '@/app/hooks/use-reading-progress';

interface ReadingProgressProps {
  targetSelector: string;
}

export function ReadingProgress({ targetSelector }: ReadingProgressProps) {
  const progress = useReadingProgress(targetSelector);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
      <div
        data-reading-progress
        className="h-full origin-left scale-x-[0] bg-[color:var(--color-accent)] transition-transform duration-200 ease-out will-change-transform"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
