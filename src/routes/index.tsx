import { Link, createFileRoute } from '@tanstack/react-router';
import BlogPostList from '../components/blog-post-list';
import StructuredData from '../components/structured-data';
import ThemeToggle from '../components/theme-toggle';
import { ArrowUpRightIcon } from '../components/icons';
import { getAllBlogPosts } from '../lib/blog';
import { SITE_DESCRIPTION, SITE_NAME, getPublicBaseUrl } from '../lib/site';

export const Route = createFileRoute('/')({
  loader: () => getAllBlogPosts(),
  head: () => ({
    links: [{ rel: 'canonical', href: getPublicBaseUrl() }],
  }),
  component: Home,
});

const socialLinks = [
  { label: 'X', href: 'https://x.com/goosewin' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/goosewin' },
  { label: 'YouTube', href: 'https://youtube.com/@dan_goosewin' },
];

function Home() {
  const posts = Route.useLoaderData();
  const latestPosts = posts.slice(0, 4);
  const baseUrl = getPublicBaseUrl();
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { '@id': `${baseUrl}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${baseUrl}/#person`,
        name: SITE_NAME,
        url: baseUrl,
        description: SITE_DESCRIPTION,
        sameAs: socialLinks.map((link) => link.href),
      },
    ],
  };

  return (
    <div className="space-y-16">
      <StructuredData data={structuredData} />
      <header className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <h1
            aria-label="Dan Goosewin"
            className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl"
          >
            Dan
            <br />
            Goosewin
          </h1>
          <ThemeToggle />
        </div>
        <p className="max-w-md text-balance text-lg text-gray-600 dark:text-gray-400">
          Software engineer and founder building AI-native products. I write
          about leverage, speed, and clarity.
        </p>
      </header>

      <section className="space-y-5">
        <div className="flex items-baseline justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
            <span className="text-orange">01</span> &mdash; Writing
          </h2>
          <Link
            to="/blog"
            className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 transition-colors hover:text-orange-deep dark:text-gray-400 dark:hover:text-orange"
          >
            All posts &rarr;
          </Link>
        </div>
        <BlogPostList posts={latestPosts} />
      </section>

      <section className="space-y-5">
        <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
          <span className="text-orange">02</span> &mdash; Elsewhere
        </h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          <li>
            <Link to="/about" className="underline-link">
              About
            </Link>
          </li>
          <li>
            <Link to="/partners" className="underline-link">
              Partners
            </Link>
          </li>
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-link inline-flex items-center gap-1"
              >
                {link.label}
                <ArrowUpRightIcon />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
