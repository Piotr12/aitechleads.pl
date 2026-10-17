/**
 * Data behind /docs2 — the open-mercato AI SDLC, TL;DR edition.
 *
 * Sources: the "AI SDLC RACI" chart (who_what_when.png) and the open-mercato/skills repo
 * (SDLC.md, docs/roles/*, docs/skills/*). Where they disagree, the repo wins; the
 * disagreements are listed in `DISCREPANCIES`.
 */

export const UPSTREAM = "https://github.com/open-mercato/skills/blob/main";

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

export const STAGE_IDS = [
  "discovery",
  "intake",
  "triage",
  "claim",
  "implement",
  "pr",
  "review",
  "qa",
  "merge",
  "cleanup",
] as const;
export type StageId = (typeof STAGE_IDS)[number];

export type Stage = {
  id: StageId;
  n: number;
  name: string;
  short: string;
  layer: "product" | "delivery";
  /** Done-when, from SDLC.md's ticket lifecycle table. */
  done: string;
  note?: string;
};

export const STAGES: Stage[] = [
  {
    id: "discovery",
    n: 1,
    name: "Discovery & Design",
    short: "Discover",
    layer: "product",
    done: "product-brief.md approved, or an idea routed with a brief",
  },
  {
    id: "intake",
    n: 2,
    name: "Intake",
    short: "Intake",
    layer: "delivery",
    done: "Ticket exists and is ready, or its gaps are named on it",
  },
  {
    id: "triage",
    n: 3,
    name: "Triage",
    short: "Triage",
    layer: "delivery",
    done: "Confirmed actionable, or closed as no-action",
  },
  {
    id: "claim",
    n: 4,
    name: "Claim",
    short: "Claim",
    layer: "delivery",
    done: "Claim visible: assignee + in-progress + comment",
  },
  {
    id: "implement",
    n: 5,
    name: "Implement",
    short: "Build",
    layer: "delivery",
    done: "Change complete, validation gate green",
    note: "SDLC.md has a separate Design stage (om-ux-shape) right before this one, for user-facing tickets only.",
  },
  {
    id: "pr",
    n: 6,
    name: "Pull request",
    short: "PR",
    layer: "delivery",
    done: "Open, ready, fully labeled PR",
  },
  {
    id: "review",
    n: 7,
    name: "Review",
    short: "Review",
    layer: "delivery",
    done: "Approving review submitted (label → merge-queue)",
  },
  {
    id: "qa",
    n: 8,
    name: "QA",
    short: "QA",
    layer: "delivery",
    done: "qa-approved (or permitted self-QA); qa-failed routes back",
  },
  {
    id: "merge",
    n: 9,
    name: "Merge",
    short: "Merge",
    layer: "delivery",
    done: "Squash-merged into main",
  },
  {
    id: "cleanup",
    n: 10,
    name: "Cleanup",
    short: "Cleanup",
    layer: "delivery",
    done: "Tracker reconciled, follow-ups filed",
  },
];

export const stageById = (id: StageId) => STAGES.find((s) => s.id === id)!;

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------

export const ROLE_IDS = [
  "product-owner",
  "domain-expert",
  "architect",
  "designer",
  "developer",
  "qa",
  "maintainer",
] as const;
export type RoleId = (typeof ROLE_IDS)[number];

export type GateId = "G1" | "G2" | "G3" | "G4" | "G5" | "G6" | "G7";

/**
 * One cell of the RACI chart.
 * dot: "decide" = red dot (a human decides, at gates); "supervise" = dark dot (agent works,
 * a human can take over); none = plain RACI involvement. `agent` present = hollow ○
 * (agents carry out delegated work).
 */
export type Cell = {
  raci: string;
  dot?: "decide" | "supervise";
  human?: string;
  agent?: string;
  skills?: string[];
  gates?: GateId[];
  note?: string;
};

export type Role = {
  id: RoleId;
  code: string;
  name: string;
  layer: "product" | "delivery" | "both";
  owns: string;
  /** Line under the name on the actor cards. */
  tagline: string;
  /** The repo's name for this role, when it differs. */
  repoName: string;
  repoDoc: { label: string; href: string };
  cells: Partial<Record<StageId, Cell>>;
  stop: string[];
  start: string[];
};

