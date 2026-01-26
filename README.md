# goosewin.com

Source for goosewin.com. Personal site and writing.

## Contents

- MDX-based posts
- Newsletter signup via Resend
- Open Graph images and sitemap generation
- Analytics via Vercel

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/goosewin/blog.git
   cd blog
   ```
2. Install dependencies
   ```bash
   bun install
   ```
3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server
   ```bash
   bun dev
   ```

## Environment Variables

```env
GITHUB_TOKEN=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RESEND_AUDIENCE_ID=
RESEND_API_KEY=
NEWSLETTER_SECRET=
SITE_URL=http://localhost:3000
```

## Writing Posts

Add new MDX files to `posts/`. Each post includes metadata at the top:

```mdx
export const metadata = {
  title: "Your Post Title",
  date: "YYYY-MM-DD",
  description: "A brief description of your post",
};

Your post content goes here...
```

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- MDX

## License

MIT © Dan Goosewin
