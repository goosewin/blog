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

## CI Image

Build the pinned local image on the Woodpecker Docker host before enabling the
repo. It includes the Bun version used locally plus `git`, `jq`, and `curl` for
the newsletter script.

```sh
cat >/tmp/blog-ci.Dockerfile <<'EOF'
FROM oven/bun:1.3.14-debian
RUN apt-get update \
  && apt-get install -y --no-install-recommends bash ca-certificates curl git jq \
  && rm -rf /var/lib/apt/lists/*
RUN bun --version && git --version && jq --version && curl --version
EOF

docker build \
  -f /tmp/blog-ci.Dockerfile \
  -t goosewin-blog-ci:bun-1.3.14-jq-curl \
  /tmp
```

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