export const ROLES: Role[] = [
  {
    id: "product-owner",
    code: "PO",
    name: "Product Owner",
    layer: "product",
    owns: "the why and the value",
    tagline: "Signs the brief, the backlog and the Definition of Ready.",
    repoName: "Product owner (SDLC.md) · Product Manager / Analyst (docs/roles)",
    repoDoc: { label: "docs/roles/product-manager.md", href: `${UPSTREAM}/docs/roles/product-manager.md` },
    cells: {
      discovery: {
        raci: "A,R",
        dot: "decide",
        gates: ["G1", "G2"],
        skills: ["om-discover", "om-brainstorm", "om-synthetic-users", "om-backlog"],
        human: "Talks to users and the market, answers the question rounds, approves the brief and the backlog tree.",
        agent: "Skeptic subagent, [SYNTHETIC] personas, the backlog tree.",
      },
      intake: {
        raci: "A",
        dot: "decide",
        gates: ["G3"],
        skills: ["om-prepare-issue", "om-auto-manage-issues"],
        human: "Checks the Definition of Ready: who, what result, what is out.",
        agent: "Dedupe, SDLC labels, files the issue.",
      },
      triage: { raci: "I", human: "Told the triage outcome." },
      review: {
        raci: "A",
        gates: ["G5"],
        human: "Approves changes to the decisions they own.",
      },
      qa: {
        raci: "C",
        dot: "decide",
        human: "Does it solve the problem from the brief? Accepts the value, not the code.",
        agent: "Preview and screenshots as evidence.",
      },
      merge: { raci: "I", human: "Merged. Shipping is the release process." },
      cleanup: { raci: "I", human: "Follow-ups filed." },
    },
    stop: [
      "Writing tickets from a blank page and filing duplicates",
      "Letting a persona quote count as evidence",
      "Reviewing code to check the value",
    ],
    start: [
      "Owning product-brief.md and its decision table (D07, N01…)",
      "Answering the ticket-level DoR tier: only a human can",
      "Correcting the agents' posted assumptions on the issue or spec PR",
      "Accepting value at QA from the preview and screenshots",
    ],
  },
  {
    id: "domain-expert",
    code: "DE",
    name: "Domain Expert",
    layer: "product",
    owns: "business rules, non-goals, decisions",
    tagline: "The named owner of the rules. Only they sign a change to one.",
    repoName: "Domain expert (optional role, discovery.roles.domainExpert)",
    repoDoc: { label: "SDLC.md › Roles", href: `${UPSTREAM}/SDLC.md#roles` },
    cells: {
      discovery: {
        raci: "A",
        dot: "decide",
        skills: ["om-discover"],
        human: "Named owner of the domain rules, non-goals and decisions.",
        agent: "Asks the question rounds; records answers as [decision] and [assumption].",
      },
      intake: {
        raci: "C",
        dot: "decide",
        human: "Confirms the in-scope spec breaks no domain rule.",
        agent: "Checks the ticket against the non-goals in product-brief.md.",
      },
      implement: { raci: "C", human: "Consulted when the spec touches one of their rules." },
      review: {
        raci: "A",
        gates: ["G5"],
        human: "Approves superseding entries for the rules and decisions they own.",
      },
    },
    stop: [
      "Keeping the rules in your head or in a chat thread",
      "Re-explaining the same rule on every PR",
    ],
    start: [
      "Owning stable ids (R03, N01, D07) with review-by dates",
      "Signing superseding entries: the only way a rule changes",
      "Treating an expired review-by date as a prompt, not a law",
    ],
  },
  {
    id: "architect",
    code: "TL",
    name: "Architect / Tech Lead",
    layer: "both",
    owns: "the how and the risk",
    tagline: "Owns the spec and the independent review of risky changes.",
    repoName: "Reviewer (SDLC.md: \"a team that names a tech lead or an architect puts them here\")",
    repoDoc: { label: "SDLC.md › Roles", href: `${UPSTREAM}/SDLC.md#roles` },
    cells: {
      discovery: {
        raci: "C · A",
        dot: "decide",
        human: "Advises on feasibility and cost (C); chooses the tech stack (A).",
      },
      triage: {
        raci: "A",
        dot: "supervise",
        skills: ["om-verify-in-repo"],
        human: "Settles disputes: risk-high vs medium, blocked.",
        agent: "Read-only: is it real, still unfixed on main, not claimed?",
      },
      implement: {
        raci: "A",
        dot: "supervise",
        skills: ["om-spec-writing", "om-auto-write-spec"],
        human: "Writes or approves the spec and ADRs: data model, API, multi-tenancy.",
        agent: "Spec draft from requirements, Risks & Impact, changelog.",
      },
      pr: { raci: "C", human: "Advises on risks to access, data and payments." },
      review: {
        raci: "A",
        dot: "decide",
        gates: ["G4"],
        skills: ["om-auto-review-pr", "om-code-review"],
        human: "Reviews sensitive changes independently, per the team's review policy.",
        agent: "Checks the change against the checklist; reports what must be fixed.",
      },
      merge: { raci: "C", human: "Consulted when gates conflict." },
    },
    stop: [
      "Being the first reader of every diff (the agent reads first)",
      "Writing specs from a blank page",
      "Accepting risk-high PRs without the evidence tests",
    ],
    start: [
      "Owning risk labels: the higher one wins when signals conflict",
      "Being the second person on auth, sessions and money",
      "Reviewing spec PRs with the spec lenses, before code exists",
    ],
  },
  {
    id: "designer",
    code: "DS",
    name: "Designer",
    layer: "product",
    owns: "the flow and screen states before code",
    tagline: "Settles flows and states up front; advisory pass on the PR.",
    repoName: "Designer · Discovery design (optional role)",
    repoDoc: { label: "docs/roles/designer.md", href: `${UPSTREAM}/docs/roles/designer.md` },
    cells: {
      discovery: {
        raci: "A",
        dot: "decide",
        skills: ["om-ux-shape", "om-ux-setup", "om-mockup-prototype"],
        human: "Defines the flow and screen states; approves the final design.",
        agent: "Builds prototypes; records the design-system reference (.uxproof/).",
        note: "In SDLC.md om-ux-shape runs in the Design stage (between Claim and Implement), per UI ticket.",
      },
      implement: {
        raci: "C",
        dot: "supervise",
        human: "Answers design questions as the screens are built.",
        agent: "Follows the agreed flow and design system.",
      },
      review: {
        raci: "C",
        dot: "supervise",
        skills: ["om-ux-review-pr"],
        human: "Advisory pass: informs the review, does not hold the merge.",
        agent: "Walks the PR's screens; findings ranked by user impact.",
      },
      qa: { raci: "I", human: "Gets the QA findings on the UI." },
    },
    stop: [
      "Handing over static mockups and hoping",
      "Chasing screenshots of what got built",
      "Holding a merge on taste",
    ],
    start: [
      "Running om-ux-setup once: your design system as an executable contract",
      "Deciding the state matrix: empty, loading, error, no-permission, long, narrow",
      "Steering via the assumptions comment on the spec PR",
    ],
  },
  {
    id: "developer",
    code: "DEV",
    name: "Developer",
    layer: "delivery",
    owns: "the change, from claim to merge-ready PR",
    tagline: "Drives the agent instead of typing the code.",
    repoName: "Author (SDLC.md) · Developer (docs/roles)",
    repoDoc: { label: "docs/roles/developer.md", href: `${UPSTREAM}/docs/roles/developer.md` },
    cells: {
      claim: {
        raci: "A,R",
        dot: "supervise",
        skills: ["om-auto-fix-issue", "om-fix", "om-auto-create-pr"],
        human: "Takes the ticket by hand or starts an agent on it.",
        agent: "Assign + in-progress + claim comment; a second agent backs off.",
      },
      implement: {
        raci: "A,R",
        dot: "supervise",
        skills: [
          "om-root-cause",
          "om-fix",
          "om-auto-create-pr",
          "om-auto-create-pr-loop",
          "om-auto-implement-spec",
        ],
        human: "Guides the work and checks it against the spec.",
        agent: "Finds the cause, makes the change, runs the tests.",
      },
      pr: {
        raci: "A,R",
        dot: "supervise",
        skills: ["om-open-pr", "om-check-and-commit"],
        human: "Checks the work; explains what changed and why.",
        agent: "Opens the PR with the full label set; records its status.",
      },
      review: {
        raci: "R",
        dot: "decide",
        skills: ["om-auto-continue-pr", "om-auto-continue-pr-loop", "om-auto-fix-pr"],
        human: "Answers review comments; explains disagreements.",
        agent: "Makes the agreed fixes, requests another review.",
      },
      qa: { raci: "I", human: "Gets the QA result." },
      merge: { raci: "I", human: "Merged." },
      cleanup: { raci: "I", human: "Gets follow-ups from review and QA." },
    },
    stop: [
      "Typing the code",
      "Opening PRs by hand with ad-hoc labels",
      "Going green by weakening a test",
    ],
    start: [
      "Handing the agent a brief, a spec or an issue number",
      "Checking the result against the spec, not just the tests",
      "Resuming interrupted runs instead of restarting them",
      "Arguing with review findings in writing, on the PR",
    ],
  },
  {
    id: "qa",
    code: "QA",
    name: "QA / Tester",
    layer: "delivery",
    owns: "testing and the QA approval",
    tagline: "Holds the one hard rule: needs-qa never merges without qa-approved.",
    repoName: "QA reviewer",
    repoDoc: { label: "docs/roles/qa.md", href: `${UPSTREAM}/docs/roles/qa.md` },
    cells: {
      implement: {
        raci: "R",
        skills: ["om-prepare-test-env"],
        agent: "Boots the app once; the other skills reuse the same env.",
      },
      qa: {
        raci: "A,R",
        dot: "decide",
        gates: ["G6"],
        skills: ["om-prepare-test-env", "om-auto-qa-pr", "om-qa-buddy", "om-integration-tests"],
        human: "Tests and approves. An engineer may sign off lower-risk work when QA is unavailable.",
        agent: "Runs checks, records test results and screenshots for review.",
      },
      cleanup: {
        raci: "R",
        dot: "supervise",
        skills: ["om-followup-issue-from-pr"],
        human: "Files what the test found outside the scope.",
        agent: "Turns QA findings into follow-up issues.",
      },
    },
    stop: [
      "Booting a fresh environment per PR",
      "Hand-writing locators and hardcoded ids",
      "Approving \"it works on my head commit\" without a sha",
    ],
    start: [
      "Pinning every approval to a commit: QA head: <sha>",
      "Failing a missing state (empty, error, no-permission…)",
      "Turning a flow worth keeping into om-integration-tests coverage",
      "Filing out-of-scope findings as follow-ups, not blockers",
    ],
  },
  {
    id: "maintainer",
    code: "MT",
    name: "Maintainer",
    layer: "both",
    owns: "the process, the merge and the changelog",
    tagline: "Context engineer (SDLC.md, config, skills) + release manager.",
    repoName: "Maintainer · Release Manager (docs/roles)",
    repoDoc: { label: "docs/roles/release-manager.md", href: `${UPSTREAM}/docs/roles/release-manager.md` },
    cells: {
      discovery: {
        raci: "A",
        dot: "decide",
        skills: [
          "om-setup-agent-pipeline",
          "om-setup-discovery-pipeline",
          "om-apply-upgrade-notes",
          "om-pipeline-retro",
        ],
        human: "Designs the process: picks the approach, sets up config, SDLC.md and skills; tunes them after a retro.",
        agent: "Asks, then writes config and SDLC.md, only after a yes.",
        note: "Setup, not per-ticket work: once per repo, then after upgrades and retros.",
      },
      intake: { raci: "A", human: "May waive a readiness item; records the reason on the ticket." },
      triage: { raci: "C", human: "Consulted: risk-high vs medium, blocked." },
      claim: { raci: "I", human: "Sees claim comments; may clear a stale in-progress." },
      review: {
        raci: "R",
        skills: ["om-review-prs", "om-pr-autopilot"],
        agent: "Sweeps the review backlog; drives one PR to the finish.",
      },
      qa: { raci: "A", human: "Approves exceptions to the QA process; records the reason." },
      merge: {
        raci: "A",
        dot: "decide",
        gates: ["G7"],
        skills: ["om-merge-buddy", "om-approve-merge-pr"],
        human: "Lifts blocked / do-not-merge; last word when gates conflict.",
        agent: "Reports what can merge, re-checks every gate, squash-merges.",
      },
      cleanup: {
        raci: "A",
        dot: "supervise",
        skills: ["om-close-fixed-issues", "om-auto-update-changelog"],
        human: "Reads follow-ups, sets priority, guards do-not-close.",
        agent: "Closes fixed issues, comments on rejected PRs, drafts the changelog.",
      },
    },
    stop: [
      "Process as tribal knowledge",
      "Merging on gut feel and a green tick",
      "Forking a skill to change one rule",
    ],
    start: [
      "SDLC.md + .ai/agentic.config.json as the single source, changed together",
      "Repo-local overrides in .ai/skills/<name>/SKILL.md",
      "Retro-driven tuning (om-pipeline-retro ranks what second passes cost)",
      "Recording every waiver and exception on the ticket or PR",
    ],
  },
];

