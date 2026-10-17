/** Every term the guide uses, explained for someone who has never seen it, with an example. */

export type Term = {
  id: string;
  term: string;
  group: "Basics" | "Process" | "Tickets & labels" | "Code & PRs" | "Quality" | "Product";
  meaning: string;
  example: string;
};

export const GLOSSARY: Term[] = [
  // Basics
  {
    id: "sdlc",
    term: "SDLC",
    group: "Basics",
    meaning: "Software Development Life Cycle: the whole path a piece of work takes, from idea to merged code.",
    example: "“Customers want CSV export” → brief → issue #412 → spec → PR #433 → review → QA → merged → changelog.",
  },
  {
    id: "raci",
    term: "RACI",
    group: "Basics",
    meaning:
      "A way to say who does what. R = Responsible (does the work), A = Accountable (owns the outcome, says yes or no), C = Consulted (asked before), I = Informed (told after). Exactly one A per decision is the goal.",
    example: "QA stage: Quinn is A,R (tests and approves), Priya is C (does it solve the problem?), Sam is I (told the result).",
  },
  {
    id: "agent",
    term: "Agent (coding agent)",
    group: "Basics",
    meaning:
      "An AI tool such as Claude Code, Codex or Cursor that reads code, runs commands and writes changes. In this process agents do delegated work; people own decisions.",
    example: "Sam types /om-auto-fix-issue 418 and the agent triages, fixes, tests and opens a PR in Sam's name.",
  },
  {
    id: "skill",
    term: "Skill",
    group: "Basics",
    meaning:
      "A packaged set of instructions an agent follows for one job, called like a command. This guide covers the open-mercato/skills collection; all names start with om-.",
    example: "/om-merge-buddy is a skill that reports which PRs can merge.",
  },
  {
    id: "auto-vs-interactive",
    term: "om-auto-* vs interactive skills",
    group: "Basics",
    meaning:
      "Skills named om-auto-* run end to end without asking: they make the most reversible call themselves and write it down for a human to override. Skills without “auto” ask you questions, report and hand control back.",
    example: "om-auto-write-spec posts its assumptions as a comment; om-spec-writing stops and waits for your answers.",
  },
  {
    id: "human-marks",
    term: "Red dot, dark dot, hollow dot",
    group: "Basics",
    meaning:
      "The chart's legend. Red: a human decides (at a gate). Dark: a human supervises (the agent works alone, the human can take over). Hollow: agents carry out delegated work.",
    example: "Claim: Sam has a dark dot (supervises), the agent a hollow one (assigns, labels, comments).",
  },
  {
    id: "gate",
    term: "Approval gate",
    group: "Basics",
    meaning:
      "A checkpoint where a named human must say yes before work moves on. The chart has seven (G1–G7). Blocked work cannot pass a gate.",
    example: "G6: a PR labelled needs-qa cannot merge until QA applies qa-approved.",
  },
  {
    id: "sdlc-md",
    term: "SDLC.md and the config",
    group: "Basics",
    meaning:
      "SDLC.md is the team's written process (stages, labels, gates). .ai/agentic.config.json holds the settings the skills read (base branch, check commands, labels). Both are created by om-setup-agent-pipeline and owned by the Maintainer.",
    example: "validation.commands: [\"npm run typecheck\", \"npm test\", \"npm run build\"].",
  },
  // Process
  {
    id: "product-layer",
    term: "Product layer / delivery layer",
    group: "Process",
    meaning:
      "The product layer (Discovery & Design) decides what and why; it is optional, switched on by om-setup-discovery-pipeline. The delivery layer (Intake → Cleanup) builds and ships it, set up by om-setup-agent-pipeline.",
    example: "A team without product roles can still use the delivery layer for bugs and tasks.",
  },
  {
    id: "triage",
    term: "Triage",
    group: "Process",
    meaning:
      "Sorting incoming work before acting on it. Here: a read-only check that a bug is real, still unfixed on main, and not already handled.",
    example: "#402 triage: already fixed by PR #397 → NO_ACTION_NEEDED, nothing else runs.",
  },
  {
    id: "no-action-needed",
    term: "NO_ACTION_NEEDED",
    group: "Process",
    meaning: "The exact word triage prints to stop the whole chain cleanly when there is nothing to do.",
    example: "NO_ACTION_NEEDED / #402 was fixed by PR #397 (commit 77e0d1f).",
  },
  {
    id: "claim",
    term: "Claim",
    group: "Process",
    meaning:
      "Marking a ticket as “I'm on it” with three signals: assignee, the in-progress label and a 🤖 claim comment. Others who see any signal back off.",
    example: "🤖 Claiming this issue — starting `om-fix` run. Started: 2026-10-17T09:02:11Z.",
  },
  {
    id: "stale-lock",
    term: "Stale claim",
    group: "Process",
    meaning: "A claim whose owner went quiet for longer than the stale window. Another run may take over, but must announce it.",
    example: "🤖 Previous claim by sam appears stale (26 h); taking over.",
  },
  {
    id: "chain-markers",
    term: "Chain markers",
    group: "Process",
    meaning:
      "Exact lines at the end of a skill's report, like “PR: #431 (link: …)”, that the next skill reads. That is how skills hand work to each other without duplicates.",
    example: "Issue: #418 (link: https://github.com/ledgerly/ledgerly/issues/418)",
  },
  {
    id: "autonomous-default",
    term: "Autonomous default (assumption)",
    group: "Process",
    meaning:
      "When an om-auto-* skill meets an open question, it picks the recommended, most reversible answer, writes it down and marks it for a human to confirm.",
    example: "Q1 Column order follows the on-screen table. ⚠ NEEDS HUMAN CONFIRMATION",
  },
  {
    id: "release-process",
    term: "Release process",
    group: "Process",
    meaning:
      "Everything after merge: deploying, smoke tests, monitoring, rollback. Owned by the team, outside this pipeline.",
    example: "PR #431 is merged on Friday; it reaches customers in Monday's deploy.",
  },
  // Tickets & labels
  {
    id: "issue",
    term: "Issue (ticket)",
    group: "Tickets & labels",
    meaning: "A GitHub item describing one piece of work: a bug, a feature, a task. It has a number, a body, labels and comments.",
    example: "#418 “Discount shows twice in cart”.",
  },
  {
    id: "label",
    term: "Label",
    group: "Tickets & labels",
    meaning:
      "A tag on an issue or PR. Groups: pipeline (where a PR is: review, changes-requested, qa, qa-failed, merge-queue, blocked, do-not-merge, one at a time), category (bug, feature, …), meta (needs-qa, qa-approved, in-progress, …), priority and risk (one of each).",
    example: "PR #431: review · bug · priority-medium · risk-high · needs-qa.",
  },
  {
    id: "priority-risk",
    term: "Priority vs risk",
    group: "Tickets & labels",
    meaning:
      "Priority = how urgent the work is. Risk = how dangerous the change is to ship. They are independent.",
    example: "A one-line outage fix: priority-extreme, risk-low. A big auth refactor that can wait: priority-low, risk-high.",
  },
  {
    id: "risk-high",
    term: "risk-high",
    group: "Tickets & labels",
    meaning:
      "Auth and sessions, data scoping, money, schema migrations, shared contracts, or broad edits. It triggers extra gates: specific tests, a second person's review, no self-QA.",
    example: "The double-discount fix touches money → risk-high → idempotency test + Ada's review.",
  },
  {
    id: "dor",
    term: "Definition of Ready (DoR)",
    group: "Tickets & labels",
    meaning:
      "The checklist a ticket must meet before work starts: the problem and who has it; the expected outcome and how it is checked; what is out of scope; open questions marked blocking or not; any agent assumption confirmed by a human. A spec can add acceptance criteria and rules, but never the human part.",
    example: "#415 “export pls” fails it: no who, no outcome, no scope.",
  },
  {
    id: "dedupe",
    term: "Dedupe",
    group: "Tickets & labels",
    meaning: "Checking for an existing issue or PR with the same intent before filing a new one.",
    example: "om-backlog adopts old issue #377 “Excel export?” instead of filing a duplicate.",
  },
  {
    id: "in-progress",
    term: "in-progress",
    group: "Tickets & labels",
    meaning: "The label that means “actively being worked on right now”. Part of a claim; merge tools skip PRs that carry it.",
    example: "Added to #418 by om-fix, removed when the run finishes or hands off.",
  },
  {
    id: "needs-qa",
    term: "needs-qa / skip-qa",
    group: "Tickets & labels",
    meaning:
      "needs-qa asks for a QA pass before merge (UI changes, new features, user-facing behaviour). skip-qa is the explicit opt-out for docs, tests, CI and similar. Never both.",
    example: "PR #433 (new export button): needs-qa. A README typo fix: skip-qa.",
  },
  {
    id: "merge-queue",
    term: "merge-queue",
    group: "Tickets & labels",
    meaning: "Pipeline label meaning “review approved, waiting to merge”. It is not proof of QA: a needs-qa PR waits here for QA.",
    example: "#431 after Ada's approval: merge-queue + needs-qa, waiting for Quinn.",
  },
  {
    id: "changes-requested",
    term: "changes-requested",
    group: "Tickets & labels",
    meaning: "Pipeline label set when a review asks for fixes. After the fixes the PR goes back to review.",
    example: "#431 got it for the missing idempotency test.",
  },
  {
    id: "blocked",
    term: "blocked / do-not-merge",
    group: "Tickets & labels",
    meaning: "Labels set and cleared by humans that stop a PR wherever it is, whatever else is green.",
    example: "#429 new VAT rates: do-not-merge until the law is published.",
  },
  {
    id: "do-not-close",
    term: "do-not-close",
    group: "Tickets & labels",
    meaning: "A human-applied issue label that housekeeping skills must never auto-close. Skills only read it.",
    example: "An umbrella issue that several PRs “fix” in parts.",
  },
  // Code & PRs
  {
    id: "main",
    term: "main (base branch)",
    group: "Code & PRs",
    meaning: "The shared, official version of the code. Everything merges into it; triage asks whether a bug still exists there.",
    example: "“Real and still unfixed on main (a1b2c3d).”",
  },
  {
    id: "branch",
    term: "Branch",
    group: "Code & PRs",
    meaning: "A separate line of changes so work doesn't disturb main until it's ready.",
    example: "fix/issue-418-double-discount",
  },
  {
    id: "worktree",
    term: "Worktree",
    group: "Code & PRs",
    meaning:
      "A second checkout of the same repository in another folder. Agents work in their own worktree so your open files are never touched.",
    example: "om-auto-create-pr builds the CSV export in a temporary worktree, then cleans it up.",
  },
  {
    id: "pr",
    term: "Pull request (PR)",
    group: "Code & PRs",
    meaning:
      "A request to merge a branch into main, with a description, labels, reviews and checks. Where the change is discussed and approved.",
    example: "PR #431 “fix(checkout): apply the discount once per order”.",
  },
  {
    id: "spec",
    term: "Spec (specification)",
    group: "Code & PRs",
    meaning:
      "A design document written before building a feature: problem, proposed solution, data model, API, risks, phases. Here it lands as a design-only PR first.",
    example: ".ai/specs/2026-10-17-invoice-csv-export.md on spec PR #430.",
  },
  {
    id: "adr",
    term: "ADR (Architecture Decision Record)",
    group: "Code & PRs",
    meaning:
      "A short note recording one technical decision, its context and why. The chart mentions ADRs; in the skills repo such decisions live in specs (“Decisions in play”), the brief's Decisions table and DECISIONS.md.",
    example: "“We stream CSV from the list query instead of building files in a job queue, because…”",
  },
  {
    id: "root-cause",
    term: "Root cause",
    group: "Code & PRs",
    meaning: "The real reason a bug happens, as opposed to its symptom.",
    example: "Symptom: −10% shown twice. Root cause: applyDiscount() called in two places.",
  },
  {
    id: "regression-test",
    term: "Regression test",
    group: "Code & PRs",
    meaning: "A test written for a bug: it fails before the fix, passes after, and catches the bug if it ever comes back.",
    example: "it(\"applies a coupon once per order (#418)\")",
  },
  {
    id: "validation-gate",
    term: "Validation gate",
    group: "Code & PRs",
    meaning: "The list of check commands from the config (typecheck, tests, build…). Any failure blocks the PR.",
    example: "npm run typecheck ✅ · npm test ✅ · npm run build ✅",
  },
  {
    id: "ci",
    term: "CI (continuous integration)",
    group: "Code & PRs",
    meaning: "Checks that run automatically on every push to a PR. Required checks must be green to merge.",
    example: "#433 “Almost ready: waiting for the e2e check”.",
  },
  {
    id: "merge",
    term: "Merge",
    group: "Code & PRs",
    meaning: "Bringing a PR's changes into main.",
    example: "om-approve-merge-pr 431 → merged as 3e9a6c2.",
  },
  {
    id: "squash-merge",
    term: "Squash-merge",
    group: "Code & PRs",
    meaning: "A merge where all the PR's commits are combined into one commit on main, so main's history has one tidy entry per PR.",
    example: "Seven work-in-progress commits on #431 become one: “fix(checkout): apply the discount once per order (#431)”.",
  },
  {
    id: "changelog",
    term: "Changelog",
    group: "Code & PRs",
    meaning: "A file listing what changed in each release, for humans.",
    example: "🐛 Apply the checkout discount once per order (fixes #418). (#431) *(@sam)*",
  },
  {
    id: "follow-up",
    term: "Follow-up issue",
    group: "Code & PRs",
    meaning: "A new issue for something found during review or QA that is outside the current PR's scope.",
    example: "#440 “CSV export: column headers are English-only”, from QA on #433.",
  },
  // Quality
  {
    id: "review",
    term: "Code review",
    group: "Quality",
    meaning: "Reading someone's change to find bugs, risks and broken rules before it merges. Ends in approve or request changes.",
    example: "om-auto-review-pr found the missing idempotency test on #431.",
  },
  {
    id: "severity",
    term: "Blocker / major / minor / nit",
    group: "Quality",
    meaning:
      "How bad a review finding is. Blocker and major must be fixed before merge (a major only with a documented waiver otherwise); minor should be fixed; nit is the author's call.",
    example: "Blocker: money path without idempotency test. Nit: rename total2.",
  },
  {
    id: "independent-review",
    term: "Independent review",
    group: "Quality",
    meaning: "A review by a second person who did not write the change. Required for risk-high work (gate G4).",
    example: "Ada reviews #431 after the agent approved it.",
  },
  {
    id: "decision-change",
    term: "Decision change",
    group: "Quality",
    meaning:
      "When a PR contradicts a recorded non-goal, rule or decision, it must carry a superseding entry approved by that entry's owner (gate G5).",
    example: "Adding XLSX needs D09 superseding D04, approved by Priya.",
  },
  {
    id: "qa",
    term: "QA (quality assurance)",
    group: "Quality",
    meaning: "Checking the change works for a user: in the running app, in a real browser, including the awkward cases.",
    example: "Quinn double-clicks Pay to check only one order is created.",
  },
  {
    id: "qa-approved",
    term: "qa-approved / qa-failed",
    group: "Quality",
    meaning:
      "qa-approved: QA signed off, the gate is open. qa-failed: it didn't work, a hard block. Authoring, review and merge skills never apply qa-approved.",
    example: "#433 got qa-failed for the missing empty state, then qa-approved after the fix.",
  },
  {
    id: "qa-head",
    term: "QA head",
    group: "Quality",
    meaning: "The line “QA head: <commit>” in the approval comment, pinning it to the exact version tested. A later push makes it stale.",
    example: "QA head: 9f3c2ab",
  },
  {
    id: "self-qa",
    term: "Self-QA exception",
    group: "Quality",
    meaning:
      "When no QA reviewer is available, an engineer (or om-auto-qa-pr --self-qa-signoff) may sign off risk-low or risk-medium work with written evidence, adding qa-self-verified. Never on risk-high.",
    example: "#441 (risk-low header translation): qa-approved + qa-self-verified.",
  },
  {
    id: "state-matrix",
    term: "State matrix",
    group: "Quality",
    meaning: "The screen states QA checks for a UI change: default, empty, loading, error, no permission, long content, narrow screen. A missing state fails QA.",
    example: "Zero invoices → blank page instead of the empty state → qa-failed.",
  },
  {
    id: "e2e",
    term: "Integration / end-to-end (E2E) test",
    group: "Quality",
    meaning: "An automated test that drives the whole running app like a user would, so a checked flow stays checked.",
    example: "“Filter invoices by October, click Export CSV, the file has 12 rows.”",
  },
  // Product
  {
    id: "product-brief",
    term: "Product brief",
    group: "Product",
    meaning:
      "product-brief.md, written by om-discover: the problem and who has it, rules, scope, non-goals, decisions with owners, risky assumptions. Every claim tagged with its evidence.",
    example: "“14 of 23 support tickets ask for an export. [data]”",
  },
  {
    id: "non-goal",
    term: "Non-goal (N…)",
    group: "Product",
    meaning: "Something the team decided NOT to build, written down so nobody builds it by accident.",
    example: "N02: No scheduled / e-mailed exports this release.",
  },
  {
    id: "business-rule",
    term: "Business rule (R…)",
    group: "Product",
    meaning: "A rule of the domain the product must respect, owned by a person (often the Domain Expert).",
    example: "R07: Exported amounts stay in the invoice currency (owner: Diego).",
  },
  {
    id: "decision-id",
    term: "Decision (D…)",
    group: "Product",
    meaning: "A recorded choice with an owner, a status and a review-by date. Changing it needs a superseding entry.",
    example: "D04: CSV first; XLSX is “Later” (owner: Priya).",
  },
  {
    id: "synthetic",
    term: "[SYNTHETIC]",
    group: "Product",
    meaning: "The tag on anything produced by made-up personas. Useful for finding questions to ask; never counts as evidence.",
    example: "[SYNTHETIC] “Ola” wants to export 6 companies at once → ask 3 real bookkeepers.",
  },
  {
    id: "backlog",
    term: "Backlog, epic, story, task",
    group: "Product",
    meaning:
      "The backlog is the list of work not yet done. An epic is a big goal, a story is one user-visible piece with acceptance criteria, a task is a technical step.",
    example: "E3 Invoice export → S3.1 Export filtered list as CSV → T3.1.2 Export button + states.",
  },
  {
    id: "prototype",
    term: "Prototype / mockup",
    group: "Product",
    meaning: "A clickable or drawn version of a screen made before real code, to try the flow cheaply.",
    example: "om-mockup-prototype builds the export flow so Priya can click through it.",
  },
];

export const TERM_BY_ID = Object.fromEntries(GLOSSARY.map((t) => [t.id, t])) as Record<string, Term>;
