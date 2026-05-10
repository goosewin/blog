import { fileURLToPath } from 'node:url';
import mdx from '@mdx-js/rollup';
import { defineConfig } from 'vitest/config';

const srcPath = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  plugins: [mdx({ providerImportSource: '@mdx-js/react' })],
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
