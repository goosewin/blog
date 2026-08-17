import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite-plus';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '#': path.join(root, 'src'),
      '@': path.join(root, 'src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['src/routes/**'],
  },
  fmt: {
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    printWidth: 80,
    ignorePatterns: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'pnpm-lock.yaml',
      'posts/**',
      'next-env.d.ts',
      'tsconfig.tsbuildinfo',
    ],
  },
  lint: {
    ignorePatterns: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'coverage/**',
      'posts/**',
      'next-env.d.ts',
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
