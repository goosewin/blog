'use client';

import React, { createContext, useEffect, useState } from 'react';
import { track } from '@vercel/analytics';
import {
  DEFAULT_THEME,
  isTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from './theme-config';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;

  // Keep this browser-side resolution logic in sync with the beforeInteractive
  // script in app/layout.tsx so SSR hydration and client toggles agree.
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (isTheme(savedTheme)) {
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
    if (theme === nextTheme) return;

    setTheme(nextTheme);
    track('theme_change', { theme: nextTheme });
  };

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
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
