import type { Metadata } from 'next';
import LinksClient from './links-client';
import { links } from './links';

export const metadata: Metadata = {
  title: 'Links',
  description:
    'A quick hub to the places I spend time online and the projects I ship.',
};

export default function LinksPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Links</h1>
        <p className="text-gray-600 dark:text-gray-400 text-balance">
          A curated list of places to follow my work and projects.
        </p>
      </div>
      <LinksClient links={links} />
    </div>
  );
}
