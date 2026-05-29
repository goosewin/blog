declare module 'virtual:post-heroes' {
  // Maps a post slug to its on-page hero image path (the LCP candidate).
  // Slugs without a body-rendered cover are absent, so indexing yields
  // `string | undefined`.
  export const postHeroes: Record<string, string | undefined>;
}
