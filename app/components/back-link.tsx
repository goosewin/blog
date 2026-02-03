import Link from 'next/link';
import { ArrowLeftIcon } from './icons';

export default function BackLink() {
  return (
    <div className="mb-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm">
        <ArrowLeftIcon />
        Back to home
      </Link>
    </div>
  );
}
