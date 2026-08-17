import Link from 'next/link';
import { ArrowLeftIcon } from './icons';

export default function BackLink() {
  return (
    <div className="mb-8">
      <Link
        href="/"
        transitionTypes={['route-back']}
        className="underline-link inline-flex items-center gap-1.5"
      >
        <ArrowLeftIcon className="size-4" />
        Back to home
      </Link>
    </div>
  );
}
