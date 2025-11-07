'use client';

import { useEffect, useState } from 'react';

export function useReadingProgress(targetSelector: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = document.querySelector(targetSelector);
    if (!target) {
      return;
    }

    const indicator = document.querySelector('[data-reading-progress]');
    if (!(indicator instanceof HTMLElement)) {
      return;
    }

    const handleScroll = () => {
      const { top, height } = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = height - viewportHeight;

      if (totalScrollable <= 0) {
        setProgress(100);
        return;
      }

      const distance = Math.min(Math.max(-top, 0), totalScrollable);
      const next = Number(((distance / totalScrollable) * 100).toFixed(0));
      setProgress(next);
      indicator.style.transform = `scaleX(${next / 100})`;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetSelector]);

  return progress;
}
