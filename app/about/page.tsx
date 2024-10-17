import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Daniel Stolbov',
  description:
    "I'm a software engineer and entrepreneur based in Granite Bay, California. I owe much of my career to the web and software development—it's what I've been doing for the past decade.",
};

export default function About() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">About</h1>
      <div className="relative">
        <Image
          src="/images/dstolbov.jpg"
          alt="Daniel Stolbov"
          width={200}
          height={200}
          className="float-right ml-6 mb-4 rounded"
        />
        <p className="text-gray-600 dark:text-gray-400">
          My name is Daniel Stolbov. I&apos;m a software engineer and
          entrepreneur based in Granite Bay, California. I owe much of my career
          to the web and software development—it&apos;s what I&apos;ve been
          doing for the past decade.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-balance">
          My journey in tech started in Ufa, Russia, with a desire to start a
          personal blog. I was pretty young, so I will spare you the details (if
          you&apos;re persistent, you might be able to find it in web archives).
          I learned HTML, CSS, JavaScript, PHP, WordPress, and MySQL. With this
          skillset, I started building websites for local businesses and making
          my first money.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-balance">
          Since then, my career brought me to the US, where I&apos;ve been
          building software in various industries. I&apos;m currently shaping
          the future of FX as a Software Development Manager at Deaglo, where
          I&apos;m spearheading the development of cutting-edge fintech
          solutions. My technical toolkit includes a wide range of programming
          languages and technologies (primarily in web), with experience
          building on various cloud platforms (AWS, GCP, Azure, Oracle, etc.)
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-balance">
          I&apos;m always excited to connect with fellow tech enthusiasts and
          innovators. Feel free to{' '}
          <Link href="/contact" className="underline-link">
            reach out
          </Link>{' '}
          if you&apos;d like to chat or collaborate. I&apos;m always open to
          helping build products that solve real problems.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-balance">
          Feel free to check out my{' '}
          <Link href="/work" className="underline-link">
            work
          </Link>{' '}
          or my{' '}
          <Link href="/blog" className="underline-link">
            blog
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
