'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './theme-toggle';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/about', label: 'About' },
    { href: '/work', label: 'Work' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="flex items-center h-full">
      <div className="sm:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <ul
        className={`sm:flex sm:space-x-4 items-center ${isMenuOpen ? 'flex' : 'hidden'} flex-col sm:flex-row absolute sm:relative top-16 sm:top-auto right-0 sm:right-auto bg-white dark:bg-dark-bg sm:bg-transparent sm:dark:bg-transparent p-4 sm:p-0 shadow-md sm:shadow-none w-full sm:w-auto`}
      >
        {navItems.map((item) => (
          <li key={item.href} className="w-full sm:w-auto">
            <Link
              href={item.href}
              className={`nav-link block py-2 sm:py-0 ${pathname === item.href ? 'active-nav-link' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className="mt-4 sm:mt-0">
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
