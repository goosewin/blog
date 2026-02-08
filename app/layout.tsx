import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import PageLayout from './components/page-layout';
import { ThemeProvider } from './components/theme-provider';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Dan Goosewin',
    template: '%s | Dan Goosewin',
  },
  description:
    'Dan Goosewin builds AI-native systems and publishes signal-first writing on software, execution, and leverage.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? 'https://goosewin.com'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://goosewin.com',
    siteName: 'Dan Goosewin',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@goosewin',
    creator: '@goosewin',
    creatorId: '1559769056168710144',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={spaceGrotesk.className}
      suppressHydrationWarning
      style={{ backgroundColor: '#fefdf8' }}
    >
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : prefersDark
        ? 'dark'
        : 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.backgroundColor = theme === 'dark' ? '#232323' : '#fefdf8';
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('theme', theme);
  } catch {
    document.documentElement.classList.remove('dark');
  }
})();`,
          }}
        />
        <ThemeProvider>
          <PageLayout>
            {children}
            <Analytics />
          </PageLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
