# goose.dev

Next.js blog for goose.dev.

## Commands

```bash
pnpm install
pnpm dev
pnpm run build
pnpm run lint
pnpm run typecheck
pnpm run format
pnpm run test
```

Send a newsletter for a post:

```bash
pnpm run newsletter -- <post-slug>
```

Requires `jq`, `curl`, `SITE_URL`, and `NEWSLETTER_SECRET`.

## Stack

- Next.js 16 App Router
- React 19
- pnpm 11.17.0 + Node.js 24 + Vite+
- Tailwind CSS v4
- MDX posts from `posts/*.mdx`
- Resend newsletter endpoints
- Vercel Analytics
- Dynamic Open Graph images with `@vercel/og`

## Environment

Create `.env.local` from `.env.example`.

```env
NEXT_PUBLIC_BASE_URL=https://www.goose.dev
RESEND_AUDIENCE_ID=
RESEND_API_KEY=
NEWSLETTER_SECRET=
SITE_URL=https://www.goose.dev
```

`NEXT_PUBLIC_` values are public. Keep secrets server-only.

## Deployment

Deploy on Vercel from `main`. The app uses the Next.js framework preset. Enable Web Analytics in the Vercel dashboard.

Manual deploy:

```bash
pnpm run deploy
```

## CI

Self-hosted Woodpecker is the CI path for lint, tests, build, and automatic newsletter dispatch. See `docs/ops/self-hosted-ci.md`.

The pre-commit hook runs check, tests, and build through pnpm before allowing a commit.
