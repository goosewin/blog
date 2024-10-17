import type { Metadata } from 'next';
import './globals.css';
import PageLayout from './components/page-layout';
import { ThemeProvider } from './components/theme-provider';
import { Space_Grotesk } from 'next/font/google';
import PlausibleProvider from 'next-plausible';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Daniel Stolbov',
    template: '%s | Daniel Stolbov',
  },
  description:
    'Daniel Stolbov is an SDE Manager at Deaglo, a software engineer, and a builder. This website is collection of his thoughts and experiences.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? 'https://goosewin.com'
  ),
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://goosewin.com',
    siteName: 'Daniel Stolbov',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dan_goosewin',
    creator: '@dan_goosewin',
    creatorId: '1559769056168710144',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spaceGrotesk.className}>
      <head>
        <PlausibleProvider
          domain="goosewin.com"
          customDomain="https://analytics.goosewin.com"
          selfHosted
          trackOutboundLinks
          enabled
        />
        <script
          id="theme-script"
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              function getInitialTheme() {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              const theme = getInitialTheme();
              document.documentElement.classList.toggle('dark', theme === 'dark');
            })();
          `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <PageLayout>{children}</PageLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
