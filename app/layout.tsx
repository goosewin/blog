import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
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
    'Dan Goosewin is a DevRel Lead at Vapi, a software engineer, and a builder. This website is collection of his thoughts and experiences.',
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
    siteName: 'Dan Goosewin',
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
    <html lang="en" className={spaceGrotesk.className + ' dark'}>
      <body>
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
