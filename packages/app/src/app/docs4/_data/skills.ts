import { SKILL_IDS, type Skill, type SkillId } from "./types";

type SkillData = Omit<Skill, "id" | "card"> & { card?: string };

const DATA: Record<SkillId, SkillData> = {
  "om-setup-agent-pipeline": {
    mode: "interactive",
    summary: "One-per-repo configurator: writes the config, installs descriptors, generates project docs.",
    description:
      "The first skill to run in a fresh repository. It inspects the repo (default branch, validation scripts, label taxonomy), asks a few questions, writes .ai/agentic.config.json, which every other skill reads, installs the tracker and browser-provider descriptors, and generates missing project docs (SDLC.md, CODE_REVIEW.md, BACKWARD_COMPATIBILITY.md, an AGENTS.md starter). Re-run it when the toolchain or label taxonomy changes.",
    worksWith: ["om-auto-create-pr", "om-auto-review-pr", "om-merge-buddy", "om-setup-discovery-pipeline"],
    example: "/om-setup-agent-pipeline",
  },
  "om-setup-discovery-pipeline": {
    mode: "interactive",
    summary: "Adds the optional product layer: product roles, the Discovery stage, the Definition of Ready, protected decisions.",
    description:
      "Adds the product layer to a repository om-setup-agent-pipeline already configured. It asks whether there is a domain expert who is not the product owner and whether there is a designer, writes a discovery block in the config, and inserts the product-layer blocks into SDLC.md between markers. Additive and idempotent; turns on the readiness checks in om-auto-manage-issues, om-auto-fix-issue and om-backlog.",
    worksWith: ["om-setup-agent-pipeline", "om-auto-manage-issues", "om-auto-fix-issue", "om-backlog", "om-code-review"],
    example: "/om-setup-discovery-pipeline",
  },
  "om-apply-upgrade-notes": {
    mode: "interactive",
    summary: "Applies UPGRADE_NOTES.md after an upgrade, preserving local edits.",
    description:
      "Run after upgrading the skills collection. It diffs the installed tracker and browser descriptors against the freshly shipped versions, adds missing operations and config keys, preserves every local customization (asking before touching an edited section), and reports gaps for custom providers. Changes are left uncommitted for review.",
    worksWith: ["om-setup-agent-pipeline", "om-check-and-commit"],
    example: "/om-apply-upgrade-notes",
  },
  "om-pipeline-retro": {
    mode: "interactive",
    summary: "Classifies finished runs and ranks what second passes cost, in wall-clock hours.",
    description:
      "Reads merged and closed-unmerged PRs and sorts every run into one of four outcomes: clean single pass, hard recovery with a recorded reason, loop checkpoints, or a second pass with no recorded cause. Causes are ranked by the hours they cost. Strictly read-only; hands the top cause to om-prepare-issue.",
    worksWith: ["om-prepare-issue"],
    example: "/om-pipeline-retro --since 2026-09-01",
  },
  "om-discover": {
    mode: "interactive",
    summary: "Product-level discovery; leaves a product-brief.md with tagged evidence and owned decisions.",
    description:
      "Establishes or refreshes product context in three modes (existing product, client idea, own idea). It reads available material before asking, runs question rounds, and writes product-brief.md: a decision summary, sources, business rules, non-goals and decision history. Observations, decisions and hypotheses are kept apart; a section with nothing behind it becomes a collection plan.",
    worksWith: ["om-brainstorm", "om-spec-writing", "om-prepare-issue", "om-backlog", "om-synthetic-users", "om-mockup-prototype"],
    example: '/om-discover --mode client "Benefits portal for SMB clients"',
  },
  "om-brainstorm": {
    mode: "interactive",
    summary: "The conversation before any artifact exists; ends with a routing decision and a handoff brief.",
    description:
      "Explores an idea, itch or question: open questions one at a time, at least two alternatives plus a “build nothing” option, a read-only tracker check, and a challenger subagent that attacks the conclusion. It never edits the repository; it ends with a machine-parsed Next: line and, after confirmation, one handoff brief.",
    worksWith: ["om-prepare-issue", "om-auto-write-spec", "om-spec-writing", "om-auto-create-pr", "om-auto-fix-issue"],
    example: '/om-brainstorm "should we build bulk-archive?"',
  },
  "om-synthetic-users": {
    mode: "interactive",
    summary: "A persona panel that walks a flow; produces [SYNTHETIC] hypotheses, never evidence.",
    description:
      "Builds personas from material the repository holds, interviews them about the last time the problem happened, and walks a named flow on the brief, a prototype or the running app. It runs at least twice with fresh panels and reports only what repeats. Stances: validate, simulate, adversary. Output never satisfies the Definition of Ready.",
    worksWith: ["om-discover", "om-spec-writing", "om-ux-review-pr", "om-prepare-test-env", "om-ux-setup", "om-mockup-prototype"],
    example: '/om-synthetic-users .ai/specs/product-brief.md --flow "first claim"',
  },
  "om-mockup-prototype": {
    mode: "interactive",
    summary: "A neutral clickable discovery prototype from the brief and the first synthetic panel.",
    description:
      "Turns a selected brief flow and its first synthetic panel into neutral clickable screens with simulated data and visible assumptions, so navigation, states and recovery can be checked before detailed design. It runs before the brief refresh and the backlog, and leaves the design contract and application code unchanged.",
    worksWith: ["om-discover", "om-synthetic-users", "om-backlog", "om-ux-setup"],
    example: '/om-mockup-prototype .ai/specs/product-brief.md --flow "onboarding"',
  },
  "om-backlog": {
    mode: "interactive",
    summary: "Epics, stories with acceptance criteria, and tasks from a brief or spec, filed after a yes.",
    description:
      "Turns a product brief or a spec's Phasing into epics, stories with Given / When / Then acceptance criteria, and tasks, with ids in titles. Every issue is filed through om-prepare-issue; existing issues are adopted, not duplicated. It shows the whole tree and waits for a yes before writing anything.",
    worksWith: ["om-discover", "om-spec-writing", "om-prepare-issue", "om-auto-manage-issues", "om-auto-fix-issue"],
    example: "/om-backlog .ai/specs/product-brief.md",
  },
  "om-ux-shape": {
    mode: "interactive",
    summary: "Turns a vague idea into a decided direction: scope, interaction contract, validation plan.",
    description:
      "Three modes: Shape (a recommendation with the smallest coherent scope, an interaction contract and a validation plan), Review (keep / simplify / rethink / stop for an existing area) and Handoff (implementation-ready behavior with a state table and acceptance criteria). Includes an AI-necessity gate.",
    worksWith: ["om-ux-setup", "om-auto-create-pr", "om-ux-review-pr"],
    example: '/om-ux-shape "Quick-add flow for the people list"',
  },
  "om-ux-setup": {
    mode: "interactive",
    summary: "Extracts the repo's design contract into committed files. Once per repo.",
    description:
      "Extracts the repository's own design contract into .uxproof/: design tokens, the component registry, screen archetypes with canonical examples, and a conventions document whose manual section survives regeneration. A repo with no declared tokens gets a proposed palette derived from its code.",
    worksWith: ["om-ux-shape", "om-ux-review-pr"],
    example: "/om-ux-setup",
  },
  "om-prepare-issue": {
    mode: "interactive",
    summary: "Files one well-formed, labeled tracker issue from a brief without implementing it.",
    description:
      "Dedupes against existing issues and open PRs, then links a covering spec (authoring one on a design-only PR when a feature needs it) or embeds codebase-derived step-by-step guidance. Applies the SDLC labels (category, priority, risk) on creation and attaches screenshots as evidence.",
    worksWith: ["om-auto-write-spec", "om-spec-writing", "om-auto-create-pr", "om-auto-fix-issue", "om-auto-manage-issues"],
    example: '/om-prepare-issue "Bulk-archive orders from the grid"',
  },
  "om-auto-manage-issues": {
    mode: "autonomous",
    summary: "Brings existing issues up to standard: labels, clarification, readiness and spec-coverage checks.",
    description:
      "For each issue in scope it applies missing SDLC labels, clarifies laconic issues (screenshot analysis, original wording preserved), posts a read-only implementation-prep analysis, checks the Definition of Ready (READY_STATUS and a not-ready comment), and flags feature issues without a covering spec. Idempotent and claim-aware; never touches source.",
    worksWith: ["om-auto-fix-issue", "om-root-cause", "om-auto-write-spec", "om-prepare-issue", "om-spec-writing"],
    example: "/om-auto-manage-issues 123",
  },
  "om-verify-in-repo": {
    mode: "interactive",
    buildingBlock: true,
    summary: "Read-only triage gate: decides whether an issue is a real, still-unfixed defect.",
    description:
      "Checks whether the issue is already closed, claimed, covered by an open or merged PR, or not a bug, and stops the chain cleanly with a NO_ACTION_NEEDED verdict when so. It never edits, commits, claims or pushes. Step 1 of the autofix chain.",
    worksWith: ["om-root-cause", "om-fix", "om-open-pr", "om-auto-fix-issue"],
  },
  "om-auto-fix-issue": {
    mode: "autonomous",
    summary: "The issue-to-PR entry point: classifies the issue, then drives the bug or feature route.",
    description:
      "Takes a tracker issue to a labeled, reviewed PR in an isolated worktree under the claim protocol. A bug goes through verify, root-cause, fix, open PR and the review loop; a feature request gets its spec resolved (or written) and implemented on the same PR. Stops cleanly when the issue is solved, claimed, or (feature route) not ready.",
    worksWith: ["om-verify-in-repo", "om-root-cause", "om-fix", "om-open-pr", "om-auto-review-pr", "om-auto-write-spec", "om-auto-implement-spec"],
    example: "/om-auto-fix-issue 123",
  },
  "om-spec-writing": {
    mode: "interactive",
    summary: "Writes and reviews feature specs to staff-engineer standards.",
    description:
      "Drafts skeleton-first with a hard Open Questions gate, researches against market leaders, and breaks delivery into phases and testable steps that each leave the app working. Specs that change entities include a data-model graph. Also produces severity-ranked architectural reviews. --autonomous resolves open questions with documented, reversible defaults.",
    worksWith: ["om-auto-create-pr", "om-followup-issue-from-pr", "om-auto-write-spec"],
    example: "/om-spec-writing",
  },
  "om-auto-write-spec": {
    mode: "autonomous",
    summary: "Turns a brief or feature-request issue into a finished spec on a ready PR, with mockups.",
    description:
      "Runs om-spec-writing in autonomous mode, posts the Open-Questions defaults for override, attaches current-app screenshots and proposed-UI mockups when a browser provider is available, applies the full SDLC labels, and emits PR / Spec markers so implementation continues on the same PR.",
    worksWith: ["om-spec-writing", "om-open-pr", "om-prepare-test-env", "om-auto-implement-spec", "om-auto-fix-issue"],
    example: '/om-auto-write-spec "CSV export for the orders grid"',
  },
  "om-auto-implement-spec": {
    mode: "autonomous",
    summary: "Implements an existing spec and ships a reviewed, UI-verified PR.",
    description:
      "Resolves a spec by path, name, linked issue or spec-PR number, reuses the spec PR's branch when present, delegates implementation to the create / continue engine, then runs the review loop and UI verification with screenshots. Deliberately thin: resolution and routing only.",
    worksWith: ["om-auto-write-spec", "om-auto-create-pr", "om-auto-create-pr-loop", "om-auto-continue-pr", "om-auto-review-pr", "om-auto-qa-pr", "om-open-pr"],
    example: "/om-auto-implement-spec 2026-07-18-csv-export",
  },
  "om-root-cause": {
    mode: "interactive",
    buildingBlock: true,
    summary: "Read-only analysis: locates the bug and the minimal change surface.",
    description:
      "Traces the code path behind a confirmed defect, pinpoints the smallest module that owns the bug, and defines the minimal change set without editing anything. The report (summary, root cause, files, approach, risks) lets the fix step work without re-exploring the repo. Step 2 of the autofix chain.",
    worksWith: ["om-verify-in-repo", "om-fix", "om-auto-fix-issue"],
  },
  "om-fix": {
    mode: "interactive",
    buildingBlock: true,
    summary: "Implements the minimal change with regression tests and runs the validation gate.",
    description:
      "Claims the issue (assignee, in-progress label, claim comment), implements the minimal change identified by root-cause analysis, adds regression tests, and runs the validation gate until it passes. No refactors, no scope creep; it never commits, pushes or opens a PR. Step 3 of the autofix chain.",
    worksWith: ["om-verify-in-repo", "om-root-cause", "om-open-pr", "om-auto-review-pr", "om-auto-fix-issue"],
  },
  "om-auto-create-pr": {
    mode: "autonomous",
    summary: "Takes a free-form task brief end-to-end to a labeled, self-reviewed PR. Resumable.",
    description:
      "Drafts a Progress-tracked execution plan, works in an isolated worktree, implements phase by phase with incremental commits, runs the validation gate, self-reviews, and opens a ready PR with normalized labels, followed by an autofix review loop. Plans above the step threshold (default 20) are handed to the loop variant.",
    worksWith: ["om-open-pr", "om-code-review", "om-auto-review-pr", "om-auto-continue-pr", "om-auto-create-pr-loop"],
    example: '/om-auto-create-pr "Add rate limiting to the login endpoint"',
  },
  "om-auto-create-pr-loop": {
    mode: "autonomous",
    summary: "Advanced create-pr for long spec builds: run folder, one commit per step, checkpoint verification.",
    description:
      "Creates a run folder with PLAN.md, HANDOFF.md and NOTIFY.md, implements one lean commit per Step with planned executor placement, batches verification into checkpoints every ~5 steps, and runs the full gate plus the integration suite at completion. Resumable via om-auto-continue-pr-loop.",
    worksWith: ["om-integration-tests", "om-code-review", "om-auto-review-pr", "om-auto-continue-pr-loop"],
    example: '/om-auto-create-pr-loop "Implement the multi-tenant billing spec"',
  },
  "om-open-pr": {
    mode: "interactive",
    buildingBlock: true,
    summary: "The shared PR opener: commits, pushes, opens or reuses a labeled PR, emits chain markers.",
    description:
      "Commits the worktree, pushes, and opens (or reuses) a ready PR with the unified body template. Applies the full SDLC label set with a rationale comment per label, hands an issue back to its author and releases the claim, and always ends with the PR: #<number> (link: <url>) reference line.",
    worksWith: ["om-fix", "om-auto-fix-issue", "om-auto-create-pr", "om-auto-continue-pr", "om-auto-write-spec", "om-auto-implement-spec", "om-auto-review-pr"],
  },
  "om-check-and-commit": {
    mode: "interactive",
    summary: "Runs the validation gate on the branch, fixes obvious drift, commits and pushes when green.",
    description:
      "Runs every configured validation command in order, fixes straightforward failures, and, only when publication was explicitly requested, commits with a conventional-commit message and pushes. Uses no tracker operations and applies no labels.",
    worksWith: [],
    example: "/om-check-and-commit",
  },
  "om-auto-review-pr": {
    mode: "autonomous",
    summary: "Reviews or re-reviews a PR by number, with an autofix loop until merge-ready.",
    description:
      "Reviews a PR in an isolated worktree with om-code-review as the engine (or a specification review for spec-only PRs), submits an approve / request-changes verdict and manages pipeline labels. On changes requested it loops: resolve conflicts, fix, add tests, validate, re-review.",
    worksWith: ["om-code-review", "om-auto-fix-issue", "om-auto-fix-pr", "om-auto-qa-pr"],
    example: "/om-auto-review-pr 123",
  },
  "om-code-review": {
    mode: "interactive",
    buildingBlock: true,
    summary: "The review checklist behind om-auto-review-pr: correctness, security, contract surfaces.",
    description:
      "Runs the validation gate (every failure is a blocker), applies the built-in checklist plus any repo-local reviewChecklist, CODE_REVIEW.md and BACKWARD_COMPATIBILITY.md rules, and produces severity-ranked findings (blocker / major / minor / nit) with a mechanical verdict. Enforces the product brief's non-goals, rules and decisions.",
    worksWith: ["om-auto-review-pr", "om-review-prs", "om-auto-create-pr", "om-auto-continue-pr"],
  },
  "om-ux-review-pr": {
    mode: "interactive",
    summary: "Design-judgment review of a PR's UI with evidence-tagged findings and done-when criteria.",
    description:
      "Walks a PR's screens in a real browser performing the user's tasks, checks the state matrix, and posts one review comment where each finding carries evidence, a pattern, a trade-off and a done-when criterion, ranked by user impact. Includes a deceptive-pattern check. Never blocks a merge by itself.",
    worksWith: ["om-ux-setup", "om-prepare-test-env", "om-auto-qa-pr", "om-ux-shape"],
    example: "/om-ux-review-pr 123",
  },
  "om-auto-continue-pr": {
    mode: "autonomous",
    summary: "Resumes an in-progress PR from the first unchecked step of its tracking plan.",
    description:
      "Claims the PR, re-enters an isolated worktree, and picks up from the first unchecked step under the same implementation, validation, self-review and label rules. A PR with no plan (a human's, another tool's, a crashed run's) is adopted: the goal is reconstructed from its context and landed as a real plan.",
    worksWith: ["om-auto-create-pr", "om-open-pr", "om-code-review", "om-auto-review-pr", "om-auto-continue-pr-loop"],
    example: "/om-auto-continue-pr 123",
  },
  "om-auto-continue-pr-loop": {
    mode: "autonomous",
    summary: "Resumes a create-pr-loop run from the first non-done Tasks-table row.",
    description:
      "Orients from HANDOFF.md, parses the Tasks table in PLAN.md, and resumes at the first row that is not done, keeping the per-step commit and checkpoint discipline through to the full gate at completion.",
    worksWith: ["om-auto-create-pr-loop", "om-open-pr", "om-code-review", "om-auto-review-pr", "om-integration-tests", "om-auto-continue-pr"],
    example: "/om-auto-continue-pr-loop 123",
  },
  "om-auto-fix-pr": {
    mode: "autonomous",
    summary: "Drives one PR to merge-ready: base merge, review-autofix, CI stabilization, UI QA. Never merges.",
    description:
      "Merges the latest base in, then loops review-autofix, CI stabilization (classify each failing check; never fake green) and UI verification until the PR is approvable, green and QA-evidenced. Non-blocking findings become follow-up issues. Hands off to om-approve-merge-pr. --ci-only runs only the CI step.",
    worksWith: ["om-auto-review-pr", "om-auto-qa-pr", "om-followup-issue-from-pr", "om-approve-merge-pr"],
    example: "/om-auto-fix-pr 123",
  },
  "om-review-prs": {
    mode: "interactive",
    summary: "Sweeps every unreviewed open PR, newest first, through the review skill.",
    description:
      "Fetches open PRs, filters out drafts, already-decided, self-authored, blocked and claimed PRs, presents the queue, then runs om-auto-review-pr on each. Respects claim locks and never force-claims in batch mode.",
    worksWith: ["om-auto-review-pr", "om-merge-buddy"],
    example: "/om-review-prs",
    notes: ["The README catalogue lists this skill among the autonomous ones; its skill card marks it interactive. This guide follows the card."],
  },
  "om-pr-autopilot": {
    mode: "autonomous",
    summary: "Diagnoses the real state of one open PR, then runs the matching chain of skills. Dispatch only.",
    description:
      "Diagnoses plan progress, review state, CI, mergeability, labels and QA evidence, maps that onto an ordered chain of existing skills, and runs it, re-diagnosing between steps. Never merges without --allow-merge, never applies qa-approved, never weakens checks.",
    worksWith: ["om-auto-continue-pr", "om-auto-continue-pr-loop", "om-auto-fix-pr", "om-auto-review-pr", "om-auto-qa-pr", "om-followup-issue-from-pr", "om-approve-merge-pr"],
    example: "/om-pr-autopilot 123",
  },
  "om-prepare-test-env": {
    mode: "interactive",
    buildingBlock: true,
    summary: "Boots the app for QA and tests on any stack and provisions the browser provider.",
    description:
      "The first run discovers how the project boots and generates cross-platform launch and teardown scripts with reuse checks, build caching and health waits; later runs execute the saved script. Provisions the browser provider and writes the shared .ai/qa/test-env.json descriptor other skills attach to.",
    worksWith: ["om-integration-tests", "om-auto-qa-pr", "om-setup-agent-pipeline"],
    example: "/om-prepare-test-env",
  },
  "om-auto-qa-pr": {
    mode: "autonomous",
    summary: "QAs a PR's UI in a real browser and posts screenshot evidence. No source touched.",
    description:
      "Checks the PR's review state first (running om-auto-review-pr when unreviewed), boots the app, derives a scenario from the diff, drives the browser with screenshots and produces a pass/fail report. Evidence only by default; --self-qa-signoff applies qa-approved + qa-self-verified only on a fully green run on a needs-qa PR below risk-high.",
    worksWith: ["om-auto-review-pr", "om-prepare-test-env", "om-integration-tests", "om-setup-agent-pipeline"],
    example: "/om-auto-qa-pr 123",
  },
  "om-qa-buddy": {
    mode: "interactive",
    summary: "A human-in-the-loop manual QA session with an interactive runbook. Never touches the tracker.",
    description:
      "Builds a plain-language brief and a short prioritized test plan for a PR, issue or branch, publishes an interactive runbook the tester can work through immediately, drives the app in a real browser, writes one reproducible bug file per defect, and returns a verdict ready to paste as a review comment. Grows a local QA knowledge base; no comments, labels or claims.",
    worksWith: ["om-auto-qa-pr", "om-prepare-test-env"],
    example: "/om-qa-buddy 123",
    card: "skills/om-qa-buddy/SKILL.md",
    notes: ["This skill has no card under docs/skills/ and is not listed in the README catalogue; the link points to its SKILL.md."],
  },
  "om-integration-tests": {
    mode: "interactive",
    summary: "Creates and runs integration / E2E tests by exploring the running app first.",
    description:
      "Discovers how the repo starts the app and reuses the shared test environment, explores the live app for real locators, preserves the repo's own runners and conventions, and diagnoses each failure from artifacts (screenshots, traces) in a per-test table with a suggested owner.",
    worksWith: ["om-prepare-test-env", "om-spec-writing"],
    example: "/om-integration-tests",
  },
  "om-merge-buddy": {
    mode: "interactive",
    summary: "Reports which open PRs can merge now and which are close but blocked.",
    description:
      "Classifies merge readiness from labels, review decisions, CI status and mergeability into three buckets: ready, almost ready, blocked, with the blockers spelled out. Strictly read-only: never merges, edits, comments or labels.",
    worksWith: ["om-approve-merge-pr"],
    example: "/om-merge-buddy",
  },
  "om-approve-merge-pr": {
    mode: "interactive",
    summary: "Approves and squash-merges a PR by number, honoring the QA gate.",
    description:
      "Submits an approving review and squash-merges, but refuses when the QA gate or a blocking label (qa-failed, do-not-merge, blocked, an active qa) forbids it. Routes failing checks to om-auto-fix-pr --ci-only and conflicts or open feedback to the full om-auto-fix-pr loop. Can file a follow-up in the same run.",
    worksWith: ["om-auto-fix-pr", "om-followup-issue-from-pr", "om-merge-buddy"],
    example: "/om-approve-merge-pr 123",
  },
  "om-followup-issue-from-pr": {
    mode: "interactive",
    summary: "Turns a PR or PR comment into a tracked follow-up issue.",
    description:
      "In comment mode it extracts the actionable ask from a PR or comment link and opens a follow-up issue assigned to the mentioned person (or the PR author). In design-doc mode it opens an Implement: tracking issue for a PR that adds a design document, if none exists.",
    worksWith: ["om-auto-create-pr", "om-auto-fix-pr", "om-approve-merge-pr"],
  },
  "om-close-fixed-issues": {
    mode: "interactive",
    summary: "Post-merge housekeeping: closes issues merged PRs fixed, comments on closed-unmerged PRs.",
    description:
      "Reconciles a window of recent PRs against the tracker: closes issues a merged PR authoritatively closes (fixes / closes / resolves keywords) with a linked comment, and comments where a PR closed without merging. Never acts on bare #N mentions; respects do-not-close, blocked and claim locks.",
    worksWith: ["om-auto-update-changelog"],
    example: "/om-close-fixed-issues",
    notes: ["The README catalogue lists this skill among the autonomous ones; its skill card marks it interactive. This guide follows the card."],
  },
  "om-auto-update-changelog": {
    mode: "autonomous",
    summary: "Drafts a CHANGELOG release entry for merged PRs and ships it as a docs PR.",
    description:
      "Covers every PR merged since the last release in a categorized format, credits the right contributor via the Supersede Credit Rule (verified against commit authorship), leaves the Highlights paragraph for a human, and hands the edit to om-auto-create-pr. Meant to be run by a maintainer, not on a schedule.",
    worksWith: ["om-auto-create-pr", "om-close-fixed-issues"],
    example: "/om-auto-update-changelog",
  },
  "om-create-skill": {
    mode: "interactive",
    summary: "Authors a new OM skill, or splits an oversized SKILL.md into layered references.",
    description:
      "Works on the skills repository itself: authors a skill from a brief or splits an existing one into references/ files without changing behavior. Gates every result on scripts/lint.sh and completeness checks.",
    worksWith: [],
    notes: ["Not shown on the RACI chart: it maintains the skills collection rather than a stage of the delivery process."],
  },
};

export const SKILLS: Skill[] = SKILL_IDS.map((id) => ({
  id,
  ...DATA[id],
  card: DATA[id].card ?? `docs/skills/${id}.md`,
}));
