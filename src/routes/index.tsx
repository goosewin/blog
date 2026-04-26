import { Link, createFileRoute } from '@tanstack/react-router';
import ThemeToggle from '../components/theme-toggle';
import { ArrowUpRightIcon } from '../components/icons';
import { getPublicBaseUrl } from '../lib/site';

export const Route = createFileRoute('/')({
  head: () => ({
    links: [{ rel: 'canonical', href: getPublicBaseUrl() }],
  }),
  component: Home,
});

function Home() {
  return (
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
            <Link to="/about" className="underline-link">
              About
            </Link>
          </li>
          <li>
            <Link to="/blog" className="underline-link">
              Blog
            </Link>
          </li>
          <li>
            <a
              href="https://x.com/goosewin"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-link inline-flex items-center gap-1"
            >
              X
              <ArrowUpRightIcon />
            </a>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {' '}
              (previously known as Twitter, a subsidiary of xAI, subsidiary of
              SpaceX)
            </span>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/goosewin"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-link inline-flex items-center gap-1"
            >
              LinkedIn
              <ArrowUpRightIcon />
            </a>
          </li>
          <li>
            <a
              href="https://youtube.com/@dan_goosewin"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-link inline-flex items-center gap-1"
            >
              YouTube
              <ArrowUpRightIcon />
            </a>
          </li>
          <li>
            <Link to="/partners" className="underline-link">
              Partners
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
