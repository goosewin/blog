import { createFileRoute } from '@tanstack/react-router';
import BackLink from '../components/back-link';
import StructuredData from '../components/structured-data';
import { ArrowUpRightIcon } from '../components/icons';
import { getPublicBaseUrl } from '../lib/site';

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
    url: 'https://minimax.io/',
  },
  {
    name: 'Mastra',
    description: 'LangChain for the TypeScript ecosystem, but tasteful.',
    logo: '/images/clients/mastra.png',
    url: 'https://mastra.ai/',
  },
  {
    name: 'CodeRabbit',
    description: 'AI code reviews that catch issues before you merge.',
    logo: '/images/clients/coderabbit.jpg',
    url: 'https://coderabbit.ai',
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

export const Route = createFileRoute('/partners')({
  head: () => {
    const baseUrl = getPublicBaseUrl();

    return {
      meta: [
        { title: 'Partners | Dan Goosewin' },
        {
          name: 'description',
          content:
            'A running list of customers and collaborators across past, current, and future work.',
        },
      ],
      links: [{ rel: 'canonical', href: `${baseUrl}/partners` }],
    };
  },
  component: Partners,
});

function Partners() {
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
        <p className="text-balance text-gray-600 dark:text-gray-400">
          I help devtools and AI companies win developer mindshare through
          opinionated technical content.
        </p>
      </header>

      <ClientSection title="Current" clients={currentClients} />
      <ClientSection title="Past" clients={pastClients} />

      <section className="space-y-4">
        <h2 className="text-base font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
          Future
        </h2>
        <div className="flex min-h-[120px] items-center justify-center rounded-2xl bg-gray-100/70 px-8 py-8 text-center dark:bg-[#1a1a1a]">
          <p className="text-balance mb-0 text-base text-gray-900 dark:text-gray-100 sm:text-lg">
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

function ClientSection({
  title,
  clients,
}: {
  title: string;
  clients: ClientEntry[];
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {clients.map((client) => (
          <a
            key={client.name}
            href={client.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="flex items-center gap-3 rounded-xl border border-gray-300/40 px-4 py-2.5 dark:border-gray-600/50">
              <div className="flex h-12 w-12 items-center justify-center bg-transparent">
                <img
                  src={client.logo}
                  alt={`${client.name} logo`}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-md object-contain"
                />
              </div>
              <div className="space-y-0">
                <p className="mb-0 text-base font-semibold leading-tight text-gray-900 dark:text-gray-100">
                  {client.name}
                </p>
                <p className="mb-0 text-sm leading-snug text-gray-600 dark:text-gray-400">
                  {client.description}
                </p>
              </div>
              <ArrowUpRightIcon className="ml-auto text-gray-400" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
