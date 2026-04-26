# goose.dev

TanStack Start blog for goose.dev.

## Commands

```bash
bun install
bun dev
bun run build
bun run lint
bun run format
```

Send a newsletter for a post:

```bash
bun run newsletter -- <post-slug>
```

Requires `jq`, `curl`, `SITE_URL`, and `NEWSLETTER_SECRET`.

## Stack

- TanStack Start and TanStack Router
- React 19
- Bun
- Tailwind CSS v4
- MDX posts from `posts/*.mdx`
- Resend newsletter endpoints
- Vercel Analytics
- Dynamic Open Graph images with `@vercel/og`

## Environment

Create `.env.local` from `.env.example`.

```env
VITE_PUBLIC_BASE_URL=https://goose.dev
RESEND_AUDIENCE_ID=
RESEND_API_KEY=
NEWSLETTER_SECRET=
SITE_URL=https://goose.dev
```

`VITE_` values are public. Keep secrets server-only.

## Deployment

Deploy on Vercel from `main`. The app uses TanStack Start with Nitro's Vercel
preset on Vercel and Bun preset for local Bun builds. `vercel.json` sets
Vercel's TanStack Start framework preset plus Bun runtime selection. Enable Web
Analytics in the Vercel dashboard.

Manual deploy:

```bash
bun run deploy
```
