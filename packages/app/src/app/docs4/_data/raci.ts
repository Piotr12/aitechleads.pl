import type { Cell } from "./types";

/**
 * Transcription of the "AI SDLC RACI — who, with which skill, at which stage" chart,
 * one entry per non-empty cell.
 */
export const CELLS: Cell[] = [
  // Product Owner
  {
    role: "product-owner",
    stage: "discovery",
    gates: ["G1", "G2"],
    skills: ["om-discover", "om-brainstorm", "om-synthetic-users", "om-backlog"],
    duties: [
      {
        mode: "decides",
        raci: ["A", "R"],
        text: "Talks to users and the market, answers the question rounds, approves the brief.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Skeptic review, [SYNTHETIC] personas, the backlog tree.",
      },
    ],
  },
  {
    role: "product-owner",
    stage: "intake",
    gates: ["G3"],
    skills: ["om-prepare-issue", "om-auto-manage-issues"],
    duties: [
      {
        mode: "decides",
        raci: ["A"],
        text: "Checks the Definition of Ready: who, what result, what is out of scope.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Dedupes, applies the SDLC labels, files the GitHub issue.",
      },
    ],
  },
  {
    role: "product-owner",
    stage: "triage",
    duties: [{ mode: "none", raci: ["I"], text: "Told of the triage outcome." }],
  },
  {
    role: "product-owner",
    stage: "review",
    gates: ["G5"],
    duties: [{ mode: "none", raci: ["A"], text: "Approves changes to the decisions they own." }],
  },
  {
    role: "product-owner",
    stage: "qa",
    duties: [
      {
        mode: "decides",
        raci: ["C"],
        text: "Does it solve the problem from the brief? Accepts the value, not the code.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Provides a preview and screenshots as evidence.",
      },
    ],
  },
  {
    role: "product-owner",
    stage: "merge",
    duties: [{ mode: "none", raci: ["I"], text: "Merged; shipping follows the release process." }],
  },
  {
    role: "product-owner",
    stage: "cleanup",
    duties: [{ mode: "none", raci: ["I"], text: "Follow-ups filed." }],
  },

  // Domain Expert
  {
    role: "domain-expert",
    stage: "discovery",
    skills: ["om-discover"],
    label: "Question rounds",
    duties: [
      {
        mode: "decides",
        raci: ["A"],
        text: "Named owner of the domain rules, non-goals and decisions.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Asks questions, records the answers as [decision] and [assumption].",
      },
    ],
  },
  {
    role: "domain-expert",
    stage: "intake",
    duties: [
      {
        mode: "decides",
        raci: ["C"],
        text: "Confirms the in-scope domain spec breaks no domain rule.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Checks the ticket against the non-goals in product-brief.md.",
      },
    ],
  },
  {
    role: "domain-expert",
    stage: "implement",
    duties: [{ mode: "none", raci: ["C"], text: "Consulted when the spec touches one of their rules." }],
  },
  {
    role: "domain-expert",
    stage: "review",
    gates: ["G5"],
    duties: [{ mode: "none", raci: ["A"], text: "Approves changes to the decisions they own." }],
  },

  // Architect / Tech Lead
  {
    role: "architect",
    stage: "discovery",
    duties: [
      { mode: "decides", raci: ["C"], text: "Advises on feasibility and cost." },
      { mode: "none", raci: ["A"], text: "Chooses the tech stack." },
    ],
  },
  {
    role: "architect",
    stage: "triage",
    skills: ["om-verify-in-repo"],
    duties: [
      {
        mode: "supervises",
        raci: ["A"],
        text: "Settles disputes: risk-high vs risk-medium, blocked.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Read-only check: is it real, still unfixed on main, not claimed by anyone.",
      },
    ],
  },
  {
    role: "architect",
    stage: "implement",
    skills: ["om-spec-writing", "om-auto-write-spec"],
    duties: [
      {
        mode: "supervises",
        raci: ["A"],
        text: "Writes or approves the spec and ADRs: data model, API, multi-tenancy.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Drafts the spec from the requirements, with Risks & Impact and a changelog.",
      },
    ],
  },
  {
    role: "architect",
    stage: "pull-request",
    duties: [{ mode: "none", raci: ["C"], text: "Advises on risks to access, data and payments." }],
  },
  {
    role: "architect",
    stage: "review",
    gates: ["G4"],
    skills: ["om-auto-review-pr", "om-code-review"],
    duties: [
      {
        mode: "decides",
        raci: ["A"],
        text: "Reviews sensitive changes independently, as required by the team's review policy.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Checks the change and reports what must be fixed.",
      },
    ],
  },
  {
    role: "architect",
    stage: "merge",
    duties: [{ mode: "none", raci: ["C"], text: "Consulted when gates conflict." }],
  },

  // Designer
  {
    role: "designer",
    stage: "discovery",
    skills: ["om-ux-shape", "om-ux-setup", "om-mockup-prototype"],
    duties: [
      {
        mode: "decides",
        raci: ["A"],
        text: "Defines the flow and the screen states; approves the final design.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Builds prototypes and records the design-system reference.",
      },
    ],
  },
  {
    role: "designer",
    stage: "implement",
    label: "Design support",
    duties: [
      {
        mode: "supervises",
        raci: ["C"],
        text: "Answers design questions as the screens are built.",
      },
      { mode: "agent", raci: ["R"], text: "Follows the agreed flow and design system." },
    ],
  },
  {
    role: "designer",
    stage: "review",
    skills: ["om-ux-review-pr"],
    duties: [
      {
        mode: "agent",
        raci: ["R"],
        text: "Walks the PR screens; findings are ranked by user impact.",
      },
      {
        mode: "supervises",
        raci: ["C"],
        text: "Advisory pass: informs the review, does not hold the merge.",
      },
    ],
  },
  {
    role: "designer",
    stage: "qa",
    duties: [{ mode: "none", raci: ["I"], text: "QA findings on the UI." }],
  },

  // Developer
  {
    role: "developer",
    stage: "claim",
    skills: ["om-auto-fix-issue", "om-fix", "om-auto-create-pr"],
    duties: [
      {
        mode: "supervises",
        raci: ["A", "R"],
        text: "Takes the ticket by hand or starts an agent.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Assign + in-progress label + claim comment; a second agent backs off.",
      },
    ],
  },
  {
    role: "developer",
    stage: "implement",
    skills: [
      "om-root-cause",
      "om-fix",
      "om-auto-create-pr",
      "om-auto-create-pr-loop",
      "om-auto-implement-spec",
    ],
    duties: [
      {
        mode: "supervises",
        raci: ["A", "R"],
        text: "Guides the work and checks it against the spec.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Finds the cause, makes the change and runs the tests.",
      },
    ],
  },
  {
    role: "developer",
    stage: "pull-request",
    skills: ["om-open-pr", "om-check-and-commit"],
    duties: [
      {
        mode: "supervises",
        raci: ["A", "R"],
        text: "Checks the work and explains what changed and why.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Opens the pull request and records its status.",
      },
    ],
  },
  {
    role: "developer",
    stage: "review",
    skills: ["om-auto-continue-pr", "om-auto-continue-pr-loop", "om-auto-fix-pr"],
    duties: [
      {
        mode: "decides",
        raci: ["R"],
        text: "Answers review comments and explains disagreements.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Makes the agreed fixes and requests another review.",
      },
    ],
  },
  {
    role: "developer",
    stage: "qa",
    duties: [{ mode: "none", raci: ["I"], text: "QA result." }],
  },
  {
    role: "developer",
    stage: "merge",
    duties: [{ mode: "none", raci: ["I"], text: "Merged." }],
  },
  {
    role: "developer",
    stage: "cleanup",
    duties: [{ mode: "none", raci: ["I"], text: "Follow-ups from review and QA." }],
  },

  // QA / Tester
  {
    role: "qa",
    stage: "implement",
    skills: ["om-prepare-test-env"],
    duties: [
      {
        mode: "agent",
        raci: ["R"],
        text: "Boots the app once; the other skills reuse the same environment.",
      },
    ],
  },
  {
    role: "qa",
    stage: "qa",
    gates: ["G6"],
    skills: ["om-prepare-test-env", "om-auto-qa-pr", "om-qa-buddy", "om-integration-tests"],
    duties: [
      {
        mode: "decides",
        raci: ["A", "R"],
        text: "Tests and approves. An engineer may sign off lower-risk work when QA is unavailable.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Runs checks and records the test results for review.",
      },
    ],
  },
  {
    role: "qa",
    stage: "cleanup",
    skills: ["om-followup-issue-from-pr"],
    duties: [
      {
        mode: "supervises",
        raci: ["R"],
        text: "Files what the test found outside the scope.",
      },
      { mode: "agent", raci: ["R"], text: "Turns QA findings into follow-up issues." },
    ],
  },

  // Maintainer
  {
    role: "maintainer",
    stage: "discovery",
    label: "Setup",
    skills: [
      "om-setup-agent-pipeline",
      "om-setup-discovery-pipeline",
      "om-apply-upgrade-notes",
      "om-pipeline-retro",
    ],
    duties: [
      {
        mode: "decides",
        raci: ["A"],
        text: "Designs the process: picks the approach, sets up the config, SDLC.md and skills; tunes them after a retro.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Asks, then writes the config and SDLC.md, only after a yes.",
      },
    ],
  },
  {
    role: "maintainer",
    stage: "intake",
    duties: [
      {
        mode: "none",
        raci: ["A"],
        text: "May waive a readiness requirement and records the reason on the ticket.",
      },
    ],
  },
  {
    role: "maintainer",
    stage: "triage",
    duties: [{ mode: "none", raci: ["C"], text: "Risk-high vs risk-medium, blocked." }],
  },
  {
    role: "maintainer",
    stage: "claim",
    duties: [{ mode: "none", raci: ["I"], text: "Claim comments." }],
  },
  {
    role: "maintainer",
    stage: "review",
    skills: ["om-review-prs", "om-pr-autopilot"],
    duties: [
      {
        mode: "agent",
        raci: ["R"],
        text: "Sweeps the review backlog; drives a PR to the finish.",
      },
    ],
  },
  {
    role: "maintainer",
    stage: "qa",
    duties: [
      {
        mode: "none",
        raci: ["A"],
        text: "Approves exceptions to the QA process and records the reason.",
      },
    ],
  },
  {
    role: "maintainer",
    stage: "merge",
    gates: ["G7"],
    skills: ["om-merge-buddy", "om-approve-merge-pr"],
    duties: [
      {
        mode: "decides",
        raci: ["A"],
        text: "Lifts blocked / do-not-merge; has the last word when gates conflict.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Reports what can merge, re-checks every gate, squash-merges.",
      },
    ],
  },
  {
    role: "maintainer",
    stage: "cleanup",
    skills: ["om-close-fixed-issues", "om-auto-update-changelog"],
    duties: [
      {
        mode: "supervises",
        raci: ["A"],
        text: "Reads follow-ups, sets priority, guards do-not-close.",
      },
      {
        mode: "agent",
        raci: ["R"],
        text: "Closes fixed issues, comments on rejected PRs.",
      },
    ],
  },
];
