# Lessons learned

Long-term memory for AI agents working on this project. **Read this before starting any task.**

Add an entry after fixing a bug, hitting a non-obvious pitfall, or discovering anything worth remembering. Update or delete entries that turn out to be wrong. One bullet per lesson, grouped by topic:

```markdown
- **YYYY-MM-DD — <short title>** — <what happened / what to do instead>. [details](lessons/YYYY-MM-DD-slug.md)
```

The `[details]` link is optional — add a file in [`lessons/`](lessons/) only when the lesson needs a longer write-up.

## General

- **2026-10-17 — Docker `npm ci` tries to compile better-sqlite3** — npm runs `node-gyp rebuild` because the package has a `binding.gyp`, which fails without Python/a compiler. better-sqlite3 ships prebuilt binaries (musl included), so the Dockerfile uses `npm ci --ignore-scripts`.
- **2026-10-17 — GitHub Actions secret names can't start with `GITHUB_`** — so the OAuth credentials are `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` everywhere (Actions secret, `.kamal/secrets`, env, `loadConfig`). Keep one name per value end to end.
- **2026-10-17 — shadcn v4 imports `cn` from the `cn` npm package** — `import { cn } from "cn"` in generated components is correct, not a broken alias. The `new-york` style is legacy; this repo uses `radix-nova`.

- **2026-10-17 — Project URLs use the integer id, not a stored slug** — the slug was made from the title at creation and never changed, so "test" renamed to "CPG" still lived at `/projects/test`. Routes are now `/projects/[id]` (parsed with `parseProjectId`) and the `slug` column is gone; don't bring back stored slugs.
- **2026-10-17 — Run `npm ci` in a fresh worktree first** — a cezar worktree has no `node_modules`, so Node resolves up to the main checkout's, whose `@atl/*` symlinks point at the *main* checkout's packages. A component just added to `packages/ui` in the worktree then "doesn't exist" for typecheck/build. Install in the worktree before building or dispatching subagents.
- **2026-10-17 — Mobile overflow: `grid lg:grid-cols-…` and bare `flex-1`** — below the breakpoint such a grid has one `auto` track that grows to the widest unbreakable token (a path, a skill name), widening the whole page. Write `grid grid-cols-1 lg:grid-cols-…`, give `flex-1`/grid children `min-w-0` (plus `break-words` for long tokens), and let tight chip rows `flex-wrap`. But a `min-w-0 flex-1` label in a wrapping row shrinks instead of wrapping: give it a real minimum (`min-w-28`). [details](lessons/2026-10-17-mobile-overflow-checks.md)
- **2026-10-17 — "Text is cut off" may be unsaved edits** — the details page showed exactly what the database held; the newer text existed only in an edit form that was never saved. Compare with the stored row before touching CSS.

## Next.js

- **2026-10-17 — One ORM per bundle, keyed by entity identity** — Next.js gives route handlers, pages and instrumentation separate copies of `@atl/db`, and MikroORM matches entities by object identity. Never cache the container/ORM on `globalThis` under a string key; `getContainer()` keys it by the `entities` array. [details](lessons/2026-10-17-mikroorm-entity-identity-next-bundles.md)
- **2026-10-17 — Dynamic `fs` paths make Turbopack trace the whole project** — paths built from env/`process.cwd()` pull every source file into the standalone output. Mark them with `/* turbopackIgnore: true */` (see `packages/core/src/config.ts`).
- **2026-10-17 — `GET` route handlers get prerendered as static** — even when they read `request.nextUrl` or `request.cookies`, `next build` marked `/auth/github` as `○ Static`, which would have frozen the OAuth state into the build. Call `await connection()` first in any handler that must run per request, and check the route table (`ƒ`) after building.
- **2026-10-17 — `cookies()` alone doesn't stop dev prerender validation** — `getViewer()` read the cookie, then MikroORM called `Date.now()` inside `findOne`, and Next logged "unstable value `Date.now()` while prerendering" on every page. `getViewer()` now calls `await connection()` first; do the same in any helper that queries before a dynamic API.
- **2026-10-17 — Dev server reload loop ("HMR hash mismatch")** — after deleting the SQLite file and editing files while `next dev` was running, every page reloaded endlessly (`[Fast Refresh] rebuilding` → `reloadPage`). Stop the dev server, `rm -rf packages/app/.next/dev`, start again. Never delete the database under a running server; stop it first.
- **2026-10-17 — `proxy.ts` can't see the router headers** — Next strips `rsc`, `next-router-prefetch`, `next-router-state-tree` and `next-router-segment-prefetch` before calling the proxy, so prefetches and client navigations look like plain `GET`s there. Only the matcher's `has`/`missing` can see them. Don't build proxy logic on those headers.
- **2026-10-17 — `pkill -f "next start"` leaves `next-server` running** — the npm wrapper dies, the server child keeps port 3000, and the next `npm start` fails with `EADDRINUSE` while curl happily talks to the old build. Kill `next-server` too, and check `lsof -iTCP:3000` before testing.
- **2026-10-17 — Deleting a route breaks `next build` via stale dev types** — `next build` type-checks `.next/dev/types/validator.ts`, which `next dev` generated and which still imports the deleted page (`Cannot find module '…/how-to-auth/page.js'`). With the dev server stopped, `rm -rf packages/app/.next/dev/types` and build again.