export const roleById = (id: RoleId) => ROLES.find((r) => r.id === id)!;
export const isRoleId = (v: string): v is RoleId => (ROLE_IDS as readonly string[]).includes(v);

/** Every skill a role invokes, in stage order, deduplicated. */
export function roleSkills(role: Role): string[] {
  const seen = new Set<string>();
  for (const s of STAGE_IDS) for (const k of role.cells[s]?.skills ?? []) seen.add(k);
  return [...seen];
}

/** Roles that list a skill in any of their cells. */
export function skillRoles(skill: string): Role[] {
  return ROLES.filter((r) => STAGE_IDS.some((s) => r.cells[s]?.skills?.includes(skill)));
}

// ---------------------------------------------------------------------------
// Gates
// ---------------------------------------------------------------------------

export type Gate = {
  id: GateId;
  name: string;
  stage: StageId;
  owner: RoleId[];
  ownerLabel: string;
  check: string[];
  signal: string;
  escape: string[];
};

export const GATES: Gate[] = [
  {
    id: "G1",
    name: "Product brief",
    stage: "discovery",
    owner: ["product-owner"],
    ownerLabel: "PO",
    check: [
      "Problem and who has it, stakeholders, rules, flows, success criteria",
      "Scope split: now / later / not doing; non-goals; decisions with owners",
      "Every claim tagged by evidence; [SYNTHETIC] never counts",
    ],
    signal: "PO confirms before om-discover writes product-brief.md",
    escape: [
      "A section with no material behind it becomes a collection plan, not prose",
    ],
  },
  {
    id: "G2",
    name: "Backlog",
    stage: "discovery",
    owner: ["product-owner"],
    ownerLabel: "PO",
    check: [
      "Epics → stories with acceptance criteria → tasks",
      "Existing issues adopted, not duplicated",
    ],
    signal: "om-backlog shows the whole tree; files nothing until a yes",
    escape: [
      "--dry-run to look first",
      "A brief resting on assumptions is refused; a research backlog is offered instead",
    ],
  },
  {
    id: "G3",
    name: "Definition of Ready",
    stage: "intake",
    owner: ["product-owner"],
    ownerLabel: "PO (+ DE consulted)",
    check: [
      "Human tier: problem + who, expected outcome + how checked, out of scope",
      "No blocking open question unanswered; autonomous assumptions confirmed",
      "Spec tier (AC, rules, paths, data/permissions, deps, mockups) may come from a spec",
      "Bugs: ready = reproducible (om-verify-in-repo)",
    ],
    signal: "om-auto-manage-issues records READY_STATUS; om-auto-fix-issue stops on a not-ready feature",
    escape: ["Maintainer waives an item by saying so on the ticket, with the reason"],
  },
  {
    id: "G4",
    name: "Independent review",
    stage: "review",
    owner: ["architect"],
    ownerLabel: "Architect / TL (Reviewer)",
    check: [
      "om-code-review checklist: correctness, security, contract surfaces, CODE_REVIEW.md",
      "risk-high evidence: denied-path + wrong-scope tests, isolation, money retry/idempotency, migration up/down + rollback",
      "Auth or money: a second person's review, whatever the QA path",
      "Red CI or conflicts are blocker findings, reported with the full review",
    ],
    signal: "changes-requested ↔ review → merge-queue",
    escape: ["Maintainer waives missing risk-high evidence on the PR"],
  },
  {
    id: "G5",
    name: "Decision change",
    stage: "review",
    owner: ["product-owner", "domain-expert"],
    ownerLabel: "Owner of the decision",
    check: [
      "PR contradicts a non-goal (N…), rule (R…) or decision (D…) without a superseding entry in the same PR → blocker",
      "Every PR body carries \"Decisions touched\"",
    ],
    signal: "Superseding row approved by the entry's owner",
    escape: [
      "Never \"delete the code\": change the decision explicitly",
      "Maintainer arbitrates a dispute",
      "Past review-by date: flagged for a look, not enforced blindly",
    ],
  },
  {
    id: "G6",
    name: "Test approval",
    stage: "qa",
    owner: ["qa"],
    ownerLabel: "QA reviewer",
    check: [
      "needs-qa must not merge without qa-approved, even fully green",
      "UI: the state matrix (default, empty, loading, error, no-permission, long, narrow) + .uxproof/ contract",
      "Approval pinned to a commit: QA head: <sha>; later pushes stale it",
    ],
    signal: "qa → merge-queue + qa-approved, or qa-failed",
    escape: [
      "skip-qa: docs, deps, CI, test-only (never with needs-qa)",
      "Self-QA on risk-low / risk-medium with full evidence → qa-approved + qa-self-verified",
      "risk-high: no self-QA; QA reviewer or the maintainer's explicit exception on the PR",
    ],
  },
  {
    id: "G7",
    name: "Merge",
    stage: "merge",
    owner: ["maintainer"],
    ownerLabel: "Maintainer signs",
    check: [
      "om-approve-merge-pr re-checks every gate, then squash-merges",
      "Hard blocks: qa-failed, blocked, do-not-merge, active qa label, in-progress, red required checks",
      "QA evidence older than head → asks for confirmation",
    ],
    signal: "om-merge-buddy: merge-now vs close-but-blocked (read-only)",
    escape: [
      "Humans set and clear blocked / do-not-merge",
      "Maintainer has the last word when gates conflict",
    ],
  },
];

