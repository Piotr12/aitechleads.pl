/**
 * The 42 skills in skills-src/skills/ (upstream commit 7c662b0). Names checked against the folder list.
 * `ch` is the chapter of "the first month" in which the team first meets the skill; the lane map grows from it.
 */

export type LaneId = "setup" | "shape" | "build" | "review" | "qa" | "merge" | "tidy" | "improve";

export type Lane = { id: LaneId; name: string; question: string };

export const LANES: Lane[] = [
  { id: "setup", name: "Set up", question: "How does this repo work?" },
  { id: "shape", name: "Shape", question: "What should we build?" },
  { id: "build", name: "Build", question: "Make the change, open a PR" },
  { id: "review", name: "Review & fix", question: "Is the change right?" },
  { id: "qa", name: "QA", question: "Does it work for a user?" },
  { id: "merge", name: "Merge", question: "May it go in now?" },
  { id: "tidy", name: "Tidy", question: "Is the tracker true again?" },
  { id: "improve", name: "Improve", question: "How do we get better?" },
];

/**
 * `auto`: runs end to end without questions (the `om-auto-*` prefix, plus `om-pr-autopilot`, whose card marks it
 * autonomous). `interactive`: acts once, may ask, hands control back.
 * `block`: one of the building blocks other skills compose (README, "Skills invoke each other").
 * `sweep`: works over many items at once.
 */
export type Kind = "auto" | "interactive";

export type Skill = {
  name: string;
  lane: LaneId;
  ch: number;
  kind: Kind;
  block?: boolean;
  sweep?: boolean;
  does: string;
};

