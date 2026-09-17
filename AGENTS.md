# Margarita

Margarita is a study in real-time UI. The current scope is the repository and deployment foundation. Do not add product features without an explicit request.

- Use pnpm from the repository root. Node 24 is the supported runtime.
- `apps/web` contains the TanStack Start app and Cloudflare Worker configuration.
- `packages/*` is reserved for shared workspace packages. Add packages only when needed.
- Run `pnpm check`, `pnpm build`, `pnpm typecheck`, and `pnpm test` before shipping changes. Build first to generate TanStack route types.
- The browser smoke tests run the production build with the Cloudflare Workers runtime.
- Keep credentials out of source control. CI uses GitHub environment secrets.
- Keep action references pinned to full commit hashes. Verify artifact upload, download, and Wrangler dry-run checks when changing CI actions.
- Run `pnpm audit --audit-level=low` before shipping dependency changes. Do not bypass pnpm trust controls or broaden install-script allowances to make an update pass.
- Keep this foundation minimal. Do not add speculative abstractions, services, or UI.
