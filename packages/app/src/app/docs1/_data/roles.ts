import type { Role } from "./types";

export const ROLES: Role[] = [
  {
    id: "product-owner",
    name: "Product Owner",
    short: "PO",
    tagline: "Owns the “why” and the value",
    layer: "product",
    summary:
      "Establishes the product context, approves the brief and the backlog, decides whether a ticket is ready, and accepts the delivered value.",
    responsibilities: [
      "Approves the product brief (G1) and the backlog tree before any issue is filed (G2).",
      "Owns the Definition of Ready: who has the problem, what result is expected, what is out of scope (G3).",
      "Approves changes to the product decisions they own (G5).",
      "At QA, checks that the change solves the problem from the brief: accepts the value, not the code.",
    ],
    repoMapping:
      "The Product owner role is added to SDLC.md by om-setup-discovery-pipeline. The closest role guide upstream is Product Manager / Analyst.",
    guide: { title: "Product Manager / Analyst", path: "docs/roles/product-manager.md" },
  },
  {
    id: "domain-expert",
    name: "Domain Expert",
    short: "DE",
    tagline: "Business rules, decisions, non-goals",
    layer: "product",
    summary:
      "The named owner of the domain rules, non-goals and decisions recorded in the product brief, consulted whenever work touches them.",
    responsibilities: [
      "Answers the discovery question rounds; answers are recorded as [decision] and [assumption].",
      "Confirms that in-scope work breaks no domain rule.",
      "Consulted during implementation when the spec touches one of their rules.",
      "Approves changes to the decisions they own (G5).",
    ],
    repoMapping:
      "Declared when om-setup-discovery-pipeline is told there is a domain expert who is not the product owner. There is no dedicated role guide upstream.",
  },
  {
    id: "architect",
    name: "Architect / Tech Lead",
    short: "AR",
    tagline: "Owns the “how” and the risk",
    layer: "delivery",
    summary:
      "Decides the technical approach and its risk: the tech stack, specs and ADRs, risk disputes, and independent review of sensitive changes.",
    responsibilities: [
      "Advises on feasibility and cost during discovery; chooses the tech stack.",
      "Settles triage disputes: risk-high vs risk-medium, blocked.",
      "Writes or approves the spec and ADRs: data model, API, multi-tenancy.",
      "Reviews sensitive changes independently, as the team's review policy requires (G4).",
    ],
    repoMapping:
      "Not a named role in SDLC.md. Its review duties correspond to the Reviewer role and to the second-person review that SDLC.md requires for risk-high auth and money changes.",
  },
  {
    id: "designer",
    name: "Designer",
    short: "DS",
    tagline: "Owns the flow and screen states before code exists",
    layer: "product",
    summary:
      "Defines the flow and its states before the code exists, keeps the design contract, and gives an advisory design pass on PRs.",
    responsibilities: [
      "Defines the flow and screen states and approves the final design.",
      "Extracts the repository's design contract once (om-ux-setup).",
      "Answers design questions while the screens are built.",
      "Runs the advisory design pass on PR screens; it informs the review and does not hold the merge.",
    ],
    repoMapping:
      "The Designer role in SDLC.md; declared in the product layer by om-setup-discovery-pipeline.",
    guide: { title: "Designer", path: "docs/roles/designer.md" },
  },
  {
    id: "developer",
    name: "Developer",
    short: "DV",
    tagline: "Drives the agent instead of typing the code",
    layer: "delivery",
    summary:
      "Claims tickets, guides the agent through implementation, checks the result against the spec, and answers the review.",
    responsibilities: [
      "Takes the ticket by hand or starts an agent.",
      "Guides the work and checks it against the spec.",
      "Checks the work and explains in the PR what changed and why.",
      "Answers review comments and explains disagreements; the agent makes the agreed fixes.",
    ],
    repoMapping: "The Author role in SDLC.md: owns the ticket from claim to a merge-ready PR.",
    guide: { title: "Developer", path: "docs/roles/developer.md" },
  },
  {
    id: "qa",
    name: "QA / Tester",
    short: "QA",
    tagline: "Owns testing and QA approval",
    layer: "delivery",
    summary:
      "Boots the shared test environment, exercises user-facing changes, and grants or withholds QA approval.",
    responsibilities: [
      "Boots the app once with om-prepare-test-env; other skills reuse it.",
      "Tests user-facing changes and owns qa-approved (G6).",
      "Adds integration / E2E coverage for flows worth keeping.",
      "Files what testing found outside the scope as follow-up issues.",
    ],
    repoMapping:
      "The QA reviewer role in SDLC.md, always referenced by role, never by name. Manual QA means a person judges the result; it does not mean the work is unassisted.",
    guide: { title: "QA", path: "docs/roles/qa.md" },
  },
  {
    id: "maintainer",
    name: "Maintainer",
    short: "MT",
    tagline: "Context engineer and release manager",
    layer: "delivery",
    summary:
      "As context engineer, owns SDLC.md, the config, the skills and their overrides. As release manager, owns the merge and the changelog.",
    responsibilities: [
      "Designs the process: config, SDLC.md and skills; tunes them after a retro.",
      "May waive a readiness requirement or approve a QA exception, recording the reason.",
      "Signs the merge (G7); lifts blocked / do-not-merge; has the last word when gates conflict.",
      "Owns post-merge housekeeping: priorities for follow-ups, do-not-close, the changelog.",
    ],
    repoMapping:
      "The Maintainer role in SDLC.md (branch protection, label taxonomy, config, the SDLC document; arbitrates when gates conflict). The release side matches the Release Manager guide.",
    guide: { title: "Release Manager", path: "docs/roles/release-manager.md" },
  },
];
