import { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/app/components/page-header';
import { NewsletterPreferencesForm } from '@/app/components/newsletter/preferences-form';
import SubscriptionForm from '@/app/components/subscription-form';
import { Surface } from '@/app/components/ui/surface';

export const metadata: Metadata = {
  title: 'Newsletter',
  description:
    'Dispatches on developer experience, partnerships, and building leverage—sent when it’s genuinely worth your attention.',
};

const JOURNEY_STEPS = [
  {
    title: 'Opt in with intent',
    description:
      'Share your email and pick the topics that matter to you. The list is small and curated—no growth hacks, no fluff.',
  },
  {
    title: 'Confirm it’s really you',
    description:
      'Check your inbox for a quick confirmation. You’ll only hear from me once you double opt-in. It keeps the list clean and the signal high.',
  },
  {
    title: 'Get high-leverage briefs',
    description:
      'Expect essays, experiments, and partner playbooks focused on developer success, product velocity, and authentic go-to-market.',
  },
];

const SOCIAL_PROOF = [
  {
    name: 'Alex K.',
    role: 'Head of Platform Partnerships',
    quote:
      'Dan understands how to build programs that matter to both founders and developers. Every send has been actionable.',
  },
  {
    name: 'Priya M.',
    role: 'Lead Developer Advocate',
    quote:
      'Rare mix of empathy and systems thinking. I’ve implemented strategies straight from these notes and saw results fast.',
  },
  {
    name: 'Jason L.',
    role: 'Founder, Developer Tools startup',
    quote:
      'This isn’t a typical newsletter. It’s a field report for people building the future of dev experience and partnerships.',
  },
];

export default function Newsletter() {
  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Newsletter"
        title="Dispatches for builders who care about trust and velocity."
        description={
          <>
            Essays and experiments on developer relations, partnerships, and
            founder operating systems.{' '}
            <span className="text-strong">
              No schedule—only when something worth your attention lands.
            </span>
          </>
        }
        actions={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="#subscribe" className="nav-link">
              Jump to subscription
            </Link>
            <Link href="#personalize" className="nav-link">
              Personalize
            </Link>
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        {JOURNEY_STEPS.map((step, index) => (
          <Surface
            key={step.title}
            variant="muted"
            className="flex flex-col gap-3 p-6"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
              Step {index + 1}
            </span>
            <h3 className="text-lg font-semibold text-strong">{step.title}</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              {step.description}
            </p>
          </Surface>
        ))}
      </section>

      <section className="space-y-6" id="personalize">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
            Personalize your feed
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Choose what you want more of and I’ll bias future issues in that
            direction.
          </p>
        </div>
        <NewsletterPreferencesForm />
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
            Signals from the community
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Builders and operators reading along. Join the conversation by
            sharing wins or ideas with me on{' '}
            <Link
              href="https://x.com/goosewin"
              className="underline-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              X/Twitter
            </Link>
            .
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {SOCIAL_PROOF.map((signal) => (
            <Surface
              key={signal.name}
              variant="muted"
              className="flex flex-col gap-3 p-6"
            >
              <p className="text-sm text-[var(--color-text-muted)]">
                “{signal.quote}”
              </p>
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
                {signal.name}
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                {signal.role}
              </div>
            </Surface>
          ))}
        </div>
      </section>

      <section className="space-y-6" id="subscribe">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
            Join the list
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Confirm your email, pick your focus, and you’ll get the next
            dispatch. You can unsubscribe anytime.
          </p>
        </div>
        <SubscriptionForm />
      </section>
    </div>
  );
}
