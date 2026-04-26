# Agent Notes

Keep changes small. Use Bun. Run `bun format` and `bun run lint` before
handoff. Use conventional commits with concise lowercase subjects.

## Project

TanStack Start personal blog: local MDX posts, newsletter endpoints, Vercel
Analytics, and generated Open Graph images.

## Commands

```bash
bun install
bun dev
bun run build
bun run lint
bun run format
bun run newsletter -- <post-slug>
```

Scripts use `bun --bun` so local commands do not depend on PATH `node`.

## Layout

- `src/routes`: file routes and server handlers
- `src/components`: shared UI
- `src/lib/blog.ts`: MDX loading via `import.meta.glob`
- `src/lib/og-image.server.tsx`: server-only OG PNG generation
- `src/emails`: React Email templates
- `posts`: source articles; avoid formatting churn
- `src/routeTree.gen.ts`: generated; do not edit manually

## Env

```env
VITE_PUBLIC_BASE_URL=https://goose.dev
RESEND_AUDIENCE_ID=
RESEND_API_KEY=
NEWSLETTER_SECRET=
SITE_URL=https://goose.dev
```

`VITE_` values are public. Keep secrets server-only.

## Deployment

Deploy on Vercel from `main`. `vercel.json` pins Bun and the TanStack Start
framework preset. `vite.config.ts` uses Nitro's Vercel preset during Vercel
builds and Nitro's Bun preset for local Bun builds. Enable Vercel Web Analytics
in the dashboard.

Manual deploy:

```bash
bun run deploy
```

Newsletter sending depends on `jq`, `curl`, `SITE_URL`, and
`NEWSLETTER_SECRET`.

## Decisions

- Keep MDX posts in `posts/*.mdx`; router loaders read them directly.
- Generate OG images with `@vercel/og`; do not bring Next.js back for
  `next/og`.
- Use server route handlers for Resend so secrets stay off the client.
- Keep `tanstackStart()` before `viteReact()` and keep Nitro enabled in
  `vite.config.ts` for Vercel.
- Do not force `nitro({ preset: 'bun' })` on Vercel; it emits generic `.output`
  instead of Vercel Build Output. Use the Vercel preset plus `bunVersion`.

## Next

- Add focused tests for blog metadata and newsletter validation.
- Verify production env vars after first Vercel deployment from `main`.
