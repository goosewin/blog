import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import { devtools } from '@tanstack/devtools-vite';

import { tanstackStart } from '@tanstack/react-start/plugin/vite';

import viteReact from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';

const vercelEnv = process.env.VERCEL?.toLowerCase();
const nitroPreset =
  vercelEnv === '1' || vercelEnv === 'true' ? 'vercel' : 'bun';

// Emits `virtual:post-heroes` — a static slug→hero-image map read from the MDX
// sources at build time. A post's cover counts as the on-page LCP image only
// when its path also appears in the body (so it occurs at least twice in the
// raw source), not when it is used solely for OG/metadata.
function postHeroManifest(): Plugin {
  const VIRTUAL_ID = 'virtual:post-heroes';
  const RESOLVED_ID = '\0' + VIRTUAL_ID;
  const postsDir = fileURLToPath(new URL('./posts', import.meta.url));

  return {
    name: 'post-hero-manifest',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id !== RESOLVED_ID) return;

      const files = fs
        .readdirSync(postsDir)
        .filter((file) => file.endsWith('.mdx'));
      const heroes: Record<string, string> = {};

      for (const file of files) {
        this.addWatchFile(path.join(postsDir, file));
        const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
        const image = raw.match(/image:\s*['"]([^'"]+)['"]/)?.[1];
        if (image && raw.split(image).length - 1 >= 2) {
          heroes[file.replace(/\.mdx$/, '')] = image;
        }
      }

      return `export const postHeroes = ${JSON.stringify(heroes)};`;
    },
  };
}

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
