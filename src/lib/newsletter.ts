export function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isSlugArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

export function dedupeSlugs(slugs: string[]) {
  const seen = new Set<string>();
  const dedupedSlugs: string[] = [];

  for (const slug of slugs) {
    const normalizedSlug = slug.trim();

    if (seen.has(normalizedSlug)) continue;

    seen.add(normalizedSlug);
    dedupedSlugs.push(normalizedSlug);
  }

  return dedupedSlugs;
}

export function getRequestedNewsletterSlugs(body: Record<string, unknown>) {
  if (Object.hasOwn(body, 'slugs')) {
    return isSlugArray(body.slugs) ? dedupeSlugs(body.slugs) : [];
  }

  if (!Array.isArray(body.posts)) {
    return [];
  }

  const slugs: string[] = [];

  for (const post of body.posts) {
    if (
      typeof post !== 'object' ||
      post === null ||
      !isNonEmptyString((post as { slug?: unknown }).slug)
    ) {
      return [];
    }

    slugs.push((post as { slug: string }).slug);
  }

  return dedupeSlugs(slugs);
}

export function isNewsletterDryRun(body: Record<string, unknown>) {
  return body.dryRun === true;
}
