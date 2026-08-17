import Link from 'next/link';
import { ArrowLeftIcon } from './icons';

export default function BackLink() {
  return (
    <div className="mb-8">
      <Link href="/" transitionTypes={['route-back']} className="quiet-link">
        <ArrowLeftIcon className="size-4" />
        Back to home
      </Link>
    </div>
  );
}
