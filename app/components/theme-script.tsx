const STORAGE_KEY = 'dg-theme';
const COOKIE_NAME = 'theme';

const themeInitializer = `(() => {
  const COOKIE = '${COOKIE_NAME}';
  const STORAGE = '${STORAGE_KEY}';
  try {
    const root = document.documentElement;
    if (!root) return;

    const getCookieTheme = () => {
      const match = document.cookie.match(new RegExp('(?:^|; )' + COOKIE + '=([^;]*)'));
      if (!match) return null;
      const value = decodeURIComponent(match[1]);
      return value === 'light' || value === 'dark' ? value : null;
    };

    const getStoredTheme = () => {
      try {
        const stored = localStorage.getItem(STORAGE);
        return stored === 'light' || stored === 'dark' ? stored : null;
      } catch (_) {
        return null;
      }
    };

    const cookieTheme = getCookieTheme();
    const storedTheme = getStoredTheme();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const nextTheme = cookieTheme || storedTheme || (prefersDark ? 'dark' : 'light');

    if (nextTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
  } catch (_) {
    // swallow
  }
})();`;

export function ThemeScript() {
  return (
    <script
      id="theme-initializer"
      dangerouslySetInnerHTML={{ __html: themeInitializer }}
    />
  );
}
