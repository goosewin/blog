import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Professional journey of Daniel Stolbov, a software developer and a builder with a track record of building disruptive digital experiences across various industries.',
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

export default function Experience() {
  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Experience
      </h1>
      {experiences.map((exp, index) => (
        <div
          key={index}
          className="border-t border-gray-200 dark:border-gray-700 pt-12 first-of-type:border-t-0 first-of-type:pt-0"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-0">
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
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {exp.period}
            </span>
          </div>
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
            {exp.position}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-balance">
            {exp.description}
          </p>
        </div>
      ))}
    </div>
  );
}
