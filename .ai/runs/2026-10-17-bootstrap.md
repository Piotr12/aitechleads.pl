# Bootstrap aitechleads.pl: GitHub login + project CRUD

**Date:** 2026-10-17
**Agent:** Claude Code (claude-opus-5-5)
**Spec:** none (requirements agreed in the session with the human)
**Status:** done (everything except the deploy, which the human holds back until DNS is ready)

## Goal

Copy an existing project skeleton (Next.js 16 monorepo, SQLite/MikroORM, Awilix, shadcn, Kamal) into this repo, renamed for aitechleads.pl, same VM (146.59.105.8), data in `/externaldata/aitechleads.pl`. Build a GitHub-login CRUD for projects people do as part of (or inspired by) the AI Tech Leaders training, which this site is **not** affiliated with. Copy: Monty Python / Pratchett humour. Decisions from the human:

- Arctic + database sessions, and zod, are OK.
- The project list is public; any GitHub account can sign in.
- The field list is fine as proposed.
- Use shadcn for the CRUD UI.
- Put OAuth setup instructions on a public `/how-to-auth` page.
- No backups (handled at VM level).
- Keep the disclaimer visible.
- Do everything except the deploy.

## Log

- Copied the skeleton's `HEAD` via `git archive`. Dropped its run logs, kept lessons. Renamed:
  - package scope → `@atl/*`
  - database file → `aitechleads.sqlite`
  - Kamal service and image → `aitechleads`
  - volume and hosts → aitechleads.pl
- Regenerated `package-lock.json` and a fresh initial migration (no DB existed yet).
- `SSH_PRIVATE_KEY`: verified `~/.ssh/my_slovenia_vm1_key` logs in to `ubuntu@146.59.105.8`, then set it on `Piotr12/aitechleads.pl` with `gh secret set`.
- VM check (read-only): `/externaldata/aitechleads.pl` exists, mode 777; `kamal-proxy` running.
- Entities: `User` (githubId unique), `Session` (id = sha256(token), cascade on user delete), `Project` (unique slug, status enum, JSON tags, owner, `hidden` for moderation). Services `projects` / `sessions` registered by `registerDb` (scoped).
- `requestScope()` is now memoized per request with React `cache`. Otherwise the session check and the page would use different `em` forks, which is a problem when passing the viewer's `User` entity into `projects.create`.
- OAuth secret names: GitHub forbids Actions secrets starting with `GITHUB_`, so it's `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` throughout.
- `www` → apex redirect in `next.config.ts`, so the state cookie and the callback are always on one host.
- **Bug found by build output:** `/auth/github` and `/auth/github/callback` were `○ Static`. Fixed with `await connection()`. Recorded as a lesson.
- **Bug found in dev log:** "unstable value `Date.now()` while prerendering" from MikroORM inside `getViewer()`. Fixed with `await connection()` in `getViewer()`. Recorded as a lesson.
- **Re-plan:** a full-page reload loop in dev ("HMR hash mismatch"). The cause was stale dev state after I deleted the DB under the running server. A clean restart (`rm -rf packages/app/.next/dev`) fixed it. Recorded as a lesson.
- AGENTS.md: styling rule changed (shadcn everywhere, per the human), plus auth, validation, services, route handler, config and tone rules.

## Changes

- Whole repo bootstrapped from the skeleton, see the commit.
- New in `packages/db/src`:
  - `entities/User.ts`, `Session.ts`, `Project.ts`
  - `services/projects.ts`, `services/sessions.ts`
- New in `packages/app/src`:
  - `server/auth.ts`
  - `app/auth/**`, `app/projects/**`, `app/me`, `app/login`, `app/how-to-auth`, `app/admin/actions.ts`
  - `not-found.tsx`, `error.tsx`
  - `components/*`
  - `lib/project-schema.ts`, `lib/statuses.ts`
- shadcn components added: input, textarea, label, select, alert-dialog, avatar, table, separator, alert, dropdown-menu.
- Deploy config:
  - `config/deploy.yml`: `env.clear` APP_URL and ADMIN_GITHUB_LOGINS, `env.secret` AUTH_GITHUB_*
  - `.kamal/secrets`
  - `.github/workflows/deploy.yml` passes the secrets to Kamal

## Verification

- `npm run lint`: clean. `npm run typecheck` (4 workspaces): 0 errors. `npm run build`:
  - pages `◐`
  - `/auth/github*` and `/up` dynamic (`ƒ`)
- Browser e2e (Playwright, scratch script, users and sessions seeded directly in SQLite since real GitHub OAuth can't run in a sandbox), 44/44 passing in `next dev`. It covers:
  - anonymous: home and empty state, `X-Clacks-Overhead`, disclaimer
  - auth redirects: `/projects/new` → login with `next`; `/auth/github` → GitHub authorize URL with `client_id`, `redirect_uri` and state matching the httpOnly cookie
  - callback failures: bad state → error, `access_denied` → error
  - pages: `/how-to-auth` status, 404, expired session treated as anonymous
  - project CRUD: server-side validation (incl. a `javascript:` URL rejected) with values kept, create with a Polish-diacritics slug, duplicate slug `-2`, tag dedup, edit status
  - permissions: non-owner gets no edit link and "None shall pass", non-admin blocked from `/admin`, admin can edit others
  - moderation: admin hide → hidden from the list and 404 for anon, visible to the admin
  - search, status and tag filters; delete via dialog → `/me`; sign out removes the session
- Same 44/44 against the production Docker image (`docker build --platform linux/amd64`, `docker run -v <dir>:/externaldata`):
  - migrations applied at boot
  - DB + WAL files appear in the mounted dir
  - `www.aitechleads.pl` → `308 https://aitechleads.pl/…`
  - security headers present
- Screenshots checked: home list, project page, form errors, mobile home.
- **Not verified:** a real GitHub OAuth round trip (needs the OAuth Apps the human creates via `/how-to-auth`), Let's Encrypt and the actual Kamal deploy.

## Follow-ups

- Human:
  1. create the OAuth Apps (prod + dev) per `/how-to-auth`
  2. `gh secret set AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`
  3. point DNS for `aitechleads.pl` and `www` to 146.59.105.8
  4. push `main` to deploy
- After the first deploy: sign in for real, check `/admin` (admin = `Piotr12`) and `/how-to-auth` shows "configured".
- Expired sessions are deleted lazily on use; `sessions.deleteExpired()` exists but nothing schedules it yet (harmless at this scale).
