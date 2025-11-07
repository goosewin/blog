import type { StaticImageData } from 'next/image';

import babyGooseTakingRisks from '@/public/images/baby-goose-taking-risks.jpg';
import devrelTheGooseWay from '@/public/images/devrel-the-goose-way.png';
import goosePortrait from '@/public/images/goosewin.jpg';
import noiseExplosionStats from '@/public/images/noise-explosion-stats.png';
import pexelsArmandoAre1 from '@/public/images/pexels-armandoare1-3759364.jpg';
import rubberDuckCollection from '@/public/images/rubber-duck-collection.jpg';
import screenTimeByAge from '@/public/images/screen-time-by-age.png';
import signalToNoiseCrisis from '@/public/images/signal-to-noise-crisis-2025.png';

const FALLBACK_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

const images = {
  portrait: {
    src: goosePortrait,
    alt: 'Portrait of Dan Goosewin smiling outdoors.',
  },
  screenTimeByAge: {
    src: screenTimeByAge,
    alt: 'Attention span distribution by age in September 2025.',
  },
  devrelTheGooseWay: {
    src: devrelTheGooseWay,
    alt: 'Illustration summarizing the DevRel - The Goose Way principles.',
  },
  signalToNoiseCrisis: {
    src: signalToNoiseCrisis,
    alt: 'Signal-to-noise ratio chart for information sources in 2025.',
  },
  noiseExplosionStats: {
    src: noiseExplosionStats,
    alt: 'Bar chart showing increase in digital noise across channels.',
  },
  babyGooseTakingRisks: {
    src: babyGooseTakingRisks,
    alt: 'Young goose standing near the water, ready to take a leap.',
  },
  pexelsArmandoAre1: {
    src: pexelsArmandoAre1,
    alt: 'Person holding a vibrant yellow rubber duck next to a laptop.',
  },
  rubberDuckCollection: {
    src: rubberDuckCollection,
    alt: 'A colorful collection of rubber ducks arranged together.',
  },
} satisfies Record<
  string,
  {
    src: StaticImageData;
    alt: string;
  }
>;

export const siteImages = images;

export type SiteImageName = keyof typeof siteImages;

export function getSiteImage(name: SiteImageName) {
  return siteImages[name];
}

export function getBlurData(image: StaticImageData | undefined) {
  return image?.blurDataURL ?? FALLBACK_BLUR;
}

export const imageSizes = {
  article: '(min-width: 1280px) 960px, (min-width: 768px) 720px, 100vw',
  inline: '(min-width: 1024px) 240px, (min-width: 640px) 40vw, 100vw',
  avatar: '160px',
  fullBleed: '100vw',
};
