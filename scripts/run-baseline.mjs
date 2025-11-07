#!/usr/bin/env bun

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import waitOn from 'wait-on';

const BASELINE_DIR = resolve(process.cwd(), '.baseline');
const SUMMARY_PATH = resolve(BASELINE_DIR, 'summary.json');
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

async function probeRoute(route) {
  const url = new URL(route.path, ORIGIN).toString();
  const startTime = performance.now();

  try {
    const response = await fetch(url, {
      redirect: 'manual',
    });

    const endTime = performance.now();
    return {
      slug: route.slug,
      url,
      status: response.status,
      ok: response.ok,
      time: Number((endTime - startTime).toFixed(2)),
      headers: Object.fromEntries(response.headers.entries()),
    };
  } catch (error) {
    return {
      slug: route.slug,
      url,
      status: 0,
      ok: false,
      time: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function formatResult(result) {
  const status = result.ok ? '✅' : '⚠️';
  const time = result.time != null ? `${result.time}ms` : '—';
  return `${status} ${result.slug.padEnd(18)} → ${result.status.toString().padEnd(3)} ${time} ${result.url}`;
}

async function writeSummary(results) {
  const summary = {
    origin: ORIGIN,
    timestamp: new Date().toISOString(),
    results,
  };

  await writeFile(SUMMARY_PATH, JSON.stringify(summary, null, 2));
}

async function main() {
  console.log('▶️  Baseline probe started');
  await ensureBaselineDir();
  await waitForServer();

  const routes = await loadRoutes();
  console.log(`🔗 Probing ${routes.length} routes from ${ORIGIN}`);

  const results = [];
  for (const route of routes) {
    const result = await probeRoute(route);
    results.push(result);
    console.log(formatResult(result));
  }

  await writeSummary(results);
  console.log(`💾 Baseline summary written to ${SUMMARY_PATH}`);

  const failures = results.filter((result) => !result.ok);
  if (failures.length > 0) {
    console.warn(`⚠️  ${failures.length} route(s) returned non-OK responses.`);
    process.exitCode = 1;
  } else {
    console.log('✅ All routes responded with 2xx/3xx status codes.');
  }
}

main().catch((error) => {
  console.error('❌ Baseline probe failed');
  console.error(error);
  process.exit(1);
});
