/** The ten stages of the chart, left to right, with the gates that sit on them. */

export type StageId =
  | "discovery"
  | "intake"
  | "triage"
  | "claim"
  | "implement"
  | "pull-request"
  | "review"
  | "qa"
  | "merge"
  | "cleanup";

export type GateId = "G1" | "G2" | "G3" | "G4" | "G5" | "G6" | "G7";

export type Stage = {
  id: StageId;
  n: number;
  name: string;
  emoji: string;
  /** The question this stage answers, in plain words. */
  question: string;
  /** One sentence a newcomer can repeat back. */
  plain: string;
  /** "Done when", from SDLC.md's ticket lifecycle table. */
  doneWhen: string;
  layer: "product" | "delivery";
  gates: GateId[];
};

export const STAGES: Stage[] = [
  {
    id: "discovery",
    n: 1,
    name: "Discovery & Design",
    emoji: "🔭",
    question: "Is this worth building, for whom, and how should it look?",
    plain:
      "People who know the users and the business work out the problem, the rules and the screens, before anyone writes a ticket.",
    doneWhen: "A product brief (or a routed brainstorm) exists, and the backlog has been approved.",
    layer: "product",
    gates: ["G1", "G2"],
  },
  {
    id: "intake",
    n: 2,
    name: "Intake",
    emoji: "📥",
    question: "Is the ticket written well enough to start?",
    plain: "The work becomes a GitHub issue with labels, and someone checks it against the Definition of Ready.",
    doneWhen: "The ticket exists and is ready, or its gaps are named on the ticket.",
    layer: "delivery",
    gates: ["G3"],
  },
  {
    id: "triage",
    n: 3,
    name: "Triage",
    emoji: "🩺",
    question: "Is it real, still broken, and nobody's on it yet?",
    plain: "A read-only check that stops the line early if there is nothing to do.",
    doneWhen: "Confirmed actionable, or closed as no-action.",
    layer: "delivery",
    gates: [],
  },
  {
    id: "claim",
    n: 4,
    name: "Claim",
    emoji: "🙋",
    question: "Who is working on it right now?",
    plain: "The developer (or their agent) puts a visible 'mine' sign on the ticket so nobody else starts the same work.",
    doneWhen: "The claim is visible on the ticket.",
    layer: "delivery",
    gates: [],
  },
  {
    id: "implement",
    n: 5,
    name: "Implement",
    emoji: "🔨",
    question: "What exactly changes, and does it work?",
    plain: "Spec first for features, root cause first for bugs; then the change, the tests and the checks.",
    doneWhen: "Change complete, validation gate green.",
    layer: "delivery",
    gates: [],
  },
  {
    id: "pull-request",
    n: 6,
    name: "Pull request",
    emoji: "📬",
    question: "Can someone else understand what changed and why?",
    plain: "The change is packaged as a pull request with a clear description and the full set of labels.",
    doneWhen: "An open, labelled PR.",
    layer: "delivery",
    gates: [],
  },
  {
    id: "review",
    n: 7,
    name: "Review",
    emoji: "🔍",
    question: "Is the code right, safe, and true to what we decided?",
    plain: "A reviewer (agent and, for risky work, a human) reads the change and approves it or asks for fixes.",
    doneWhen: "An approving review is submitted.",
    layer: "delivery",
    gates: ["G4", "G5"],
  },
  {
    id: "qa",
    n: 8,
    name: "QA",
    emoji: "🧪",
    question: "Does it actually work for a user, in a real browser?",
    plain: "A tester walks the change in the running app, with screenshots, and approves it or sends it back.",
    doneWhen: "qa-approved is applied (or the permitted self-QA exception); qa-failed sends it back.",
    layer: "delivery",
    gates: ["G6"],
  },
  {
    id: "merge",
    n: 9,
    name: "Merge",
    emoji: "🚀",
    question: "Are all the gates green, so it can go into main?",
    plain: "Every gate is re-checked one last time, then the PR is squash-merged into main.",
    doneWhen: "The PR is squash-merged into main.",
    layer: "delivery",
    gates: ["G7"],
  },
  {
    id: "cleanup",
    n: 10,
    name: "Cleanup",
    emoji: "🧹",
    question: "Is the tracker tidy and nothing forgotten?",
    plain: "Fixed issues get closed, leftovers become follow-up issues, the changelog gets its line.",
    doneWhen: "Tracker reconciled, follow-ups filed.",
    layer: "delivery",
    gates: [],
  },
];

export const STAGE_BY_ID = Object.fromEntries(STAGES.map((s) => [s.id, s])) as Record<StageId, Stage>;

export function stageNeighbours(id: StageId): { prev?: Stage; next?: Stage } {
  const i = STAGES.findIndex((s) => s.id === id);
  return { prev: STAGES[i - 1], next: STAGES[i + 1] };
}
