'use client';

import { ViewTransition } from 'react';

export default function MainViewTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransition
      enter={{
        'route-forward': 'auto',
        'route-back': 'auto',
        default: 'none',
      }}
      exit={{
        'route-forward': 'auto',
        'route-back': 'auto',
        default: 'none',
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
