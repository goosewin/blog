import { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import { GitHubRepo } from '@/types/github';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Showcase of all the things I build to experiment with bleeding edge technology and to drive innovation.',
};

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

export default async function Projects() {
  const githubRepos = await getGitHubRepos();

  return (
    <div className="space-y-12">
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
