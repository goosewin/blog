#!/usr/bin/env bun
/// <reference types="bun" />

const requiredBunVersion = '1.3.14';
const repoRootUrl = new URL('../', import.meta.url);
const repoRootPath = Bun.fileURLToPath(repoRootUrl);
const preinstallMode = Bun.argv.includes('--preinstall');

const forbiddenLockfiles = [
  // Non-Bun package manager lockfiles.
  'package-lock.json',
  'npm-shrinkwrap.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  // Bun's binary lockfile is disallowed because this repo standardizes on bun.lock.
  'bun.lockb',
];

const scannedExtensions = [
  '.cjs',
  '.cts',
  '.js',
  '.jsx',
  '.json',
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
  'scripts/enforce-bun-policy.ts',
  'scripts/check-bun-version.ts',
  'bun.lock',
]);

const ignoredPathFragments = [
  '/.agents/',
  '/.claude/',
  '/.codex/',
  '/.cursor/',
  '/.git/',
  '/convex/_generated/',
  '/legacy-source/',
  '/node_modules/',
];

// Matches authored npm/pnpm/yarn/npx invocations with install/run-style
// subcommands. Capture group 1 is the allowed prefix; keep it aligned with
// the line-number offset below.
const packageManagerCommandPattern =
  /(^|[\s"'`([{;&|])(?:(?:npm|pnpm|yarn)\s+(?:add|audit|build|ci|config|create|dev|dlx|exec|format|i|info|init|install|link|lint|login|outdated|pack|publish|rebuild|remove|run|show|start|test|unlink|update|upgrade|version|view|x)\b|npx\s+[-@./\w])/g;

function fail(message: string): never {
  console.error(`\nBun policy violation: ${message}\n`);
  const bunExit = (Bun as typeof Bun & { exit?: (code?: number) => never })
    .exit;
  if (bunExit) return bunExit(1);
  process.exit(1);
}

function compareVersions(a: string, b: string): number {
  const left = a.split('.').map((part) => Number(part));
  const right = b.split('.').map((part) => Number(part));
  const length = Math.max(left.length, right.length);

  for (let index = 0; index < length; index += 1) {
    const diff = (left[index] ?? 0) - (right[index] ?? 0);
    if (diff !== 0) return diff;
  }

  return 0;
}

async function readPackageJson() {
  return Bun.file(new URL('package.json', repoRootUrl)).json();
}

function listTrackedFiles(): string[] | null {
  let result;
  try {
    result = Bun.spawnSync(['git', 'ls-files'], {
      cwd: repoRootPath,
      stdout: 'pipe',
      stderr: 'pipe',
    });
  } catch {
    return null;
  }

  if (result.exitCode !== 0) {
    return null;
  }

  return new TextDecoder().decode(result.stdout).split('\n').filter(Boolean);
}

async function listCandidateFiles(): Promise<string[]> {
  const trackedFiles = listTrackedFiles();
  if (trackedFiles) return trackedFiles;

  const files: string[] = [];
  const glob = new Bun.Glob('**/*');
  for await (const path of glob.scan({
    cwd: repoRootPath,
    dot: true,
    onlyFiles: true,
  })) {
    files.push(path);
  }

  return files;
}

function shouldScanFile(path: string): boolean {
  if (ignoredPaths.has(path)) return false;
  if (ignoredPathFragments.some((fragment) => `/${path}`.includes(fragment))) {
    return false;
  }

  return scannedExtensions.some((extension) => path.endsWith(extension));
}

function lineNumberForOffset(source: string, offset: number): number {
  let line = 1;
  for (let index = 0; index < offset; index += 1) {
    if (source.charCodeAt(index) === 10) line += 1;
  }
  return line;
}

async function checkPackageManagerMetadata() {
  const packageJson = await readPackageJson();
  const expectedPackageManager = `bun@${requiredBunVersion}`;

  if (packageJson.packageManager !== expectedPackageManager) {
    fail(
      `packageManager must be "${expectedPackageManager}", found ${JSON.stringify(packageJson.packageManager)}`
    );
  }

  if (packageJson.engines?.bun !== `>=${requiredBunVersion}`) {
    fail(`engines.bun must be ">=${requiredBunVersion}"`);
  }
}

async function checkLockfiles() {
  const missingBunLock = !(await Bun.file(
    new URL('bun.lock', repoRootUrl)
  ).exists());
  if (missingBunLock) {
    fail('bun.lock is required');
  }

  const presentForbiddenLockfiles = [];
  for (const filename of forbiddenLockfiles) {
    if (await Bun.file(new URL(filename, repoRootUrl)).exists()) {
      presentForbiddenLockfiles.push(filename);
    }
  }

  if (presentForbiddenLockfiles.length > 0) {
    fail(`remove non-Bun lockfiles: ${presentForbiddenLockfiles.join(', ')}`);
  }
}

async function checkAuthoredPackageManagerCommands() {
  const violations = [];

  for (const path of await listCandidateFiles()) {
    if (!shouldScanFile(path)) continue;

    const source = await Bun.file(new URL(path, repoRootUrl)).text();
    packageManagerCommandPattern.lastIndex = 0;

    for (
      let match = packageManagerCommandPattern.exec(source);
      match;
      match = packageManagerCommandPattern.exec(source)
    ) {
      const command = match[0].trim();
      const commandOffset = match.index + match[1].length;
      violations.push(
        `${path}:${lineNumberForOffset(source, commandOffset)} uses ${command}`
      );
    }
  }

  if (violations.length > 0) {
    fail(`use bun/bunx instead:\n${violations.join('\n')}`);
  }
}

if (preinstallMode) {
  const userAgent = Bun.env.npm_config_user_agent ?? '';
  if (!userAgent.startsWith('bun/')) {
    fail(
      `install dependencies with "bun install" only; detected ${userAgent || 'an unknown package manager'}`
    );
  }
}

if (compareVersions(Bun.version, requiredBunVersion) < 0) {
  fail(`Bun ${requiredBunVersion} or newer is required; found ${Bun.version}`);
}

await checkPackageManagerMetadata();
await checkLockfiles();
if (!preinstallMode) {
  await checkAuthoredPackageManagerCommands();
}
