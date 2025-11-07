'use client';

import { Moon, Sun } from 'lucide-react';

import { useTheme, type Theme } from './theme-provider';

const OPTIONS: Array<{
  value: Theme;
  label: string;
  icon: typeof Sun;
}> = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Select theme"
      className="relative inline-flex items-center rounded-full border border-gray-200 bg-white/70 p-1 shadow-sm backdrop-blur transition-colors dark:border-gray-800 dark:bg-gray-900/60"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1 top-1 h-8 w-8 rounded-full bg-gray-900 shadow-sm transition-transform duration-300 ease-out dark:bg-gray-100 dark:shadow-gray-900/30"
        style={{
          transform: theme === 'dark' ? 'translateX(calc(100%))' : 'translateX(0)',
        }}
      />
      {OPTIONS.map((option) => {
        const isActive = option.value === theme;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setTheme(option.value)}
            className={`relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:focus-visible:outline-gray-100 ${
              isActive
                ? 'text-white dark:text-gray-900'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <span className="sr-only">{option.label}</span>
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
