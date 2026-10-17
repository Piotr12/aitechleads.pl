import type { Gate } from "./types";

export const GATES: Gate[] = [
  {
    id: "G1",
    name: "Product brief",
    stage: "discovery",
    owners: ["product-owner"],
    ownerLabel: "Product Owner",
    question: "Is the brief an accurate, evidenced account of the problem, the users and the scope?",
    approves:
      "product-brief.md: problem and who has it, stakeholders, rules, flows, success criteria, scope (now, later, not doing), non-goals, decisions with owners, riskiest assumptions.",
    enforcement: [
      "om-discover records the user's choices and does not mark a proposal active without confirmation.",
      "Synthetic personas and assumptions are tagged and never count as evidence.",
    ],
  },
  {
    id: "G2",
    name: "Backlog",
    stage: "discovery",
    owners: ["product-owner"],
    ownerLabel: "Product Owner",
    question: "Is this the right set of epics, stories and tasks to file?",
    approves: "The backlog tree drafted from the brief or a spec's Phasing.",
    enforcement: [
      "om-backlog shows the whole tree and waits for a yes before writing anything.",
      "It refuses a brief whose problems and users rest on synthetic or assumed claims, and offers the research backlog instead.",
      "A completed backlog dry run does not authorize issue filing.",
    ],
  },
  {
    id: "G3",
    name: "Definition of Ready",
    stage: "intake",
    owners: ["product-owner"],
    ownerLabel: "Product Owner",
    question: "Does the ticket say who has the problem, what result is expected and what is out of scope?",
    approves:
      "Ticket-level readiness: the problem and who has it, the expected outcome and how it is checked, what is out of scope, no blocking question left open, autonomous assumptions confirmed by a human.",
    enforcement: [
      "om-prepare-issue files tickets with the ready sections.",
      "om-auto-manage-issues records READY_STATUS per issue and posts a not-ready comment naming what is missing.",
      "om-auto-fix-issue's feature route stops on a ticket that fails the ticket-level tier instead of speccing around the gap.",
      "Spec-level gaps are not a stop: the spec is authored.",
    ],
    exceptions: ["A maintainer may waive an item by saying so on the ticket."],
  },
  {
    id: "G4",
    name: "Independent review",
    stage: "review",
    owners: ["architect"],
    ownerLabel: "Architect / Tech Lead",
    question: "Has a sensitive change been reviewed independently?",
    approves: "Sensitive changes, as required by the team's review policy.",
    enforcement: [
      "SDLC.md: a change to auth or money needs a second person's review regardless of the QA path.",
      "risk-high areas carry evidence requirements (denied-path tests, isolation tests, migration up/down tests, a rollback plan); om-code-review blocks without that evidence.",
    ],
    exceptions: ["A maintainer may waive the risk-high evidence requirement on the PR."],
  },
  {
    id: "G5",
    name: "Decision change",
    stage: "review",
    owners: ["product-owner", "domain-expert"],
    ownerLabel: "Owner of the decision",
    question: "Does this PR change a non-goal, business rule or decision, and has its owner agreed?",
    approves:
      "A superseding entry for a protected non-goal (N01), business rule (R03) or decision (D07) in product-brief.md.",
    enforcement: [
      "A PR that builds something a non-goal excludes, or contradicts a rule or decision, without a superseding entry in the same PR is a blocker in review, quoting the entry and its id.",
      "The way out is never “delete the code”: it is a superseding row approved by the entry's owner.",
    ],
    exceptions: ["The maintainer arbitrates a dispute."],
  },
  {
    id: "G6",
    name: "Test approval",
    stage: "qa",
    owners: ["qa"],
    ownerLabel: "QA",
    question: "Has the user-facing change been exercised and approved at the current head?",
    approves: "qa-approved on a PR carrying needs-qa, pinned to the tested commit by a QA head: <sha> line.",
    enforcement: [
      "A PR carrying needs-qa must not merge until it also carries qa-approved, even when every other check is green.",
      "A push after the QA head line stales the approval; om-approve-merge-pr asks for confirmation before merging.",
      "Automated skills request QA with needs-qa; no authoring, review or merge skill applies qa-approved.",
    ],
    exceptions: [
      "Self-QA: when no QA reviewer has capacity, any engineer (or om-auto-qa-pr --self-qa-signoff) may sign off a risk-low or risk-medium PR, with evidence and the qa-self-verified label.",
      "No self-QA on risk-high: it needs a QA reviewer or a maintainer's explicit exception stated on the PR.",
      "skip-qa opts out docs-only, dependency-only, CI-only, test-only and similar low-risk changes.",
    ],
  },
  {
    id: "G7",
    name: "Merge",
    stage: "merge",
    owners: ["maintainer"],
    ownerLabel: "Maintainer signs",
    question: "Are all gates satisfied, and does the maintainer sign off the merge?",
    approves: "The squash-merge into the base branch.",
    enforcement: [
      "om-approve-merge-pr re-checks every gate before approving and squash-merging.",
      "om-merge-buddy classifies a needs-qa PR without qa-approved as blocked.",
      "blocked and do-not-merge are set and cleared by humans and stop the flow wherever it is.",
    ],
    exceptions: ["The maintainer has the last word when gates conflict."],
  },
];

/** What "blocked work cannot merge" means in label terms (SDLC.md). */
export const HARD_BLOCKS: { label: string; meaning: string }[] = [
  { label: "needs-qa without qa-approved", meaning: "The QA gate is not satisfied." },
  { label: "qa-failed", meaning: "QA failed; the PR is routed back." },
  { label: "blocked", meaning: "Set and cleared by humans; stops the flow wherever it is." },
  { label: "do-not-merge", meaning: "Set and cleared by humans; stops the flow wherever it is." },
  { label: "qa (pipeline label)", meaning: "A tester is on the PR right now; never merge under an active tester." },
  { label: "in-progress", meaning: "An agent holds a claim; the merge tooling skips the PR." },
  { label: "Red required checks", meaning: "Required checks gate every merge; the tooling refuses until they are green." },
];
