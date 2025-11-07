import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

import { PageHeader } from '@/app/components/page-header';
import { ButtonLink } from '@/app/components/ui/button';
import { imageSizes, siteImages } from '@/lib/images';

export const metadata: Metadata = {
  title: 'About Dan Goosewin',
  description:
    "I'm a software engineer and entrepreneur based in San Francisco, California. I owe much of my career to the web and software development—it's what I've been doing for the past decade.",
};

const portrait = siteImages.portrait;

export default function About() {
  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="About"
        title="Dan Goosewin"
        description="Engineer, DevRel, and partnership builder focused on shipping products that respect people’s attention and create real leverage."
        actions={
          <div className="flex flex-col gap-2 sm:flex-row">
            <ButtonLink href="/contact" size="md">
              Say hello
            </ButtonLink>
            <ButtonLink href="/work" variant="secondary" size="md">
              View work
            </ButtonLink>
          </div>
        }
      />

      <div className="grid gap-10 md:grid-cols-[minmax(0,1.6fr)_minmax(0,280px)] md:items-start">
        <div className="space-y-6 text-base leading-relaxed text-[var(--color-text-muted)]">
          <p>
            My name is Dan Goosewin. I&apos;m a software engineer and
            entrepreneur based in San Francisco, California. I owe much of my
            career to the web and software development—it&apos;s what I&apos;ve
            been doing for the past decade.
          </p>
          <p>
            My journey in tech started in Ufa, Russia, with a desire to start a
            personal blog. I learned HTML, CSS, JavaScript, PHP, WordPress, and
            MySQL. That curiosity turned into building websites for local
            businesses and making my first money online.
          </p>
          <p>
            Since then, I&apos;ve worked across startups and enterprises in the
            US, now leading developer relations at Vapi. I build community,
            developer experiences, and partnerships around voice AI technology
            while staying close to code and product.
          </p>
          <p>
            I&apos;m always excited to connect with fellow builders and
            innovators. Feel free to{' '}
            <Link href="/contact" className="underline-link">
              reach out
            </Link>{' '}
            if you&apos;d like to collaborate. You can also explore my{' '}
            <Link href="/work" className="underline-link">
              recent work
            </Link>{' '}
            or dive into the{' '}
            <Link href="/blog" className="underline-link">
              blog archive
            </Link>
            .
          </p>
        </div>
        <div className="mx-auto flex max-w-xs flex-col items-center gap-6 md:mx-0">
          <Image
            src={portrait.src}
            alt={portrait.alt}
            placeholder="blur"
            sizes={imageSizes.inline}
            fetchPriority="high"
            priority
            className="h-48 w-48 rounded-[var(--radius-lg)] border border-subtle object-cover shadow-soft"
          />
          <div className="text-center text-sm text-[var(--color-text-muted)]">
            <p>Based in San Francisco, California</p>
            <p>Leading DevRel & Partnerships @ vapi.ai</p>
          </div>
        </div>
      </div>
    </div>
  );
}
