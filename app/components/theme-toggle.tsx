'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from './theme-provider';
import { useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
    >
      <div className="flex items-center justify-center relative">
        {theme === 'light' ? (
          <Moon size={20} />
        ) : theme === 'dark' ? (
          <Sun size={20} />
        ) : (
          <Monitor size={20} />
        )}
        <div
          className={`absolute z-50 right-[-250%] w-8 text-center transition-opacity duration-150 ${isHovered ? 'opacity-100' : 'opacity-0'} sm:bottom-[-200%] sm:right-0 sm:w-16`}
        >
          {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}
        </div>
      </div>
    </button>
  );
}
