import { describe, expect, it } from 'vite-plus/test';
import { createRateLimiter } from './rate-limit';

describe('createRateLimiter', () => {
  it('allows up to max hits inside the window and then rejects', () => {
    const limiter = createRateLimiter({ windowMs: 1_000, max: 2 });
    const now = 1_000;

    expect(limiter.consume('1.1.1.1', now)).toBe(true);
    expect(limiter.consume('1.1.1.1', now + 10)).toBe(true);
    expect(limiter.consume('1.1.1.1', now + 20)).toBe(false);
  });

  it('isolates keys and expires old hits', () => {
    const limiter = createRateLimiter({ windowMs: 100, max: 1 });

    expect(limiter.consume('a', 0)).toBe(true);
    expect(limiter.consume('b', 0)).toBe(true);
    expect(limiter.consume('a', 50)).toBe(false);
    expect(limiter.consume('a', 100)).toBe(true);
  });
});
