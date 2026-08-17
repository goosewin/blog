# goose.dev · agent rules

This file is the single source of truth for AI coding agents.
`CLAUDE.md` is a symlink to this file. Edit here, not there.

## Hard rules

1. **pnpm + Node 24 + Vite+.** Use pnpm 11.17.0 and Node.js >=24.18.0 for package and script commands: `pnpm`, `pnpm add`, `pnpm remove`, `pnpm run <script>`, and `pnpm dlx`. The lockfile is `pnpm-lock.yaml`. Do not commit any other lockfile. Never add `engines.bun`, `packageManager bun`, `bunfig.toml`, or `scripts/check-bun-version.ts`. Use `vp` (vite-plus) for check/lint/fmt/test. Keep Next.js 16 App Router. Do not rewrite the site to Vite or TanStack Start. CI and Vercel are configured for pnpm and Node 24.

2. **Docs-first, no training-data guesses.** Before using any library, framework, or API, fetch current documentation and verify the exact symbols, flags, and signatures.

3. **Hosting target is Vercel.** Deploy config and runtime assumptions should match Vercel's Node.js runtime.

4. **No em dashes.** The em dash character (U+2014) is banned from all copy, code, comments, and commit messages.

## Stack

- Next.js 16 App Router, React 19, TypeScript 7
- Tailwind 4 (`src/styles.css`)
- Vite+ (`vp`) for check, lint, format, and tests. Tests import from `vite-plus/test`.
- MDX posts in `posts/*.mdx` with an ESM `export const metadata = { title, date, description?, image? }`
- Resend + react-email for subscribe and newsletter
- Vercel Analytics
- `@vercel/og` for Open Graph PNGs

## Commands

```bash
pnpm install
pnpm dev
pnpm run build
pnpm run check
pnpm run test
pnpm run format
pnpm run lint
pnpm run newsletter -- <post-slug>
```

TypeScript scripts run with `tsx` or `node --import tsx`. Source `~/.vite-plus/env` if the `vp` binary is missing from PATH.

## Layout

- `app`: App Router pages and route handlers
- `src/components`: shared UI
- `src/lib/blog.ts`: MDX loading from `posts/` via `fs`
- `src/lib/og-image.server.tsx`: server-only OG PNG generation
- `src/emails`: React Email templates
- `posts`: source articles; avoid formatting churn

## Env

```env
NEXT_PUBLIC_BASE_URL=https://www.goose.dev
RESEND_AUDIENCE_ID=
RESEND_API_KEY=
NEWSLETTER_SECRET=
SITE_URL=https://www.goose.dev
```

`NEXT_PUBLIC_` values are public. Keep secrets server-only. The canonical host is `www.goose.dev`.

## Deployment

Deploy on Vercel from `main`. `vercel.json` uses the Next.js framework preset. Enable Vercel Web Analytics in the dashboard.

Manual deploy:

```bash
pnpm run deploy
```

Newsletter sending depends on `jq`, `curl`, `SITE_URL`, and `NEWSLETTER_SECRET`.

## Decisions

- Keep MDX posts in `posts/*.mdx`; `src/lib/blog.ts` reads them from disk.
- Generate OG images with `@vercel/og`.
- Use App Router route handlers for Resend so secrets stay off the client.
- Minimum release age is 14 days via `pnpm-workspace.yaml`. Vite+ packages are excluded because the pin is newer than 14 days. Next 16.3.1, `@vercel/og` 1.0.1, `react-email` 6.9.2, Resend 6.20.0, and tsx 4.23.12 are excluded at exact versions until 2026-08-27.
- Authoritative enforcement is Woodpecker `.woodpecker/blog.yml` on `node:24.18.1-bookworm-slim` with Corepack pnpm. GitHub Actions stays disabled.
- Commits and PR titles: conventional `type: summary`. No ticket key. No `[NA]` prefix.
