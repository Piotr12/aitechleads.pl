import type { GateId } from "./gates";
import { UPSTREAM } from "./links";
import type { StageId } from "./stages";

export type RoleId = "po" | "domain" | "architect" | "designer" | "developer" | "qa" | "maintainer";

/**
 * The chart's marks, in plain words:
 * - decides: red dot, a human decides (usually at a gate)
 * - supervises: dark dot, an agent works and a human watches and can take over
 * - agent: only the hollow ring, agents carry out delegated work
 * - plain: no dot, only a RACI letter (asked, told, or owning in the background)
 */
export type Mark = "decides" | "supervises" | "agent" | "plain";

export type Handoff = { role: RoleId; what: string };

export type Moment = {
  stage: StageId;
  mark: Mark;
  /** RACI letters from the chart: R does the work, A owns the outcome, C is asked, I is told. */
  raci: string;
  /** What the person does, in one sentence. */
  you: string;
  /** What the agents do for them (the chart's hollow ring), if anything. */
  agent?: string;
  skills?: string[];
  gates?: GateId[];
  from?: Handoff;
  to?: Handoff;
};

export type Role = {
  id: RoleId;
  name: string;
  short: string;
  emoji: string;
  /** One line: what this person owns. */
  owns: string;
  /** "You are this if…" */
  youAre: string;
  optional?: boolean;
  /** How the repo names or treats this role. */
  repo: string;
  docs: { label: string; href: string }[];
  /** Literal Tailwind classes, so the scanner sees them. */
  tone: { avatar: string; ring: string; text: string };
  moments: Moment[];
};

