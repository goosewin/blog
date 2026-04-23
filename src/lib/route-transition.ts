export function getTransitionDirection({
  fromIndex,
  toIndex,
}: {
  fromIndex?: number;
  toIndex: number;
}) {
  if (fromIndex === undefined || toIndex > fromIndex) return 'forward';
  if (toIndex < fromIndex) return 'back';
  return 'replace';
}
