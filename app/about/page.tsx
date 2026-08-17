import type { Metadata } from 'next';
import BackLink from '#/components/back-link';
import { createPageOpenGraph, getPublicBaseUrl } from '#/lib/site';

const title = 'About Dan Goosewin';
const description =
  "I'm a software engineer and founder building AI-native products. I focus on systems, execution, and product narratives that matter in AI.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: createPageOpenGraph({ title, description, path: '/about' }),
  alternates: { canonical: `${getPublicBaseUrl()}/about` },
};

export default function About() {
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
          Previously DevRel Lead at Vapi in San Francisco. Now fractional DevRel
          through my own company, Goosewin Media Group, helping devtools and AI
          companies win developer mindshare. I also talk about tech, AI, and the
          change ahead on{' '}
          <a
            href="https://youtube.com/@dan_goosewin"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-link"
          >
            YouTube
          </a>
          .
        </p>
        <p className="text-balance text-gray-600 dark:text-gray-400">
          I care about leverage, speed, and clarity. I love products and teams
          that ship, work, and earn trust. Throughout my career I have shipped
          software in web, IoT, automation, videogames, and more.
        </p>
      </div>
    </div>
  );
}
