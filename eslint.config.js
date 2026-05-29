// @ts-check

import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  ...tanstackConfig,
  {
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            {
              name: 'fs',
              message:
                'Prefer Bun.file, Bun.write, Bun.Glob, or Web APIs when this code runs under Bun.',
            },
            {
              name: 'path',
              message: 'Prefer URL-based paths when this code runs under Bun.',
            },
            {
              name: 'crypto',
              message:
                'Prefer Bun.CryptoHasher or Web Crypto when this code runs under Bun.',
            },
            {
              name: 'child_process',
              message:
                'Prefer Bun.spawn or Bun.spawnSync when this code runs under Bun.',
            },
          ],
          patterns: [
            {
              group: ['fs/*', 'path/*', 'crypto/*', 'child_process/*'],
              message:
                'Prefer Bun-native APIs or Web APIs when the runtime allows it.',
            },
            {
              regex: '^node:',
              message:
                'Prefer Bun-native APIs or Web APIs when the runtime allows it.',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [
      '.agents/**',
      '.claude/**',
      '.codex/**',
      '.cursor/**',
      '.next/**',
      '.output/**',
      '.vercel/**',
      'app/**',
      'dist/**',
      'eslint.config.js',
      'legacy-source/**',
      'next-env.d.ts',
      'src/routeTree.gen.ts',
      'tsconfig.tsbuildinfo',
    ],
  },
];
