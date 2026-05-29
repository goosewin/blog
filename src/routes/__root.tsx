import { createRootRouteWithContext } from '@tanstack/react-router';

import RootDocument from '../components/root-document';
import NotFoundPage from '../components/not-found-page';
import { SITE_DESCRIPTION, SITE_NAME, getPublicBaseUrl } from '../lib/site';

import appCss from '../styles.css?url';

export const Route = createRootRouteWithContext()({
  head: () => {
    const baseUrl = getPublicBaseUrl();

    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: SITE_NAME },
        { name: 'description', content: SITE_DESCRIPTION },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:url', content: baseUrl },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:title', content: SITE_NAME },
        { property: 'og:description', content: SITE_DESCRIPTION },
        { property: 'og:image', content: `${baseUrl}/opengraph-image` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@goosewin' },
        { name: 'twitter:creator', content: '@goosewin' },
        { name: 'twitter:image', content: `${baseUrl}/opengraph-image` },
      ],
      links: [
        {
          rel: 'preload',
          href: '/fonts/nunito-variable.woff2',
          as: 'font',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: '/fonts/jetbrains-mono-variable.woff2',
          as: 'font',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
        },
        { rel: 'stylesheet', href: appCss },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-icon.png' },
      ],
    };
  },
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
});
