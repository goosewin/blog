import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { evaluate } from '@mdx-js/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentType } from 'react';
import * as jsxRuntime from 'react/jsx-runtime';

export interface BlogPostMetadata {
  title: string;
  date: string;
  description?: string;
  image?: string;
}

export interface BlogPost extends BlogPostMetadata {
  slug: string;
  // The cover image when it is actually rendered in the post body (the LCP
  // candidate). Undefined when the cover is only used for OG/metadata.
  heroImage?: string;
}

export type BlogPostContent = ComponentType<{ components?: MDXComponents }>;

interface BlogPostEntry extends BlogPost {
  filePath: string;
  sortTimestamp: number;
  Content: BlogPostContent;
}

interface EvaluatedPost {
  default: BlogPostContent;
  metadata?: unknown;
}

const postsDir = join(process.cwd(), 'posts');

// Compiling MDX is only cheap enough to repeat on every request in dev, where
// edited posts must show up without a restart.
const shouldCache = process.env.NODE_ENV === 'production';
let cachedEntries: Promise<BlogPostEntry[]> | null = null;

function slugFromPath(filePath: string) {
  return (
    filePath
      .split('/')
      .pop()
      ?.replace(/\.mdx$/, '') ?? ''
  );
}

function assertNonEmptyMetadataString(
  value: unknown,
  field: keyof BlogPostMetadata,
  filePath: string
): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid blog post metadata.${field} in ${filePath}`);
  }

  return value;
}

function assertOptionalMetadataString(
  value: unknown,
  field: keyof BlogPostMetadata,
  filePath: string
): string | undefined {
  if (value === undefined) return undefined;

  if (typeof value !== 'string') {
    throw new Error(`Invalid blog post metadata.${field} in ${filePath}`);
  }

  return value;
}

function getSortTimestamp(date: string, filePath: string) {
  const timestamp = Date.parse(`${date}T00:00:00.000Z`);

  if (Number.isNaN(timestamp)) {
    throw new Error(`Invalid blog post metadata.date in ${filePath}: ${date}`);
  }

  return timestamp;
}

function assertMetadataObject(
  metadata: unknown,
  filePath: string
): Record<string, unknown> {
  if (typeof metadata !== 'object' || metadata === null) {
    throw new Error(`Missing metadata export in ${filePath}`);
  }

  return metadata as Record<string, unknown>;
}

// A cover image that also appears in the body is the LCP element. MDX renders
// it through the `Image`/`img` component, and the raw source mentions the path
// once in `metadata.image` plus once per body usage.
function resolveHeroImage(raw: string, image: string | undefined) {
  if (!image) return undefined;

  return raw.split(image).length - 1 >= 2 ? image : undefined;
}

async function toBlogPostEntry(fileName: string): Promise<BlogPostEntry> {
  const filePath = join(postsDir, fileName);
  const raw = await readFile(filePath, 'utf8');
  const slug = slugFromPath(fileName);

  if (!slug) {
    throw new Error(`Invalid blog post filename: ${filePath}`);
  }

  const evaluated = (await evaluate(raw, {
    ...jsxRuntime,
    development: false,
  })) as unknown as EvaluatedPost;

  const metadata = assertMetadataObject(evaluated.metadata, filePath);
  const title = assertNonEmptyMetadataString(metadata.title, 'title', filePath);
  const date = assertNonEmptyMetadataString(metadata.date, 'date', filePath);
  const description = assertOptionalMetadataString(
    metadata.description,
    'description',
    filePath
  );
  const image = assertOptionalMetadataString(metadata.image, 'image', filePath);

  return {
    slug,
    title,
    date,
    description,
    image,
    heroImage: resolveHeroImage(raw, image),
    filePath,
    sortTimestamp: getSortTimestamp(date, filePath),
    Content: evaluated.default,
  };
}

async function loadPostEntries(): Promise<BlogPostEntry[]> {
  const fileNames = await readdir(postsDir);
  const entries = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map(toBlogPostEntry)
  );

  return entries.sort((a, b) => b.sortTimestamp - a.sortTimestamp);
}

function getPostEntries(): Promise<BlogPostEntry[]> {
  if (!shouldCache) return loadPostEntries();

  cachedEntries ??= loadPostEntries();
  return cachedEntries;
}

function toBlogPost(post: BlogPostEntry): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    description: post.description,
    image: post.image,
    heroImage: post.heroImage,
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const entries = await getPostEntries();
  return entries.map(toBlogPost);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const entries = await getPostEntries();
  const post = entries.find((entry) => entry.slug === slug);
  return post ? toBlogPost(post) : null;
}

export async function getBlogPostContent(
  slug: string
): Promise<BlogPostContent> {
  const entries = await getPostEntries();
  const post = entries.find((entry) => entry.slug === slug);

  if (!post) {
    throw new Error(`Unknown blog post: ${slug}`);
  }

  return post.Content;
}
