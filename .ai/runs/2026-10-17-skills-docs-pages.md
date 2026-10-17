# Hidden /docs1, /docs2, /docs3 guides to the open-mercato SDLC skills

**Date:** 2026-10-17
**Agent:** Claude Code (Opus 5.5) via cezar, orchestrating three subagents
**Spec:** none (request given directly in the cezar task)
**Status:** in progress

## Goal

Three alternative, unlinked click-through guides to the [open-mercato/skills](https://github.com/open-mercato/skills)
AI SDLC (the "AI SDLC RACI" chart, `who_what_when.png`): who does what, with which skill, at which stage.
Visual, many pages, one flow per actor.

- `/docs1` — most objective take.
- `/docs2` — TL;DR for seniors.
- `/docs3` — junior audience, examples first.

No links from the rest of the site; pages are `noindex`.

## Plan

1. Clone the skills repo read-only into the task tmp dir; transcribe the RACI chart into a shared brief
   (so all three variants start from the same facts).
2. Add the shadcn components the guides are likely to need (`tabs`, `accordion`, `tooltip`, `breadcrumb`) up
   front, so the subagents never touch `packages/ui` concurrently.
3. Dispatch three subagents in this worktree, each owning only `packages/app/src/app/docsN/`.
4. Review each variant, then run lint, typecheck, build and click through all three in `npm run dev`.
5. Commit and push the branch.

## Log

- Cloned the skills repo; wrote the shared brief (chart transcription + house rules).
- Added `accordion`, `breadcrumb`, `tabs`, `tooltip` to `@atl/ui` via `npx shadcn@latest add`.

## Changes

## Verification

## Follow-ups
