import type { Metadata } from 'next';
import Link from 'next/link';
import BackLink from '@/app/components/back-link';
import { ArrowUpRightIcon } from '@/app/components/icons';
import type { GitHubRepo } from '@/types/github';

export const metadata: Metadata = {
  title: 'My Work',
  description:
    'Latest public GitHub projects from Dan Goosewin — open-source work and side projects.',
  alternates: {
    canonical: '/work',
  },
};

const repos: GitHubRepo[] = [
  {
    id: 1,
    name: 'blog',
    full_name: 'goosewin/blog',
    description: 'Personal site and writing for Dan Goosewin.',
    html_url: 'https://github.com/goosewin/blog',
    updated_at: '2026-02-03T23:56:05Z',
  },
  {
    id: 2,
    name: 'goose-demux',
    full_name: 'goosewin/goose-demux',
    description: '',
    html_url: 'https://github.com/goosewin/goose-demux',
    updated_at: '2026-02-05T02:31:02Z',
  },
  {
    id: 3,
    name: 'gralph',
    full_name: 'goosewin/gralph',
    description: '',
    html_url: 'https://github.com/goosewin/gralph',
    updated_at: '2026-02-04T01:54:17Z',
  },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function Work() {
  return (
    <div className="space-y-10">
      <BackLink />
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">My Work</h1>
        <p className="text-gray-600 dark:text-gray-400 text-balance">
          Latest public projects on GitHub.
        </p>
      </header>

      <section className="space-y-4">
        <div className="grid gap-4">
          {repos.map((repo) => (
            <Link
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex items-center gap-3 rounded-xl border border-gray-300/40 dark:border-gray-600/50 px-4 py-4">
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight mb-0">
                    {repo.name}
                  </p>
                  {repo.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug mb-0">
                      {repo.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-0">
                    Updated {formatDate(repo.updated_at)}
                  </p>
                </div>
                <ArrowUpRightIcon className="ml-auto shrink-0 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
