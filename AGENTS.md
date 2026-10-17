# AGENTS.md

Instructions for every AI agent (Claude Code, Codex, Cursor, …) working in this repository. `CLAUDE.md` only imports this file — keep all agent rules here. The one other `AGENTS.md`, in `packages/app/`, holds the block `next dev` maintains there (imported by `packages/app/CLAUDE.md`).

## Stack and architecture — non-negotiable

These are the project's architectural decisions. Follow them; do not introduce alternatives (another ORM, DI library, CSS framework or component kit, package manager) without the human's explicit approval.

- **Next.js 16 (App Router, Turbopack, Cache Components) + React 19 + TypeScript (strict)**, always on the latest stable versions. This Next.js has breaking changes versus your training data: read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code.
- **npm workspaces monorepo.** Every package lives in `packages/` and is named `@atl/<name>`. Packages export their TypeScript source directly (`exports` → `./src/…`, no build step); Turbopack transpiles them. Never use relative imports across packages.

  | Package | Contains | May depend on |
  | --- | --- | --- |
  | `packages/app` (`@atl/app`) | The Next.js application: routes, pages, server actions, the DI composition root (`src/server/container.ts`), startup migrations (`src/instrumentation.ts`) | `core`, `db`, `ui` |
  | `packages/core` (`@atl/core`) | Reusable, framework-agnostic code: config (`loadConfig`), DI helpers (`createAppContainer`, `Cradle`), shared utilities and domain logic that needs no database | — |
  | `packages/db` (`@atl/db`) | Data management: MikroORM config, entities, migrations, DB helpers, Awilix registrations (`registerDb`) | `core` |
  | `packages/ui` (`@atl/ui`) | Reusable UI: shadcn/ui components, `cn`, theme and Tailwind entry CSS | — |

- **Database: SQLite through MikroORM 7** (`@mikro-orm/sqlite`, better-sqlite3 driver).
  - Define entities with `defineEntity` (no decorators) and list them in `packages/db/src/entities/index.ts`.
  - Change the schema **only through migrations**: edit the entity → `npm run db:migration:create -- <name>` → commit the migration, `.snapshot.json` and the regenerated `migrations/index.ts` together. Never edit a migration that has been pushed; never use `schema:update` against a real database.
  - Migrations run automatically when the server starts (`instrumentation.ts`); `npm run db:migrate` runs them by hand.
  - Query through the request-scoped `em` (`(await requestScope()).cradle.em`), never the global `orm.em`.
  - SQLite allows one writer at a time, so the "pool" is a single better-sqlite3 connection per ORM, running in WAL mode. Keep transactions short.
