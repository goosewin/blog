#!/usr/bin/env tsx

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const requiredPackageManager = 'pnpm@11.17.0';
const repoRoot = fileURLToPath(new URL('../', import.meta.url));

const forbiddenFiles = [
  // Bun is not used in this repo.
  'bun.lock',
  'bun.lockb',
  'bunfig.toml',
  // Other package managers' lockfiles.
  'package-lock.json',
  'npm-shrinkwrap.json',
  'yarn.lock',
];

const scannedExtensions = [
  '.cjs',
  '.cts',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mdx',
  '.mjs',
  '.mts',
  '.sh',
  '.toml',
  '.ts',
  '.tsx',
  '.yaml',
  '.yml',
];

const ignoredPaths = new Set([
  'scripts/enforce-pnpm-policy.ts',
  'eslint.config.mjs',
  'pnpm-lock.yaml',
]);

const ignoredPathFragments = [
  '/.agents/',
  '/.claude/',
  '/.codex/',
  '/.cursor/',
  '/.git/',
  '/.next/',
  '/legacy-source/',
  '/node_modules/',
];

// A line carrying this marker is exempt, so docs can spell out what is banned.
const allowMarker = 'pnpm-policy: allow-bun';

// Authored Bun invocations: `bun <subcommand>`, `bunx <pkg>`, `bun:test`
// imports, and Bun's Docker images.
const bunUsagePattern =
  /(^|[\s"'`([{;&|])(?:bun\s+(?:add|build|create|dev|i|init|install|link|outdated|pm|publish|remove|repl|run|start|test|unlink|update|upgrade|why|x)\b|bunx\s+[-@./\w]|oven\/bun\b)|["'`]bun:[a-z]+["'`]|@types\/bun/g;

const violations: string[] = [];

function fail(message: string): never {
  console.error(`\npnpm policy violation: ${message}\n`);
  process.exit(1);
}

function listTrackedFiles(): string[] | null {
  const result = spawnSync('git', ['ls-files'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  if (result.status !== 0 || typeof result.stdout !== 'string') return null;
  return result.stdout.split('\n').filter(Boolean);
}

function walk(directory: string, collected: string[]): string[] {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    const path = relative(repoRoot, absolute);
    if (ignoredPathFragments.some((fragment) => `/${path}/`.includes(fragment)))
      continue;
    if (entry.isDirectory()) {
      walk(absolute, collected);
    } else if (entry.isFile()) {
      collected.push(path);
    }
  }
  return collected;
}

function listCandidateFiles(): string[] {
  return listTrackedFiles() ?? walk(repoRoot, []);
}

function shouldScanFile(path: string): boolean {
  if (ignoredPaths.has(path)) return false;
  if (ignoredPathFragments.some((fragment) => `/${path}`.includes(fragment)))
    return false;
  return scannedExtensions.some((extension) => path.endsWith(extension));
}

function checkPackageManagerMetadata() {
  const packageJson = JSON.parse(
    readFileSync(join(repoRoot, 'package.json'), 'utf8')
  );

  if (packageJson.packageManager !== requiredPackageManager) {
    violations.push(
      `package.json packageManager must be "${requiredPackageManager}", found ${JSON.stringify(
        packageJson.packageManager
      )}`
    );
  }

  if (packageJson.engines?.node !== '>=24.18.0') {
    violations.push('package.json engines.node must be ">=24.18.0"');
  }

  if (packageJson.engines?.bun) {
    violations.push('package.json must not declare engines.bun');
  }
}

function checkLockfiles() {
  if (!existsSync(join(repoRoot, 'pnpm-lock.yaml'))) {
    violations.push('pnpm-lock.yaml is required; run `vp install`');
  }

  for (const filename of forbiddenFiles) {
    if (existsSync(join(repoRoot, filename))) {
      violations.push(`remove ${filename}; this repo installs with pnpm only`);
    }
  }
}

function checkAuthoredBunUsage() {
  for (const path of listCandidateFiles()) {
    if (!shouldScanFile(path)) continue;

    const absolute = join(repoRoot, path);
    if (!existsSync(absolute)) continue;

    const lines = readFileSync(absolute, 'utf8').split('\n');
    lines.forEach((line, index) => {
      if (line.includes(allowMarker)) return;
      bunUsagePattern.lastIndex = 0;
      for (
        let match = bunUsagePattern.exec(line);
        match;
        match = bunUsagePattern.exec(line)
      ) {
        violations.push(`${path}:${index + 1} uses ${match[0].trim()}`);
      }
    });
  }
}

checkPackageManagerMetadata();
checkLockfiles();
checkAuthoredBunUsage();

if (violations.length > 0) {
  fail(`use pnpm (via \`vp\`) instead of Bun:\n${violations.join('\n')}`);
}
