import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import StructuredData from '@/app/components/structured-data';
import { ArrowUpRightIcon } from '@/app/components/icons';
import BackLink from '@/app/components/back-link';

export const metadata: Metadata = {
  title: 'Partners',
  description:
    'A running list of customers and collaborators across past, current, and future work.',
  alternates: {
    canonical: '/partners',
  },
};

interface ClientEntry {
  name: string;
  description: string;
  logo: string;
  url: string;
}

const currentClients: ClientEntry[] = [
  {
    name: 'MiniMax',
    description: 'AI company bringing intelligence to everyone.',
    logo: '/images/clients/minimax.jpg',
    url: 'http://minimax.io/',
  },
  {
    name: 'Mastra',
    description: 'LangChain for the TypeScript ecosystem, but tasteful.',
    logo: '/images/clients/mastra.png',
    url: 'https://mastra.ai/',
  },
];

const pastClients: ClientEntry[] = [
  {
    name: 'Vapi',
    description: 'Platform for building and deploying Voice AI agents.',
    logo: '/images/clients/vapi.svg',
    url: 'https://vapi.ai/',
  },
];

export default function Partners() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Partners',
    itemListElement: [...currentClients, ...pastClients].map(
      (client, index) => ({
        '@type': 'Organization',
        position: index + 1,
        name: client.name,
        url: client.url,
        description: client.description,
      })
    ),
  };

  return (
    <div className="space-y-10">
      <BackLink />
      <StructuredData data={structuredData} />
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Partners</h1>
        <p className="text-gray-600 dark:text-gray-400 text-balance">
          I help devtools and AI companies win developer mindshare through
          opinionated technical content.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-base font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
          Current
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {currentClients.map((client) => (
            <Link
              key={client.name}
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex items-center gap-3 rounded-xl border border-gray-300/40 dark:border-gray-600/50 px-4 py-2.5">
                <div className="flex h-12 w-12 items-center justify-center bg-transparent">
                  <Image
                    src={client.logo}
                    alt={`${client.name} logo`}
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain rounded-md"
                  />
                </div>
                <div className="space-y-0">
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight mb-0">
                    {client.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug mb-0">
                    {client.description}
                  </p>
                </div>
                <ArrowUpRightIcon className="ml-auto text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
          Past
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {pastClients.map((client) => (
            <Link
              key={client.name}
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex items-center gap-3 rounded-xl border border-gray-300/40 dark:border-gray-600/50 px-4 py-2.5">
                <div className="flex h-12 w-12 items-center justify-center bg-transparent">
                  <Image
                    src={client.logo}
                    alt={`${client.name} logo`}
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain rounded-md"
                  />
                </div>
                <div className="space-y-0">
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight mb-0">
                    {client.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug mb-0">
                    {client.description}
                  </p>
                </div>
                <ArrowUpRightIcon className="ml-auto text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
          Future
        </h2>
        <div className="rounded-2xl bg-gray-100/70 dark:bg-[#1a1a1a] px-8 py-8 text-center flex items-center justify-center min-h-[120px]">
          <p className="text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-0 text-balance">
            I work with a small number of companies each quarter on
            sponsorships, technical breakdowns, and collaborations.
            <br />
            <span className="mt-2 block">
              If you are interested, email me at dan @ (this domain)
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
