# goosewin.com

Welcome to the repository powering `goosewin.com`.

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for server-side rendering and static site generation
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [MDX](https://mdxjs.com/) - Markdown for the component era

## Getting Started

1. Clone the repository:

   ```sh
   git clone https://github.com/goosewin/blog.git
   ```

2. Install dependencies:

   ```sh
   bun install
   ```

3. Run the development server:
   ```sh
   bun dev
   ```

## Environment Variables

This project uses environment variables for configuration:

- `GITHUB_TOKEN`: Your GitHub personal access token (required for fetching GitHub repositories)

You can copy the `.env.example` file and replace the values with your own:

```sh
cp .env.example .env.local
```

Then edit `.env.local` and replace `your_github_token_here` with your actual GitHub token.

## Writing Blog Posts

Add new MDX files to the `posts/` directory. Each post should include metadata at the top:

```mdx
export const metadata = {
  title: 'Your Post Title',
  date: 'YYYY-MM-DD',
  description: 'A brief description of your post',
};

Your post content goes here...
```
