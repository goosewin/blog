'use client';

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { track } from '@vercel/analytics';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme: Theme;
  hasUserPreference: boolean;
}

const STORAGE_KEY = 'dg-theme';
const COOKIE_NAME = 'theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const prefersDark = () =>
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const applyThemeToDocument = (theme: Theme) => {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  root.classList.toggle('dark', theme === 'dark');
};

const persistTheme = (theme: Theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (_) {
    // ignore storage errors (private mode, etc.)
  }

  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; expires=${expires.toUTCString()}; SameSite=Lax`;
};

const readStoredTheme = (): Theme | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch (_) {
    return null;
  }
};

type UpdateOptions = {
  trackChange?: boolean;
  persistValue?: boolean;
};

export function ThemeProvider({
  children,
  defaultTheme,
  hasUserPreference,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const userPreferenceRef = useRef<boolean>(hasUserPreference);

  const updateTheme = useCallback(
    (nextTheme: Theme, options: UpdateOptions = {}) => {
      const { trackChange = true, persistValue = true } = options;

      setThemeState(nextTheme);
      applyThemeToDocument(nextTheme);

      if (persistValue) {
        persistTheme(nextTheme);
        userPreferenceRef.current = true;
      } else {
        userPreferenceRef.current = false;
      }

      if (trackChange) {
        track('theme_change', { theme: nextTheme });
      }
    },
    []
  );

  useEffect(() => {
    const stored = readStoredTheme();

    if (stored) {
      startTransition(() =>
        updateTheme(stored, { trackChange: false, persistValue: true })
      );
    } else {
      const systemTheme = prefersDark() ? 'dark' : 'light';
      startTransition(() =>
        updateTheme(systemTheme, { trackChange: false, persistValue: false })
      );
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (!userPreferenceRef.current) {
        const systemTheme = event.matches ? 'dark' : 'light';
        setThemeState(systemTheme);
        applyThemeToDocument(systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, [updateTheme]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: (nextTheme) =>
        updateTheme(nextTheme, { trackChange: true, persistValue: true }),
    }),
    [theme, updateTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
