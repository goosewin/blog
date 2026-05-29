import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';

import { tanstackStart } from '@tanstack/react-start/plugin/vite';

import viteReact from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';
import { postHeroManifest } from './post-hero-manifest';

const vercelEnv = process.env.VERCEL?.toLowerCase();
const nitroPreset =
  vercelEnv === '1' || vercelEnv === 'true' ? 'vercel' : 'bun';

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    postHeroManifest(),
    devtools(),
    mdx({ providerImportSource: '@mdx-js/react' }),
    tailwindcss(),
    tanstackStart(),
    nitro({
      preset: nitroPreset,
      compressPublicAssets: { gzip: true, brotli: true },
    }),
    viteReact(),
  ],
});

export default config;
