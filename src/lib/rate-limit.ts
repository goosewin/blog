export function createRateLimiter({
  windowMs,
  max,
}: {
  windowMs: number;
  max: number;
}) {
  const hits = new Map<string, number[]>();

  return {
    consume(key: string, now = Date.now()) {
      const timestamps = (hits.get(key) ?? []).filter(
        (timestamp) => now - timestamp < windowMs
      );

      if (timestamps.length >= max) {
        hits.set(key, timestamps);
        return false;
      }

      timestamps.push(now);
      hits.set(key, timestamps);
      return true;
    },
  };
}

export const subscribeRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
});
