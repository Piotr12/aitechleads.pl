import type { Holder } from "../_components/marks";

/**
 * The journey of one illustrative piece of work, "Bulk-archive orders from the grid" (the README's own
 * example), from idea to tidied. Issue #412, spec PR #418, implementation PR #421 and every path, date and
 * comment below are invented, but shaped like what the skills produce (sources cited per station).
 */

export type StationId = "idea" | "issue" | "spec" | "pickup" | "build" | "review" | "qa" | "merge" | "after";

export type Station = {
  id: StationId;
  n: number;
  /** Page title. */
  title: string;
  /** Two-word name on the tracker strip. */
  short: string;
  /** What the work is called when it arrives and when it leaves. */
  arrives: string;
  leaves: string;
  emoji: string;
  holder: Holder;
  /** The one idea of the page. */
  idea: string;
  lead: string;
  /** Who starts this hand-off, and with what. */
  run: { who: string; cmd: string };
  /** Skills that run inside, without anyone typing them. */
  inside: string[];
  reads: string[];
  leavesBehind: string[];
  /** Labels on the parcel after this station (on the item named in labelsOn). */
  labels: string[];
  labelsOn: string;
  /** Exact marker lines the skill ends with (the "your turn" for the next one). */
  markers: string[];
  decide: { who: string; what: string; short: string } | null;
  noDecide?: string;
  stops: string[];
  notes: { title: string; text: string }[];
  specimen?: { kind: string; title: string; body: string };
  sources: string[];
};

const ISSUE = "https://github.com/acme/shop/issues/412";
const SPEC_PR = "https://github.com/acme/shop/pull/418";
const PR = "https://github.com/acme/shop/pull/421";
const BRIEF = ".ai/specs/briefs/2026-10-19-bulk-archive-orders.md";
const SPEC = ".ai/specs/2026-10-20-bulk-archive-orders.md";
const PLAN = ".ai/runs/2026-10-21-bulk-archive-orders.md";

