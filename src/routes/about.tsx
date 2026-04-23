import { createFileRoute } from '@tanstack/react-router';
import BackLink from '../components/back-link';
import { getPublicBaseUrl } from '../lib/site';

export const Route = createFileRoute('/about')({
  head: () => {
    const baseUrl = getPublicBaseUrl();

    return {
      meta: [
        { title: 'About Dan Goosewin | Dan Goosewin' },
        {
          name: 'description',
          content:
            "I'm a software engineer and founder building AI-native products in San Francisco. I focus on systems, execution, and product narratives that matter in AI.",
        },
      ],
      links: [{ rel: 'canonical', href: `${baseUrl}/about` }],
    };
  },
  component: About,
});

function About() {
  return (
    <div className="space-y-8">
      <BackLink />
      <h1 className="text-3xl font-bold">About</h1>
      <div className="relative">
        <img
          src="/images/goosewin.jpg"
          alt="Dan Goosewin"
          width={200}
          height={200}
          loading="lazy"
          className="float-right mb-4 ml-6 rounded-sm"
        />
        <p className="text-gray-600 dark:text-gray-400">
          Dan Goosewin is a software engineer and founder building AI-native
          software and systems that reduce the distance between intent and
          output.
        </p>
        <p className="text-balance text-gray-600 dark:text-gray-400">
          Based in California.
        </p>
        <p className="text-balance text-gray-600 dark:text-gray-400">
          I care about leverage, speed, and clarity. I love products and teams
          that ship, work, and earn trust. Throughout my career I have shipped
          software in web, IoT, automation, videogames, and more.
        </p>
        <p className="text-balance text-gray-600 dark:text-gray-400">
          I write about AI, software, and execution. What scales, what breaks,
          and what changes outcomes.
        </p>
      </div>
    </div>
  );
}