export const ROLES: Role[] = [
  {
    id: "po",
    name: "Product Owner",
    short: "PO",
    emoji: "🧭",
    owns: "the why and the value",
    youAre: "you decide what is worth building and whether the result solves the problem",
    repo: "The README calls this seat “Product Manager / Analyst”.",
    docs: [
      { label: "docs/roles/product-manager.md", href: UPSTREAM.roles.productManager },
      { label: "SDLC.md: Definition of Ready", href: UPSTREAM.sdlcSection.ready },
    ],
    tone: { avatar: "bg-amber-100 dark:bg-amber-950", ring: "ring-amber-500/60", text: "text-amber-700 dark:text-amber-300" },
    moments: [
      {
        stage: "discovery",
        mark: "decides",
        raci: "A,R",
        you: "Talk to real users and the market, answer the agent's question rounds, then approve the product brief and the backlog.",
        agent: "Plays the sceptic, runs [SYNTHETIC] personas (invented users, never counted as evidence) and drafts the backlog tree.",
        skills: ["om-discover", "om-brainstorm", "om-synthetic-users", "om-backlog"],
        gates: ["G1", "G2"],
        from: { role: "domain", what: "the business rules, non-goals and decisions" },
        to: { role: "architect", what: "the brief, for a feasibility and cost check" },
      },
      {
        stage: "intake",
        mark: "decides",
        raci: "A",
        you: "Check that each ticket is Ready: who has the problem, what result is expected, what is out of scope.",
        agent: "Looks for duplicates, adds the SDLC labels and files the GitHub issue.",
        skills: ["om-prepare-issue", "om-auto-manage-issues"],
        gates: ["G3"],
        to: { role: "developer", what: "a Ready ticket (after triage confirms it is real)" },
      },
      { stage: "triage", mark: "plain", raci: "I", you: "Told what triage concluded." },
      {
        stage: "review",
        mark: "plain",
        raci: "A",
        you: "If a PR would change a decision you own, you approve the change, or refuse it.",
        gates: ["G5"],
        from: { role: "developer", what: "a PR that touches one of your decisions" },
      },
      {
        stage: "qa",
        mark: "decides",
        raci: "C",
        you: "Does it solve the problem from the brief? You accept the value, not the code.",
        agent: "Provides a preview and screenshots as evidence.",
        from: { role: "qa", what: "a preview and screenshots" },
      },
      { stage: "merge", mark: "plain", raci: "I", you: "Told it merged. Shipping to users is the release process." },
      { stage: "cleanup", mark: "plain", raci: "I", you: "Told which follow-ups were filed." },
    ],
  },
  {
    id: "domain",
    name: "Domain Expert",
    short: "Domain",
    emoji: "📜",
    owns: "the business rules, the decisions and the non-goals",
    youAre: "you know how the business really works, and which rules must never be broken",
    optional: true,
    repo: "Optional: a product-layer role, switched on by om-setup-discovery-pipeline. SDLC.md treats the rules and decisions you own as a protected contract.",
    docs: [
      { label: "SDLC.md: product decisions as a protected contract", href: UPSTREAM.sdlcSection.decisions },
      { label: "om-discover", href: `${UPSTREAM.repo}/blob/main/docs/skills/om-discover.md` },
    ],
    tone: { avatar: "bg-lime-100 dark:bg-lime-950", ring: "ring-lime-500/60", text: "text-lime-700 dark:text-lime-300" },
    moments: [
      {
        stage: "discovery",
        mark: "decides",
        raci: "A",
        you: "Be the named owner of the domain rules, the non-goals and the decisions.",
        agent: "Asks the question rounds and records your answers, tagged [decision] or [assumption].",
        skills: ["om-discover"],
        to: { role: "po", what: "rules and decisions for the product brief" },
      },
      {
        stage: "intake",
        mark: "decides",
        raci: "C",
        you: "Confirm that the ticket breaks no domain rule.",
        agent: "Checks the ticket against the non-goals in product-brief.md.",
        from: { role: "po", what: "a ticket to check" },
      },
      {
        stage: "implement",
        mark: "plain",
        raci: "C",
        you: "Asked when the spec touches one of your rules.",
        from: { role: "architect", what: "a spec question about a rule" },
      },
      {
        stage: "review",
        mark: "plain",
        raci: "A",
        you: "Approve, or refuse, any change to a decision you own.",
        gates: ["G5"],
      },
    ],
  },
  {
    id: "architect",
    name: "Architect / Tech Lead",
    short: "Architect",
    emoji: "📐",
    owns: "the how and the risk",
    youAre: "you decide how things are built and how much risk a change carries",
    repo: "The repo has no Architect role. Its Reviewer is a person or the om-auto-review-pr skill, so read this seat as “the tech lead who reviews”.",
    docs: [
      { label: "SDLC.md: roles", href: UPSTREAM.sdlcSection.roles },
      { label: "CODE_REVIEW.md", href: UPSTREAM.codeReview },
      { label: "DECISIONS.md", href: UPSTREAM.decisions },
    ],
    tone: { avatar: "bg-sky-100 dark:bg-sky-950", ring: "ring-sky-500/60", text: "text-sky-700 dark:text-sky-300" },
    moments: [
      {
        stage: "discovery",
        mark: "decides",
        raci: "C · A",
        you: "Advise on feasibility and cost, and choose the tech stack.",
        from: { role: "po", what: "the brief" },
      },
      {
        stage: "triage",
        mark: "supervises",
        raci: "A",
        you: "Settle the disputes: is this risk-high or only medium? Is it blocked?",
        agent: "A read-only check: is it real, still unfixed on main, and not claimed by anyone?",
        skills: ["om-verify-in-repo"],
      },
      {
        stage: "implement",
        mark: "supervises",
        raci: "A",
        you: "Write or approve the spec and the ADRs (short architecture decision records): data model, API, multi-tenancy.",
        agent: "Drafts the spec from the requirements, with Risks & Impact and a changelog.",
        skills: ["om-spec-writing", "om-auto-write-spec"],
        to: { role: "developer", what: "an approved spec" },
      },
      { stage: "pr", mark: "plain", raci: "C", you: "Advise on risks to access, data and payments." },
      {
        stage: "review",
        mark: "decides",
        raci: "A",
        you: "Review the sensitive changes yourself, independently, as the team's review policy requires.",
        agent: "Checks the change against the review checklist and reports what must be fixed.",
        skills: ["om-auto-review-pr", "om-code-review"],
        gates: ["G4"],
        from: { role: "developer", what: "a PR" },
        to: { role: "developer", what: "review comments, or an approval" },
      },
      { stage: "merge", mark: "plain", raci: "C", you: "Asked when two gates disagree." },
    ],
  },
  {
    id: "designer",
    name: "Designer",
    short: "Designer",
    emoji: "🎨",
    owns: "the flow and the screen states, before code exists",
    youAre: "you decide what the screens do, including when things are empty, slow or broken",
    optional: true,
    repo: "Optional: a product-layer role. SDLC.md also gives the Designer a per-ticket Design stop between Claim and Implement (om-ux-shape).",
    docs: [
      { label: "docs/roles/designer.md", href: UPSTREAM.roles.designer },
      { label: "SDLC.md: ticket lifecycle", href: UPSTREAM.sdlcSection.lifecycle },
    ],
    tone: { avatar: "bg-pink-100 dark:bg-pink-950", ring: "ring-pink-500/60", text: "text-pink-700 dark:text-pink-300" },
    moments: [
      {
        stage: "discovery",
        mark: "decides",
        raci: "A",
        you: "Define the flow and the screen states, and approve the final design.",
        agent: "Builds clickable prototypes and records where the design system lives.",
        skills: ["om-ux-shape", "om-ux-setup", "om-mockup-prototype"],
        to: { role: "developer", what: "the agreed flow and design system" },
      },
      {
        stage: "implement",
        mark: "supervises",
        raci: "C",
        you: "Answer design questions while the screens are being built.",
        agent: "Follows the agreed flow and the design system.",
        from: { role: "developer", what: "questions about the screens" },
      },
      {
        stage: "review",
        mark: "supervises",
        raci: "C",
        you: "Give an advisory design pass: it informs the review, it does not hold the merge.",
        agent: "Walks the PR's screens in a real browser and ranks the findings by user impact.",
        skills: ["om-ux-review-pr"],
      },
      { stage: "qa", mark: "plain", raci: "I", you: "Told what QA found on the UI." },
    ],
  },
  {
    id: "developer",
    name: "Developer",
    short: "Dev",
    emoji: "🛠️",
    owns: "the change, from claim to a merge-ready PR",
    youAre: "you drive the agent that writes the code, instead of typing it all yourself",
    repo: "SDLC.md calls this seat the Author: a human or an agent who writes the change.",
    docs: [
      { label: "docs/roles/developer.md", href: UPSTREAM.roles.developer },
      { label: "SDLC.md: the claim protocol", href: UPSTREAM.sdlcSection.claim },
    ],
    tone: { avatar: "bg-violet-100 dark:bg-violet-950", ring: "ring-violet-500/60", text: "text-violet-700 dark:text-violet-300" },
    moments: [
      {
        stage: "claim",
        mark: "supervises",
        raci: "A,R",
        you: "Take the ticket by hand, or start an agent on it.",
        agent: "Assigns itself, adds in-progress, posts a claim comment. A second agent finding the claim backs off.",
        skills: ["om-auto-fix-issue", "om-fix", "om-auto-create-pr"],
        from: { role: "po", what: "a Ready ticket" },
      },
      {
        stage: "implement",
        mark: "supervises",
        raci: "A,R",
        you: "Guide the work and check it against the spec.",
        agent: "Finds the cause, makes the change and runs the tests.",
        skills: ["om-root-cause", "om-fix", "om-auto-create-pr", "om-auto-create-pr-loop", "om-auto-implement-spec"],
        from: { role: "architect", what: "the spec, for a feature" },
      },
      {
        stage: "pr",
        mark: "supervises",
        raci: "A,R",
        you: "Check the work, and explain what changed and why.",
        agent: "Opens the pull request and records its status.",
        skills: ["om-open-pr", "om-check-and-commit"],
        to: { role: "architect", what: "the PR, for review" },
      },
      {
        stage: "review",
        mark: "decides",
        raci: "R",
        you: "Answer the review comments, and explain where you disagree.",
        agent: "Makes the agreed fixes and asks for another review.",
        skills: ["om-auto-continue-pr", "om-auto-continue-pr-loop", "om-auto-fix-pr"],
        from: { role: "architect", what: "review comments" },
        to: { role: "qa", what: "an approved PR" },
      },
      { stage: "qa", mark: "plain", raci: "I", you: "Told the QA result (qa-failed comes back to you)." },
      { stage: "merge", mark: "plain", raci: "I", you: "Told it merged." },
      { stage: "cleanup", mark: "plain", raci: "I", you: "Told about follow-ups from review and QA." },
    ],
  },
  {
    id: "qa",
    name: "QA / Tester",
    short: "QA",
    emoji: "🧪",
    owns: "testing, and the test approval",
    youAre: "you decide whether a change really works before it merges",
    repo: "SDLC.md calls this seat the QA reviewer: always named by role, never by person, because assignments change.",
    docs: [
      { label: "docs/roles/qa.md", href: UPSTREAM.roles.qa },
      { label: "SDLC.md: the QA gate", href: UPSTREAM.sdlcSection.qaGate },
    ],
    tone: { avatar: "bg-emerald-100 dark:bg-emerald-950", ring: "ring-emerald-500/60", text: "text-emerald-700 dark:text-emerald-300" },
    moments: [
      {
        stage: "implement",
        mark: "agent",
        raci: "R",
        you: "Get the app booted once, so every later check reuses the same environment.",
        agent: "Boots the app once; the other skills reuse it.",
        skills: ["om-prepare-test-env"],
      },
      {
        stage: "qa",
        mark: "decides",
        raci: "A,R",
        you: "Test and approve. When QA has no capacity, an engineer may sign off lower-risk work instead.",
        agent: "Runs the checks in a real browser and records the results for review.",
        skills: ["om-prepare-test-env", "om-auto-qa-pr", "om-qa-buddy", "om-integration-tests"],
        gates: ["G6"],
        from: { role: "developer", what: "an approved PR marked needs-qa" },
        to: { role: "maintainer", what: "qa-approved (or qa-failed, back to the developer)" },
      },
      {
        stage: "cleanup",
        mark: "supervises",
        raci: "R",
        you: "File what the testing found outside the PR's scope.",
        agent: "Turns QA findings into follow-up issues.",
        skills: ["om-followup-issue-from-pr"],
        to: { role: "maintainer", what: "follow-up issues to prioritise" },
      },
    ],
  },
  {
    id: "maintainer",
    name: "Maintainer",
    short: "Maintainer",
    emoji: "🗝️",
    owns: "the process itself, and the merge",
    youAre: "you set up the pipeline, keep it tuned, and sign the merge",
    repo: "The chart's maintainer wears two hats: context engineer (config, SDLC.md, skills) and release manager (merge, changelog). The README's “Release Manager” is the second hat.",
    docs: [
      { label: "docs/roles/release-manager.md", href: UPSTREAM.roles.releaseManager },
      { label: "SDLC.md: label state machine", href: UPSTREAM.sdlcSection.labels },
    ],
    tone: { avatar: "bg-slate-200 dark:bg-slate-800", ring: "ring-slate-500/60", text: "text-slate-700 dark:text-slate-300" },
    moments: [
      {
        stage: "discovery",
        mark: "decides",
        raci: "A",
        you: "Design the process: pick the approach, set up the config, SDLC.md and the skills, and tune them after a retro.",
        agent: "Asks questions, then writes the config and SDLC.md, only after you say yes.",
        skills: ["om-setup-agent-pipeline", "om-setup-discovery-pipeline", "om-apply-upgrade-notes", "om-pipeline-retro"],
      },
      { stage: "intake", mark: "plain", raci: "A", you: "May waive one readiness item, writing the reason on the ticket." },
      { stage: "triage", mark: "plain", raci: "C", you: "Asked: risk-high or medium? Blocked?" },
      { stage: "claim", mark: "plain", raci: "I", you: "Sees the claim comments." },
      {
        stage: "review",
        mark: "agent",
        raci: "R",
        you: "Point the agents at the review backlog.",
        agent: "Sweeps every unreviewed PR, or drives one PR all the way to the finish.",
        skills: ["om-review-prs", "om-pr-autopilot"],
      },
      { stage: "qa", mark: "plain", raci: "A", you: "Approve exceptions to the QA process, with the reason written down." },
      {
        stage: "merge",
        mark: "decides",
        raci: "A",
        you: "Sign the merge. Lift blocked or do-not-merge, and have the last word when gates conflict.",
        agent: "Reports what can merge, re-checks every gate, and squash-merges.",
        skills: ["om-merge-buddy", "om-approve-merge-pr"],
        gates: ["G7"],
        from: { role: "qa", what: "qa-approved PRs" },
      },
      {
        stage: "cleanup",
        mark: "supervises",
        raci: "A",
        you: "Read the follow-ups, set their priority, and guard anything marked do-not-close.",
        agent: "Closes fixed issues, comments on rejected PRs, drafts the changelog.",
        skills: ["om-close-fixed-issues", "om-auto-update-changelog"],
        from: { role: "qa", what: "follow-up issues" },
      },
    ],
  },
];

export const ROLE_BY_ID = Object.fromEntries(ROLES.map((r) => [r.id, r])) as Record<RoleId, Role>;

export function isRoleId(value: string): value is RoleId {
  return value in ROLE_BY_ID;
}

/** Only being told ("I") is not a moment where you act. */
export function isActive(m: Moment): boolean {
  return m.raci !== "I";
}

export function momentAt(role: Role, stage: StageId): Moment | undefined {
  return role.moments.find((m) => m.stage === stage);
}

export const MARK_TEXT: Record<Mark, { name: string; plain: string }> = {
  decides: { name: "A person decides", plain: "red dot: a named person says yes or no" },
  supervises: { name: "A person supervises", plain: "dark dot: the agent works, the person watches and can take over" },
  agent: { name: "Agents do delegated work", plain: "ring: agents carry it out for someone" },
  plain: { name: "Asked, told, or owns it", plain: "no dot: only a RACI letter" },
};
