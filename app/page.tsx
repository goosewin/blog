import Link from 'next/link';
import ThemeToggle from '@/app/components/theme-toggle';
import { ArrowUpRight } from 'lucide-react';

export default async function Home() {
  return (
    <>
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Dan Goosewin</h1>
            <ThemeToggle />
          </div>
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link href="/about" className="underline-link">
                About
              </Link>
            </li>
            <li>
              <Link href="/blog" className="underline-link">
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="https://x.com/goosewin"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-link inline-flex items-center gap-1"
              >
                X
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {' '}
                (previously known as Twitter, a subsidiary of xAI, subsidiary of
                SpaceX)
              </span>
            </li>
            <li>
              <Link
                href="https://www.linkedin.com/in/goosewin"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-link inline-flex items-center gap-1"
              >
                LinkedIn
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
            <li>
              <Link
                href="https://youtube.com/@dan_goosewin"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-link inline-flex items-center gap-1"
              >
                YouTube
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
            <li>
              <Link href="/partners" className="underline-link">
                Partners
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
