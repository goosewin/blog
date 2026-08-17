export function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const [first] = forwarded.split(',');
    const trimmed = first?.trim();
    if (trimmed) return trimmed;
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}
