import type { StationId } from "./stations";

/**
 * The people along the road. Names follow the README's "Workflows by role" and docs/roles/*.md, plus the
 * Reviewer and Maintainer roles that SDLC.md defines. Release manager duties are folded into Maintainer, as
 * SDLC.md does ("the Maintainer — or a release manager, when the team names one").
 */

export type RoleId = "product" | "designer" | "developer" | "reviewer" | "qa" | "maintainer";

/** Where on the road a moment happens: a journey station, or one of the side roads. */
export type Where = StationId | "setup" | "product-road" | "stalled";

export type Moment = {
  where: Where;
  /** What the person runs (exact commands, illustrative arguments). */
  run: string[];
  /** What they look at or do, in plain words. */
  does: string;
  /** What only they can decide here, if anything. */
  decide?: string;
};

export type Role = {
  id: RoleId;
  name: string;
  emoji: string;
  /** One line: their relationship to the parcel. */
  tagline: string;
  source: string;
  moments: Moment[];
  never: string[];
  monday: string[];
};

export const ROLES: Role[] = [
  {
    id: "product",
    name: "Product person",
    emoji: "📋",
    tagline: "You start the parcel and say what it must be. Nothing gets built until you ask.",
    source: "docs/roles/product-manager.md",
    moments: [
      {
        where: "setup",
        run: ["/om-setup-discovery-pipeline"],
        does: "Once, optional: switch the product layer on, adding product roles, a Discovery stage, the Definition of Ready and protected product decisions to `SDLC.md`.",
      },
      {
        where: "product-road",
        run: ['/om-discover --mode client "Benefits portal for SMB clients"', "/om-backlog .ai/specs/product-brief.md --dry-run"],
        does: "Build the product brief from real material, then see the backlog tree before anything is filed.",
        decide: "Every product decision in the brief has an owner; the backlog files nothing until you say yes to the tree.",
      },
      {
        where: "idea",
        run: ['/om-brainstorm "should we build bulk-archive?"'],
        does: "Talk an idea through; get one routing decision and a brief file.",
        decide: "Confirm the routing.",
      },
      {
        where: "issue",
        run: ['/om-prepare-issue "Bulk-archive orders from the grid"', "/om-auto-manage-issues"],
        does: "File a clean issue, or bring existing ones up to standard.",
        decide: "Supply the ticket-level Definition of Ready: problem, who has it, outcome and its check, out of scope, blocking questions answered.",
      },
      {
        where: "spec",
        run: ["/om-auto-write-spec 412"],
        does: "Get a spec PR to sign off before any code is written.",
        decide: "Correct the autonomous defaults; confirm any row marked `⚠ NEEDS HUMAN CONFIRMATION`.",
      },
    ],
    never: [
      "`om-prepare-issue` files work but never implements it: hand the issue to a developer or `om-auto-fix-issue` when you are ready to build.",
      "Synthetic personas never count as evidence; `om-backlog` refuses a brief whose problem rests only on assumptions.",
    ],
    monday: [
      "Read `SDLC.md` in your repo: the Definition of Ready section is the contract you now own.",
      "Run `/om-auto-manage-issues --dry-run` to see what your open issues lack, without changing anything.",
      "Pick one fuzzy idea and run `/om-brainstorm` on it.",
    ],
  },
  {
    id: "designer",
    name: "Designer",
    emoji: "🎨",
    tagline: "You shape the flow before it is drawn, and judge the screens before they ship.",
    source: "docs/roles/designer.md",
    moments: [
      {
        where: "setup",
        run: ["/om-ux-setup"],
        does: "Once per repo: extract the design system into `.uxproof/`, so reviews judge against yours, not generic taste.",
      },
      {
        where: "product-road",
        run: [
          '/om-mockup-prototype .ai/specs/product-brief.md --flow "onboarding"',
          "/om-synthetic-users .ai/prototypes/discovery/onboarding/revision-001/index.html --stance validate",
        ],
        does: "During discovery: a neutral clickable prototype of one flow, then personas walking it. Findings are hypotheses tagged synthetic, each paired with the real test that would confirm it.",
      },
      {
        where: "spec",
        run: [
          '/om-ux-shape "Quick-add flow for the people list"',
          '/om-auto-write-spec "Redesign the checkout summary panel — include mockups of the new layout and screenshots of the current one"',
        ],
        does: "Decide the scope and the screen states, then get a spec PR with mockups next to screenshots of today's app.",
        decide: "The flow and its states (empty, loading, error, no permission) before the code exists. Reply on the assumptions comment to steer.",
      },
      {
        where: "review",
        run: ["/om-ux-review-pr 421"],
        does: "A design review of the PR's screens in a real browser, ranked by user impact.",
      },
      {
        where: "qa",
        run: ["/om-auto-qa-pr 421"],
        does: "Pull fresh screenshots of a PR's UI at any time, without touching source or labels.",
      },
    ],
    never: [
      "`om-ux-review-pr` is advisory: it applies no labels, changes no source and blocks no merge. QA runs its objective checks.",
      "Mockups are illustrative statics under `.ai/specs/assets/`; no app code is scaffolded for them.",
    ],
    monday: [
      "Run `/om-ux-setup` once, so later design reviews know your components and tokens.",
      "Open the latest spec PR and read its mockups and assumptions comment.",
      "Try `/om-ux-review-pr` on a recently merged UI PR to see what it reports.",
    ],
  },
  {
    id: "developer",
    name: "Developer",
    emoji: "👩‍💻",
    tagline: "You hand the parcel to the agents and get back a reviewed, labelled PR.",
    source: "docs/roles/developer.md",
    moments: [
      {
        where: "pickup",
        run: ["/om-auto-fix-issue 412"],
        does: "Hand over any issue: bugs take the fix chain, features take spec-then-build.",
      },
      {
        where: "build",
        run: [
          '/om-auto-create-pr "Add rate limiting to the login endpoint"',
          "/om-auto-implement-spec 2026-07-18-csv-export",
          "/om-auto-continue-pr 421",
          "/om-check-and-commit",
        ],
        does: "Ship a free-form task, build an existing spec, resume an interrupted run, or (on a branch you worked by hand) run the gate, fix drift, commit and push.",
      },
      {
        where: "stalled",
        run: ["/om-pr-autopilot 421 --dry-run"],
        does: "See what is left on a PR before you drive it to the end.",
      },
    ],
    never: [
      "Your checkout is never touched: every autonomous run works in an isolated worktree on its own branch.",
      "Add `Closes #123` yourself only when you open a PR by hand; the skills manage `Refs` and `Closes` for you.",
    ],
    monday: [
      "Run `/om-auto-create-pr` on a small, low-risk chore and watch the draft PR fill in: plan commit, progress ticks, labels, review.",
      "Read the plan file it committed under `.ai/runs/`.",
      "Then try `/om-auto-fix-issue` on a real, small bug.",
    ],
  },
  {
    id: "reviewer",
    name: "Reviewer",
    emoji: "🔍",
    tagline: "You read the diff (or the spec) and move the PR on or back.",
    source: "SDLC.md",
    moments: [
      {
        where: "spec",
        run: ["/om-auto-review-pr 418"],
        does: "On a spec-only PR: a specification review with five design lenses instead of the code checklist.",
        decide: "Approve the spec, or request changes; the autofix loop then edits the spec, never adds code.",
      },
      {
        where: "review",
        run: ["/om-auto-review-pr 421", "/om-review-prs"],
        does: "Review one PR, or sweep every unreviewed one, newest first. On someone else's PR the skill reviews and hands back; add `--autofix` to let it fix.",
        decide: "Approve or request changes. A `risk-high` change to auth, sessions, permissions or money needs a second person's review.",
      },
    ],
    never: [
      "Never apply `qa-approved` from reading a diff, and never set the `qa` label: those belong to QA.",
      "The agent never pushes to another author's branch without `--autofix`.",
    ],
    monday: [
      "Read `CODE_REVIEW.md` (generated if your repo had none): it is the checklist both you and `om-code-review` apply.",
      "Run `/om-review-prs` once and compare its verdicts with your own.",
    ],
  },
  {
    id: "qa",
    name: "QA reviewer",
    emoji: "🧪",
    tagline: "You hold the one hard gate: nothing user-facing merges without your word.",
    source: "docs/roles/qa.md",
    moments: [
      {
        where: "qa",
        run: ["/om-prepare-test-env", "/om-auto-qa-pr 421", "/om-qa-buddy 421", "/om-integration-tests"],
        does: "Boot the app once, collect screenshot evidence, run a guided manual session with a runbook, keep good flows as tests. Start from the reviewer's P0/P1/P2 QA instructions comment.",
        decide: "`qa` while you test; then `qa-approved` (with a `QA head:` line) or `qa-failed`.",
      },
    ],
    never: [
      "Skills request QA with `needs-qa`; they never set `qa`, and only `--self-qa-signoff` (never on `risk-high`) can add `qa-approved`.",
      "Never sign off a partial or environment-limited run.",
    ],
    monday: [
      "Run `/om-prepare-test-env` once; the other QA skills reuse that booted app.",
      "Run `/om-auto-qa-pr <PR>` on an open `needs-qa` PR in its default evidence-only mode, and read the report.",
      "Read the QA gate section of `SDLC.md`, including `QA head:` and the self-QA exception.",
    ],
  },
  {
    id: "maintainer",
    name: "Maintainer",
    emoji: "🛡️",
    tagline: "You own the rulebook and press merge. Releases and housekeeping are yours too.",
    source: "SDLC.md",
    moments: [
      {
        where: "setup",
        run: ["/om-setup-agent-pipeline", "/om-apply-upgrade-notes"],
        does: "Write the config and `SDLC.md` once; re-sync after updating the skills.",
        decide: "Branch protection, the label taxonomy, the config and `SDLC.md` are yours, and so is arbitrating when gates conflict.",
      },
      {
        where: "stalled",
        run: ["/om-pr-autopilot 421", "/om-auto-fix-pr 421"],
        does: "Drive a stuck PR to merge-ready. Neither merges.",
      },
      {
        where: "merge",
        run: ["/om-merge-buddy", "/om-approve-merge-pr 421"],
        does: "See what can merge; ship one PR after the skill re-checks every gate.",
        decide: "Whether to merge now. You may also state an explicit exception on a PR (a waived Definition of Ready item, a waived risk-high evidence gate).",
      },
      {
        where: "after",
        run: ["/om-close-fixed-issues", "/om-auto-update-changelog", "/om-pipeline-retro"],
        does: "Reconcile the tracker, draft the changelog, rank what rework cost.",
        decide: "The release Highlights, and whether the retro's top cause becomes an issue.",
      },
    ],
    never: [
      "Never let an agent merge on its own: `om-pr-autopilot` merges only with `--allow-merge`, `om-auto-fix-pr` never.",
      "A repo-local skill override can add rules but cannot relax the installed safety rules (no skipping tests, no `--no-verify`, no force-push).",
    ],
    monday: [
      "Install and configure: `npx skills add open-mercato/skills --skill '*'`, then `/om-setup-agent-pipeline` and review what it detected.",
      "Read the generated `SDLC.md` with the team; it is the document humans follow.",
      "Run `/om-merge-buddy` to see your open PRs through the gates.",
    ],
  },
];

export const ROLE_BY_ID = Object.fromEntries(ROLES.map((r) => [r.id, r])) as Record<RoleId, Role>;

export function isRoleId(x: string): x is RoleId {
  return x in ROLE_BY_ID;
}
