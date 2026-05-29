import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Minimal structural plugin shape. Avoids importing vite's `Plugin` type so the
// same plugin is assignable under both the app's rolldown-vite and the copy of
// vite that Vitest bundles, which otherwise have incompatible `Plugin` types.
interface VirtualModulePlugin {
  name: string;
  resolveId: (id: string) => string | undefined;
  load: (
    this: { addWatchFile: (id: string) => void },
    id: string
  ) => string | undefined;
}

// Emits `virtual:post-heroes` — a static slug→hero-image map read from the MDX
// sources at build time. A post's cover counts as the on-page LCP image only
// when its path also appears in the body (so it occurs at least twice in the
// raw source), not when it is used solely for OG/metadata.
export function postHeroManifest(): VirtualModulePlugin {
  const VIRTUAL_ID = 'virtual:post-heroes';
  const RESOLVED_ID = '\0' + VIRTUAL_ID;
  const postsDir = fileURLToPath(new URL('./posts', import.meta.url));

  return {
    name: 'post-hero-manifest',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return undefined;
    },
    load(id) {
      if (id !== RESOLVED_ID) return undefined;

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
