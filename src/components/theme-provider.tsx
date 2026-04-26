'use client';

import React, { createContext, useEffect, useRef, useState } from 'react';
import { track } from '@vercel/analytics';
import { DEFAULT_THEME, isTheme, THEME_STORAGE_KEY } from './theme-config';
import type { Theme } from './theme-config';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

interface StoredThemeState {
  available: boolean;
  theme: Theme | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function readStoredTheme(): StoredThemeState {
  if (typeof window === 'undefined') {
    return { available: false, theme: null };
  }

  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(savedTheme)) {
      return { available: true, theme: savedTheme };
    }

    return { available: true, theme: null };
  } catch {
    return { available: false, theme: null };
  }
}

function getStoredTheme() {
  return readStoredTheme().theme;
}

function writeStoredTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    return true;
  } catch {
    return false;
  }
}

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;

  const storedTheme = getStoredTheme();
  if (storedTheme) return storedTheme;

  try {
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
  const currentThemeRef = useRef(theme);
  const shouldTrackThemeChangeRef = useRef(false);
  const userSelectedThemeRef = useRef(false);
  const storageAvailableRef = useRef(readStoredTheme().available);

  const updateTheme = (nextTheme: Theme) => {
    if (theme === nextTheme) return;

    currentThemeRef.current = nextTheme;
    userSelectedThemeRef.current = true;
    shouldTrackThemeChangeRef.current = true;
    setTheme(nextTheme);
  };

  useEffect(() => {
    let attempts = 0;

    const reconcileStoredTheme = () => {
      attempts += 1;
      const storedThemeState = readStoredTheme();

      if (storedThemeState.available) {
        storageAvailableRef.current = true;
      }

      if (userSelectedThemeRef.current) {
        if (storedThemeState.theme !== currentThemeRef.current) {
          writeStoredTheme(currentThemeRef.current);
        }
        return;
      }

      if (storedThemeState.theme) {
        const storedTheme = storedThemeState.theme;
        setTheme((currentTheme) =>
          currentTheme === storedTheme ? currentTheme : storedTheme
        );
      }

      if (attempts >= 8) {
        window.clearInterval(reconcileInterval);
      }
    };

    const reconcileInterval = window.setInterval(reconcileStoredTheme, 250);
    const reconcileTimeout = window.setTimeout(reconcileStoredTheme, 0);

    window.addEventListener('focus', reconcileStoredTheme);
    window.addEventListener('storage', reconcileStoredTheme);

    return () => {
      window.clearInterval(reconcileInterval);
      window.clearTimeout(reconcileTimeout);
      window.removeEventListener('focus', reconcileStoredTheme);
      window.removeEventListener('storage', reconcileStoredTheme);
    };
  }, []);

  useEffect(() => {
    currentThemeRef.current = theme;

    const root = document.documentElement;

    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;

    const storedThemeState = readStoredTheme();

    if (!storageAvailableRef.current && storedThemeState.available) {
      storageAvailableRef.current = true;

      if (
        storedThemeState.theme &&
        storedThemeState.theme !== theme &&
        !userSelectedThemeRef.current
      ) {
        const storedTheme = storedThemeState.theme;
        setTheme(storedTheme);
        return;
      }
    }

    if (storedThemeState.available) {
      if (!writeStoredTheme(theme)) {
        // Keep the selected theme in memory when storage is unavailable.
      }
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
