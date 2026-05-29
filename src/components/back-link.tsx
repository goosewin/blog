import { Link } from '@tanstack/react-router';
import { ArrowLeftIcon } from './icons';

export default function BackLink() {
  return (
    <div className="mb-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gray-500 transition-colors hover:text-orange-deep dark:text-gray-400 dark:hover:text-orange"
      >
        <ArrowLeftIcon />
        Back to home
      </Link>
    </div>
  );
}