export const STATIONS: Station[] = [
  {
    id: "idea",
    n: 1,
    title: "An idea becomes a brief",
    short: "Idea",
    arrives: "a hunch",
    leaves: "a brief file",
    emoji: "💡",
    holder: "both",
    idea: "The first hand-off is a conversation, and it ends in exactly one routing decision that a person confirms.",
    lead: "Support keeps archiving old orders one at a time. A product person suspects a bulk action would help, but is not sure it is worth building. Before anything is filed or built, they talk it through with `om-brainstorm`.",
    run: { who: "Product person", cmd: '/om-brainstorm "should support be able to bulk-archive orders?"' },
    inside: [],
    reads: [
      "the repo's agent instructions and the code area the idea touches, read-only, just enough to talk concretely",
      "`.ai/specs/product-brief.md` when `om-discover` has written one: its non-goals and decisions are settled, not re-argued",
      "the tracker, read-only: is this already filed, or already being built?",
    ],
    leavesBehind: [
      `one brief file, \`${BRIEF}\`: Problem, Agreed direction, Resolved unknowns, Non-goals`,
      "the brief stays uncommitted: the skill it routes to makes it durable (here, by copying it into the issue)",
      "a short report ending in two machine-read lines (below)",
    ],
    labels: [],
    labelsOn: "nothing yet: the work does not exist in the tracker",
    markers: [
      `Next: om-prepare-issue "Bulk-archive orders from the grid — brief: ${BRIEF}"`,
      `Brief: ${BRIEF}`,
    ],
    decide: {
      who: "Product person",
      short: "confirms the routing",
      what: "Confirm the routing. The skill weighs at least two alternatives plus \"build nothing\", sends its conclusion to a fresh-context challenger subagent, then stops and waits for your yes before it writes anything.",
    },
    stops: [
      "The question is answered, or nothing is worth building: `Next: none`, and no file is written.",
      "It is already tracked: `Next: om-auto-fix-issue <issue>` instead of a brief.",
      "No person to answer (an unattended run): it stops and reports. It never invents your answers, and no `om-auto-*` skill may drive it.",
    ],
    notes: [
      {
        title: "Why the brief matters later",
        text: "Its **Resolved unknowns** table is load-bearing: downstream, those answers replace the spec writer's autonomous guesses, so the full-auto road runs on your answers instead of the agent's.",
      },
    ],
    specimen: {
      kind: "End of the om-brainstorm report",
      title: "what the product person sees",
      body: `Decision: worth capturing now, building later.
Reason: support archives ~40 orders a week by hand (your numbers).
Caveat: bulk-archiving more than one page of results is out of scope.

Next: om-prepare-issue "Bulk-archive orders from the grid — brief: ${BRIEF}"
Brief: ${BRIEF}`,
    },
    sources: ["skills/om-brainstorm/SKILL.md", "skills/om-brainstorm/references/brief-template.md"],
  },
  {
    id: "issue",
    n: 2,
    title: "The brief becomes an issue",
    short: "Issue",
    arrives: "a brief file",
    leaves: "issue #412",
    emoji: "🎫",
    holder: "agent",
    idea: "The issue is the work's first durable form: deduplicated, labelled, and only ready once a person has supplied what no agent may guess.",
    lead: "The product person runs the line the brainstorm printed. `om-prepare-issue` turns the brief into one tracker issue that someone can pick up cold, weeks later.",
    run: { who: "Product person", cmd: `/om-prepare-issue "Bulk-archive orders from the grid — brief: ${BRIEF}"` },
    inside: [],
    reads: [
      "the brief, whose content it embeds in the issue body, so the tracker copy never depends on a local file",
      "open issues and PRs, searched with two or three phrasings, so it does not file a near-copy",
      "`.ai/specs/` and open PRs, for a spec that already covers the ask",
      "`SDLC.md`: the Definition of Ready, and the rules for inferring priority and risk",
      "the code, when no spec covers the task, to write guidance with real file paths",
    ],
    leavesBehind: [
      "issue #412, `Implement: Bulk-archive orders from the grid`: problem, who has it, expected outcome, out of scope, open questions",
      "a link to a covering spec, or numbered implementation steps (a substantial feature with no spec gets one written right here, by `om-auto-write-spec`)",
      "a `🏷️ label rationale` section: one reason per label",
      "the pick-up command for whoever comes next: `om-auto-fix-issue 412`",
    ],
    labels: ["feature", "priority-medium", "risk-medium"],
    labelsOn: "issue #412",
    markers: [`Issue: #412 (link: ${ISSUE})`],
    decide: {
      who: "Product person (or whoever reported it)",
      short: "supplies the Definition of Ready",
      what: "Supply the ticket-level Definition of Ready: the problem and who has it, the expected outcome and how it is checked, what is out of scope, and no blocking question left open. Only a human can supply these. Where they are missing, the skill writes \"unknown\" and marks the question blocking.",
    },
    stops: [
      "A credible duplicate exists: no new issue. It reports the duplicate and, with your OK, adds the new detail to it as a comment.",
    ],
    notes: [
      {
        title: "What filing never sets",
        text: "`om-prepare-issue` never puts a pipeline label (`review`, `merge-queue`, …: those are PR-only) or `in-progress` on the issue it files: nobody is working on it yet. A skill that later works the issue claims it with `in-progress` (stop 3 does).",
      },
      {
        title: "Many issues, or messy ones",
        text: "`om-backlog` files a whole tree of epics and stories, each through `om-prepare-issue`. For issues people filed by hand, `om-auto-manage-issues` adds missing labels, clarifies one-liners, and posts a not-ready comment naming what the Definition of Ready still lacks.",
      },
    ],
    specimen: {
      kind: "Issue #412",
      title: "body, shortened",
      body: `Implement: Bulk-archive orders from the grid

## Problem
Support staff archive finished orders one at a time (about 40 a week).
## Who has it
Support agents working the Orders grid.
## Expected outcome
Select several orders, archive them in one action, see them leave the list.
Checked by: archiving 10 selected orders takes one confirmation.
## Out of scope
Archiving more than one page of results at once.
## Open questions
None blocking.

Pick up with: om-auto-fix-issue 412

🤖 \`om-prepare-issue\` — 🏷️ label rationale
- ✨ \`feature\` — adds a capability the grid does not have yet.
- 🔹 \`priority-medium\` — an ordinary net-new feature.
- 🟡 \`risk-medium\` — one area, ships with tests.`,
    },
    sources: ["skills/om-prepare-issue/SKILL.md", "SDLC.md"],
  },
  {
    id: "spec",
    n: 3,
    title: "A feature gets a spec PR first",
    short: "Spec",
    arrives: "issue #412",
    leaves: "spec PR #418",
    emoji: "📐",
    holder: "agent",
    idea: "For a feature, the design travels ahead of the code on its own PR, and every guess the agent made is posted for a person to correct.",
    lead: "“Not now” was a decision about timing, not about the idea. Weeks later the team schedules issue #412. Before any code exists, the product person wants to sign off on the approach, so they run `om-auto-write-spec` on the issue. It writes the spec unattended and opens a PR that holds only the design.",
    run: { who: "Product person (or designer, or developer)", cmd: "/om-auto-write-spec 412" },
    inside: ["om-spec-writing", "om-open-pr", "om-prepare-test-env"],
    reads: [
      "issue #412 with its comments and the embedded brief: the brief's Resolved unknowns pre-answer the spec's Open Questions",
      "the code and existing specs for the area, and `product-brief.md` when it exists",
      "the running app, through the configured browser provider, for screenshots of today's screens",
    ],
    leavesBehind: [
      "a claim on issue #412 while it works (assignee, `in-progress`, a 🤖 comment), released when it is done",
      `branch \`spec/bulk-archive-orders\` with the spec \`${SPEC}\``,
      "mockups and current-app screenshots in `.ai/specs/assets/bulk-archive-orders/`, shown inline on the PR",
      "spec PR #418, carrying `Refs #412` and never `Closes`: merging a spec must not close the feature",
      "an **Open Questions answered with autonomous defaults** comment, on the PR and on the issue",
    ],
    labels: ["review", "documentation", "skip-qa", "priority-medium", "risk-low"],
    labelsOn: "spec PR #418",
    markers: [`PR: #418 (link: ${SPEC_PR})`, `Spec: ${SPEC}`, `Issue: #412 (link: ${ISSUE})`],
    decide: {
      who: "Product person, with designer and reviewer",
      short: "corrects the agent's guesses",
      what: "Read the assumptions table and correct any default by replying on it or editing the spec. A row marked `⚠ NEEDS HUMAN CONFIRMATION` keeps the PR a draft until someone confirms it. Your confirmations are part of the Definition of Ready.",
    },
    stops: [
      "An open PR already carries a spec for this issue: it stops and points at it, never opening a second one.",
      "No browser provider configured: no screenshots; the spec goes out text-only and the PR says why.",
    ],
    notes: [
      {
        title: "Design first (optional)",
        text: "For a change people will see, a designer may settle the flow and its states (empty, loading, error, no permission) before the spec is written, with `/om-ux-shape \"bulk-archive from the orders grid\"`. A change with no UI skips this.",
      },
      {
        title: "Two speeds",
        text: "**Spec first** (this page): `om-auto-write-spec` stops once the spec PR is up, and the build waits for a later run. **Full auto**: `om-auto-fix-issue 412` on an issue with no spec writes the spec and goes straight on to build it, in one run.",
      },
      {
        title: "The spec PR's own trip",
        text: "Review it like code (`/om-auto-review-pr 418` runs the specification review; its fixes edit only the spec), then the maintainer merges it at stop 8; `skip-qa` means no QA gate. The build at stop 5 does not wait for that merge: it reads the spec from #418's branch.",
      },
    ],
    specimen: {
      kind: "Comment on PR #418 and issue #412",
      title: "the guesses, posted for override",
      body: `🤖 \`om-auto-write-spec\` — Open Questions answered with autonomous defaults

Applied these defaults in the spec; correct any answer before merge.

| #  | Question                        | Applied default        | Why                                | Confirm?   |
|----|---------------------------------|------------------------|------------------------------------|------------|
| Q1 | Can an archive be undone?       | Yes, from the archive  | most reversible choice             | reversible |
| Q2 | Who may bulk-archive?           | Same as single archive | no new permission introduced       | reversible |`,
    },
    sources: ["skills/om-auto-write-spec/SKILL.md", "skills/om-auto-write-spec/references/assumptions-comment.md", "skills/om-auto-review-pr/SKILL.md"],
  },
  {
    id: "pickup",
    n: 4,
    title: "Someone picks it up, and the road forks",
    short: "Pick-up",
    arrives: "issue #412 + spec PR #418",
    leaves: "a route",
    emoji: "🔀",
    holder: "agent",
    idea: "Picking up an issue is a routing decision a skill makes: is the work free, is it a bug or a feature, and is it ready?",
    lead: "With the spec agreed, a developer hands the issue to `om-auto-fix-issue`, the single entry point for any issue. Its first job is to decide whether it may take the work at all, and which way to send it.",
    run: { who: "Developer (or a scheduled run)", cmd: "/om-auto-fix-issue 412" },
    inside: ["om-auto-implement-spec"],
    reads: [
      "the issue's assignees, labels and comments: is someone else already working on it?",
      "the category label first, then the wording (\"add…\", \"support…\" reads as a feature; \"fails\", \"crash\" as a bug)",
      "`SDLC.md`'s Definition of Ready, on the feature route",
      "the spec, wherever it is: linked from the issue, in `.ai/specs/`, or on an open spec PR such as #418",
    ],
    leavesBehind: [
      "a route: feature, spec found (PR #418), so build it with `om-auto-implement-spec 418`",
      "no lock of its own on this route: the skills it calls make their own claims, so a stop here leaves no stray lock behind",
    ],
    labels: ["feature", "priority-medium", "risk-medium"],
    labelsOn: "issue #412 (unchanged)",
    markers: [],
    decide: null,
    noDecide: "Nobody decides at this fork; the developer already decided by starting the run. One exception: an issue that mixes a defect and a new capability makes the skill stop and ask a person to split it.",
    stops: [
      "`NO_ACTION_NEEDED`: already built, already fixed, or already in flight. It cites the evidence (PR links, commits).",
      "`NOT_READY`: the ticket fails the ticket-level Definition of Ready. It posts a comment naming the gaps, and stops. A missing spec is not a stop: one gets written.",
      "Claimed by someone else: it stops and asks. `--force` takes over, but always posts an override comment naming the previous owner.",
    ],
    notes: [
      {
        title: "The other branch of the fork",
        text: "A bug goes down a different, shorter chain: confirm it is real, find the root cause, make the minimal fix with a regression test, open the PR. See the bug on-ramp.",
      },
    ],
    sources: ["skills/om-auto-fix-issue/SKILL.md", "skills/om-auto-fix-issue/references/feature-route.md"],
  },
  {
    id: "build",
    n: 5,
    title: "The spec becomes a plan, a branch and a PR",
    short: "Build",
    arrives: "spec PR #418",
    leaves: "PR #421",
    emoji: "🛠️",
    holder: "agent",
    idea: "Code is written plan-first: the plan is the first commit, the PR opens as a draft at once, and every finished step is ticked off so any later run can resume.",
    lead: "`om-auto-implement-spec` is a thin router. It finds the spec, sees there is no implementation PR yet, and hands the work to the main engine, `om-auto-create-pr`. The spec PR stays design-only; the code goes on a PR of its own.",
    run: { who: "Called by om-auto-fix-issue (or a developer directly)", cmd: "om-auto-implement-spec 418" },
    inside: ["om-auto-create-pr", "om-open-pr", "om-auto-review-pr", "om-auto-qa-pr"],
    reads: [
      "the spec: its Implementation Plan seeds the phases and steps",
      "`AGENTS.md` / `CLAUDE.md` and the contributing docs, so project conventions apply from the first commit",
      "`validation.commands` from the config: the gate every PR must pass",
      "`engine.loopStepThreshold` (default 20): a plan with more steps goes to `om-auto-create-pr-loop` instead",
    ],
    leavesBehind: [
      "an isolated worktree on branch `feat/bulk-archive-orders`: nobody's own checkout is touched",
      `first commit: the execution plan \`${PLAN}\`, ending in a \`## Progress\` checklist`,
      "draft PR #421, opened straight after that commit, so the run can be watched from the start",
      "a commit per step (or per phase), each ticked in Progress with its SHA; tests with every code change",
      "the full validation gate, the review loop (next stop), a run-summary comment, then the flip from draft to ready",
      "for a change people can see: `om-auto-qa-pr` screenshots on the PR, as evidence only",
    ],
    labels: ["review", "feature", "needs-qa", "priority-medium", "risk-medium"],
    labelsOn: "PR #421",
    markers: [`PR: #421 (link: ${PR})`, `Spec: ${SPEC}`, `Issue: #412 (link: ${ISSUE})`],
    decide: null,
    noDecide: "Nobody, by design. An autonomous run makes the recommended, most reversible call itself and writes it down in the plan or a PR comment instead of stopping to ask. It stops only for the gated cases: a claim conflict, or a `⚠ NEEDS HUMAN CONFIRMATION` assumption.",
    stops: [
      "Interrupted (timeout, crash, blocker): the PR stays a draft with `Status: in-progress`, and `/om-auto-continue-pr 421` resumes from the first unchecked step.",
      "Spec not found: a clean stop that lists the closest candidates. It never improvises a spec.",
    ],
    notes: [
      {
        title: "Why the plan comes first",
        text: "Because it is committed and pushed before any code, a crashed run leaves a branch and a draft PR that say exactly where it stopped. `om-auto-continue-pr` reads the `Tracking plan:` line and carries on.",
      },
    ],
    specimen: {
      kind: "PR #421",
      title: "top of the body",
      body: `feat(orders): bulk-archive orders from the grid (#412)

Closes #412
Refs #418
Tracking plan: ${PLAN}
Source doc: ${SPEC}
Status: complete

## 🎯 What changes
Support agents can select several orders in the grid and archive them
in one action, instead of one at a time.
…`,
    },
    sources: ["skills/om-auto-implement-spec/SKILL.md", "skills/om-auto-create-pr/SKILL.md", "skills/om-auto-create-pr/references/pr-body-template.md"],
  },
  {
    id: "review",
    n: 6,
    title: "The PR goes round the review loop",
    short: "Review",
    arrives: "PR #421 in review",
    leaves: "PR #421 approved",
    emoji: "🔍",
    holder: "agent",
    idea: "Review is a loop whose state is a label: `review`, then `changes-requested` and back as often as needed, until approval moves the PR to `merge-queue`.",
    lead: "Before calling the PR finished, the engine runs one authoritative review with `om-auto-review-pr`. Because the automation wrote this PR, the review may also fix what it finds, and then re-review.",
    run: { who: "Inside the build run (or a person: /om-auto-review-pr 421)", cmd: "om-auto-review-pr 421 --autofix" },
    inside: ["om-code-review"],
    reads: [
      "the diff, in an isolated worktree of its own",
      "every review comment already on the PR, from people, bots or earlier passes: an unaddressed ask counts as a finding",
      "merge conflicts and failing required checks: reported as blockers inside the review, never instead of it",
      "`CODE_REVIEW.md`, `BACKWARD_COMPATIBILITY.md` and any repo-local checklist",
      "the validation gate, run again",
    ],
    leavesBehind: [
      "a submitted review: any blocker, or any major without a documented waiver, means changes requested; only minors and nits means approve",
      "fix commits on the same branch, then a re-review (only on its own PRs, or with `--autofix`)",
      "one `🏷️ label rationale` comment, rewritten in place at every change",
      "on approving a `needs-qa` PR: a manual-QA instructions comment with P0/P1/P2 cases for the tester",
      "the verdict lands at once; CI is followed up afterwards, for at most `ci.maxWaitMinutes` (default 40)",
    ],
    labels: ["merge-queue", "feature", "needs-qa", "priority-medium", "risk-medium"],
    labelsOn: "PR #421",
    markers: [`PR: #421 (link: ${PR})`],
    decide: {
      who: "Reviewer",
      short: "may review too; a second one on risky changes",
      what: "A person may review instead of the agent, or as well; the same checklist applies either way. A `risk-high` change to auth, sessions, permissions or money needs a second person's review.",
    },
    stops: [
      "The change already exists on the base branch: changes requested, citing the duplicating commits or PRs.",
      "Someone else's PR, no `--autofix`: review, labels and a hand-back to the author only. It never pushes to their branch uninstructed.",
    ],
    notes: [
      {
        title: "One cycle, the whole picture",
        text: "A red check never short-circuits the review, and the review never waits for CI. The author gets the failing check, the conflict and every code finding in one pass.",
      },
      {
        title: "A design pass (advisory)",
        text: "Because #421 changes a screen, a designer can run `/om-ux-review-pr 421`: it walks the changed screens in a real browser and posts findings ranked by user impact. It informs the review; it sets no labels and never holds the merge.",
      },
    ],
    specimen: {
      kind: "Comment on PR #421",
      title: "one comment, rewritten in place",
      body: `🤖 \`om-auto-review-pr\` — 🏷️ label rationale

- 🚀 \`merge-queue\` — code review passed; \`needs-qa\` stays on, so the QA-approval
  gate holds the merge until a QA reviewer adds \`qa-approved\`.
- 🧪 \`needs-qa\` — the change alters user-facing behavior that a human should exercise.
- 🔹 \`priority-medium\` — an ordinary net-new feature.
- 🟡 \`risk-medium\` — a single-area change that ships with tests.`,
    },
    sources: ["skills/om-auto-review-pr/SKILL.md", "skills/om-auto-review-pr/references/label-transitions.md"],
  },
  {
    id: "qa",
    n: 7,
    title: "QA: the one hard gate",
    short: "QA",
    arrives: "PR #421 in merge-queue",
    leaves: "PR #421 QA-approved",
    emoji: "🧪",
    holder: "person",
    idea: "Agents can gather QA evidence, but `qa-approved` is a person's word, pinned to the exact commit they tested.",
    lead: "PR #421 changes what support agents see, so it carries `needs-qa`. With the QA gate switched on in the config (`qaGate: true`), it cannot merge until it also carries `qa-approved`, however green everything else is.",
    run: { who: "QA reviewer", cmd: "/om-prepare-test-env\n/om-auto-qa-pr 421" },
    inside: ["om-prepare-test-env"],
    reads: [
      "the PR's review state first: an unreviewed PR gets a review before any QA",
      "the diff, to derive a scenario: which screens, which forms, which states",
      "the booted app, driven through the browser provider in `.ai/browsers/<provider>.md`",
    ],
    leavesBehind: [
      "screenshots and a pass/fail report as a PR comment; by default not a single label changes",
      "the QA reviewer's own moves: `qa` while testing, then back to `merge-queue` with `qa-approved`, or `qa-failed`",
      "a comment with the line `QA head: <sha>`, naming the commit that was tested",
      "a flow worth keeping becomes integration coverage, with `om-integration-tests`",
    ],
    labels: ["merge-queue", "feature", "needs-qa", "qa-approved", "priority-medium", "risk-medium"],
    labelsOn: "PR #421",
    markers: [`PR: #421 (link: ${PR})`],
    decide: {
      who: "QA reviewer",
      short: "grants qa-approved, or not",
      what: "Pass or fail. Only a QA reviewer sets the `qa` label and grants `qa-approved`. The state matrix (default, empty, loading, error, no permission, long content, narrow viewport) is part of the verdict: a missing state fails QA.",
    },
    stops: [
      "A push after the `QA head:` line stales the approval. The label stays, but the merge tools report \"QA evidence older than head\" and ask before merging.",
      "`qa-failed` is a hard block: the PR goes back to its author.",
    ],
    notes: [
      {
        title: "The self-QA exception",
        text: "When no QA reviewer has time, an engineer, or `om-auto-qa-pr --self-qa-signoff`, may sign off a `risk-low` or `risk-medium` PR with full evidence (scenario, environment, test data, result, negative cases, `QA head:`), adding both `qa-approved` and `qa-self-verified`. Never on `risk-high`.",
      },
      {
        title: "Opting out",
        text: "`skip-qa` is the explicit opt-out for docs-only, dependency-only, CI-only and test-only changes, and is never combined with `needs-qa`. The spec PR #418 carried it.",
      },
    ],
    specimen: {
      kind: "QA reviewer's comment on PR #421",
      title: "written by a person",
      body: `✅ QA passed on staging.

Scenario: select 3, 10 and 25 orders in the grid, archive, confirm.
Checked: empty selection (button disabled), no-permission user (no button),
error from the API (toast, nothing archived), narrow viewport.
Result: as specified; archived orders appear under Archive.

QA head: 3f9c2e1`,
    },
    sources: ["SDLC.md", "skills/om-auto-qa-pr/SKILL.md", "docs/roles/qa.md"],
  },
  {
    id: "merge",
    n: 8,
    title: "A person presses merge",
    short: "Merge",
    arrives: "PR #421 ready",
    leaves: "merged",
    emoji: "🚀",
    holder: "person",
    idea: "Merging is always a deliberate step a person starts, and the merge skill re-checks every gate itself instead of trusting anyone's word.",
    lead: "Agents prepare PRs all day; none of them merges on its own initiative. The maintainer (or whoever the team lets merge) asks what is ready, then ships one.",
    run: { who: "Maintainer or release manager", cmd: "/om-merge-buddy\n/om-approve-merge-pr 421" },
    inside: [],
    reads: [
      "every open PR's labels, reviews, required checks and mergeability (`om-merge-buddy`, which only reports)",
      "the latest `QA head:` line, compared with the PR's current head commit",
      "the hard blocks: `qa-failed`, `do-not-merge`, `blocked`, and an active `qa` label (a tester is on it right now)",
    ],
    leavesBehind: [
      "an approving review, then a squash-merge into the base branch",
      "issue #412 closed by the `Closes #412` line in the PR body",
      "the spec PR #418 is merged the same way, by the same person, once its review approved it; its `Refs #412` leaves the issue for #421 to close",
      "optionally a follow-up issue, filed after the merge so it can point at merged work",
    ],
    labels: [],
    labelsOn: "PR #421 is merged",
    markers: [`PR: #421 (link: ${PR})`],
    decide: {
      who: "Maintainer",
      short: "starts the merge",
      what: "Whether to ship it now. The skill refuses a `needs-qa` PR without `qa-approved`, a hard-block label, a draft or a conflict, and asks before merging over `changes-requested` or a stale QA head. Required checks must be genuinely green: a local test run never stands in for them.",
    },
    stops: [
      "Red CI: it offers `om-auto-fix-pr 421 --ci-only`. Conflicts or several problems: it offers `om-auto-fix-pr 421`, which hands the PR back here when it is ready.",
      "Hard-block labels and the QA gate are never routed to automation. They need people.",
    ],
    notes: [],
    specimen: {
      kind: "om-merge-buddy report",
      title: "shortened",
      body: `Ready to merge (1)
  #421 feat(orders): bulk-archive orders from the grid — merge with om-approve-merge-pr 421
Almost ready (1)
  #417 fix(cart): coupon total — required checks still pending
Blocked (1)
  #409 feat(users): CSV import — needs-qa without qa-approved`,
    },
    sources: ["skills/om-approve-merge-pr/SKILL.md", "skills/om-merge-buddy/SKILL.md", "skills/om-auto-fix-issue/references/feature-route.md"],
  },
  {
    id: "after",
    n: 9,
    title: "After the merge: tidy up, and loop back",
    short: "After",
    arrives: "merged PR #421",
    leaves: "new issues, a changelog line",
    emoji: "🧹",
    holder: "agent",
    idea: "A merged PR leaves loose ends, and each loose end becomes new work on the same road.",
    lead: "The code is in. Four housekeeping skills turn what is left into a reconciled tracker, new issues and a changelog line. Here `SDLC.md` stops: deploying, monitoring and rolling back belong to your release process.",
    run: {
      who: "Maintainer or release manager (follow-ups: anyone)",
      cmd: "/om-close-fixed-issues\n/om-followup-issue-from-pr <link to a review comment>\n/om-auto-update-changelog\n/om-pipeline-retro",
    },
    inside: ["om-auto-create-pr", "om-prepare-issue"],
    reads: [
      "PRs merged since the last release (the date in the top `CHANGELOG.md` heading, by default)",
      "authoritative close links only (`Closes #412`, `Fixes`, `Resolves`), never a bare `#412` mention",
      "review comments that were left as non-blocking nits",
      "finished runs: their review rounds and comments, for the retro",
    ],
    leavesBehind: [
      "issues that merged PRs fixed are closed with a linked comment (skipped when they carry `do-not-close`)",
      "follow-up issues for leftover asks, assigned to the @-mentioned person or the PR author; each starts its own trip at the issue stop",
      "a changelog entry, shipped as a docs PR through `om-auto-create-pr`, with contributor credits and the Highlights left for a person",
      "a ranking of what second passes cost in wall-clock hours, and an offer to file the top cause through `om-prepare-issue`",
    ],
    labels: [],
    labelsOn: "new issues get their own labels",
    markers: [],
    decide: {
      who: "Maintainer",
      short: "writes the Highlights, files retro causes",
      what: "Write the release Highlights (the skill leaves them for a person, and is not meant to run on a schedule), and decide whether the retro's top cause becomes an issue: filing is your call, not the skill's.",
    },
    stops: ["`--dry-run` on the sweeps prints every change they would make and makes none."],
    notes: [],
    specimen: {
      kind: "CHANGELOG.md draft",
      title: "on the changelog docs PR",
      body: `# 1.4.0 (2026-11-03)

## Highlights
<!-- left for a person to write -->

## ✨ Features
- ✨ Bulk-archive orders from the grid. (#421) *(@author)*`,
    },
    sources: [
      "skills/om-close-fixed-issues/SKILL.md",
      "skills/om-followup-issue-from-pr/SKILL.md",
      "skills/om-auto-update-changelog/SKILL.md",
      "skills/om-pipeline-retro/SKILL.md",
      "SDLC.md",
    ],
  },
];

export const STATION_BY_ID = Object.fromEntries(STATIONS.map((s) => [s.id, s])) as Record<StationId, Station>;

export function isStationId(x: string): x is StationId {
  return x in STATION_BY_ID;
}
