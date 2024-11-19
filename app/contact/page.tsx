import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Github, Linkedin } from 'lucide-react';
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
  { name: 'Email', url: 'mailto:daniel@webline.app', icon: <Mail /> },
  { name: 'GitHub', url: 'https://github.com/goosewin', icon: <Github /> },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/dstolbov',
    icon: <Linkedin />,
  },
  {
    name: 'Twitter',
    url: 'https://x.com/dan_goosewin',
    icon: <XLogo className="w-6 h-6 p-1" />,
  },
];

export default function Contact() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="text-gray-600 dark:text-gray-400 text-balance">
        I&apos;m open to helping build products that solve real problems. Feel
        free to reach out through any of the following channels.
      </p>
      <ul className="space-y-4">
        {contactLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="text-lg group-hover:underline">{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
