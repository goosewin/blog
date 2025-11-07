import { Github, Linkedin, Mail } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/app/components/page-header';
import { Surface } from '@/app/components/ui/surface';
import XLogo from '@/app/components/x-logo';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Connect with Dan Goosewin for collaboration, technology leadership insights, or discussions on building innovative digital experiences and enterprises.',
};

interface ContactLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

const contactLinks: ContactLink[] = [
  {
    name: 'X/Twitter',
    url: 'https://x.com/goosewin',
    icon: <XLogo className="h-6 w-6 p-1" />,
  },
  {
    name: 'GitHub',
    url: 'https://github.com/goosewin',
    icon: <Github className="h-6 w-6" />,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/goosewin',
    icon: <Linkedin className="h-6 w-6" />,
  },
  {
    name: 'Email',
    url: 'mailto:hi@goosewin.com',
    icon: <Mail className="h-6 w-6" />,
  },
];

export default function Contact() {
  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Contact"
        title="Let’s build something useful together."
        description="I collaborate with founders, product teams, and developer communities. DM me on X/Twitter or pick a channel below—my replies are human, not automated."
      />

      <Surface variant="muted" className="grid gap-6 p-6 sm:grid-cols-2">
        {contactLinks.map((link) => (
          <Link
            key={link.name}
            href={link.url}
            target={link.url.startsWith('http') ? '_blank' : undefined}
            rel={
              link.url.startsWith('http') ? 'noopener noreferrer' : undefined
            }
            className="group flex items-center gap-4 rounded-[var(--radius-md)] border border-transparent px-4 py-3 transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]/40"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-surface text-[var(--color-text)] shadow-soft">
              {link.icon}
            </span>
            <span className="text-base font-medium text-strong group-hover:underline">
              {link.name}
            </span>
          </Link>
        ))}
      </Surface>
    </div>
  );
}