export const SKILLS: Skill[] = [
  // Set up
  { name: "om-setup-agent-pipeline", lane: "setup", ch: 1, kind: "interactive", does: "Inspects the repo, asks a few questions, writes .ai/agentic.config.json, the tracker and browser descriptors, and any missing SDLC.md, CODE_REVIEW.md, BACKWARD_COMPATIBILITY.md and AGENTS.md starter." },
  { name: "om-setup-discovery-pipeline", lane: "setup", ch: 1, kind: "interactive", does: "Adds the optional product layer: product roles, the Discovery stage, the Definition of Ready and protected product decisions in SDLC.md." },
  { name: "om-ux-setup", lane: "setup", ch: 1, kind: "interactive", does: "Extracts the repo's own design contract (tokens, components, screen archetypes, conventions) into .uxproof/. Once per repo." },

  // Shape
  { name: "om-discover", lane: "shape", ch: 5, kind: "interactive", does: "Product discovery from real material; writes product-brief.md with every claim tagged by its evidence and every decision owned by a person." },
  { name: "om-synthetic-users", lane: "shape", ch: 5, kind: "interactive", does: "A panel of personas walks a flow; only what repeats across fresh panels counts, and everything stays tagged [SYNTHETIC], never evidence." },
  { name: "om-mockup-prototype", lane: "shape", ch: 5, kind: "interactive", does: "Turns a brief flow into a neutral clickable discovery prototype, checked in a browser, before the backlog." },
  { name: "om-brainstorm", lane: "shape", ch: 5, kind: "interactive", does: "The conversation before any artefact: alternatives (including building nothing), a challenger subagent, then one routing decision and a handoff brief." },
  { name: "om-ux-shape", lane: "shape", ch: 5, kind: "interactive", does: "Turns a vague UI or AI feature idea into a decided direction: smallest scope, states, interaction contract, validation plan." },
  { name: "om-backlog", lane: "shape", ch: 5, kind: "interactive", does: "Turns a product brief or a spec's phasing into epics, stories and tasks, filed through om-prepare-issue after you approve the tree." },
  { name: "om-prepare-issue", lane: "shape", ch: 5, kind: "interactive", does: "Files one well-formed, deduplicated, labelled issue, with a linked spec or step-by-step guidance. Never implements." },
  { name: "om-auto-manage-issues", lane: "shape", ch: 5, kind: "auto", sweep: true, does: "Brings existing issues up to standard: missing labels, clarified wording, Definition of Ready check, spec-coverage check." },
  { name: "om-spec-writing", lane: "shape", ch: 5, kind: "interactive", does: "Writes or reviews a spec to staff-engineer standards, skeleton first, stopping at a hard Open Questions gate." },
  { name: "om-auto-write-spec", lane: "shape", ch: 5, kind: "auto", does: "Turns a brief or feature issue into a spec on its own PR, with assumptions posted for override and mockups when the UI is touched." },

  // Build
  { name: "om-verify-in-repo", lane: "build", ch: 2, kind: "interactive", block: true, does: "Read-only triage: is this issue a real, still-unfixed defect? Stops the chain with NO_ACTION_NEEDED when not." },
  { name: "om-root-cause", lane: "build", ch: 2, kind: "interactive", block: true, does: "Read-only analysis: finds the bug and the smallest change surface, so the fix step never re-explores the repo." },
  { name: "om-fix", lane: "build", ch: 2, kind: "interactive", block: true, does: "Claims the issue, makes the minimal change with regression tests, runs the validation gate. Does not commit or push." },
  { name: "om-open-pr", lane: "build", ch: 2, kind: "interactive", block: true, does: "Commits, pushes, opens (or reuses) a ready PR with the full label set, releases or hands off the claim, emits the PR: line." },
  { name: "om-check-and-commit", lane: "build", ch: 2, kind: "interactive", does: "On a hand-worked branch: runs the validation gate, fixes obvious drift, commits and pushes when you asked it to." },
  { name: "om-auto-fix-issue", lane: "build", ch: 4, kind: "auto", does: "One command from issue to PR: classifies bug or feature, then runs the bug chain or the spec-then-build route." },
  { name: "om-auto-create-pr", lane: "build", ch: 4, kind: "auto", does: "From a free-form brief: execution plan, isolated worktree, phase-by-phase commits, validation gate, labelled and reviewed PR." },
  { name: "om-auto-implement-spec", lane: "build", ch: 6, kind: "auto", does: "Builds an existing spec on its own implementation PR, then runs review and UI verification." },
  { name: "om-auto-create-pr-loop", lane: "build", ch: 6, kind: "auto", does: "The engine for long builds: run folder (PLAN, HANDOFF, NOTIFY), one commit per step, checkpoints every ~5 steps." },
  { name: "om-auto-continue-pr", lane: "build", ch: 6, kind: "auto", does: "Resumes a PR from the first unchecked step of its plan; adopts a PR that never had a plan by reconstructing one." },
  { name: "om-auto-continue-pr-loop", lane: "build", ch: 6, kind: "auto", does: "Resumes a loop-engine run from the first row of its Tasks table that is not done." },

  // Review & fix
  { name: "om-code-review", lane: "review", ch: 3, kind: "interactive", block: true, does: "The review checklist: validation gate, correctness, security, contract surfaces, your CODE_REVIEW.md; severity-ranked findings." },
  { name: "om-auto-review-pr", lane: "review", ch: 3, kind: "auto", does: "Reviews a PR in an isolated worktree, submits the verdict, moves the labels; fixes its own PRs (or any, with --autofix)." },
  { name: "om-review-prs", lane: "review", ch: 4, kind: "interactive", sweep: true, does: "Sweeps every unreviewed open PR, newest first, through om-auto-review-pr, skipping claimed ones." },
  { name: "om-pr-autopilot", lane: "review", ch: 4, kind: "auto", does: "\"Just finish this PR\": diagnoses its real state, then runs the matching chain of other skills. Merges only with --allow-merge." },
  { name: "om-auto-fix-pr", lane: "review", ch: 7, kind: "auto", does: "Drives one PR to merge-ready: base merged in, review autofix, honest CI repair, UI QA, follow-ups. Never merges." },
  { name: "om-ux-review-pr", lane: "review", ch: 8, kind: "interactive", does: "Walks a PR's screens in a real browser and posts design findings ranked by user impact. Advisory; does not hold the merge." },

  // QA
  { name: "om-prepare-test-env", lane: "qa", ch: 1, kind: "interactive", block: true, does: "Boots the app for QA and tests on any stack, provisions the browser provider, writes the shared .ai/qa/test-env.json." },
  { name: "om-auto-qa-pr", lane: "qa", ch: 8, kind: "auto", does: "Walks a PR's UI in a real browser and posts screenshots plus a pass/fail report. Touches no labels unless told to." },
  { name: "om-qa-buddy", lane: "qa", ch: 8, kind: "interactive", does: "A manual QA session with a person: a test plan, an interactive runbook to click through, bug files. Never touches the tracker." },
  { name: "om-integration-tests", lane: "qa", ch: 8, kind: "interactive", does: "Writes and runs integration/E2E tests by exploring the running app first, with the repo's own test runner." },

  // Merge
  { name: "om-merge-buddy", lane: "merge", ch: 9, kind: "interactive", sweep: true, does: "Read-only scan of open PRs: ready to merge, almost ready, blocked, with each blocker named." },
  { name: "om-approve-merge-pr", lane: "merge", ch: 9, kind: "interactive", does: "Re-checks every gate, approves and squash-merges one PR; refuses when the QA gate or a blocking label says no." },

  // Tidy
  { name: "om-close-fixed-issues", lane: "tidy", ch: 10, kind: "interactive", sweep: true, does: "Closes issues that merged PRs fixed (by closing keyword only) and comments where a PR closed unmerged." },
  { name: "om-followup-issue-from-pr", lane: "tidy", ch: 10, kind: "interactive", does: "Turns a PR or one of its comments into a tracked follow-up issue, assigned to the @-mention or the PR author." },
  { name: "om-auto-update-changelog", lane: "tidy", ch: 10, kind: "auto", does: "Drafts the CHANGELOG entry for everything merged since the last release, credits verified, and ships it as a docs PR." },

  // Improve
  { name: "om-pipeline-retro", lane: "improve", ch: 11, kind: "interactive", does: "Read-only: classifies finished runs and ranks what second passes cost in wall-clock hours; hands the top cause to om-prepare-issue." },
  { name: "om-apply-upgrade-notes", lane: "improve", ch: 11, kind: "interactive", does: "After an upgrade, re-syncs the tracker and browser descriptors in your repo while keeping your local edits." },
  { name: "om-create-skill", lane: "improve", ch: 11, kind: "interactive", does: "Authors a new skill for the collection, or splits an oversized SKILL.md, behind the collection's lint gate." },
];

