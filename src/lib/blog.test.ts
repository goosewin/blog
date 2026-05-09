import { describe, expect, it } from 'vitest';
import { getAllBlogPosts, getBlogPost } from './blog';

describe('blog metadata', () => {
  it('loads every local MDX post with valid metadata', async () => {
    const posts = await getAllBlogPosts();
    const slugs = posts.map((post) => post.slug);

    expect(posts).toHaveLength(5);
    expect(slugs).toContain('leaving-san-francisco');

    for (const post of posts) {
      expect(post.slug).toMatch(/^[a-z0-9-]+$/);
      expect(post.title).toEqual(expect.any(String));
      expect(post.title.length).toBeGreaterThan(0);
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('sorts newest posts first and returns null for unknown slugs', async () => {
    const posts = await getAllBlogPosts();
    const timestamps = posts.map((post) =>
      Date.parse(`${post.date}T00:00:00Z`)
    );

    expect(timestamps).toEqual([...timestamps].sort((a, b) => b - a));
    await expect(getBlogPost('missing-post')).resolves.toBeNull();
  });
});
