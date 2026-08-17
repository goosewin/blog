import { ArrowUpRightIcon } from './icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-4 mt-8">
      <div className="flex flex-col sm:flex-row items-center">
        <p className="mb-2 sm:mb-0 sm:mr-auto text-center sm:text-left text-gray-600 dark:text-gray-400">
          Dan Goosewin, {currentYear}.{' '}
          <a
            className="nav-link inline-flex items-center gap-1"
            href="https://github.com/goosewin/blog"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
            <ArrowUpRightIcon />
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
