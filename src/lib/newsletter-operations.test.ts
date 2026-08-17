import { describe, expect, it } from 'vite-plus/test';
import {
  findBroadcastIdByName,
  runExclusiveNewsletterOperation,
} from './newsletter-operations';

describe('newsletter operations', () => {
  it('returns an existing broadcast by name across pages', async () => {
    const pages = [
      {
        items: [{ id: 'b1', name: 'other' }],
        hasMore: true,
      },
      {
        items: [{ id: 'b2', name: 'send-1' }],
        hasMore: false,
      },
    ];

    await expect(
      findBroadcastIdByName(async () => pages.shift()!, 'send-1')
    ).resolves.toBe('b2');
  });

  it('serializes concurrent work for the same request ID', async () => {
    let started = 0;
    let resolveFirst:
      | ((value: { broadcastId: string; reused: boolean }) => void)
      | undefined;
    const first = new Promise<{ broadcastId: string; reused: boolean }>(
      (resolve) => {
        resolveFirst = resolve;
      }
    );

    const execute = () => {
      started += 1;
      return started === 1
        ? first
        : Promise.resolve({ broadcastId: 'should-not-run', reused: false });
    };

    const [pendingA, pendingB] = [
      runExclusiveNewsletterOperation('same-id', execute),
      runExclusiveNewsletterOperation('same-id', execute),
    ];

    resolveFirst?.({ broadcastId: 'b1', reused: false });

    await expect(Promise.all([pendingA, pendingB])).resolves.toEqual([
      { broadcastId: 'b1', reused: false },
      { broadcastId: 'b1', reused: false },
    ]);
    expect(started).toBe(1);

    await expect(
      runExclusiveNewsletterOperation('same-id', execute)
    ).resolves.toEqual({ broadcastId: 'b1', reused: false });
    expect(started).toBe(1);
  });
});
