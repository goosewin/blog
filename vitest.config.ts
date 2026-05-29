import mdx from '@mdx-js/rollup';
import { defineConfig } from 'vitest/config';
import { postHeroManifest } from './post-hero-manifest';

const srcPath = decodeURIComponent(new URL('./src', import.meta.url).pathname);

export default defineConfig({
  plugins: [postHeroManifest(), mdx({ providerImportSource: '@mdx-js/react' })],
  resolve: {
    alias: {
      '#': srcPath,
      '@': srcPath,
    },
  },
  test: {
    environment: 'jsdom',
    exclude: ['node_modules/**', 'dist/**', 'legacy-source/**'],
  },
});
