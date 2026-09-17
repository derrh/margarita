# Margarita

A study in real-time UI. This repository currently contains only the development and deployment foundation.

[Live app](https://margarita.derr-b37.workers.dev) · [CI runs](https://github.com/derrh/margarita/actions/workflows/ci.yml)

## Develop locally

Use Node 24 and pnpm 10.27.0.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Vite. The app runs in the Cloudflare Workers runtime through the Cloudflare Vite plugin.

## Verify changes

```sh
pnpm check
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

Pull requests run formatting, lint, TypeScript, production build, and browser smoke checks. Pushes to `main` deploy the tested build after those checks pass. The workflow then checks the production response. You can also run the workflow manually on `main`.

The GitHub `production` environment uses these settings. The API token can also be stored as a repository secret.

| Setting | Kind | Purpose |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | Secret | Cloudflare API token with Workers Scripts Edit and Account Settings Read for the deployment account |
| `CLOUDFLARE_ACCOUNT_ID` | Variable | Deployment account ID |
| `PRODUCTION_URL` | Variable | Worker URL used by the deployment check |

To deploy from your machine, authenticate with `pnpm --filter @margarita/web exec wrangler login`, then run `pnpm deploy`.

To roll back, run `pnpm --filter @margarita/web exec wrangler rollback`. Follow the Wrangler prompt to choose the previous deployment. Revert the corresponding Git commit before the next deployment.

The setup follows [Cloudflare's TanStack Start guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/). It uses the default TanStack server entrypoint, Workers logs, and a committed pnpm lockfile. GitHub Actions are pinned to commit hashes. Dependabot checks package and action updates weekly.

## License

[MIT](LICENSE), copyright 2026 Derrick Hathaway.
