import { cacheLife } from 'next/cache';

const Footer = async () => {
  'use cache';
  cacheLife('max');

  return (
    <footer className="py-4 mt-8">
      <div className="flex flex-col sm:flex-row items-center">
        <p className="mb-2 sm:mb-0 sm:mr-auto text-center sm:text-left text-gray-500 dark:text-gray-500">
          Dan Goosewin, {new Date().getFullYear()}.{' '}
          <a
            className="nav-link"
            href="https://github.com/goosewin/blog"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
