import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { HeadContent, Scripts } from '@tanstack/react-router';
import { Analytics } from '@vercel/analytics/react';
import { MDXProvider } from '@mdx-js/react';

import PageLayout from './page-layout';
import RouteTransitionManager from './route-transition-manager';
import { ThemeProvider } from './theme-provider';
import { DEFAULT_THEME, THEME_STORAGE_KEY } from './theme-config';
import { mdxComponents } from '../mdx-components';

const themeInitScript = `(() => {
  try {
    const savedTheme = localStorage.getItem('${THEME_STORAGE_KEY}');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : prefersDark
        ? 'dark'
        : 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('${THEME_STORAGE_KEY}', theme);
  } catch {
    document.documentElement.classList.toggle('dark', '${DEFAULT_THEME}' === 'dark');
    document.documentElement.style.colorScheme = '${DEFAULT_THEME}';
  }
})();`;

const Devtools = import.meta.env.DEV
  ? lazy(async () => {
      const [{ TanStackDevtools }, { TanStackRouterDevtoolsPanel }] =
        await Promise.all([
          import('@tanstack/react-devtools'),
          import('@tanstack/react-router-devtools'),
        ]);

      function DevtoolsShell() {
        return (
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        );
      }

      return { default: DevtoolsShell };
    })
  : null;

export default function RootDocument({ children }: { children: ReactNode }) {
  const defaultHtmlClassName = DEFAULT_THEME === 'dark' ? 'dark' : undefined;

  return (
    <html lang="en" className={defaultHtmlClassName} suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          id="theme-init"
          // react-doctor-disable-next-line react-doctor/no-danger -- static first-paint theme script built from constants, no user input
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body>
        <RouteTransitionManager />
        <ThemeProvider>
          <MDXProvider components={mdxComponents}>
            <PageLayout>{children}</PageLayout>
          </MDXProvider>
        </ThemeProvider>
        <Analytics />
        {Devtools ? (
          <Suspense fallback={null}>
            <Devtools />
          </Suspense>
        ) : null}
        <Scripts />
      </body>
    </html>
  );
}
