import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-4 mt-8">
      <div className="flex flex-col sm:flex-row items-center">
        <p className="mb-2 sm:mb-0 sm:mr-auto text-center sm:text-left">
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
        <a
          href="https://twitter.com/dan_goosewin"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 sm:mt-0 space-x-1 flex items-center nav-link"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current mr-1"
          >
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
          </svg>
          <span>Follow me</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
