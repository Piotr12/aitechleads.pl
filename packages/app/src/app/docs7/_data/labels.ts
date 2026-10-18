/** The label taxonomy, as SDLC.md ("Label state machine") and the setup skill's config schema define it. */

export type LabelGroup = "pipeline" | "category" | "meta" | "priority" | "risk" | "human";

export type LabelInfo = { name: string; group: LabelGroup; means: string };

export const GROUPS: { id: LabelGroup; name: string; rule: string }[] = [
  { id: "pipeline", name: "Pipeline", rule: "One at a time: where the PR stands in the flow." },
  { id: "category", name: "Category", rule: "Additive: what kind of change it is." },
  { id: "meta", name: "Meta", rule: "Additive: process signals (QA requests, claims)." },
  { id: "priority", name: "Priority", rule: "One at a time; unset reads as medium. How urgent the work is." },
  { id: "risk", name: "Risk", rule: "One at a time; unset reads as medium. How dangerous it is to ship." },
  { id: "human", name: "Outside the taxonomy", rule: "Applied by humans; skills only read it." },
];

export const LABELS: LabelInfo[] = [
  { name: "review", group: "pipeline", means: "Ready and waiting for review. Every new ready PR starts here." },
  { name: "changes-requested", group: "pipeline", means: "The reviewer asked for changes; after the fixes it goes back to review." },
  { name: "merge-queue", group: "pipeline", means: "Approved. Routing, not proof of QA: a needs-qa PR waits here for QA." },
  { name: "qa", group: "pipeline", means: "A QA reviewer is testing it right now. Only a QA reviewer sets it; never merge under it." },
  { name: "qa-failed", group: "pipeline", means: "QA failed. A hard block until QA re-runs." },
  { name: "blocked", group: "pipeline", means: "Blocked by a dependency. Set and cleared by humans; stops the flow." },
  { name: "do-not-merge", group: "pipeline", means: "Explicit hard stop. Set and cleared by humans." },
  { name: "bug", group: "category", means: "A defect fix." },
  { name: "feature", group: "category", means: "New capability." },
  { name: "refactor", group: "category", means: "Restructuring without new behaviour." },
  { name: "security", group: "category", means: "Security change." },
  { name: "dependencies", group: "category", means: "Dependency change." },
  { name: "documentation", group: "category", means: "Docs only (spec PRs carry it)." },
  { name: "needs-qa", group: "meta", means: "User-facing change: may not merge without qa-approved while the QA gate is on." },
  { name: "skip-qa", group: "meta", means: "Explicit opt-out for docs, dependency, CI or test-only changes. Never with needs-qa." },
  { name: "qa-approved", group: "meta", means: "QA passed, for the commit named on the PR's QA head: line." },
  { name: "qa-self-verified", group: "meta", means: "The approval came through the self-QA exception, so it can be audited." },
  { name: "in-progress", group: "meta", means: "The claim lock: someone is actively working this item, so others back off." },
  { name: "ci-monitoring", group: "meta", means: "Work is done and reported; only a CI-result comment is still owed. Not a claim." },
  { name: "priority-low", group: "priority", means: "Cosmetic, docs, dependency bumps, follow-up cleanup." },
  { name: "priority-medium", group: "priority", means: "Ordinary fixes and features (and what unset means)." },
  { name: "priority-high", group: "priority", means: "Security hardening, release-blocking regressions." },
  { name: "priority-extreme", group: "priority", means: "Outage, data loss, active security incident." },
  { name: "risk-low", group: "risk", means: "Docs, tests, typos, isolated cosmetic changes." },
  { name: "risk-medium", group: "risk", means: "An ordinary single-area change with tests (and what unset means)." },
  { name: "risk-high", group: "risk", means: "Auth, sessions, data scoping, money, migrations, shared contracts, broad edits. Triggers extra gates." },
  { name: "do-not-close", group: "human", means: "On an issue: housekeeping skills must never auto-close it." },
];

export const LABEL_BY_NAME: Record<string, LabelInfo> = Object.fromEntries(LABELS.map((l) => [l.name, l]));
