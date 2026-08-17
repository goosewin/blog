import Link from 'next/link';
import { ArrowLeftIcon } from './icons';

export default function BackLink() {
  return (
    <div className="mb-8">
      <Link
        href="/"
        transitionTypes={['route-back']}
        className="inline-flex items-center gap-2 font-mono text-sm text-gray-500 transition-colors hover:text-orange-deep dark:text-gray-400 dark:hover:text-orange"
      >
        <ArrowLeftIcon />
        Back to home
      </Link>
    </div>
  );
}