export const gateById = (id: GateId) => GATES.find((g) => g.id === id)!;
export const gatesAt = (stage: StageId) => GATES.filter((g) => g.stage === stage);

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export type SkillGroup = "setup" | StageId;

export type Skill = {
  name: string;
  group: SkillGroup;
  line: string;
  example: string;
  /** Mostly composed by other skills rather than called by hand. */
  block?: boolean;
  /** Override for skills that no chart cell lists. */
  roles?: RoleId[];
  /** Not documented with a docs/skills card upstream. */
  noCard?: boolean;
};

export const SKILLS: Skill[] = [
  // Setup
  { name: "om-setup-agent-pipeline", group: "setup", line: "Once per repo: writes .ai/agentic.config.json, SDLC.md, tracker/browser descriptors", example: "/om-setup-agent-pipeline" },
  { name: "om-setup-discovery-pipeline", group: "setup", line: "Adds the product layer: product roles, Discovery stage, DoR, protected decisions", example: "/om-setup-discovery-pipeline" },
  { name: "om-apply-upgrade-notes", group: "setup", line: "After a skills update: applies UPGRADE_NOTES.md, keeps local edits", example: "/om-apply-upgrade-notes" },
  { name: "om-pipeline-retro", group: "setup", line: "Classifies finished runs, ranks second-pass causes by hours lost (read-only)", example: "/om-pipeline-retro" },
  { name: "om-create-skill", group: "setup", line: "Authors a new skill or splits an oversized SKILL.md", example: "/om-create-skill \"<brief>\"", roles: ["maintainer"] },
  // Discovery
  { name: "om-discover", group: "discovery", line: "product-brief.md from real material; evidence-tagged, decisions owned", example: "/om-discover --mode client \"Benefits portal\"" },
  { name: "om-brainstorm", group: "discovery", line: "One idea → challenger-tested routing decision + handoff brief", example: "/om-brainstorm \"should we build bulk-archive?\"" },
  { name: "om-synthetic-users", group: "discovery", line: "Persona panel walks a flow; findings are [SYNTHETIC] hypotheses only", example: "/om-synthetic-users .ai/specs/product-brief.md --flow \"onboarding\"" },
  { name: "om-mockup-prototype", group: "discovery", line: "Neutral clickable prototype of a brief flow, browser-checked", example: "/om-mockup-prototype .ai/specs/product-brief.md --flow \"onboarding\"" },
  { name: "om-ux-shape", group: "discovery", line: "Vague idea → decided direction: scope, states, riskiest-assumption test", example: "/om-ux-shape \"Quick-add flow for the people list\"" },
  { name: "om-ux-setup", group: "discovery", line: "Once per repo: design contract into .uxproof/ (tokens, components, archetypes)", example: "/om-ux-setup" },
  { name: "om-backlog", group: "discovery", line: "Brief → epics, stories with AC, tasks; files after you approve the tree", example: "/om-backlog .ai/specs/product-brief.md" },
  // Intake
  { name: "om-prepare-issue", group: "intake", line: "One deduped, SDLC-labeled issue with spec link or guidance; never implements", example: "/om-prepare-issue \"Bulk-archive orders from the grid\"" },
  { name: "om-auto-manage-issues", group: "intake", line: "Label sync, laconic-issue clarification, DoR + spec-coverage check", example: "/om-auto-manage-issues [<issue>]" },
  // Triage
  { name: "om-verify-in-repo", group: "triage", line: "Read-only: real, unfixed on main, unclaimed? Else NO_ACTION_NEEDED", example: "/om-verify-in-repo <issue>", block: true },
  // Claim
  { name: "om-auto-fix-issue", group: "claim", line: "The issue entry point: classifies, then bug chain or spec-then-build", example: "/om-auto-fix-issue <issue>" },
  // Implement
  { name: "om-root-cause", group: "implement", line: "Read-only: locates the bug and the minimal change surface", example: "/om-root-cause <issue>", block: true },
  { name: "om-fix", group: "implement", line: "Minimal change + regression tests + validation gate; no commit", example: "/om-fix <issue>", block: true },
  { name: "om-auto-create-pr", group: "implement", line: "Free-form brief → plan, worktree, phased commits, gate, self-review, PR", example: "/om-auto-create-pr \"Add rate limiting to login\"" },
  { name: "om-auto-create-pr-loop", group: "implement", line: "Long runs: PLAN/HANDOFF, one commit per step, checkpoints", example: "/om-auto-create-pr-loop \"<large spec>\"" },
  { name: "om-auto-implement-spec", group: "implement", line: "Builds an existing spec on its PR, with screenshots", example: "/om-auto-implement-spec <spec>" },
  { name: "om-spec-writing", group: "implement", line: "Staff-level spec, skeleton-first, hard Open Questions gate", example: "/om-spec-writing" },
  { name: "om-auto-write-spec", group: "implement", line: "Brief or FR → spec PR with mockups + assumptions comment", example: "/om-auto-write-spec <issue|brief>" },
  { name: "om-prepare-test-env", group: "implement", line: "Boot the app once, any stack; shared env descriptor; browser provider", example: "/om-prepare-test-env", block: true },
  // PR
  { name: "om-open-pr", group: "pr", line: "Commit, push, open/reuse PR, full labels, release claim, chain markers", example: "/om-open-pr [<issue>]", block: true },
  { name: "om-check-and-commit", group: "pr", line: "Hand-worked branch: gate, fix drift, commit + push when green", example: "/om-check-and-commit" },
  // Review
  { name: "om-auto-review-pr", group: "review", line: "Review + autofix loop; spec-only PRs get the spec lenses", example: "/om-auto-review-pr <PR>" },
  { name: "om-code-review", group: "review", line: "The checklist: correctness, security, contracts, CODE_REVIEW.md", example: "/om-code-review", block: true },
  { name: "om-ux-review-pr", group: "review", line: "Advisory design review in a real browser, ranked by user impact", example: "/om-ux-review-pr <PR>" },
  { name: "om-auto-continue-pr", group: "review", line: "Resumes a PR from its first unchecked plan step (adopts plan-less PRs)", example: "/om-auto-continue-pr <PR>" },
  { name: "om-auto-continue-pr-loop", group: "review", line: "Resumes a loop run from HANDOFF.md", example: "/om-auto-continue-pr-loop <PR>" },
  { name: "om-auto-fix-pr", group: "review", line: "One PR to merge-ready: base merge, review-autofix, honest CI fixes, UI QA; never merges", example: "/om-auto-fix-pr <PR> [--ci-only]" },
  { name: "om-review-prs", group: "review", line: "Sweeps every unreviewed PR, newest first, claim-aware", example: "/om-review-prs" },
  { name: "om-pr-autopilot", group: "review", line: "\"Just finish this PR\": diagnoses, dispatches the chain; merges only with --allow-merge", example: "/om-pr-autopilot <PR> [--dry-run]" },
  // QA
  { name: "om-auto-qa-pr", group: "qa", line: "Browser QA with screenshots + pass/fail; labels only with a flag", example: "/om-auto-qa-pr <PR> [--self-qa-signoff | --apply-failure]" },
  { name: "om-qa-buddy", group: "qa", line: "Human-in-the-loop QA runbook, bug files, local knowledge base; never touches the tracker", example: "/om-qa-buddy <PR|issue|branch>", noCard: true },
  { name: "om-integration-tests", group: "qa", line: "E2E tests against the live app: real locators, artifact diagnosis", example: "/om-integration-tests" },
  // Merge
  { name: "om-merge-buddy", group: "merge", line: "Read-only: merge-now vs close-but-blocked", example: "/om-merge-buddy" },
  { name: "om-approve-merge-pr", group: "merge", line: "Re-checks every gate, approves, squash-merges; refuses on QA gate", example: "/om-approve-merge-pr <PR>" },
  // Cleanup
  { name: "om-followup-issue-from-pr", group: "cleanup", line: "PR or comment → tracked follow-up issue", example: "/om-followup-issue-from-pr <PR-or-comment-url>" },
  { name: "om-close-fixed-issues", group: "cleanup", line: "Closes issues merged PRs fixed; comments on closed-unmerged", example: "/om-close-fixed-issues [--dry-run]" },
  { name: "om-auto-update-changelog", group: "cleanup", line: "CHANGELOG entry since last release, shipped as a docs PR", example: "/om-auto-update-changelog" },
];

