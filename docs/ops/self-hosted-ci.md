# Self-hosted CI

The blog uses self-hosted Woodpecker for CI and newsletter dispatch. GitHub
Actions stays disabled while the Goosewin repos are using the Hetzner-backed
Woodpecker path instead of GitHub-hosted Actions minutes.

## Repo Contract

The checked-in workflow is `.woodpecker/blog.yml`.

The `critical` step runs on pushes, pull requests, and manual Woodpecker runs:

- `bun install --frozen-lockfile`
- `bun run lint`
- `bun run format:check`
- `bun run typecheck`
- `bun run test`
- `bun run build`

The `newsletter` step runs only for pushes to `main` that add `posts/*.mdx`.
It sends through the existing `scripts/send-newsletter.sh` path after the
critical checks pass.

Both steps use the pinned public `oven/bun:1.3.14-debian` image. The newsletter
step installs `curl`, `git`, and `jq` at runtime because those tools are needed
only for dispatch.

The clone step uses `depth: 0` so newsletter dispatch can compare against
`CI_PREV_COMMIT_SHA` even after large pushes. The newsletter script still fetches
the previous commit explicitly if a CI checkout is missing it.

## Woodpecker Setup

1. Activate `goosewin/blog` in the existing `ci.goosewin.com` Woodpecker
   instance.
2. Keep the default pipeline path so Woodpecker discovers `.woodpecker/*.yml`.
3. Enable push and pull-request hooks for the repo.
4. Add repository secrets for the newsletter step:

```sh
woodpecker-cli repo secret add \
  --repository goosewin/blog \
  --name site_url \
  --value https://goose.dev \
  --event push

woodpecker-cli repo secret add \
  --repository goosewin/blog \
  --name newsletter_secret \
  --value <NEWSLETTER_SECRET> \
  --event push
```

5. Require the Woodpecker `blog` status in GitHub branch protection. Do not
   require the disabled GitHub Actions workflow.

Manual newsletter sends should use `bun run newsletter -- <post-slug>` from a
trusted shell with `SITE_URL` and `NEWSLETTER_SECRET` set.
