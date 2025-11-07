import { cacheLife } from 'next/cache';

const Footer = async () => {
  'use cache';
  cacheLife('max');

  return (
    <footer className="mt-12 border-t border-subtle pt-8">
      <div className="flex flex-col items-center gap-4 text-sm text-[var(--color-text-muted)] sm:flex-row sm:justify-between">
        <p className="text-center sm:text-left text-[var(--color-text-muted)]">
          Dan Goosewin, {new Date().getFullYear()}.{' '}
          <a
            className="font-semibold text-[var(--color-text)] transition hover:text-accent"
            href="https://github.com/goosewin/blog"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        </p>
        <a
          href="https://x.com/goosewin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-subtle px-4 py-2 text-[var(--color-text)] transition hover:border-strong hover:bg-elevated"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current mr-1"
          >
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
          </svg>
          <span className="text-sm font-semibold">Follow me</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
