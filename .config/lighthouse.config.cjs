const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const routesPath = resolve(__dirname, 'baseline-routes.json');
const routes = JSON.parse(readFileSync(routesPath, 'utf-8'));

const baseOrigin = process.env.BASELINE_ORIGIN || 'http://localhost:3000';

const urls = routes.map((route) => {
  const url = new URL(route.path, baseOrigin);
  return url.toString();
});

module.exports = {
  ci: {
    collect: {
      url: urls,
      numberOfRuns: 3,
      startServerCommand: process.env.LHCI_START_SERVER || undefined,
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 120000,
      settings: {
        chromeFlags: '--headless=new',
        throttlingMethod: 'devtools',
        throttling: {
          rttMs: 40,
          throughputKbps: 10_240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        'interactive': ['warn', { maxNumericValue: 3000 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.baseline/lighthouse',
    },
  },
};
