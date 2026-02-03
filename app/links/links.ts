export interface LinkItem {
  title: string;
  url: string;
  description: string;
}

export const links: LinkItem[] = [
  {
    title: 'X/Twitter',
    url: 'https://x.com/goosewin',
    description: 'Short updates, experiments, and shipping progress.',
  },
  {
    title: 'GitHub',
    url: 'https://github.com/goosewin',
    description: 'Open-source projects and code.',
  },
  {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/goosewin',
    description: 'Professional updates and work history.',
  },
  {
    title: 'YouTube',
    url: 'https://youtube.com/@dan_goosewin',
    description: 'Long-form takes and daily shipping cadence.',
  },
  {
    title: 'Blog Source',
    url: 'https://github.com/goosewin/blog',
    description: 'Source code for this site.',
  },
];
