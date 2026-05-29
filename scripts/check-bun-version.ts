// Install-time guard for the bunfig.toml `minimumReleaseAge` cooldown.
//
// `minimumReleaseAge` only exists in Bun >= 1.3. Older Bun and non-Bun managers
// (npm/yarn/pnpm) ignore the setting, so the supply-chain cooldown would be a
// silent no-op. This hook always executes under `bun` (its command is
// `bun scripts/...`), so `process.versions.bun` can't tell us who *invoked* the
// install — `npm install` on a Bun-equipped machine would still pass. We read
// `npm_config_user_agent` instead, which reflects the invoking package manager
// and its version (e.g. "bun/1.3.14 npm/? node/..." vs "npm/11.12.1 node/...").

function fail(message: string): never {
  console.error(
    `\n[install blocked] ${message}\nSee the Dependency policy in AGENTS.md.\n`
  );
  process.exit(1);
}

const userAgent = process.env.npm_config_user_agent ?? '';
const bunMatch = /(?:^|\s)bun\/(\d+)\.(\d+)\.\d+/.exec(userAgent);

if (!bunMatch) {
  // No "bun/x.y.z" in the user agent: either a non-Bun manager invoked the
  // install, or the script was run directly with no user agent (e.g. a git
  // hook). Trust the runtime only in the latter (no-agent) case.
  const runtime = (process.versions as Record<string, string | undefined>).bun;
  const [rMajor = 0, rMinor = 0] = (runtime ?? '').split('.').map(Number);

  if (userAgent === '' && (rMajor > 1 || (rMajor === 1 && rMinor >= 3))) {
    process.exit(0);
  }

  fail(
    `this project must be installed with Bun >= 1.3 (saw "${userAgent || 'no package-manager user agent'}"). ` +
      `Other package managers ignore the bunfig.toml minimumReleaseAge cooldown. Install Bun: https://bun.sh`
  );
}

const major = Number(bunMatch[1]);
const minor = Number(bunMatch[2]);

if (major < 1 || (major === 1 && minor < 3)) {
  fail(
    `Bun ${major}.${minor}.x is too old — minimumReleaseAge was added in Bun 1.3 and is silently ignored ` +
      `by older versions. Upgrade with: bun upgrade`
  );
}