export const skillByName = (name: string) => SKILLS.find((s) => s.name === name);

export function skillHref(name: string): string {
  const skill = skillByName(name);
  return skill?.noCard ? `${UPSTREAM}/skills/${name}/SKILL.md` : `${UPSTREAM}/docs/skills/${name}.md`;
}

export const isAutonomous = (name: string) => name.startsWith("om-auto-") || name === "om-pr-autopilot";

// ---------------------------------------------------------------------------
// Handoffs
// ---------------------------------------------------------------------------

export type Handoff = {
  stage: StageId;
  from: RoleId;
  to: RoleId;
  artifact: string;
  via?: string;
  gate?: GateId;
};

export const HANDOFFS: Handoff[] = [
  { stage: "discovery", from: "maintainer", to: "product-owner", artifact: "SDLC.md + agentic.config.json, product layer on", via: "om-setup-discovery-pipeline" },
  { stage: "discovery", from: "domain-expert", to: "product-owner", artifact: "Rules, non-goals, decisions as [decision] / [assumption]", via: "om-discover" },
  { stage: "discovery", from: "designer", to: "product-owner", artifact: "Clickable prototype, flow and states", via: "om-mockup-prototype" },
  { stage: "discovery", from: "architect", to: "product-owner", artifact: "Feasibility, cost, the stack" },
  { stage: "discovery", from: "product-owner", to: "developer", artifact: "Approved brief + backlog tree, issues filed", via: "om-backlog", gate: "G2" },
  { stage: "intake", from: "domain-expert", to: "product-owner", artifact: "No domain rule broken", via: "om-auto-manage-issues" },
  { stage: "intake", from: "product-owner", to: "architect", artifact: "Ready ticket (DoR met, or waived by MT)", gate: "G3" },
  { stage: "triage", from: "architect", to: "developer", artifact: "Actionable + risk label, or NO_ACTION_NEEDED", via: "om-verify-in-repo" },
  { stage: "claim", from: "developer", to: "maintainer", artifact: "Claim: assignee + in-progress + comment", via: "om-auto-fix-issue" },
  { stage: "implement", from: "architect", to: "developer", artifact: "Spec + ADRs (spec PR)", via: "om-auto-write-spec" },
  { stage: "implement", from: "designer", to: "developer", artifact: "Answers on flow and design system" },
  { stage: "pr", from: "developer", to: "architect", artifact: "Ready, labeled PR: #<n>", via: "om-open-pr" },
  { stage: "review", from: "designer", to: "architect", artifact: "Advisory UX findings", via: "om-ux-review-pr" },
  { stage: "review", from: "architect", to: "developer", artifact: "Verdict: changes-requested → fixes → re-review", via: "om-auto-review-pr", gate: "G4" },
  { stage: "review", from: "product-owner", to: "developer", artifact: "Superseding decision approved (if one is touched)", gate: "G5" },
  { stage: "review", from: "developer", to: "qa", artifact: "Approved PR in merge-queue, carrying needs-qa", via: "om-auto-continue-pr" },
  { stage: "qa", from: "qa", to: "product-owner", artifact: "Preview + screenshots: does it solve the brief?", via: "om-auto-qa-pr" },
  { stage: "qa", from: "qa", to: "maintainer", artifact: "qa-approved @ QA head: <sha>, or qa-failed → DEV", gate: "G6" },
  { stage: "merge", from: "maintainer", to: "developer", artifact: "Squash-merged into main (PO informed)", via: "om-approve-merge-pr", gate: "G7" },
  { stage: "cleanup", from: "qa", to: "maintainer", artifact: "Follow-up issues for out-of-scope findings", via: "om-followup-issue-from-pr" },
  { stage: "cleanup", from: "maintainer", to: "developer", artifact: "Prioritised follow-ups, closed issues, changelog", via: "om-close-fixed-issues" },
];

