# Margarita

A study in real-time UI. This repository currently contains only the development and deployment foundation.

[Live app](https://margarita.derr-b37.workers.dev) · [CI runs](https://github.com/derrh/margarita/actions/workflows/ci.yml)

## Develop locally

Use Node 24 and pnpm 10.34.5.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Vite. The app runs in the Cloudflare Workers runtime through the Cloudflare Vite plugin.

## Verify changes

```sh
pnpm check
pnpm audit --audit-level=low
pnpm build
pnpm typecheck
pnpm --filter @margarita/web exec playwright install chromium
pnpm test
```

Build before type-checking to generate TanStack's route tree. Browser tests start the production preview and check server rendering, browser loading, and HTTP 404 responses.

Run `pnpm format` to apply formatting and import ordering.

## Workspace

- `apps/web`: TanStack Start, React, Vite, and the Cloudflare Worker configuration.
- `packages/*`: workspace location for shared packages when needed.
- `.github/workflows/ci.yml`: validation and production deployment.

## Deployment

Pull requests review dependency changes for known vulnerabilities, audit the dependency tree, and run formatting, lint, TypeScript, build, and browser checks. Every successful build is uploaded as an artifact. A separate job downloads it, runs the browser checks against that artifact, and performs a Wrangler deployment dry run without credentials.

Pushes to `main` deploy the verified artifact after both jobs pass. The workflow then checks the production response. You can also run the workflow manually on `main`. Daily scheduled runs audit and verify the current foundation without deploying.

Store the deployment token only in the GitHub `production` environment, which allows deployments from `main`. Do not store it as a repository secret. The deployment job disables dependency install scripts and dependency caching. Only the Wrangler deployment step receives the token.

| Setting | Kind | Purpose |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | Secret | Cloudflare API token with Workers Scripts Edit and Account Settings Read for the deployment account |
| `CLOUDFLARE_ACCOUNT_ID` | Variable | Deployment account ID |
| `PRODUCTION_URL` | Variable | Worker URL used by the deployment check |

To deploy from your machine, authenticate with `pnpm --filter @margarita/web exec wrangler login`, then run `pnpm deploy`.

To roll back, run `pnpm --filter @margarita/web exec wrangler rollback`. Follow the Wrangler prompt to choose the previous deployment. Revert the corresponding Git commit before the next deployment.

The setup follows [Cloudflare's TanStack Start guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/). It uses the default TanStack server entrypoint, Workers logs, and a committed pnpm lockfile. GitHub Actions are pinned to commit hashes. Dependabot checks package and action updates weekly.

## Dependency security

GitHub requires full commit hashes for actions and permits only the actions used by this workflow. Dependabot vulnerability alerts and security updates are enabled. Pull-request dependency review and `pnpm audit --audit-level=low` block known vulnerabilities, including development dependencies. Registry or audit failures fail the checks rather than silently passing them.

pnpm applies a seven-day minimum release age when resolving new versions, rejects publisher trust downgrades, and blocks exotic transitive sources such as arbitrary Git repositories and tarball URLs. Frozen installs preserve the reviewed lockfile. The release-age setting does not retroactively age out the existing lockfile.

Only the exact esbuild and workerd versions listed in `pnpm-workspace.yaml` may run install scripts. A new version with an install script needs an explicit review and allowlist update. Unreviewed install scripts fail installation.

Dependabot groups minor and patch npm updates, leaves major npm updates separate, and groups action updates so upload and download changes are tested together. Version updates have a seven-day cooldown. Security updates need prompt review and may require an explicit, version-specific release-age exception for an urgent fix. Never add a blanket exception.

These controls reduce exposure but do not prove that dependencies are benign. Build tools execute code, and Wrangler must receive the deployment token. Keep its Cloudflare permissions limited to the deployment account and rotate it after suspected exposure.

## License

[MIT](LICENSE), copyright 2026 Derrick Hathaway.
