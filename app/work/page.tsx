import { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';

import { PageHeader } from '@/app/components/page-header';
import { ButtonLink } from '@/app/components/ui/button';
import { Surface } from '@/app/components/ui/surface';
import { GitHubRepo } from '@/types/github';

interface ExperienceItem {
  company: string;
  position: string;
  period: string;
  description: string;
  link?: string;
}

const experiences: ExperienceItem[] = [
  {
    company: 'Vapi',
    position: 'DevRel & Partnerships Lead',
    period: '2025 - Present',
    description:
      "Leading developer relations and community engagement for Vapi's voice AI platform. Building developer experiences, creating technical content, and fostering a thriving developer ecosystem around voice AI technology.",
  },
  {
    company: 'Deaglo',
    position: 'Software Development Manager',
    period: '2023 - 2025',
    description:
      'Oversaw the development and enhancement of FX Risk Management solutions. Responsible for system architecture, team leadership, cross-functional collaboration, and driving technical innovation to align with strategic goals.',
  },
  {
    company: 'Webline',
    position: 'Founder',
    period: '2021 - 2023',
    description:
      'Founded and operated Webline, specializing in providing top-tier custom web development services. Experienced in a wide range of web technologies including TypeScript, React, .NET, Java, Go, and more.',
  },
  {
    company: 'Tesco Controls',
    position: 'Supervisory Controls and Data Acquisition Engineer',
    period: '2021',
    description:
      'Excelled in integration of custom solutions for automated systems. Ensured high-quality performance and stability of control systems.',
  },
  {
    company: 'Hivehub',
    position: 'Lead Software Engineer',
    period: '2020',
    description:
      'Led web development projects, designing and deploying a variety of web applications. Leveraged technologies including TypeScript, React, React Native, and Node.js to create responsive and intuitive web solutions.',
  },
];

interface CustomProject {
  name: string;
  description: string;
  url: string;
}

const customProjects: CustomProject[] = [
  {
    name: 'Vapi CLI',
    description:
      'Command-line interface for Vapi voice AI platform. Build, test, and deploy voice applications from the terminal with powerful development tools.',
    url: 'https://github.com/VapiAI/cli',
  },
  {
    name: 'Prank Your Dad',
    description:
      'A fun voice AI application that lets you prank your dad with AI-generated phone calls. Built with Vapi to showcase voice AI capabilities.',
    url: 'https://call-dad.vapi.ai',
  },
  {
    name: 'Deaglo Platform',
    description:
      'The Deaglo Platform is a SaaS consisting of powerful tools for modern finance teams to manage international investments and transactions.',
    url: 'https://platform.deaglo.com/',
  },
  {
    name: 'Inverview Agent',
    description:
      'A fully automated Technical Interview AI Agent built during the ElevenLabs x a16z hackathon.',
    url: 'https://inverview-agent.com/',
  },
];

function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.startsWith('www.') ? domain.slice(4) : domain;
  } catch {
    return url;
  }
}

const getGitHubRepos = cache(async (): Promise<GitHubRepo[] | null> => {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      'https://api.github.com/users/goosewin/repos?sort=updated&per_page=5',
      {
        headers,
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub repos');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return null;
  }
});

export default async function Work() {
  const githubRepos = await getGitHubRepos();

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Work"
        title="Building products that compound agency and trust."
        description="Highlights from the last decade of shipping: leadership roles, independent work, and the experiments I publish in the open."
        actions={
          <div className="flex flex-col gap-2 sm:flex-row">
            <ButtonLink href="/contact" size="md">
              Collaborate with me
            </ButtonLink>
            <ButtonLink href="/blog" variant="secondary" size="md">
              Read the blog
            </ButtonLink>
          </div>
        }
      />

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-lg font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
            Experience
          </h2>
          <span className="text-sm text-[var(--color-text-muted)]">
            From lead roles to founder journeys
          </span>
        </div>
        <div className="grid gap-4">
          {experiences.map((exp) => (
            <Surface
              key={`${exp.company}-${exp.period}`}
              variant="muted"
              className="p-5 sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-col gap-1">
                    <div className="inline-flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-strong">
                        {exp.link ? (
                          <Link
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nav-link"
                          >
                            {exp.company}
                          </Link>
                        ) : (
                          exp.company
                        )}
                      </h3>
                      <span className="rounded-full border border-subtle px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[var(--color-text-muted)]">
                      {exp.position}
                    </p>
                  </div>
                  <p className="text-[clamp(0.95rem,0.92rem+0.2vw,1.05rem)] text-[var(--color-text-muted)]">
                    {exp.description}
                  </p>
                </div>
              </div>
            </Surface>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-lg font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
            Projects
          </h2>
          <span className="text-sm text-[var(--color-text-muted)]">
            Selected side builds and collaborations
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {customProjects.map((project) => (
            <Surface
              key={project.name}
              variant="muted"
              className="flex flex-col gap-3 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-strong">
                  <Link
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link"
                  >
                    {project.name}
                  </Link>
                </h3>
                <Link
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]"
                >
                  {extractDomain(project.url)}
                </Link>
              </div>
              <p className="text-[var(--color-text-muted)]">
                {project.description}
              </p>
            </Surface>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-lg font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
            GitHub Repositories
          </h2>
          <span className="text-sm text-[var(--color-text-muted)]">
            Recent open source and experiments
          </span>
        </div>
        {githubRepos ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {githubRepos.map((repo) => (
              <Surface
                key={repo.id}
                variant="muted"
                className="flex flex-col gap-3 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-strong">
                    <Link
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-link"
                    >
                      {repo.name}
                    </Link>
                  </h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                    {repo.language ?? 'TypeScript'}
                  </span>
                </div>
                <p className="text-[var(--color-text-muted)]">
                  {repo.description ??
                    'No description yet, just getting started.'}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Updated {new Date(repo.updated_at).toLocaleDateString()}
                </p>
              </Surface>
            ))}
          </div>
        ) : (
          <Surface
            variant="muted"
            className="p-8 text-center text-[var(--color-text-muted)]"
          >
            Unable to load GitHub repositories at this time. Please check back
            later.
          </Surface>
        )}
      </section>
    </div>
  );
}
