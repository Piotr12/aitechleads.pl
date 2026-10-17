import type { RoleId } from "./roles";
import type { StageId } from "./stages";

export type GateId = "G1" | "G2" | "G3" | "G4" | "G5" | "G6" | "G7";

export type Gate = {
  id: GateId;
  name: string;
  stage: StageId;
  holders: RoleId[];
  holderLabel: string;
  /** The question the holder answers, in plain words. */
  question: string;
  detail: string;
  /** What the repo adds or says differently. */
  repo: string;
};

export const GATES: Gate[] = [
  {
    id: "G1",
    name: "Product brief",
    stage: "discovery",
    holders: ["po"],
    holderLabel: "Product Owner",
    question: "Is this the right problem, for the right people?",
    detail: "The Product Owner approves the product brief: who has the problem, what hurts, what the product will not do.",
    repo: "om-discover leaves a product-brief.md in which every claim is tagged with its evidence and every decision has a named owner.",
  },
  {
    id: "G2",
    name: "Backlog",
    stage: "discovery",
    holders: ["po"],
    holderLabel: "Product Owner",
    question: "Are these the right epics and stories?",
    detail: "The Product Owner sees the whole backlog tree before a single issue is filed.",
    repo: "om-backlog shows the tree and writes nothing until somebody says yes.",
  },
  {
    id: "G3",
    name: "Definition of Ready",
    stage: "intake",
    holders: ["po"],
    holderLabel: "Product Owner",
    question: "Is this ticket clear enough to build?",
    detail: "Who has the problem, what result is expected and how it will be checked, what is out of scope, no blocking question left open.",
    repo: "om-auto-fix-issue's feature route stops on a ticket that is not Ready instead of guessing. A maintainer may waive one item, saying so on the ticket.",
  },
  {
    id: "G4",
    name: "Independent review",
    stage: "review",
    holders: ["architect"],
    holderLabel: "Architect / Tech Lead",
    question: "Is this change safe to take?",
    detail: "Sensitive changes are reviewed by someone who did not write them, as the team's review policy requires.",
    repo: "The repo's Reviewer is a person or om-auto-review-pr. Changes to auth or money always need a second person's review.",
  },
  {
    id: "G5",
    name: "Decision change",
    stage: "review",
    holders: ["po", "domain"],
    holderLabel: "Owner of the decision",
    question: "This PR changes a decision. Does its owner agree?",
    detail: "Business rules, non-goals and decisions have named owners. Only the owner can approve changing one.",
    repo: "A PR that breaks a recorded rule, non-goal or decision without a superseding entry is a blocker in review. The way out is never “delete the code”, it is “change the decision explicitly”.",
  },
  {
    id: "G6",
    name: "Test approval",
    stage: "qa",
    holders: ["qa"],
    holderLabel: "QA / Tester",
    question: "Does it actually work, in a real browser?",
    detail: "A PR marked needs-qa cannot merge until QA adds qa-approved, however green the automated checks are.",
    repo: "Self-QA exception: on risk-low or risk-medium work an engineer (or om-auto-qa-pr --self-qa-signoff) may sign off with evidence and the extra label qa-self-verified. Never on risk-high.",
  },
  {
    id: "G7",
    name: "Merge",
    stage: "merge",
    holders: ["maintainer"],
    holderLabel: "Maintainer",
    question: "Is every other gate really passed?",
    detail: "The maintainer signs the merge, lifts blocked or do-not-merge, and has the last word when gates conflict.",
    repo: "om-approve-merge-pr re-checks every gate and refuses to merge a needs-qa PR without qa-approved, or one with a blocking label.",
  },
];

export const GATE_BY_ID = Object.fromEntries(GATES.map((g) => [g.id, g])) as Record<GateId, Gate>;

export function gatesAt(stage: StageId): Gate[] {
  return GATES.filter((g) => g.stage === stage);
}
