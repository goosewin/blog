'use client';

import React, { createContext, useEffect, useState } from 'react';
import { track } from '@vercel/analytics';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(getPreferredTheme);

  const updateTheme = (nextTheme: Theme) => {
    setTheme((currentTheme) => {
      if (currentTheme !== nextTheme) {
        track('theme_change', { theme: nextTheme });
      }

      return nextTheme;
    });
  };

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
