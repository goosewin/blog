export type Theme = 'light' | 'dark';

export const DEFAULT_THEME: Theme = 'dark';
export const THEME_STORAGE_KEY = 'theme';

export function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}