// ---------------------------------------------------------------------------
// Chart vs repo
// ---------------------------------------------------------------------------

export const DISCREPANCIES: { topic: string; chart: string; repo: string }[] = [
  {
    topic: "Design stage",
    chart: "Folds design into Discovery & Design; om-ux-shape listed there.",
    repo: "SDLC.md has its own Design stage between Claim and Implement, per user-facing ticket. Shown as a note on Implement.",
  },
  {
    topic: "Architect / Tech Lead",
    chart: "A named actor.",
    repo: "No such role: it is the Reviewer, who also signs off specs and is the second person on risk-high.",
  },
  {
    topic: "Domain Expert",
    chart: "Always present.",
    repo: "Optional (discovery.roles.domainExpert). Without one, the Product Owner signs the rules.",
  },
  {
    topic: "Maintainer vs Release Manager",
    chart: "One actor.",
    repo: "Same: the Maintainer acts as release manager unless the team names one.",
  },
  {
    topic: "om-auto-fix-pr",
    chart: "Developer, Review stage.",
    repo: "Listed in the Release Manager guide. Kept on the Developer row; it is in the cheatsheet either way.",
  },
  {
    topic: "om-qa-buddy",
    chart: "QA stage.",
    repo: "Exists in skills/ but has no docs/skills card and is not in the README catalog. Linked to its SKILL.md.",
  },
  {
    topic: "Self-QA",
    chart: "\"An engineer may sign off lower-risk work.\"",
    repo: "risk-low / risk-medium only, full evidence + QA head line, both qa-approved and qa-self-verified. Never on risk-high.",
  },
];

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export type NavItem = { href: string; label: string };

export const PAGES: NavItem[] = [
  { href: "/docs2", label: "Overview" },
  ...ROLES.map((r) => ({ href: `/docs2/${r.id}`, label: r.name })),
  { href: "/docs2/gates", label: "Gates" },
  { href: "/docs2/handoffs", label: "Handoffs" },
  { href: "/docs2/cheatsheet", label: "Cheatsheet" },
];

export function neighbours(href: string): { prev?: NavItem; next?: NavItem } {
  const i = PAGES.findIndex((p) => p.href === href);
  return { prev: i > 0 ? PAGES[i - 1] : undefined, next: i >= 0 ? PAGES[i + 1] : undefined };
}

export const ROBOTS = { index: false, follow: false } as const;
