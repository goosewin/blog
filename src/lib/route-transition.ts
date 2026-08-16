export type RouteTransitionDirection = 'forward' | 'back' | 'replace';

export function getTransitionDirection({
  fromIndex,
  toIndex,
}: {
  fromIndex?: number;
  toIndex: number;
}): RouteTransitionDirection {
  if (fromIndex === undefined || toIndex > fromIndex) return 'forward';
  if (toIndex < fromIndex) return 'back';
  return 'replace';
}
