'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackLink() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return (
    <div className="mb-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to home
      </Link>
    </div>
  );
}
