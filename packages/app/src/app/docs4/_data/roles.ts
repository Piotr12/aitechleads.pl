import type { Role } from "./types";

/**
 * The seven roles of the chart, each played by one character in the story.
 * The characters, the clinic network and every number in the story are invented.
 */
export const ROLES: Role[] = [
  {
    id: "product-owner",
    name: "Product Owner",
    short: "PO",
    person: "Marta",
    initials: "MW",
    character: "Marta Wilk owns the booking product. She reads call logs the way other people read novels.",
    owns: "The why and the value",
    layer: "product",
    decides: [
      "Approves the product brief (G1) and the backlog tree (G2).",
      "Checks the Definition of Ready on each ticket (G3): who, what result, what is out.",
      "Approves changes to the decisions she owns (G5).",
      "At QA, accepts the value, not the code: does it solve the problem from the brief?",
    ],
    supervises: ["The discovery rounds: the agent asks, she answers and corrects."],
    delegates: [
      "The skeptic reading of the draft brief, by a fresh subagent.",
      "Synthetic persona panels, tagged [SYNTHETIC] and never counted as evidence.",
      "Drafting the backlog tree, deduplicating and labelling, filing the issues.",
      "The preview and screenshots she looks at before accepting.",
    ],
    offTheDesk: [
      "Writing ticket boilerplate and picking labels.",
      "Searching the tracker for duplicates before filing.",
      "Chasing which tickets are ready: not-ready comments name the gaps.",
      "Collecting screenshots to check a change against the brief.",
    ],
    repoMapping:
      "The repo calls this role Product Manager / Analyst (docs/roles/product-manager.md). The product layer that gives it gates is switched on by om-setup-discovery-pipeline.",
    guide: "docs/roles/product-manager.md",
  },
  {
    id: "domain-expert",
    name: "Domain Expert",
    short: "DE",
    person: "Bogdan",
    initials: "BN",
    character:
      "Bogdan Nowak runs operations for the clinic network. He knows every rule about appointments and, more usefully, why each one exists.",
    owns: "Business rules, decisions, non-goals",
    layer: "product",
    optional: true,
    decides: [
      "Is the named owner of the domain rules, non-goals and decisions in product-brief.md.",
      "Approves any change to a rule or decision he owns (G5): a superseding entry, never a silent edit.",
    ],
    supervises: ["Confirms the in-scope spec breaks no domain rule at Intake.", "Is consulted when a spec touches one of his rules."],
    delegates: [
      "The question rounds: the agent asks, records answers as [decision] and [assumption].",
      "Checking each ticket against the non-goals in product-brief.md.",
    ],
    offTheDesk: [
      "Re-explaining the same rule in every ticket: the rule has an id, and the ticket quotes it.",
      "Reading code to spot a broken rule: review quotes the rule and blocks the PR.",
    ],
    repoMapping:
      "Optional. om-setup-discovery-pipeline asks whether there is a domain expert who is not the product owner; if not, the product owner holds these decisions.",
  },
  {
    id: "architect",
    name: "Architect / Tech Lead",
    short: "TL",
    person: "Tomasz",
    initials: "TL",
    character: "Tomasz Lis is the tech lead. He has opinions about locks and is usually right about them.",
    owns: "The how and the risk",
    layer: "delivery",
    decides: [
      "Chooses the tech stack; advises on feasibility and cost in discovery.",
      "Reviews sensitive changes independently, as the team's review policy requires (G4).",
    ],
    supervises: [
      "Settles triage disputes: risk-high or risk-medium, blocked or not.",
      "Writes or approves the spec and the ADRs: data model, API, multi-tenancy.",
      "Is consulted on risks to access, data and payments when the PR is opened, and when gates conflict at merge.",
    ],
    delegates: [
      "The read-only triage check: is it real, still unfixed on main, unclaimed.",
      "The spec draft from the requirements, with Risks & Impact and a changelog.",
      "The checklist review that reports what must be fixed.",
    ],
    offTheDesk: [
      "The first-pass review of every PR: it arrives with findings ranked by severity.",
      "Writing spec skeletons from scratch.",
      "Checking by hand whether an old issue still reproduces on main.",
    ],
    repoMapping:
      "The repo has no Architect role. A tech lead acts as the Reviewer of SDLC.md, and SDLC.md asks for a second person's review on auth and money and on other risk-high areas.",
  },
  {
    id: "designer",
    name: "Designer",
    short: "DS",
    person: "Lena",
    initials: "LK",
    character: "Lena Kraus designs the patient-facing screens. Her first question about any screen is what it says when it is empty.",
    owns: "The flow and the screen states, before code exists",
    layer: "product",
    optional: true,
    decides: ["Defines the flow and the screen states; approves the final design."],
    supervises: [
      "Answers design questions while the screens are built.",
      "Gives an advisory pass on the PR's screens: it informs the review, it does not hold the merge.",
    ],
    delegates: [
      "Building the clickable discovery prototype.",
      "Recording the design-system reference (.uxproof/) the reviews read.",
      "Walking the PR's screens in a browser, findings ranked by user impact.",
    ],
    offTheDesk: [
      "Building throwaway prototypes by hand.",
      "Taking screenshots of every state of every PR.",
      "Checking each screen against the token list.",
    ],
    repoMapping:
      "Optional, like the Domain Expert: om-setup-discovery-pipeline asks whether there is a designer. SDLC.md's Designer may be a human, om-ux-shape for shaping, or om-ux-review-pr for the PR pass.",
    guide: "docs/roles/designer.md",
  },
  {
    id: "developer",
    name: "Developer",
    short: "DEV",
    person: "Kuba",
    initials: "KZ",
    character: "Kuba Zieliński is a developer. He spends more of his day reading plans and diffs than typing either.",
    owns: "Driving the agent instead of typing the code",
    layer: "delivery",
    decides: ["Answers review comments and explains disagreements, in his own words."],
    supervises: [
      "Takes the ticket by hand or starts an agent on it.",
      "Guides the work and checks it against the spec; stops the agent when the plan is wrong.",
      "Checks the PR and explains what changed and why.",
    ],
    delegates: [
      "The claim signals: assignee, in-progress, claim comment.",
      "Finding the cause, making the change, writing the tests, running the gate.",
      "Opening the PR with its labels and status.",
      "Making the agreed review fixes and asking for another review.",
    ],
    offTheDesk: [
      "Typing the change and its tests.",
      "PR boilerplate and labels.",
      "Re-running the gate and rebasing after each review round.",
    ],
    repoMapping: "SDLC.md's Author: the human or agent who writes the change and owns the ticket from claim to a merge-ready PR.",
    guide: "docs/roles/developer.md",
  },
  {
    id: "qa",
    name: "QA / Tester",
    short: "QA",
    person: "Ola",
    initials: "OM",
    character: "Ola Mazur tests. She finds the bug in the second tab, the one nobody else opened.",
    owns: "Testing and QA approval",
    layer: "delivery",
    decides: [
      "Tests and approves user-facing changes (G6): qa-approved, pinned to the tested commit.",
      "Lower-risk work may be signed off by an engineer when QA is unavailable; risk-high never.",
    ],
    supervises: ["Files what a test found outside the scope as follow-up issues."],
    delegates: [
      "Booting the app once, so every check reuses the same environment.",
      "Running the checks and recording results and screenshots for review.",
      "Turning QA findings into follow-up issues.",
    ],
    offTheDesk: [
      "Setting up a test environment per PR.",
      "Pasting screenshots into reports.",
      "First drafts of end-to-end tests for flows worth keeping.",
    ],
    repoMapping: "SDLC.md's QA reviewer, always referenced by role, never by name: assignments change.",
    guide: "docs/roles/qa.md",
  },
  {
    id: "maintainer",
    name: "Maintainer",
    short: "MT",
    person: "Wanda",
    initials: "WS",
    character:
      "Wanda Sikora maintains the process: SDLC.md, the config, the skills. She also signs the merges, which she says is the easy part.",
    owns: "The process (SDLC.md, config, skills) and the merge",
    layer: "delivery",
    decides: [
      "Designs the process: the approach, the config, SDLC.md and the skills; tunes them after a retro.",
      "Signs the merge (G7); lifts blocked and do-not-merge; has the last word when gates conflict.",
      "May waive a readiness item or approve a QA exception, with the reason written down.",
    ],
    supervises: ["Reads the follow-ups, sets their priority, guards do-not-close."],
    delegates: [
      "Writing the config and SDLC.md, only after her yes.",
      "Sweeping the review backlog and driving a PR to the finish.",
      "Reporting what can merge, re-checking every gate, squash-merging.",
      "Closing fixed issues and drafting the changelog.",
    ],
    offTheDesk: [
      "Assembling the list of what can merge today.",
      "Checking each PR's labels, approvals and QA evidence before merging.",
      "Closing issues after a release, and drafting the changelog.",
    ],
    repoMapping:
      "The chart's Maintainer is two repo roles in one: SDLC.md's Maintainer (branch protection, labels, config, the process document) and the Release Manager of docs/roles/release-manager.md (merge, changelog).",
    guide: "docs/roles/release-manager.md",
  },
];
