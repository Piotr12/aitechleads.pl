/**
 * Every skill the guide mentions, with a one-line, plain-words summary and a link to its card
 * in the open-mercato/skills repo.
 */

const REPO = "https://github.com/open-mercato/skills/blob/main";

export type SkillInfo = {
  /** What it does, in words a junior can follow. */
  summary: string;
  /** "auto" = runs end to end without asking; "interactive" = asks you, reports, hands back. */
  mode: "auto" | "interactive" | "building block";
  /** Override for skills that have no card under docs/skills/. */
  path?: string;
};

export const SKILLS = {
  "om-setup-agent-pipeline": {
    summary: "Run once per repo. Asks a few questions, writes the config and SDLC.md (the team's process doc).",
    mode: "interactive",
  },
  "om-setup-discovery-pipeline": {
    summary: "Run once. Switches on the product layer: product roles, the Discovery stage, the Definition of Ready.",
    mode: "interactive",
  },
  "om-apply-upgrade-notes": {
    summary: "After updating the skills, applies the upgrade notes to your repo without losing local edits.",
    mode: "interactive",
  },
  "om-pipeline-retro": {
    summary: "Looks back at finished runs and ranks what cost the most time (second passes, recoveries).",
    mode: "interactive",
  },
  "om-discover": {
    summary: "Product discovery: asks question rounds and writes product-brief.md, with every claim tagged by its evidence.",
    mode: "interactive",
  },
  "om-brainstorm": {
    summary: "Talks one idea through before anything is written, then decides where it goes next.",
    mode: "interactive",
  },
  "om-synthetic-users": {
    summary: "A panel of made-up personas walks a flow. Everything is tagged [SYNTHETIC]: ideas to check, never evidence.",
    mode: "interactive",
  },
  "om-backlog": {
    summary: "Turns the brief into epics, stories and tasks. Shows you the whole tree first; files nothing until you say yes.",
    mode: "interactive",
  },
  "om-ux-shape": {
    summary: "Decides the flow and screen states (empty, loading, error, no permission) before anything is drawn.",
    mode: "interactive",
  },
  "om-ux-setup": {
    summary: "Extracts the repo's design system into a design contract the reviews can check against.",
    mode: "interactive",
  },
  "om-mockup-prototype": {
    summary: "Builds a plain, clickable prototype of a flow so people can try it before code exists.",
    mode: "interactive",
  },
  "om-prepare-issue": {
    summary: "Files one well-formed GitHub issue: checks for duplicates, links a spec, adds the SDLC labels.",
    mode: "interactive",
  },
  "om-auto-manage-issues": {
    summary: "Tidies existing issues: adds missing labels, clarifies one-liners, posts a 'not ready' comment when the DoR fails.",
    mode: "auto",
  },
  "om-verify-in-repo": {
    summary: "Read-only triage: is this bug real, still unfixed on main, and not already claimed? If not, it stops the chain.",
    mode: "building block",
  },
  "om-auto-fix-issue": {
    summary: "The one entry point for an issue number. Bug → fix chain. Feature → spec, then build. Ends with a labelled PR.",
    mode: "auto",
  },
  "om-fix": {
    summary: "Claims the issue, makes the smallest change that fixes it, adds a regression test, runs the checks.",
    mode: "building block",
  },
  "om-auto-create-pr": {
    summary: "From a free-text task to a reviewed, labelled PR: plan, isolated worktree, commits, checks, self-review.",
    mode: "auto",
  },
  "om-auto-create-pr-loop": {
    summary: "The long-distance version of om-auto-create-pr for big specs: one commit per step, resumable.",
    mode: "auto",
  },
  "om-root-cause": {
    summary: "Read-only detective work: finds where the bug lives and the smallest place to change.",
    mode: "building block",
  },
  "om-auto-implement-spec": {
    summary: "Builds an existing spec, then runs the review loop and takes screenshots of the working app.",
    mode: "auto",
  },
  "om-spec-writing": {
    summary: "Writes or reviews a spec to staff-engineer standards, skeleton first, with an Open Questions gate.",
    mode: "interactive",
  },
  "om-auto-write-spec": {
    summary: "Writes a spec on its own and opens it as a PR, posting its assumptions so a human can correct them.",
    mode: "auto",
  },
  "om-prepare-test-env": {
    summary: "Boots the app once for testing; the other QA skills reuse the same running app.",
    mode: "building block",
  },
  "om-open-pr": {
    summary: "Commits, pushes and opens the PR with the standard description and the full label set.",
    mode: "building block",
  },
  "om-check-and-commit": {
    summary: "For a branch you worked on by hand: runs the checks, fixes small drift, commits and pushes when green.",
    mode: "interactive",
  },
  "om-auto-review-pr": {
    summary: "Reviews a PR in its own worktree: approves or requests changes, moves the labels, can fix its own PRs.",
    mode: "auto",
  },
  "om-code-review": {
    summary: "The review checklist itself: correctness, security, contracts, tests. Findings ranked blocker → nit.",
    mode: "building block",
  },
  "om-ux-review-pr": {
    summary: "Walks the PR's screens in a real browser and ranks design findings by user impact. Advisory only.",
    mode: "interactive",
  },
  "om-auto-continue-pr": {
    summary: "Picks a PR up where it stopped (first unchecked step) and carries it to the finish.",
    mode: "auto",
  },
  "om-auto-continue-pr-loop": {
    summary: "Resumes a long om-auto-create-pr-loop run from its hand-off notes.",
    mode: "auto",
  },
  "om-auto-fix-pr": {
    summary: "Drives one PR to merge-ready: review fixes, CI fixes, UI checks. Never merges it itself.",
    mode: "auto",
  },
  "om-review-prs": {
    summary: "Sweeps every unreviewed open PR through om-auto-review-pr, newest first.",
    mode: "auto",
  },
  "om-pr-autopilot": {
    summary: "'Just finish this PR': works out what is missing and runs the right skills in order.",
    mode: "auto",
  },
  "om-auto-qa-pr": {
    summary: "Tests the PR's UI in a real browser and posts screenshots plus a pass/fail table. Labels untouched by default.",
    mode: "auto",
  },
  "om-qa-buddy": {
    summary: "A human-guided QA session: an interactive test runbook the tester clicks through, bugs written up as files.",
    mode: "interactive",
    path: "skills/om-qa-buddy/SKILL.md",
  },
  "om-integration-tests": {
    summary: "Writes and runs end-to-end tests against the running app, so a checked flow stays checked.",
    mode: "interactive",
  },
  "om-merge-buddy": {
    summary: "Read-only report: which PRs can merge now, which are close, which are blocked and why.",
    mode: "interactive",
  },
  "om-approve-merge-pr": {
    summary: "Re-checks every gate, approves and squash-merges one PR. Refuses if a gate says no.",
    mode: "interactive",
  },
  "om-close-fixed-issues": {
    summary: "After merges: closes the issues the merged PRs fixed, comments on PRs closed without merging.",
    mode: "auto",
  },
  "om-auto-update-changelog": {
    summary: "Drafts the CHANGELOG entry for everything merged since the last release, crediting the real authors.",
    mode: "auto",
  },
  "om-followup-issue-from-pr": {
    summary: "Turns a PR comment or QA finding into a tracked follow-up issue, assigned to the right person.",
    mode: "interactive",
  },
} satisfies Record<string, SkillInfo>;

export type SkillName = keyof typeof SKILLS;

export function skillUrl(name: SkillName): string {
  const info: SkillInfo = SKILLS[name];
  return `${REPO}/${info.path ?? `docs/skills/${name}.md`}`;
}

export const REPO_LINKS = {
  readme: `${REPO}/README.md`,
  sdlc: `${REPO}/SDLC.md`,
  roles: "https://github.com/open-mercato/skills/tree/main/docs/roles",
  catalog: `${REPO}/docs/skills/README.md`,
};
