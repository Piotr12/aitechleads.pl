import type { LaneId } from "./skills";
import type { PersonId } from "./story";
import { UP } from "./links";

/**
 * Each person's flow: the moments they act, in the order they usually come, with the command, what they get back,
 * and, where it applies, the decision that is theirs. Commands and flags are from the README role tables, the
 * docs/roles guides and the SKILL.md files.
 */
export type FlowStep = {
  when: string;
  run: string;
  skill?: string;
  get: string;
  decide?: string;
  lane: LaneId;
  ch: number;
};

export type Flow = {
  id: PersonId;
  oneLine: string;
  /** The command this person reaches for most often. */
  usual: string;
  steps: FlowStep[];
  notYours: string[];
  monday: string[];
  guide?: { name: string; href: string };
};

export const FLOWS: Flow[] = [
  {
    id: "developer",
    usual: "/om-auto-fix-issue",
    oneLine: "Hand over an issue, a brief or a spec; get back a labelled, reviewed PR.",
    steps: [
      { when: "An issue is ready to build", run: "/om-auto-fix-issue 123", skill: "om-auto-fix-issue", get: "a finished, labelled PR: bug chain or spec-then-build", decide: "if it asks: split an issue that mixes a bug and a feature", lane: "build", ch: 4 },
      { when: "A small task with no ticket", run: '/om-auto-create-pr "add a delivered webhook"', skill: "om-auto-create-pr", get: "a plan, a draft PR at once, a ready PR at the end", lane: "build", ch: 4 },
      { when: "A spec is approved", run: "/om-auto-implement-spec 2026-10-12-bulk-reschedule", skill: "om-auto-implement-spec", get: "an implementation PR of its own, reviewed, with screenshots", lane: "build", ch: 6 },
      { when: "A run stopped half-way", run: "/om-auto-continue-pr 31", skill: "om-auto-continue-pr", get: "the run resumed at the first unchecked step (om-auto-continue-pr-loop for loop runs)", lane: "build", ch: 6 },
      { when: "You edited code by hand", run: "/om-check-and-commit", skill: "om-check-and-commit", get: "the gate run, drift fixed, a commit and push when you asked for it", lane: "build", ch: 2 },
      { when: "Not sure what a PR still needs", run: "/om-pr-autopilot 14 --dry-run", skill: "om-pr-autopilot", get: "its real state and the chain that would finish it, nothing changed", lane: "review", ch: 4 },
    ],
    notYours: ["whether your PR passed QA: the QA reviewer's (self-QA only below risk-high)", "the merge: whoever runs om-approve-merge-pr"],
    monday: [
      "Take one small bug through the four building blocks by hand: /om-verify-in-repo, /om-root-cause, /om-fix, /om-open-pr (chapter 2).",
      "Hand the next small bug to /om-auto-fix-issue and read everything it posts: the claim comment, the label rationale, the run summary.",
    ],
    guide: { name: "docs/roles/developer.md", href: UP.roles.developer },
  },
  {
    id: "reviewer",
    usual: "/om-review-prs",
    oneLine: "Clear the review queue, judge what agents cannot, and be the second person where it counts.",
    steps: [
      { when: "Start of the day", run: "/om-review-prs", skill: "om-review-prs", get: "every unreviewed open PR reviewed, newest first, claimed ones skipped", lane: "review", ch: 4 },
      { when: "One PR", run: "/om-auto-review-pr 14", skill: "om-auto-review-pr", get: "a verdict, moved labels, a hand-back to the author", decide: "accept the skill's verdict, waive a major in writing, or review by hand instead", lane: "review", ch: 3 },
      { when: "You want it fixed too", run: "/om-auto-review-pr 14 --autofix", skill: "om-auto-review-pr", get: "findings fixed, re-reviewed, until clean", lane: "review", ch: 3 },
      { when: "A spec PR", run: "/om-auto-review-pr 29", skill: "om-auto-review-pr", get: "a specification review: risks, compatibility, gaps, improvements, simplicity", lane: "shape", ch: 5 },
      { when: "Auth or money changes", run: "read the diff yourself", get: "the second person's review SDLC.md requires", decide: "be the second person", lane: "review", ch: 7 },
      { when: "A comment worth keeping", run: "/om-followup-issue-from-pr <comment link>", skill: "om-followup-issue-from-pr", get: "a follow-up issue for the @-mention or the PR author", lane: "tidy", ch: 10 },
    ],
    notYours: ["qa-approved: the QA reviewer's", "the label taxonomy and the config: the maintainer's"],
    monday: [
      "Run /om-review-prs once and read three of the reviews it writes against your own judgement.",
      "Add one house rule to CODE_REVIEW.md that the reviews missed.",
    ],
  },
  {
    id: "product",
    usual: "/om-brainstorm",
    oneLine: "Turn ideas into ready, labelled work, and sign off the plan before any code exists.",
    steps: [
      { when: "Once, with the maintainer", run: "/om-setup-discovery-pipeline", skill: "om-setup-discovery-pipeline", get: "product roles, Discovery stage, Definition of Ready in SDLC.md", lane: "setup", ch: 1 },
      { when: "A fuzzy idea", run: '/om-brainstorm "should we build bulk reschedule?"', skill: "om-brainstorm", get: "a routing decision and a handoff brief", decide: "confirm where it goes", lane: "shape", ch: 5 },
      { when: "A new product or area", run: '/om-discover --mode client "Benefits portal"', skill: "om-discover", get: "product-brief.md, or a plan of what evidence to collect", lane: "shape", ch: 5 },
      { when: "Park an idea", run: '/om-prepare-issue "Bulk reschedule from the grid"', skill: "om-prepare-issue", get: "one deduplicated, labelled issue", lane: "shape", ch: 5 },
      { when: "Tidy the backlog", run: "/om-auto-manage-issues", skill: "om-auto-manage-issues", get: "labels added, laconic issues clarified, not-ready comments", decide: "answer the ticket-level gaps it names", lane: "shape", ch: 5 },
      { when: "Plan before code", run: "/om-auto-write-spec 123", skill: "om-auto-write-spec", get: "a spec PR with an assumptions comment", decide: "confirm or correct the assumptions", lane: "shape", ch: 5 },
    ],
    notYours: ["whether a change passed QA: the QA reviewer's", "the label taxonomy and the config: the maintainer's"],
    monday: [
      "Run /om-auto-manage-issues --dry-run to see what it would change in the backlog, changing nothing.",
      "Take one fuzzy idea through /om-brainstorm and follow its Next: line.",
    ],
    guide: { name: "docs/roles/product-manager.md", href: UP.roles.productManager },
  },
  {
    id: "designer",
    usual: "/om-ux-shape",
    oneLine: "Decide the flow and its states before code exists, then judge the screens that result.",
    steps: [
      { when: "Once per repo", run: "/om-ux-setup", skill: "om-ux-setup", get: "the design contract in .uxproof/", lane: "setup", ch: 1 },
      { when: "Before drawing", run: '/om-ux-shape "Quick-add flow for the people list"', skill: "om-ux-shape", get: "a decided direction: scope, states, riskiest assumption", decide: "the flow and its states", lane: "shape", ch: 5 },
      { when: "A visual spec", run: '/om-auto-write-spec "… include mockups of the new layout"', skill: "om-auto-write-spec", get: "a spec PR with mockups and current-app screenshots", decide: "correct the design assumptions", lane: "shape", ch: 5 },
      { when: "Fresh screenshots of a PR", run: "/om-auto-qa-pr 123", skill: "om-auto-qa-pr", get: "screenshots and a pass/fail report; no labels changed", lane: "qa", ch: 8 },
      { when: "Judge a PR's UI", run: "/om-ux-review-pr 123", skill: "om-ux-review-pr", get: "findings by user impact, each with a done-when (advisory)", lane: "review", ch: 8 },
    ],
    notYours: ["holding a merge with a design review: it is advisory", "qa-approved: the QA reviewer's"],
    monday: [
      "Run /om-ux-setup if .uxproof/ does not exist yet, and fill in its manual section.",
      "Run /om-ux-review-pr on one open UI PR and compare it with your own notes.",
    ],
    guide: { name: "docs/roles/designer.md", href: UP.roles.designer },
  },
  {
    id: "qa",
    usual: "/om-auto-qa-pr",
    oneLine: "Boot the app once, test changes in a real browser, and own the QA gate.",
    steps: [
      { when: "Start of a session", run: "/om-prepare-test-env", skill: "om-prepare-test-env", get: "a booted app the other QA skills reuse", lane: "qa", ch: 1 },
      { when: "Evidence for a PR", run: "/om-auto-qa-pr 123", skill: "om-auto-qa-pr", get: "screenshots and a pass/fail report; no labels changed", lane: "qa", ch: 8 },
      { when: "Testing it yourself", run: "/om-qa-buddy 123", skill: "om-qa-buddy", get: "a test plan, a clickable runbook, a verdict to paste", lane: "qa", ch: 8 },
      { when: "Done testing", run: "set qa while testing, then qa-approved or qa-failed", get: "a comment with QA head: <sha>", decide: "pass or fail, across the whole state matrix", lane: "qa", ch: 8 },
      { when: "Broken UI, on record", run: "/om-auto-qa-pr 123 --apply-failure", skill: "om-auto-qa-pr", get: "qa-failed with a comment on why", lane: "qa", ch: 8 },
      { when: "A flow worth keeping", run: "/om-integration-tests", skill: "om-integration-tests", get: "E2E tests written against the live app", lane: "qa", ch: 8 },
    ],
    notYours: ["the merge itself", "changing source: QA skills never edit code"],
    monday: [
      "Run /om-merge-buddy to list PRs blocked on missing QA sign-off (it only reads).",
      "Boot once with /om-prepare-test-env, then /om-auto-qa-pr the oldest one and test it.",
    ],
    guide: { name: "docs/roles/qa.md", href: UP.roles.qa },
  },
  {
    id: "maintainer",
    usual: "/om-merge-buddy",
    oneLine: "Own the config, the labels and SDLC.md; run merge day, releases and the retro.",
    steps: [
      { when: "Day 0", run: "npx skills add open-mercato/skills --skill '*' && /om-setup-agent-pipeline", skill: "om-setup-agent-pipeline", get: "the config, descriptors, SDLC.md and friends, ready to commit", decide: "every setup answer", lane: "setup", ch: 1 },
      { when: "Merge day", run: "/om-merge-buddy", skill: "om-merge-buddy", get: "ready / almost ready / blocked, each blocker named", lane: "merge", ch: 9 },
      { when: "Ship one", run: "/om-approve-merge-pr 14", skill: "om-approve-merge-pr", get: "merged, or refused with the gate that said no", decide: "the merge", lane: "merge", ch: 9 },
      { when: "Close but not ready", run: "/om-auto-fix-pr 29", skill: "om-auto-fix-pr", get: "merge-ready, handed back; never merged", lane: "review", ch: 7 },
      { when: "After a merge batch", run: "/om-close-fixed-issues --dry-run", skill: "om-close-fixed-issues", get: "the plan, then the tracker reconciled", lane: "tidy", ch: 10 },
      { when: "Release", run: "/om-auto-update-changelog", skill: "om-auto-update-changelog", get: "a changelog docs PR with blank Highlights", decide: "write the Highlights", lane: "tidy", ch: 10 },
      { when: "Monthly", run: "/om-pipeline-retro, then npx skills update -p && /om-apply-upgrade-notes", skill: "om-pipeline-retro", get: "ranked rework causes; descriptors re-synced", decide: "what changes in the process", lane: "improve", ch: 11 },
    ],
    notYours: ["qa-approved: the QA reviewer's (on a risk-high PR you may grant a written exception)", "relaxing a safety rule through an override: impossible by design"],
    monday: [
      "Install, run /om-setup-agent-pipeline, read every generated file before committing it.",
      "Let it create the labels; read SDLC.md with the team.",
      "Run /om-merge-buddy to see the board through the pipeline's eyes.",
    ],
    guide: { name: "docs/roles/release-manager.md", href: UP.roles.releaseManager },
  },
];

export const FLOW_BY_ID: Record<PersonId, Flow> = Object.fromEntries(FLOWS.map((f) => [f.id, f])) as Record<
  PersonId,
  Flow
>;
