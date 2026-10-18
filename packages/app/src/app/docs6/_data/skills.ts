/**
 * All 42 skills in skills-src/skills/ (open-mercato/skills @ 7c662b0), each placed at the point of the journey
 * where it touches the work. One-liners are paraphrased from each SKILL.md description.
 */

export const REPO = "https://github.com/open-mercato/skills/blob/main";
export const skillUrl = (name: string) => `${REPO}/skills/${name}/SKILL.md`;
export const repoUrl = (path: string) => `${REPO}/${path}`;

/** Where on the road a skill picks the work up. */
export type Place =
  | "setup"
  | "product"
  | "idea"
  | "issue"
  | "spec"
  | "pickup"
  | "build"
  | "review"
  | "qa"
  | "merge"
  | "after";

export type Skill = {
  name: string;
  /** "auto" = the om-auto-* naming convention (plus om-pr-autopilot, whose card is marked autonomous). */
  kind: "auto" | "interactive";
  place: Place;
  /** Mostly called by other skills rather than by people. */
  inner?: boolean;
  one: string;
};

export const SKILLS: Skill[] = [
  // Setting up the road
  { name: "om-setup-agent-pipeline", kind: "interactive", place: "setup", one: "Once per repo: inspects it, asks a few questions, writes `.ai/agentic.config.json`, installs the tracker descriptor, generates `SDLC.md` and other missing project docs." },
  { name: "om-setup-discovery-pipeline", kind: "interactive", place: "setup", one: "Adds the optional product layer: product roles, a Discovery stage, the Definition of Ready and protected product decisions in `SDLC.md`." },
  { name: "om-apply-upgrade-notes", kind: "interactive", place: "setup", one: "After you update the skills: applies `UPGRADE_NOTES.md`, re-syncing descriptors while keeping your local edits." },
  { name: "om-ux-setup", kind: "interactive", place: "setup", one: "Once per repo: extracts your design system (tokens, components, screen archetypes) into `.uxproof/` so design reviews judge against it." },
  { name: "om-create-skill", kind: "interactive", place: "setup", one: "Writes a new skill in the house style, or splits an oversized `SKILL.md` into `references/` files." },
  // Product road
  { name: "om-discover", kind: "interactive", place: "product", one: "Product discovery: writes `product-brief.md` from real material, every claim tagged by its evidence, every decision owned by a person." },
  { name: "om-synthetic-users", kind: "interactive", place: "product", one: "A panel of personas walks a flow (brief, prototype or running app). Output is hypotheses tagged `[SYNTHETIC]`, never evidence." },
  { name: "om-mockup-prototype", kind: "interactive", place: "product", one: "A neutral clickable low-fi prototype of one brief flow, checked in a browser, before the brief is refreshed." },
  { name: "om-backlog", kind: "interactive", place: "product", one: "Turns a ready brief (or a spec's Phasing) into epics, stories and tasks, filed through `om-prepare-issue` after you have seen the tree and said yes." },
  // Idea
  { name: "om-brainstorm", kind: "interactive", place: "idea", one: "The conversation before any artefact: questions one at a time, alternatives including building nothing, then a routing decision and a brief file." },
  // Issue
  { name: "om-prepare-issue", kind: "interactive", place: "issue", one: "Files one well-formed new issue: dedupes first, links or authors a spec, applies category, priority and risk labels." },
  { name: "om-auto-manage-issues", kind: "auto", place: "issue", one: "Brings existing issues up to standard: missing labels, clarified wording, readiness check against the Definition of Ready, spec coverage." },
  // Spec
  { name: "om-auto-write-spec", kind: "auto", place: "spec", one: "Turns a brief or a feature issue into a spec on its own PR, with mockups, screenshots and an assumptions comment for you to correct." },
  { name: "om-spec-writing", kind: "interactive", place: "spec", one: "The spec engine: skeleton first, a hard Open Questions gate (or `--autonomous` defaults), phases that feed the build." },
  { name: "om-ux-shape", kind: "interactive", place: "spec", one: "Turns a vague UI idea into a decided direction: smallest scope, screen states, the riskiest assumption and how to test it." },
  // Pickup
  { name: "om-auto-fix-issue", kind: "auto", place: "pickup", one: "The single issue entry point: checks the claim, classifies bug or feature, then runs the bug chain or the feature route." },
  { name: "om-verify-in-repo", kind: "interactive", place: "pickup", inner: true, one: "Read-only triage gate of the bug chain: is this a real, still-unfixed defect? Stops with `NO_ACTION_NEEDED` if not." },
  // Build
  { name: "om-auto-implement-spec", kind: "auto", place: "build", one: "Builds an existing spec on its own implementation PR, then the review loop and UI evidence. Thin: it routes to the engines." },
  { name: "om-auto-create-pr", kind: "auto", place: "build", one: "The main engine: execution plan, isolated worktree, phase-by-phase commits, validation gate, labelled PR, review loop." },
  { name: "om-auto-create-pr-loop", kind: "auto", place: "build", one: "The engine for long plans (more than 20 steps by default): a run folder with PLAN, HANDOFF and NOTIFY, one commit per step, checkpoints." },
  { name: "om-auto-continue-pr", kind: "auto", place: "build", one: "Resumes an unfinished PR from the first unchecked step of its plan; adopts a PR that never had a plan." },
  { name: "om-auto-continue-pr-loop", kind: "auto", place: "build", one: "Resumes a loop-engine run from its HANDOFF and Tasks table." },
  { name: "om-root-cause", kind: "interactive", place: "build", inner: true, one: "Read-only: finds the bug and the minimal change surface, so the fix step does not re-explore the repo." },
  { name: "om-fix", kind: "interactive", place: "build", inner: true, one: "Claims the issue, makes the minimal change with regression tests, runs the validation gate. Does not commit." },
  { name: "om-open-pr", kind: "interactive", place: "build", inner: true, one: "The shared PR opener: commits, pushes, opens or reuses a ready PR, applies the full label set, emits the marker lines." },
  { name: "om-check-and-commit", kind: "interactive", place: "build", one: "For a hand-worked branch: runs the validation gate, fixes obvious drift, commits and pushes when green." },
  // Review
  { name: "om-auto-review-pr", kind: "auto", place: "review", one: "Reviews a PR in an isolated worktree, approves or requests changes, moves the labels; fixes its own PRs (or any, with `--autofix`)." },
  { name: "om-code-review", kind: "interactive", place: "review", inner: true, one: "The checklist behind every review: correctness, security, contract surfaces, plus your `CODE_REVIEW.md`." },
  { name: "om-review-prs", kind: "interactive", place: "review", one: "Sweeps every unreviewed open PR, newest first, through `om-auto-review-pr`, respecting claims." },
  { name: "om-ux-review-pr", kind: "interactive", place: "review", one: "A design review of a PR's screens in a real browser. Advisory: it applies no labels and blocks no merge." },
  { name: "om-auto-fix-pr", kind: "auto", place: "review", one: "Drives one PR to merge-ready: merges the base, loops review-autofix, fixes CI honestly, gets UI evidence. Never merges." },
  { name: "om-pr-autopilot", kind: "auto", place: "review", one: "\"Just finish this PR\": diagnoses its real state and runs the matching chain of skills. Never merges without `--allow-merge`." },
  // QA
  { name: "om-auto-qa-pr", kind: "auto", place: "qa", one: "Walks a PR's UI in a real browser and posts screenshots and a pass/fail report. Changes no labels unless asked." },
  { name: "om-prepare-test-env", kind: "interactive", place: "qa", one: "Boots the app once, on any stack, and provisions the browser, so QA and tests share one running instance." },
  { name: "om-integration-tests", kind: "interactive", place: "qa", one: "Writes and runs integration/E2E tests against the live app, with real locators and artefact-based diagnosis." },
  { name: "om-qa-buddy", kind: "interactive", place: "qa", one: "A human-in-the-loop QA session: a test plan and an interactive runbook the tester clicks through. Never touches the tracker." },
  // Merge
  { name: "om-merge-buddy", kind: "interactive", place: "merge", one: "Read-only: which open PRs can merge now, which are close, and what blocks the rest." },
  { name: "om-approve-merge-pr", kind: "interactive", place: "merge", one: "Approves and squash-merges one PR, after re-checking every gate. Refuses when the QA gate or a blocking label says no." },
  // After
  { name: "om-close-fixed-issues", kind: "interactive", place: "after", one: "Housekeeping sweep: closes issues that merged PRs fixed; comments on issues whose PR closed unmerged." },
  { name: "om-followup-issue-from-pr", kind: "interactive", place: "after", one: "Turns a PR comment (often a reviewer's nit) into a tracked follow-up issue, assigned to the right person." },
  { name: "om-auto-update-changelog", kind: "auto", place: "after", one: "Drafts the `CHANGELOG.md` entry for everything merged since the last release and ships it as a docs PR." },
  { name: "om-pipeline-retro", kind: "interactive", place: "after", one: "Read-only: classifies finished runs and ranks what second passes cost, then offers to file the top cause as an issue." },
];

export const SKILL_BY_NAME: Record<string, Skill> = Object.fromEntries(SKILLS.map((s) => [s.name, s]));

export const PLACE_NAMES: Record<Place, string> = {
  setup: "Setting up the road",
  product: "Before the idea: the product road",
  idea: "Idea to brief",
  issue: "Brief to issue",
  spec: "Spec",
  pickup: "Pick-up and routing",
  build: "Building the PR",
  review: "Review loop",
  qa: "QA",
  merge: "Merge",
  after: "After the merge",
};
