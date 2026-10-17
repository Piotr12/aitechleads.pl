/** "Who decides this?" scenarios for the self-check page. */
import type { RoleId } from "./roles";

export type QuizQuestion = {
  id: string;
  scenario: string;
  /** Answer options: role ids, or "agent" for "the agent can do it alone". */
  options: (RoleId | "agent")[];
  answer: RoleId | "agent";
  explanation: string;
};

export const QUIZ: QuizQuestion[] = [
  {
    id: "brief",
    scenario: "The product brief for invoice exports is drafted. Who approves it before any backlog is planned?",
    options: ["product-owner", "architect", "maintainer", "agent"],
    answer: "product-owner",
    explanation: "Gate G1 belongs to the Product Owner. The agent drafts and challenges; it never approves its own brief.",
  },
  {
    id: "dor",
    scenario: "Issue #415 says only “export pls”. Who decides whether it is ready to start?",
    options: ["developer", "product-owner", "qa", "agent"],
    answer: "product-owner",
    explanation:
      "The Definition of Ready (G3) is the Product Owner's check. The agent only names what is missing; a Maintainer may waive an item, in writing.",
  },
  {
    id: "risk",
    scenario: "Triage labelled the double-discount bug risk-medium, but it affects what customers are charged. Who settles it?",
    options: ["architect", "developer", "qa", "product-owner"],
    answer: "architect",
    explanation: "The Architect / Tech Lead settles risk disputes (the Maintainer is consulted). Money means risk-high.",
  },
  {
    id: "claim",
    scenario: "Two agents want to start #418 at the same minute. Who decides which one works on it?",
    options: ["agent", "maintainer", "architect", "developer"],
    answer: "agent",
    explanation:
      "Nobody needs to: the claim protocol does it. The first claim (assignee + in-progress + 🤖 comment) wins, the second agent backs off.",
  },
  {
    id: "g4",
    scenario: "The agent approved PR #431, a three-line fix in the payment code. Can it merge on that review alone?",
    options: ["agent", "architect", "developer", "designer"],
    answer: "architect",
    explanation: "No. It is risk-high (money), so gate G4 needs an independent human review, typically the Architect / Tech Lead.",
  },
  {
    id: "g5",
    scenario: "A PR converts all exported amounts to PLN, contradicting rule R07 (owner: Diego). Who must agree for that to stay?",
    options: ["architect", "domain-expert", "maintainer", "developer"],
    answer: "domain-expert",
    explanation: "Gate G5: only the owner of the rule can approve a superseding entry. Here that is the Domain Expert.",
  },
  {
    id: "design",
    scenario: "PR #433 adds a new button and a dialog. Whose pass walks the changed screens and ranks findings by user impact?",
    options: ["designer", "qa", "product-owner", "architect"],
    answer: "designer",
    explanation:
      "The Designer's pass (om-ux-review-pr). Note: it is advisory. It informs the review but does not hold the merge; the objective state checks are run by QA.",
  },
  {
    id: "g6",
    scenario: "PR #431 (risk-high) passed every automated check. Quinn is away. Who can apply qa-approved?",
    options: ["developer", "qa", "agent", "product-owner"],
    answer: "qa",
    explanation:
      "Only a QA reviewer, or a maintainer's explicit written exception. Self-QA (by an engineer or the agent) is never allowed on risk-high.",
  },
  {
    id: "value",
    scenario: "Who checks that the CSV export actually solves the accountants' problem from the brief?",
    options: ["qa", "product-owner", "domain-expert", "designer"],
    answer: "product-owner",
    explanation: "The Product Owner is consulted in QA: she accepts the value, not the code. The approval label stays with QA.",
  },
  {
    id: "g7",
    scenario: "Review approved PR #433, but QA marked it qa-failed. Who has the last word?",
    options: ["maintainer", "architect", "developer", "product-owner"],
    answer: "maintainer",
    explanation: "When gates conflict, the Maintainer decides (G7). And qa-failed is a hard block: it goes back to the developer.",
  },
  {
    id: "followup",
    scenario: "QA noticed the CSV headers are English-only, outside the PR's scope. Who files the follow-up?",
    options: ["qa", "maintainer", "developer", "product-owner"],
    answer: "qa",
    explanation: "QA files what testing found outside the scope (om-followup-issue-from-pr). The Maintainer then sets its priority.",
  },
];
