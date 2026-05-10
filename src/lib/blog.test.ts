import { describe, expect, it } from 'vitest';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { getAllBlogPosts, getBlogPost } from './blog';

const getPostFileSlugs = async () => {
  const filenames = await readdir(join(process.cwd(), 'posts'));

  return filenames
    .filter((filename) => filename.endsWith('.mdx'))
    .map((filename) => filename.replace(/\.mdx$/, ''))
    .sort();
};

const parseValidPostDate = (date: string) => {
  expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

  const timestamp = Date.parse(`${date}T00:00:00Z`);

  expect(Number.isFinite(timestamp)).toBe(true);
  expect(new Date(timestamp).toISOString().slice(0, 10)).toBe(date);

  return timestamp;
};

describe('blog metadata', () => {
  it('loads every local MDX post with valid metadata', async () => {
    const posts = await getAllBlogPosts();
    const slugs = posts.map((post) => post.slug);

    expect(posts.length).toBeGreaterThan(0);
    expect([...slugs].sort()).toEqual(await getPostFileSlugs());

    for (const post of posts) {
      expect(post.slug).toMatch(/^[a-z0-9-]+$/);
      expect(post.title).toEqual(expect.any(String));
      expect(post.title.length).toBeGreaterThan(0);
      parseValidPostDate(post.date);
    }
  });

  it('sorts newest posts first and returns null for unknown slugs', async () => {
    const posts = await getAllBlogPosts();
    const timestamps = posts.map((post) => parseValidPostDate(post.date));

    expect(timestamps).toEqual([...timestamps].sort((a, b) => b - a));
    await expect(getBlogPost('missing-post')).resolves.toBeNull();
  });
});
