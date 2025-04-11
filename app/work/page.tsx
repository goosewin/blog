import { GitHubRepo } from '@/types/github';
import { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Professional experience and projects of Dan Goosewin, a software developer and builder with a track record of creating disruptive digital experiences across various industries.',
};

interface ExperienceItem {
  company: string;
  position: string;
  period: string;
  description: string;
  link?: string;
}

const experiences: ExperienceItem[] = [
  {
    company: 'Deaglo',
    position: 'Software Development Manager',
    period: '2023 - Present',
    description:
      'Overseeing the development and enhancement of FX Risk Management solutions. Responsible for system architecture, team leadership, cross-functional collaboration, and driving technical innovation to align with strategic goals.',
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
  {
    name: 'Chronicler',
    description:
      'Experimental project to streamline the process of creating user-friendly changelogs for repositories using LLM agents.',
    url: 'https://chronicler-lake.vercel.app/',
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
    const response = await fetch(
      'https://api.github.com/users/goosewin/repos?sort=updated&per_page=5',
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
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
      <section>
        <h2 className="text-2xl font-bold mb-6">Experience</h2>
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="border-t border-gray-200 dark:border-gray-700 pt-12 first-of-type:border-t-0 first-of-type:pt-0 mb-12"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-0">
                {exp.link ? (
                  <Link
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link hover:opacity-80 transition-opacity"
                  >
                    {exp.company}
                  </Link>
                ) : (
                  exp.company
                )}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {exp.period}
              </span>
            </div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              {exp.position}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-balance">
              {exp.description}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Projects</h2>
        <div className="space-y-6">
          {customProjects?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Stay tuned! New projects and applications are coming soon.
              </p>
            </div>
          )}
          {customProjects.map((project, index) => (
            <div
              key={index}
              className="border-t border-gray-200 dark:border-gray-700 pt-6 first:border-t-0 first:pt-0"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                <h3 className="text-xl font-semibold mb-2 sm:mb-0">
                  <Link
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    {project.name}
                  </Link>
                </h3>
                <Link
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:opacity-80 transition-opacity"
                >
                  {extractDomain(project.url)}
                </Link>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">GitHub Repositories</h2>
        {githubRepos ? (
          <div className="space-y-6">
            {githubRepos.map((repo) => (
              <div
                key={repo.id}
                className="border-t border-gray-200 dark:border-gray-700 pt-6 first:border-t-0 first:pt-0"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                  <h3 className="text-xl font-semibold mb-2 sm:mb-0">
                    <Link
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      {repo.name}
                    </Link>
                  </h3>
                  <Link
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:opacity-80 transition-opacity"
                  >
                    {repo.full_name}
                  </Link>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {repo.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Last updated: {new Date(repo.updated_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Unable to load GitHub repositories at this time. Please check back
              later.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
