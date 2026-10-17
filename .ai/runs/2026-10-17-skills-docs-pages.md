# Hidden /docs1, /docs2, /docs3 guides to the open-mercato SDLC skills

**Date:** 2026-10-17
**Agent:** Claude Code (Opus 5.5) via cezar, orchestrating three subagents
**Spec:** none (request given directly in the cezar task)
**Status:** done (deployed to production)

## Goal

Three alternative, unlinked click-through guides to the [open-mercato/skills](https://github.com/open-mercato/skills)
AI SDLC (the "AI SDLC RACI" chart, `who_what_when.png`): who does what, with which skill, at which stage.
Visual, many pages, one flow per actor.

- `/docs1`: the most objective take.
- `/docs2`: TL;DR for seniors.
- `/docs3`: junior audience, examples first.

No links from the rest of the site; pages are `noindex`.

## Plan

1. Clone the skills repo read-only into the task tmp dir and transcribe the RACI chart into a shared brief,
   so all three variants start from the same facts.
2. Add the shadcn components the guides are likely to need (`tabs`, `accordion`, `tooltip`, `breadcrumb`) up
   front, so the subagents never touch `packages/ui` at the same time.
3. Dispatch three subagents in this worktree. Each owns only `packages/app/src/app/docsN/`, runs no build or
   dev server, and makes no git changes.
4. Review each variant, then run lint, typecheck and build, and click through all three.
5. Commit and push the branch.

## Log

- Cloned the skills repo and wrote the shared brief (chart transcription plus house rules).
- Added `accordion`, `breadcrumb`, `tabs` and `tooltip` to `@atl/ui` with `npx shadcn@latest add`. Declared
  `lucide-react` in `@atl/app`, which the docs icons import (it was only a dependency of `@atl/ui`).
- Dispatched three general-purpose subagents in parallel.
- docs1 hit `Cannot find module '@atl/ui/components/breadcrumb'`. The worktree had no `node_modules`, so `@atl/ui`
  resolved to the main checkout's package. Ran `npm ci` in the worktree (recorded as a lesson).
- All three reported back with lint and typecheck clean. Each noted where the chart and the repo differ: the
  repo has a separate per-ticket Design stage, no Architect role (a tech lead is the Reviewer), and
  `om-qa-buddy` has no docs card. Each variant notes these differences on its pages.
- Visual check with headless Chrome: desktop looked right. On mobile (375px, emulated through the DevTools
  protocol), the glossary, the docs2 role pages and the docs3 role pages overflowed sideways. Fixed with
  `grid-cols-1`, `min-w-0`, `break-words` and `flex-wrap` (recorded as a lesson).
- While restarting the test server, `pkill -f next-server` also stopped any other local `next-server`. Later
  restarts kill only the process on port 3456.

- Human chose to merge: `main` fast-forwarded to 5a85029 and deployed (Deploy run 39072569409 green);
  `https://aitechleads.pl/docs1`, `/docs2` and `/docs3` return 200 with `noindex, nofollow`.
- 2026-10-18: of the two rate-limit fixes (raise the limit to 300, or stop prefetching on the docs), the human chose
  to stop prefetching. Each variant now has `_components/link.tsx` (`next/link` with `prefetch={false}`), used by
  all 33 importers. Measured with Chrome via the DevTools protocol (fresh profile, full scroll): every docs page
  view now costs 7 proxied requests, 6 of them the site header's own prefetches (`/`, `/projects/new`,
  `/login`), and a click costs 1. Before, `/docs1/skills` cost 26 or more.

## Changes

- `packages/ui/src/components/{accordion,breadcrumb,tabs,tooltip}.tsx` (shadcn, generated).
- `packages/app/package.json` and `package-lock.json`: `lucide-react` declared for `@atl/app`.
- `packages/app/src/app/docs1/**`: reference guide. Overview, flows, 10 stage pages, 7 role pages, gates, a
  42-skill catalogue with a page per skill, and a filterable RACI matrix (the only client component).
- `packages/app/src/app/docs2/**`: TL;DR. A one-screen overview with the rail, gates, role cards and matrix;
  7 role flow pages (lane, timeline, commands, stop/start, handoffs in and out); gates; a handoff sequence
  diagram; a cheatsheet. Server components only.
- `packages/app/src/app/docs3/**`: beginner guide. Two running examples in the made-up "Ledgerly" app
  (feature #412 CSV export, bug #418 double discount) followed through 10 story pages with illustrative
  artefacts, 7 "day in the life" role pages, gates with pass/fail pairs, the chart, a 58-term glossary and an
  11-question quiz.
- `.ai/lessons.md` and `.ai/lessons/2026-10-17-mobile-overflow-checks.md`.

## Verification

- `npm run lint`: exit 0. `npm run typecheck`: exit 0 in all workspaces.
- `npm run build`: exit 0, 121 static pages. Every `/docs*` route is `◐` (prerendered), as are the dynamic
  segments, through `generateStaticParams`.
- `next start` on port 3456, curl over 26 docs URLs: all 200 with `<meta name="robots" content="noindex, nofollow">`.
  Unknown slugs render the not-found UI (streamed with status 200, the same as the existing
  `/projects/<missing>`). The home page contains no `docs1`, `docs2` or `docs3` string, and `robots.txt` is
  unchanged, so it reveals nothing.
- Desktop screenshots (1440px) of the overviews, role, stage and story pages in all three variants look right.
- Mobile: emulated 375px across every role page of all three variants, every docs3 story page and each
  section's index pages. After the fixes, `scrollWidth == innerWidth == 375` everywhere.
- Not checked: dark mode, which the site has no switch for (`.dark` is class-based), and clicking through the
  docs3 quiz by hand. It renders on the server, but answering wasn't exercised.

## Follow-ups

- The site header's three links still prefetch, costing 6 requests on every page of the site. Fine at 120/min,
  but worth remembering if the limit is ever lowered.
- Pick one variant (or merge the best parts) and delete the others, then decide on linking and indexing.
