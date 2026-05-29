// Install-time guard.
//
// The minimumReleaseAge supply-chain cooldown in bunfig.toml was added in
// Bun 1.3. Older Bun versions (and non-Bun package managers) silently ignore
// the setting, turning the cooldown into a no-op and giving false confidence.
// Fail the install loudly instead of skipping the gate quietly.

const bunVersion = (process.versions as Record<string, string | undefined>).bun;

if (!bunVersion) {
  console.error(
    'This project must be installed with Bun >= 1.3 — other package managers ignore the bunfig.toml minimumReleaseAge cooldown. Install Bun: https://bun.sh'
  );
  process.exit(1);
}

const [major = 0, minor = 0] = bunVersion.split('.').map(Number);

if (major < 1 || (major === 1 && minor < 3)) {
  console.error(
    `Bun ${bunVersion} is too old: the minimumReleaseAge cooldown in bunfig.toml was added in Bun 1.3 and is silently ignored by older versions. Run: bun upgrade`
  );
  process.exit(1);
}
