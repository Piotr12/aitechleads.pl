/**
 * The RACI chart ("AI SDLC RACI — who, with which skill, at which stage"), cell by cell.
 * Each cell has an optional human part and an optional agent part.
 */
import type { SkillName } from "./skills";
import type { GateId, StageId } from "./stages";
import type { RoleId } from "./roles";

/** red = a human decides (at a gate) · dark = a human supervises · plain = just a RACI letter. */
export type HumanMark = "decides" | "supervises" | "plain";

export type RaciLetter = "R" | "A" | "C" | "I";

export type RaciCell = {
  role: RoleId;
  stage: StageId;
  letters: RaciLetter[];
  human?: { mark: HumanMark; letters: RaciLetter[]; text: string };
  /** Agents carry out delegated work (always R). */
  agent?: string;
  skills: SkillName[];
  gates: GateId[];
};

export const RACI: RaciCell[] = [
  // ── Product Owner ────────────────────────────────────────────────
  {
    role: "product-owner",
    stage: "discovery",
    letters: ["A", "R"],
    human: {
      mark: "decides",
      letters: ["A", "R"],
      text: "Talks to users and the market, answers the question rounds, approves the brief.",
    },
    agent: "Plays the skeptic, runs [SYNTHETIC] personas, drafts the backlog tree.",
    skills: ["om-discover", "om-brainstorm", "om-synthetic-users", "om-backlog"],
    gates: ["G1", "G2"],
  },
  {
    role: "product-owner",
    stage: "intake",
    letters: ["A"],
    human: {
      mark: "decides",
      letters: ["A"],
      text: "Checks the Definition of Ready: who has the problem, what result, what is out.",
    },
    agent: "Looks for duplicates, applies SDLC labels, files the GitHub issue.",
    skills: ["om-prepare-issue", "om-auto-manage-issues"],
    gates: ["G3"],
  },
  {
    role: "product-owner",
    stage: "triage",
    letters: ["I"],
    human: { mark: "plain", letters: ["I"], text: "Is told the triage outcome." },
    skills: [],
    gates: [],
  },
  {
    role: "product-owner",
    stage: "review",
    letters: ["A"],
    human: { mark: "plain", letters: ["A"], text: "Approves changes to the decisions they own." },
    skills: [],
    gates: ["G5"],
  },
  {
    role: "product-owner",
    stage: "qa",
    letters: ["C"],
    human: {
      mark: "decides",
      letters: ["C"],
      text: "Does it solve the problem from the brief? Accepts the value, not the code.",
    },
    agent: "Provides a preview and screenshots as evidence.",
    skills: [],
    gates: [],
  },
  {
    role: "product-owner",
    stage: "merge",
    letters: ["I"],
    human: { mark: "plain", letters: ["I"], text: "Told it merged. Shipping to users is the release process." },
    skills: [],
    gates: [],
  },
  {
    role: "product-owner",
    stage: "cleanup",
    letters: ["I"],
    human: { mark: "plain", letters: ["I"], text: "Told which follow-ups were filed." },
    skills: [],
    gates: [],
  },

  // ── Domain Expert ────────────────────────────────────────────────
  {
    role: "domain-expert",
    stage: "discovery",
    letters: ["A"],
    human: {
      mark: "decides",
      letters: ["A"],
      text: "The named owner of the domain rules, non-goals and decisions.",
    },
    agent: "Asks the questions, records the answers as [decision] and [assumption].",
    skills: ["om-discover"],
    gates: [],
  },
  {
    role: "domain-expert",
    stage: "intake",
    letters: ["C"],
    human: {
      mark: "decides",
      letters: ["C"],
      text: "Confirms the in-scope ticket breaks no domain rule.",
    },
    agent: "Checks the ticket against the non-goals in product-brief.md.",
    skills: [],
    gates: [],
  },
  {
    role: "domain-expert",
    stage: "implement",
    letters: ["C"],
    human: { mark: "plain", letters: ["C"], text: "Consulted when the spec touches one of their rules." },
    skills: [],
    gates: [],
  },
  {
    role: "domain-expert",
    stage: "review",
    letters: ["A"],
    human: { mark: "plain", letters: ["A"], text: "Approves changes to the decisions they own." },
    skills: [],
    gates: ["G5"],
  },

  // ── Architect / Tech Lead ────────────────────────────────────────
  {
    role: "architect",
    stage: "discovery",
    letters: ["C", "A"],
    human: {
      mark: "decides",
      letters: ["C", "A"],
      text: "Advises on feasibility and cost (C); chooses the tech stack (A).",
    },
    skills: [],
    gates: [],
  },
  {
    role: "architect",
    stage: "triage",
    letters: ["A"],
    human: {
      mark: "supervises",
      letters: ["A"],
      text: "Settles disputes: risk-high or medium? Should it be blocked?",
    },
    agent: "Read-only: is it real, still unfixed on main, not claimed by anyone?",
    skills: ["om-verify-in-repo"],
    gates: [],
  },
  {
    role: "architect",
    stage: "implement",
    letters: ["A"],
    human: {
      mark: "supervises",
      letters: ["A"],
      text: "Writes or approves the spec and ADRs: data model, API, multi-tenancy.",
    },
    agent: "Drafts the spec from the requirements, with Risks & Impact and a changelog.",
    skills: ["om-spec-writing", "om-auto-write-spec"],
    gates: [],
  },
  {
    role: "architect",
    stage: "pull-request",
    letters: ["C"],
    human: { mark: "plain", letters: ["C"], text: "Advises on risks to access, data and payments." },
    skills: [],
    gates: [],
  },
  {
    role: "architect",
    stage: "review",
    letters: ["A"],
    human: {
      mark: "decides",
      letters: ["A"],
      text: "Reviews sensitive changes independently, as the team's review policy requires.",
    },
    agent: "Checks the change and reports what must be fixed.",
    skills: ["om-auto-review-pr", "om-code-review"],
    gates: ["G4"],
  },
  {
    role: "architect",
    stage: "merge",
    letters: ["C"],
    human: { mark: "plain", letters: ["C"], text: "Consulted when gates conflict." },
    skills: [],
    gates: [],
  },

  // ── Designer ─────────────────────────────────────────────────────
  {
    role: "designer",
    stage: "discovery",
    letters: ["A"],
    human: {
      mark: "decides",
      letters: ["A"],
      text: "Defines the flow and screen states; approves the final design.",
    },
    agent: "Builds prototypes and records the design-system reference.",
    skills: ["om-ux-shape", "om-ux-setup", "om-mockup-prototype"],
    gates: [],
  },
  {
    role: "designer",
    stage: "implement",
    letters: ["C"],
    human: {
      mark: "supervises",
      letters: ["C"],
      text: "Design support: answers design questions as the screens are built.",
    },
    agent: "Follows the agreed flow and the design system.",
    skills: [],
    gates: [],
  },
  {
    role: "designer",
    stage: "review",
    letters: ["C"],
    human: {
      mark: "supervises",
      letters: ["C"],
      text: "Advisory pass: informs the review, does not hold the merge.",
    },
    agent: "Walks the PR's screens; findings ranked by user impact.",
    skills: ["om-ux-review-pr"],
    gates: [],
  },
  {
    role: "designer",
    stage: "qa",
    letters: ["I"],
    human: { mark: "plain", letters: ["I"], text: "Told about QA findings on the UI." },
    skills: [],
    gates: [],
  },

  // ── Developer ────────────────────────────────────────────────────
  {
    role: "developer",
    stage: "claim",
    letters: ["A", "R"],
    human: {
      mark: "supervises",
      letters: ["A", "R"],
      text: "Takes the ticket by hand or starts an agent on it.",
    },
    agent: "Assigns itself, adds in-progress, posts a claim comment; a second agent backs off.",
    skills: ["om-auto-fix-issue", "om-fix", "om-auto-create-pr"],
    gates: [],
  },
  {
    role: "developer",
    stage: "implement",
    letters: ["A", "R"],
    human: {
      mark: "supervises",
      letters: ["A", "R"],
      text: "Guides the work and checks it against the spec.",
    },
    agent: "Finds the cause, makes the change and runs the tests.",
    skills: ["om-root-cause", "om-fix", "om-auto-create-pr", "om-auto-create-pr-loop", "om-auto-implement-spec"],
    gates: [],
  },
  {
    role: "developer",
    stage: "pull-request",
    letters: ["A", "R"],
    human: {
      mark: "supervises",
      letters: ["A", "R"],
      text: "Checks the work and explains what changed and why.",
    },
    agent: "Opens the pull request and records its status.",
    skills: ["om-open-pr", "om-check-and-commit"],
    gates: [],
  },
  {
    role: "developer",
    stage: "review",
    letters: ["R"],
    human: {
      mark: "decides",
      letters: ["R"],
      text: "Answers review comments and explains disagreements.",
    },
    agent: "Makes the agreed fixes and asks for another review.",
    skills: ["om-auto-continue-pr", "om-auto-continue-pr-loop", "om-auto-fix-pr"],
    gates: [],
  },
  {
    role: "developer",
    stage: "qa",
    letters: ["I"],
    human: { mark: "plain", letters: ["I"], text: "Told the QA result." },
    skills: [],
    gates: [],
  },
  {
    role: "developer",
    stage: "merge",
    letters: ["I"],
    human: { mark: "plain", letters: ["I"], text: "Told it merged." },
    skills: [],
    gates: [],
  },
  {
    role: "developer",
    stage: "cleanup",
    letters: ["I"],
    human: { mark: "plain", letters: ["I"], text: "Told about follow-ups from review and QA." },
    skills: [],
    gates: [],
  },

  // ── QA / Tester ──────────────────────────────────────────────────
  {
    role: "qa",
    stage: "implement",
    letters: ["R"],
    agent: "Boots the app once; the other skills reuse the same environment.",
    skills: ["om-prepare-test-env"],
    gates: [],
  },
  {
    role: "qa",
    stage: "qa",
    letters: ["A", "R"],
    human: {
      mark: "decides",
      letters: ["A", "R"],
      text: "Tests and approves. An engineer may sign off lower-risk work when QA is unavailable.",
    },
    agent: "Runs the checks and records test results for review.",
    skills: ["om-prepare-test-env", "om-auto-qa-pr", "om-qa-buddy", "om-integration-tests"],
    gates: ["G6"],
  },
  {
    role: "qa",
    stage: "cleanup",
    letters: ["R"],
    human: {
      mark: "supervises",
      letters: ["R"],
      text: "Files what the testing found outside the PR's scope.",
    },
    agent: "Turns QA findings into follow-up issues.",
    skills: ["om-followup-issue-from-pr"],
    gates: [],
  },

  // ── Maintainer ───────────────────────────────────────────────────
  {
    role: "maintainer",
    stage: "discovery",
    letters: ["A"],
    human: {
      mark: "decides",
      letters: ["A"],
      text: "Designs the process: picks the approach, sets up config, SDLC.md and skills; tunes them after a retro.",
    },
    agent: "Asks questions, writes the config and SDLC.md, only after a yes.",
    skills: ["om-setup-agent-pipeline", "om-setup-discovery-pipeline", "om-apply-upgrade-notes", "om-pipeline-retro"],
    gates: [],
  },
  {
    role: "maintainer",
    stage: "intake",
    letters: ["A"],
    human: {
      mark: "plain",
      letters: ["A"],
      text: "May waive a readiness requirement, and writes the reason on the ticket.",
    },
    skills: [],
    gates: [],
  },
  {
    role: "maintainer",
    stage: "triage",
    letters: ["C"],
    human: { mark: "plain", letters: ["C"], text: "Consulted on risk-high vs medium, and on blocked." },
    skills: [],
    gates: [],
  },
  {
    role: "maintainer",
    stage: "claim",
    letters: ["I"],
    human: { mark: "plain", letters: ["I"], text: "Sees the claim comments." },
    skills: [],
    gates: [],
  },
  {
    role: "maintainer",
    stage: "review",
    letters: ["R"],
    agent: "Sweeps the review backlog; drives a stuck PR to the finish.",
    skills: ["om-review-prs", "om-pr-autopilot"],
    gates: [],
  },
  {
    role: "maintainer",
    stage: "qa",
    letters: ["A"],
    human: {
      mark: "plain",
      letters: ["A"],
      text: "Approves exceptions to the QA process and records the reason.",
    },
    skills: [],
    gates: [],
  },
  {
    role: "maintainer",
    stage: "merge",
    letters: ["A"],
    human: {
      mark: "decides",
      letters: ["A"],
      text: "Lifts blocked / do-not-merge; has the last word when gates conflict.",
    },
    agent: "Reports what can merge, re-checks every gate, squash-merges.",
    skills: ["om-merge-buddy", "om-approve-merge-pr"],
    gates: ["G7"],
  },
  {
    role: "maintainer",
    stage: "cleanup",
    letters: ["A"],
    human: {
      mark: "supervises",
      letters: ["A"],
      text: "Reads the follow-ups, sets their priority, guards do-not-close.",
    },
    agent: "Closes fixed issues, comments on rejected PRs (and drafts the changelog entry).",
    skills: ["om-close-fixed-issues", "om-auto-update-changelog"],
    gates: [],
  },
];

export function cellsForStage(stage: StageId): RaciCell[] {
  return RACI.filter((c) => c.stage === stage);
}

export function cellsForRole(role: RoleId): RaciCell[] {
  return RACI.filter((c) => c.role === role);
}

export function cellAt(role: RoleId, stage: StageId): RaciCell | undefined {
  return RACI.find((c) => c.role === role && c.stage === stage);
}
