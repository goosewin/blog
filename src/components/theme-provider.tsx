'use client';

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { track } from '@vercel/analytics';
import { DEFAULT_THEME, isTheme, THEME_STORAGE_KEY } from './theme-config';
import type { Theme } from './theme-config';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getStoredTheme(): Theme | null {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(saved) ? saved : null;
  } catch {
    return null;
  }
}

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;

  const stored = getStoredTheme();
  if (stored) return stored;

  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return DEFAULT_THEME;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getPreferredTheme);

  // Mirror the active theme onto the document for CSS to consume.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  }, [theme]);

  // Follow theme changes made in other tabs.
  useEffect(() => {
    const syncFromStorage = () => {
      const stored = getStoredTheme();
      if (stored) setThemeState(stored);
    };

    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Storage may be unavailable; keep the selection in memory only.
    }

    track('theme_change', { theme: nextTheme });
  }, []);

  const value = useMemo<ThemeContextType>(
    () => ({ theme, setTheme }),
    [theme, setTheme]
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
  const context = use(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
