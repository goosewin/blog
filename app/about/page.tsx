import { Metadata } from 'next';
import Image from 'next/image';
import BackLink from '@/app/components/back-link';

export const metadata: Metadata = {
  title: 'About Dan Goosewin',
  description:
    "I'm a software engineer and founder building AI-native products in San Francisco. I focus on systems, execution, and product narratives that matter in AI.",
  alternates: {
    canonical: '/about',
  },
};

export default function About() {
  return (
    <div className="space-y-8">
      <BackLink />
      <h1 className="text-3xl font-bold">About</h1>
      <div className="relative">
        <Image
          src="/images/goosewin.jpg"
          alt="Dan Goosewin"
          width={200}
          height={200}
          className="float-right ml-6 mb-4 rounded-sm"
        />
        <p className="text-gray-600 dark:text-gray-400">
          Dan Goosewin is a software engineer and founder building AI-native
          software and systems that reduce the distance between intent and
          output.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-balance">
          Based in San Francisco, California.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-balance">
          I care about leverage, speed, and clarity. I love products and teams
          that ship, work, and earn trust. Throughout my career I have shipped
          software in web, IoT, automation, videogames, and more.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-balance">
          I write about AI, software, and execution. What scales, what breaks,
          and what changes outcomes.
        </p>
      </div>
    </div>
  );
}
