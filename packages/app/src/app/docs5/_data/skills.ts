import { skillUrl } from "./links";
import type { PhaseId } from "./stages";

/** The five drawers: the four legs of the road, plus the tools for looking after the road itself. */
export type DrawerId = PhaseId | "tend";

export type Drawer = { id: DrawerId; name: string; emoji: string; line: string };

export const DRAWERS: Drawer[] = [
  { id: "decide", name: "Decide what", emoji: "🧭", line: "Product context, ideas, backlog, tickets, triage." },
  { id: "build", name: "Build it", emoji: "🔨", line: "Specs, fixes, implementation, opening the PR." },
  { id: "check", name: "Check it", emoji: "🔍", line: "Review, fixing review comments, QA in a browser, tests." },
  { id: "land", name: "Land it", emoji: "🚢", line: "Merge, closing issues, follow-ups, the changelog." },
  { id: "tend", name: "Tend the road", emoji: "🧰", line: "Set-up, upgrades, retros, new skills. Once in a while." },
];

export type Skill = {
  name: string;
  drawer: DrawerId;
  line: string;
  /** One of the nine to learn first. */
  starter?: boolean;
  /** Mostly called by other skills rather than typed by a person. */
  inside?: boolean;
  /** Not on the RACI chart (the chart lists 41 skills, the repo has 42). */
  notOnChart?: boolean;
};

