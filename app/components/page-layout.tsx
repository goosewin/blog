import Link from 'next/link';
import { ViewTransition } from 'react';

import Footer from './footer';
import Navigation from './navigation';
import { SearchProvider } from './search/search-provider';
import { Container } from './ui/container';
import { Surface } from './ui/surface';

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SearchProvider>
      <Container
        as="div"
        className="relative flex min-h-screen flex-col gap-10 pb-[calc(4rem+env(safe-area-inset-bottom))] pt-[calc(1.5rem+env(safe-area-inset-top))] sm:gap-12"
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Surface
          as="header"
          variant="translucent"
          className="sticky z-40 flex items-center justify-between gap-3 rounded-full px-5 py-3"
          style={{ top: 'calc(env(safe-area-inset-top) + 1rem)' }}
        >
          <Link
            href="/"
            className="flex items-center text-lg font-semibold tracking-tight text-strong transition hover:text-accent sm:text-xl"
          >
            <span className="sm:hidden">DG</span>
            <span className="hidden sm:inline">Dan Goosewin</span>
          </Link>
          <Navigation />
        </Surface>

        <ViewTransition name="main-content">
          <main id="main-content" className="flex-1 space-y-10 sm:space-y-12">
            {children}
          </main>
        </ViewTransition>

        <Footer />
      </Container>
    </SearchProvider>
  );
}
