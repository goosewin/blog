import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';

import PageLayout from '#/components/page-layout';
import RouteTransitionManager from '#/components/route-transition-manager';
import { ThemeProvider } from '#/components/theme-provider';
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '#/components/theme-config';
import { SITE_DESCRIPTION, SITE_NAME, getPublicBaseUrl } from '#/lib/site';
import '#/styles.css';

const baseUrl = getPublicBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [`${baseUrl}/opengraph-image`],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@goosewin',
    creator: '@goosewin',
    images: [`${baseUrl}/opengraph-image`],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const defaultHtmlClassName = DEFAULT_THEME === 'dark' ? 'dark' : undefined;

  return (
    <html lang="en" className={defaultHtmlClassName} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/nunito-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/jetbrains-mono-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body>
        <ThemeProvider>
          <RouteTransitionManager />
          <PageLayout>{children}</PageLayout>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
