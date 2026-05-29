import { fileURLToPath } from 'node:url';
import mdx from '@mdx-js/rollup';
import { defineConfig } from 'vitest/config';
import { postHeroManifest } from './post-hero-manifest';

const srcPath = fileURLToPath(new URL('./src', import.meta.url));

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
