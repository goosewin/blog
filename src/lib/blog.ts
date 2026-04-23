import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

export interface BlogPostMetadata {
  title: string;
  date: string;
  description?: string;
  image?: string;
}

export interface BlogPost extends BlogPostMetadata {
  slug: string;
}

interface BlogPostModule {
  default: ComponentType;
  metadata: BlogPostMetadata;
}

interface BlogPostEntry extends BlogPost {
  filePath: string;
  sortTimestamp: number;
}

const postMetadataModules = import.meta.glob<BlogPostMetadata>(
  '../../posts/*.mdx',
  {
    eager: true,
    import: 'metadata',
  }
);

const postContentModules = import.meta.glob<BlogPostModule>(
  '../../posts/*.mdx'
);

const postEntries = Object.entries(postMetadataModules)
  .map(([filePath, metadata]) => toBlogPostEntry(filePath, metadata))
  .sort((a, b) => b.sortTimestamp - a.sortTimestamp);

const contentCache = new Map<string, LazyExoticComponent<ComponentType>>();

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

function toBlogPostEntry(
  filePath: string,
  metadata: BlogPostMetadata
): BlogPostEntry {
  const slug = slugFromPath(filePath);

  if (!slug) {
    throw new Error(`Invalid blog post filename: ${filePath}`);
  }

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
    filePath,
    sortTimestamp: getSortTimestamp(date, filePath),
  };
}

function toBlogPost(post: BlogPostEntry): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    description: post.description,
    image: post.image,
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return postEntries.map(toBlogPost);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const post = postEntries.find((entry) => entry.slug === slug);
  return post ? toBlogPost(post) : null;
}

export function getBlogPostContent(
  slug: string
): LazyExoticComponent<ComponentType> {
  const post = postEntries.find((entry) => entry.slug === slug);
  if (!post) {
    throw new Error(`Unknown blog post: ${slug}`);
  }

  const loader = postContentModules[post.filePath];
  const cachedContent = contentCache.get(post.slug);
  if (cachedContent) return cachedContent;

  const Content = lazy(async () => {
    const module = await loader();
    return { default: module.default };
  });

  contentCache.set(post.slug, Content);
  return Content;
}