- **All persisted files go under `config.dataDir`** (`DATA_DIR`): the database and every other file the app writes (uploads, exports, …). The container filesystem is thrown away on every deploy. Production: `/externaldata` in the container, bind-mounted from `/externaldata/aitechleads.pl` on the VM (`config/deploy.yml`). Locally: `<repo>/data/` (gitignored).
- **Dependency injection: Awilix** in `PROXY` injection mode, `strict` on. Services take dependencies by destructuring the cradle (`({ em, config }) => …`), which keeps working after minification; never use `CLASSIC` mode. The package that owns a dependency registers it (`registerDb(container, orm)`) and adds it to `Cradle` via `declare module "@atl/core"`. Resolve only in server code, through `getContainer()` / `requestScope()` from `packages/app/src/server/container.ts`.
- **Styling.** Compose UI from **shadcn/ui** components in `@atl/ui` (`radix-nova` style) everywhere: forms, dialogs, menus, tables, badges, admin pages. Use plain **Tailwind CSS 4** utilities for layout and one-off presentation. Add missing components with `npx shadcn@latest add <component>` in `packages/ui` rather than hand-writing them. Theme tokens live in `packages/ui/src/styles/globals.css`, the single Tailwind entry point.
- **Authentication: GitHub OAuth via [Arctic](https://arcticjs.dev), sessions in our database.** The cookie `atl_session` holds a random token; the `Session` table stores its SHA-256. `getViewer()` / `requireViewer()` / `canEdit()` in `packages/app/src/server/auth.ts` are the only way to learn who is signed in. **Every server action re-checks the session and permissions itself.** Users and admins are identified by the numeric GitHub user ID, never the login (logins can be renamed and re-claimed); admins are the IDs in `ADMIN_GITHUB_IDS`.
- **Rate limiting** is caveman grade, in memory, from `sharedRateLimiter` (`@atl/core`): per client IP in `packages/app/src/proxy.ts` (120 requests/min for pages, 20/min for POSTs and `/auth/github*`; `/up` and static assets are exempt), and per user in `projects/actions.ts` (30 project creates/edits per hour, admins exempt) on top of `MAX_PROJECTS_PER_USER`. The client IP is the **last** `X-Forwarded-For` entry, the one kamal-proxy adds. It stops scripted abuse, not a real flood. That would need something in front of the VM, such as Cloudflare.
- **Validation: zod** (v4) at the edge (server actions, see `packages/app/src/lib/project-schema.ts`). User-supplied URLs must be `http(s)` only. Client components may only `import type` from modules that touch `@atl/db`.
- **Domain services** (`createProjectService`, `createSessionService`) live in `packages/db/src/services/`, are registered by `registerDb` as scoped Awilix services and resolved from `(await requestScope()).cradle`. `requestScope()` is memoized per request with React `cache`, so a page and the session check share one `em`.
- **Server components that read the database** must call `await connection()` and sit inside a `<Suspense>` boundary (Cache Components would otherwise try to prerender them at build time). **Route handlers** (`route.ts`) that must run per request call `await connection()` too: reading `request` alone does not stop Next from prerendering a `GET` handler as static.
- **Commands** (from the repo root): `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm run db:migrate`, `npm run db:migration:create -- <name>`.
- **Deployment:** pushing to `main` deploys with Kamal from GitHub Actions to a VM shared with other apps (kamal-proxy routes by host). kamal-proxy only switches traffic once `/up` answers, and `/up` queries the database. Runtime config: `env.clear` in `config/deploy.yml`; secrets (`AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`) come from GitHub Actions secrets → `.kamal/secrets`. GitHub forbids Actions secret names starting with `GITHUB_`, hence `AUTH_GITHUB_*`.
- **Configuration** is read only through `loadConfig()` (`packages/core/src/config.ts`): `DATA_DIR`, `APP_URL`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `ADMIN_GITHUB_IDS`. Locally, put them in `packages/app/.env.local` (template: `packages/app/.env.example`).
- **Tone.** User-facing copy is Monty Python / Terry Pratchett flavoured, but stays clear about what to do. The "not affiliated with aitechleaders.pl" disclaimer must stay visible on every page (footer) and on the home page.

## The `.ai/` metadata folder

All AI working metadata lives in `.ai/`. Using it is **mandatory**, not optional.

```
.ai/
├── README.md
├── specs/                  # SDD specifications (written by the human, implemented by agents)
│   ├── README.md
│   ├── YYYY-MM-DD-slug.md  # active specs — not yet fully implemented
│   ├── implemented/        # specs that have been fully implemented
│   │   └── README.md
│   └── archive/            # specs that were superseded, abandoned or rejected
│       └── README.md
├── runs/                   # one log per autonomous AI run
│   ├── README.md
│   └── YYYY-MM-DD-slug.md
├── lessons.md              # long-term memory: index of lessons learned
└── lessons/                # long-form write-ups linked from lessons.md
    ├── README.md
    └── YYYY-MM-DD-slug.md
```

`.ai/cezar/` is local state of the cezar cockpit — it is gitignored; never edit or commit it.

### Naming convention

Every file in `specs/` (and its subfolders), `runs/` and `lessons/` is named `YYYY-MM-DD-slug.md`:

- `YYYY-MM-DD` — the date the file was **created** (never changed afterwards, even when a spec is moved).
- `slug` — short, lowercase, kebab-case description, e.g. `2026-10-17-user-login.md`.
- If the name is already taken, append a counter: `2026-10-17-user-login-2.md`.

`README.md` files are the only exception.

## Mandatory workflow

### 1. Before starting any task

1. **Read `.ai/lessons.md`** and open any linked lesson relevant to the task. Do not repeat a mistake that is already recorded there.
2. **Check `.ai/specs/`** for a spec covering the task. If one exists, it is the source of truth — implement what it says. If the task conflicts with the spec, stop and ask the human instead of guessing.
3. **If this is an autonomous run** (you are working without a human approving each step — e.g. dispatched by cezar, a scheduled/automated job, a headless session), **create the run log** `.ai/runs/YYYY-MM-DD-slug.md` right away (template below).
4. **Plan complex tasks before writing code** (multi-file changes, new features, bugs with an unclear cause). Write down the steps, the files you will touch and how you will verify the result — in the run log, or shown to the human in an interactive session. Aim for a plan good enough to implement in one pass. Resolve ambiguity by asking, not by guessing.

### 2. While working

- Keep the run log up to date as you go (decisions, deviations from the spec, blockers) — not only at the end, so an interrupted run still leaves a trail.
- Do not rewrite the intent of a spec. Specs are authored by the human. You may tick off checklist items or add an `## Implementation notes` section; anything that changes scope must be raised with the human.
- **When things go sideways, stop and re-plan** instead of piling on patches. Record in the run log why the first approach failed.
- **Fix bugs end-to-end yourself.** Given a bug report, failing check or log, reproduce it, find the root cause and fix it — read the logs and code rather than asking the human how.
- **Keep your context clean**: delegate broad searches and independent side tasks to subagents when your tool supports them.
- If you find yourself repeating the same multi-step workflow, propose turning it into a skill or command committed to the repo.

### 3. Before finishing

1. **Verify your changes — never claim "done" without evidence.** At minimum run `npm run lint`, `npm run typecheck` and `npm run build` (and the tests, once they exist). For UI or route changes, run the app (`npm run dev`) and check the actual behaviour. Record what you ran and what it printed; if something could not be verified, say so explicitly.
2. **Raise the bar**: review your own diff and ask, *"knowing everything I know now, is there a simpler, more elegant solution?"* If so, replace the hacky fix before handing over.
3. **Finalize the run log**: outcome, what changed, how it was verified, follow-ups.
4. **Record lessons**: after **every correction from the human**, after fixing a bug, hitting a non-obvious pitfall, or discovering something worth remembering long-term, add an entry to `.ai/lessons.md` (see format below). Phrase it as a rule that prevents the mistake from happening again; if it is a standing project rule, propose adding it to this file instead. Update or remove entries that turned out to be wrong.
5. **Move the spec** once it is fully implemented and verified: `git mv .ai/specs/<file> .ai/specs/implemented/`. Superseded or abandoned specs go to `.ai/specs/archive/` (add a one-line note at the top of the spec saying why).
6. Commit the `.ai/` changes together with the code they describe.

## Templates

### Spec — `.ai/specs/YYYY-MM-DD-slug.md`

```markdown
# <Title>

**Status:** draft | ready | in progress | implemented | archived
**Created:** YYYY-MM-DD

## Goal
## Context
## Requirements
- [ ] ...
## Out of scope
## Acceptance criteria
```

### Run log — `.ai/runs/YYYY-MM-DD-slug.md`

```markdown
# <Title>

**Date:** YYYY-MM-DD
**Agent:** <tool / model>
**Spec:** <path to spec, or "none">
**Status:** in progress | done | partial | failed | blocked

## Goal
## Log
- <timestamped notes: steps taken, decisions, deviations>
## Changes
- <files / commits>
## Verification
- <commands run and their results>
## Follow-ups
```

### Lesson — entry in `.ai/lessons.md`

```markdown
- **YYYY-MM-DD — <short title>** — <what happened / what to do instead, one or two sentences>. [details](lessons/YYYY-MM-DD-slug.md)
```

Keep `lessons.md` short and scannable — one bullet per lesson, grouped by topic. When a lesson needs more than a couple of sentences (root cause analysis, reproduction steps, code samples), write it up in `.ai/lessons/YYYY-MM-DD-slug.md` and link it from the bullet.
