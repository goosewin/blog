#!/usr/bin/env bun

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import pa11y from 'pa11y';
import waitOn from 'wait-on';

const BASELINE_DIR = resolve(process.cwd(), '.baseline/a11y');
const ROUTES_PATH = resolve(process.cwd(), '.config/baseline-routes.json');
const ORIGIN = process.env.BASELINE_ORIGIN ?? 'http://localhost:3000';

async function ensureBaselineDir() {
  await mkdir(BASELINE_DIR, { recursive: true });
}

async function waitForServer() {
  const resource = `${ORIGIN.replace(/\/$/, '')}/`;
  await waitOn({
    resources: [resource],
    timeout: 120000,
    validateStatus(status) {
      return status < 500;
    },
  });
}

async function loadRoutes() {
  const file = await readFile(ROUTES_PATH, 'utf-8');
  return JSON.parse(file);
}

async function auditRoute(route) {
  const url = new URL(route.path, ORIGIN).toString();

  const runner = await pa11y(url, {
    timeout: 60000,
    standard: 'WCAG2AA',
    chromeLaunchConfig: {
      executablePath: process.env.CHROME_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });

  const issues = runner.issues.map((issue) => ({
    code: issue.code,
    message: issue.message,
    selector: issue.selector,
    type: issue.type,
    typeCode: issue.typeCode,
    context: issue.context,
  }));

  const reportPath = resolve(BASELINE_DIR, `${route.slug}.json`);
  await writeFile(
    reportPath,
    JSON.stringify(
      {
        slug: route.slug,
        url,
        timestamp: new Date().toISOString(),
        issues,
      },
      null,
      2
    )
  );

  return { slug: route.slug, url, issuesCount: issues.length };
}

async function main() {
  console.log('🧪 Running accessibility audits with pa11y');
  await ensureBaselineDir();
  await waitForServer();

  const routes = await loadRoutes();
  const results = [];

  for (const route of routes) {
    try {
      const result = await auditRoute(route);
      results.push(result);
      const statusIcon = result.issuesCount === 0 ? '✅' : '⚠️';
      console.log(
        `${statusIcon} ${route.slug} → ${result.issuesCount} issues (${result.url})`
      );
    } catch (error) {
      console.error(`❌ Failed to audit ${route.slug}`);
      console.error(error);
      results.push({
        slug: route.slug,
        url: new URL(route.path, ORIGIN).toString(),
        issuesCount: -1,
      });
    }
  }

  const summaryPath = resolve(BASELINE_DIR, 'summary.json');
  await writeFile(
    summaryPath,
    JSON.stringify(
      {
        origin: ORIGIN,
        timestamp: new Date().toISOString(),
        results,
      },
      null,
      2
    )
  );

  const failures = results.filter(
    (result) => result.issuesCount > 0 || result.issuesCount < 0
  );
  if (failures.length > 0) {
    console.warn(
      `⚠️  ${failures.length} route(s) reported accessibility issues. See ${BASELINE_DIR}`
    );
  } else {
    console.log('✅ No WCAG 2.1 AA issues detected by pa11y');
  }
}

main().catch((error) => {
  console.error('❌ pa11y baseline failed');
  console.error(error);
  process.exit(1);
});