export const SKILL_BY_NAME: Record<string, Skill> = Object.fromEntries(SKILLS.map((s) => [s.name, s]));

export function skill(name: string): Skill {
  const s = SKILL_BY_NAME[name];
  if (!s) throw new Error(`docs7: unknown skill ${name}`);
  return s;
}

/** Human decision points, placed on the lane map in the chapter where the story first shows them. */
export type Decision = { id: string; lane: LaneId; ch: number; text: string; who: string };

export const DECISIONS: Decision[] = [
  { id: "setup", lane: "setup", ch: 1, text: "Answer setup's questions; commit the config and SDLC.md", who: "Maintainer" },
  { id: "route", lane: "shape", ch: 5, text: "Confirm where an idea goes next", who: "Whoever brainstorms" },
  { id: "ready", lane: "shape", ch: 5, text: "Supply the ticket-level Definition of Ready", who: "Product owner" },
  { id: "assume", lane: "shape", ch: 5, text: "Confirm or correct the spec's assumptions", who: "Product owner, designer" },
  { id: "force", lane: "build", ch: 7, text: "Take over someone else's claim (--force, with a comment)", who: "A person, deliberately" },
  { id: "second", lane: "review", ch: 7, text: "Second person's review on auth or money", who: "Reviewer" },
  { id: "block", lane: "merge", ch: 7, text: "Set or clear blocked / do-not-merge", who: "Any person" },
  { id: "qa", lane: "qa", ch: 8, text: "Grant qa-approved, or fail it", who: "QA reviewer" },
  { id: "merge", lane: "merge", ch: 9, text: "Decide to merge", who: "Maintainer or reviewer" },
  { id: "highlights", lane: "tidy", ch: 10, text: "Write the changelog Highlights", who: "Maintainer" },
  { id: "change", lane: "improve", ch: 11, text: "Decide what changes in the process", who: "Maintainer, with the team" },
];
