# 🥥 AI Tech Leads (aitechleads.pl)

### Bring out your demos!

A small collaboration space for people who consider themselves **AI Tech Leaders**, and for those bravely, bravely working on it. Sign in with GitHub, add the project you're building, browse everyone else's, and find a fellow knight for your quest.

> **Not affiliated.** This site is in no way connected with, endorsed by or run by the AI Tech Leaders training (aitechleaders.pl). It's a community collab space. We're not the Messiah, we're just a bunch of very naughty tech leads.

What it does:

- **Projects**: title, summary, description, repo and demo links, tags, and a status:
  - *(Idea) Merely an idea*: not dead yet.
  - *(Ongoing) 'Tis but a scratch*: in progress.
  - *(Shipped) Shrubbery delivered*: shipped.
  - *(Abandoned) Pining for the fjords*: resting. Definitely resting.
- **Public list** with search, status and tag filters. Anyone can read; signing in with any GitHub account lets you add, edit and delete *your own* projects.
- **The Patrician's office** (`/admin`): admins (GitHub user IDs in `ADMIN_GITHUB_IDS`) can hide, unhide or delete any project.

Built on the [CPG](https://github.com/Piotr12/CPG) skeleton by an LLM, while a human watched, raised an eyebrow, and occasionally said "Ni!".

## Architecture

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, Cache Components), React 19, TypeScript |
| Database | SQLite (better-sqlite3) through MikroORM 7, with migrations |
| Auth | GitHub OAuth (Arctic), sessions in SQLite (hashed tokens) |
| Validation | zod 4 |
| Dependency injection | Awilix |
| Styling | shadcn/ui components + Tailwind CSS 4 |
| Repo layout | npm workspaces monorepo |
| Deployment | Docker + Kamal on a single VM (shared with CPG), from GitHub Actions |

```
packages/
├── app/    @atl/app   Next.js app: routes, pages, server actions, auth, DI composition root
├── core/   @atl/core  config, DI container factory, shared logic
├── db/     @atl/db    MikroORM config, entities (User, Session, Project), migrations, services
└── ui/     @atl/ui    shadcn/ui components, theme, Tailwind entry CSS
```

Dependencies only point one way: `app → core, db, ui` and `db → core`. Packages ship TypeScript source; Turbopack compiles them as part of the app.

**Request flow.** At startup, `instrumentation.ts` applies pending migrations. A request gets one Awilix scope (`requestScope()`, memoized per request) holding the config, a request-scoped `EntityManager` and the `projects` / `sessions` services. `getViewer()` turns the `atl_session` cookie into the signed-in user; every server action checks it again before changing anything.

**Login.** `/auth/github` sets a short-lived state cookie and redirects to GitHub (no scopes: public profile only). `/auth/github/callback` checks the state, exchanges the code, upserts the `User`, stores a `Session` (SHA-256 of the token) and sets the cookie for 30 days. `www.` redirects to the apex, so one callback URL is enough.

**Data.** Everything persistent lives under `DATA_DIR`: `aitechleads.sqlite` (WAL mode). In production, that's `/externaldata` in the container, bind-mounted from `/externaldata/aitechleads.pl` on the VM. Locally, it's `./data/`.

**Health.** `/up` queries the database, so kamal-proxy won't switch traffic to a container that can't reach its data.

## Development

```sh
npm install
cp packages/app/.env.example packages/app/.env.local   # add a dev GitHub OAuth App
npm run dev                               # http://localhost:3000
npm run lint && npm run typecheck && npm run build

npm run db:migration:create -- add-thing  # after changing an entity
npm run db:migrate                        # apply migrations (also runs on server start)

cd packages/ui && npx shadcn@latest add dialog   # add a shadcn component
```

Without OAuth credentials, the site still works read-only, and the login page says GitHub login isn't configured.

## Deployment

Pushing to `main` builds the Docker image and deploys it with Kamal (`config/deploy.yml`, `.github/workflows/deploy.yml`) to the VM that also hosts CPG.

Before the first deploy:

- **DNS:** `aitechleads.pl` and `www.aitechleads.pl` have A records pointing to the VM, so Let's Encrypt can issue the certificate.
- **Secrets:** the repository has these GitHub Actions secrets:
  - `SSH_PRIVATE_KEY`
  - `AUTH_GITHUB_ID`
  - `AUTH_GITHUB_SECRET`
- **Data folder:** `/externaldata/aitechleads.pl` exists on the VM and is writable by uid 1001.

## For AI agents

Start with [`AGENTS.md`](AGENTS.md). Specs, run logs and lessons learned are in [`.ai/`](.ai/).

---

*"What is your name?" "What is your quest?" "What is your GitHub account?"* GNU Terry Pratchett.