export const SKILLS: Skill[] = [
  // Decide what
  { name: "om-discover", drawer: "decide", starter: true, line: "Builds the product brief from real material: who has the problem, rules, non-goals, owned decisions." },
  { name: "om-brainstorm", drawer: "decide", line: "Talks one idea through, weighs alternatives (including building nothing), and routes it." },
  { name: "om-synthetic-users", drawer: "decide", line: "A panel of invented personas walks a flow. Findings are hypotheses tagged [SYNTHETIC], never evidence." },
  { name: "om-mockup-prototype", drawer: "decide", line: "A neutral clickable prototype of one flow from the brief." },
  { name: "om-ux-shape", drawer: "decide", line: "Turns a vague idea into a decided direction: scope, screen states, what to test first." },
  { name: "om-backlog", drawer: "decide", line: "Turns the brief into epics, stories and tasks, after you have seen the tree and said yes." },
  { name: "om-prepare-issue", drawer: "decide", starter: true, line: "Files one well-formed, deduplicated, labelled issue. Never implements it." },
  { name: "om-auto-manage-issues", drawer: "decide", line: "Brings existing issues up to standard: labels, clarified wording, a not-ready comment naming what is missing." },
  { name: "om-verify-in-repo", drawer: "decide", inside: true, line: "Read-only triage: is the issue real, and still unfixed? Stops the chain cleanly if not." },
  // Build it
  { name: "om-spec-writing", drawer: "build", line: "Writes or reviews a feature spec with you, with a hard gate on open questions." },
  { name: "om-auto-write-spec", drawer: "build", line: "Writes the spec on its own and opens it as a PR, with mockups and assumptions for you to correct." },
  { name: "om-auto-fix-issue", drawer: "build", starter: true, line: "Give it an issue number: it decides bug or feature, then drives the right chain to a PR." },
  { name: "om-auto-create-pr", drawer: "build", starter: true, line: "Give it a task in a sentence: plan, worktree, commits, checks, self-review, labelled PR." },
  { name: "om-auto-create-pr-loop", drawer: "build", line: "The long-haul version for big specs: one commit per step, checkpoints, resumable." },
  { name: "om-auto-implement-spec", drawer: "build", line: "Builds an existing spec and ships a reviewed, screenshot-verified PR." },
  { name: "om-root-cause", drawer: "build", inside: true, line: "Read-only: finds the bug and the smallest place to change." },
  { name: "om-fix", drawer: "build", inside: true, line: "Makes the minimal change, adds regression tests, runs the checks." },
  { name: "om-open-pr", drawer: "build", inside: true, line: "The shared PR opener: commit, push, labels, run summary, releases the claim." },
  { name: "om-check-and-commit", drawer: "build", line: "For a branch you worked by hand: runs the checks, fixes drift, commits and pushes when green." },
  // Check it
  { name: "om-auto-review-pr", drawer: "check", starter: true, line: "Reviews a PR, approves or requests changes, and loops fixes until it is merge-ready." },
  { name: "om-code-review", drawer: "check", inside: true, line: "The review checklist behind every review: correctness, security, contracts." },
  { name: "om-review-prs", drawer: "check", line: "Sweeps every unreviewed PR through the review skill, newest first." },
  { name: "om-auto-continue-pr", drawer: "check", line: "Picks up an unfinished PR from its plan, or adopts one with no plan, and finishes it." },
  { name: "om-auto-continue-pr-loop", drawer: "check", line: "Resumes a long loop run from its handoff notes." },
  { name: "om-auto-fix-pr", drawer: "check", line: "Drives one PR to merge-ready: review fixes, honest CI fixes, UI QA. Never merges itself." },
  { name: "om-pr-autopilot", drawer: "check", line: "“Just finish this PR”: works out what state it is in and runs the right skills in order." },
  { name: "om-ux-review-pr", drawer: "check", line: "A design review of a PR's screens in a real browser. Advisory: it does not hold the merge." },
  { name: "om-prepare-test-env", drawer: "check", inside: true, line: "Boots the app once for QA and tests; everyone else reuses it." },
  { name: "om-auto-qa-pr", drawer: "check", starter: true, line: "Walks the change in a real browser and posts screenshots and a pass/fail report." },
  { name: "om-qa-buddy", drawer: "check", line: "A human-guided QA session: a runbook the tester clicks through, plus bug files. Never touches the tracker." },
  { name: "om-integration-tests", drawer: "check", line: "Writes and runs end-to-end tests against the live app." },
  // Land it
  { name: "om-merge-buddy", drawer: "land", starter: true, line: "Read-only report: which PRs can merge now, which are close but blocked." },
  { name: "om-approve-merge-pr", drawer: "land", starter: true, line: "Re-checks every gate, approves and squash-merges. Refuses when the QA gate says no." },
  { name: "om-close-fixed-issues", drawer: "land", line: "After merges: closes the issues they fixed, comments on PRs closed without merging." },
  { name: "om-followup-issue-from-pr", drawer: "land", line: "Turns a PR comment or a QA finding into a tracked follow-up issue." },
  { name: "om-auto-update-changelog", drawer: "land", line: "Drafts the CHANGELOG entry for everything merged since the last release." },
  // Tend the road
  { name: "om-setup-agent-pipeline", drawer: "tend", starter: true, line: "Once per repo: asks a few questions, writes the config and SDLC.md. Every other skill reads them." },
  { name: "om-setup-discovery-pipeline", drawer: "tend", line: "Switches on the optional product layer: product roles, Discovery, the Definition of Ready." },
  { name: "om-ux-setup", drawer: "tend", line: "Once per repo: writes down the design system so design reviews can check against it." },
  { name: "om-apply-upgrade-notes", drawer: "tend", line: "After updating the skills: applies the upgrade notes, keeping your local edits." },
  { name: "om-pipeline-retro", drawer: "tend", line: "Reads finished runs and ranks what the second passes cost, in hours." },
  { name: "om-create-skill", drawer: "tend", notOnChart: true, line: "Writes a new skill in the house style, or splits an oversized one." },
];

export const SKILL_BY_NAME = Object.fromEntries(SKILLS.map((s) => [s.name, s])) as Record<string, Skill>;

export function skillsIn(drawer: DrawerId): Skill[] {
  return SKILLS.filter((s) => s.drawer === drawer);
}

/** om-auto-* runs end to end on its own; everything else is a conversation that hands control back. */
export function isAuto(name: string): boolean {
  return name.startsWith("om-auto-");
}

export const STARTERS = SKILLS.filter((s) => s.starter);

export { skillUrl };
