import fs from 'fs';
import path from 'path';
import { cacheLife } from 'next/cache';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface BlogPostMetadata {
  title: string;
  date: string;
  description?: string;
  image?: string;
}

export interface BlogPost extends BlogPostMetadata {
  slug: string;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  'use cache';
  cacheLife('days');

  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  if (fileNames.length === 0) {
    return [];
  }

  const allPostsData = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        try {
          const { metadata } = await import(`@/posts/${slug}.mdx`);
          return {
            slug,
            ...(metadata as BlogPostMetadata),
          };
        } catch (error) {
          console.error(`Error loading blog post ${slug}:`, error);
          return null;
        }
      })
  );

  return allPostsData
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  'use cache';
  cacheLife('days');

  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  try {
    const { metadata } = await import(`@/posts/${slug}.mdx`);
    return {
      slug,
      ...(metadata as BlogPostMetadata),
    };
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}
