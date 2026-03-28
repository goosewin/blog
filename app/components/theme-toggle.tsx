'use client';

import { useState } from 'react';
import { useTheme } from './theme-provider';
import { MoonIcon, SunIcon } from './icons';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const nextTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="p-2 rounded-full bg-gray-200 dark:bg-[#1c1c1c]/60 hover:opacity-80 transition-opacity duration-200 focus:outline-none cursor-pointer"
      aria-label={`Switch to ${nextTheme} mode`}
      suppressHydrationWarning
      type="button"
    >
      <div className="flex items-center justify-center relative">
        {theme === 'light' ? (
          <MoonIcon />
        ) : (
          <SunIcon />
        )}
        <div
          className={`absolute z-50 right-[-250%] w-8 text-center transition-opacity duration-150 ${isHovered ? 'opacity-100' : 'opacity-0'} sm:bottom-[-200%] sm:right-0 sm:w-16`}
        >
          {nextTheme === 'dark' ? 'Dark' : 'Light'}
        </div>
      </div>
    </button>
  );
}
