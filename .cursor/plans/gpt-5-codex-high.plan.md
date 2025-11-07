<!-- 68545b45-345b-4f47-8cd2-ccf417f91963 81d5351d-b281-434f-ba74-8366a5458075 -->

# Ultimate UX Overhaul

## Baseline Findings

- `app/components/theme-provider.tsx` short-circuits SSR (returns `null` before hydrate) and Root `<html>` defaults to `dark`, causing blank flashes and jarring light/dark swaps.
- `app/components/subscription-form.tsx` imports `Activity` from `react` (typo) and lacks loading/validation affordances on small screens; layout breaks on narrow viewports.
- Navigation and layout (`app/components/navigation.tsx`, `page-layout.tsx`) fall back to absolute positioning without focus/aria state, creating usability issues past `sm` breakpoints and no skip-link.
- Content presentation is text-heavy with limited hierarchy (hero, about, work, blog detail) and no card/media system; the current palette lacks contrast guidance and micro-interactions feel inconsistent.
- Structured data, OG imagery, and email flows exist but miss modern touches (reading time, share metadata, automated analytics, proactive performance budgets).

## Phase 1 – Stabilize Foundations

- Refactor theming (`app/layout.tsx`, `theme-provider.tsx`, `theme-effect.ts`) to hydrate with SSR-friendly defaults, persist user preference, and expose CSS custom properties for light/dark without blank states.
- Rebuild navigation (`components/navigation.tsx`, `page-layout.tsx`) with accessible primitives: release mobile menu from absolute hacks, add `aria-expanded`, trap focus, integrate a header bar and `Skip to content` link.
- Fix subscription flow: correct icon import, add debounce + progressive disclosure, validate and surface errors inline, and make the form stack vertically under 360px.
- Introduce a shared utility layer (`app/components/ui/*`, tokens in `globals.css`) and clean up Tailwind usage for predictable spacing, border, and typography scales.

## Phase 2 – Visual Identity & Layout System

- Establish a design token map (colors, spacing, typography, shadows) in `globals.css` and optional `styles/theme.css`, supporting light/dark/high-contrast variants and media queries.
- Redesign the home hero (`app/page.tsx`) into an immersive narrative: responsive grid, portrait, primary CTAs, social proof, and interactive resume/download cards.
- Build reusable sections (e.g., `FeatureSection`, `TestimonialCarousel`, `CaseStudyCard`) with framer-motion micro-interactions that degrade gracefully to CSS transitions.
- Rework `about`, `work`, and `contact` pages into rich storytelling modules (timeline, map, endorsements, contact CTA bar) using the new component library.

## Phase 3 – Content & Engagement Enhancements

- Expand blog experience: add `ReadingTime`, `Series`, and share panel components inside `app/components/blog/*`; support MDX callouts/embeds via `mdx-components.tsx`.
- Add contextual CTAs (related posts, newsletter prompts) with smart placement and `IntersectionObserver` triggers, ensuring Lighthouse-friendly lazy loading.
- Enhance `work` page by integrating live GitHub/LinkedIn badges, role filters, and animated metrics sourced via cached fetchers in `lib/*`.
- Introduce a `Now` or `Signals` section (new route) with real-time updates, leveraging `cacheLife`/`revalidate` for freshness without performance regressions.

## Phase 4 – Performance, Accessibility & Quality

- Audit Lighthouse, axe, and WebPageTest after each redesign step; enforce performance budgets via CI (GitHub Action) and add bundle analysis to detect regressions.
- Optimize assets: generate responsive image sets (`next/image` with blur placeholders), prefetch critical routes, and tune `next-sitemap`/`app/opengraph-image.tsx` for richer previews.
- Add comprehensive metadata: JSON-LD for person, article, breadcrumb; implement canonical tags per route and extend newsletter tracking with UTM helpers.
- Harden accessibility: keyboard traps, focus outlines, prefers-reduced-motion guards, semantic landmarks, and unit/integration tests (Playwright) for nav, modals, forms.

## Phase 5 – Growth & Continuous Optimization

- Reinforce newsletter pipeline (double opt-in notice, welcome journey analytics, `/app/emails/*` tone refresh) and build an archive page.
- Wire up analytics dashboards (Vercel Analytics, optional PostHog) with event schemas for CTA clicks, reading completion, and theme toggles.
- Implement content authoring tooling: MDX linting, preview server, and automated RSS/Atom feed to broaden distribution.
- Schedule periodic UX reviews with heatmaps/user testing, capturing insights in repo docs (`/docs/ux-playbook.md`) to maintain “best on earth” quality.

### To-dos

- [ ] Fix theming, navigation, and subscription form foundations before visual redesign.
- [ ] Create responsive visual identity and component library underpinning all pages.
- [ ] Enhance content, blog, and engagement flows with interactive storytelling.
- [ ] Lock in Lighthouse, accessibility, and testing automation to guard regressions.
- [ ] Elevate newsletter, analytics, and continuous UX iteration practices.
