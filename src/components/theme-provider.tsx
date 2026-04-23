'use client';

import React, { createContext, useEffect, useRef, useState } from 'react';
import { track } from '@vercel/analytics';
import { DEFAULT_THEME, isTheme, THEME_STORAGE_KEY } from './theme-config';
import type { Theme } from './theme-config';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;

  try {
    // Keep this browser-side resolution logic in sync with the root theme script
    // so SSR hydration and client toggles agree.
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(savedTheme)) {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return DEFAULT_THEME;
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(getPreferredTheme);
  const shouldTrackThemeChangeRef = useRef(false);

  const updateTheme = (nextTheme: Theme) => {
    if (theme === nextTheme) return;

    shouldTrackThemeChangeRef.current = true;
    setTheme(nextTheme);
  };

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Keep the selected theme in memory when storage is unavailable.
    }

    if (shouldTrackThemeChangeRef.current) {
      shouldTrackThemeChangeRef.current = false;
      track('theme_change', { theme });
    }
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
