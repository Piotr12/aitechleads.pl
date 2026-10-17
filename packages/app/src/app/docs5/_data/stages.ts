/**
 * The road: four legs (phases) and the stops (stages) on each.
 * The chart has ten stages; SDLC.md adds a per-ticket Design stage between Claim and Implement,
 * shown here as a dashed "repo extra" stop.
 */

export type PhaseId = "decide" | "build" | "check" | "land";

export type Phase = {
  id: PhaseId;
  name: string;
  emoji: string;
  line: string;
};

export const PHASES: Phase[] = [
  {
    id: "decide",
    name: "Decide what",
    emoji: "🧭",
    line: "Work out what is worth doing, and write it down so that anyone could pick it up.",
  },
  {
    id: "build",
    name: "Build it",
    emoji: "🔨",
    line: "Someone takes the ticket, and an agent makes the change, with tests.",
  },
  {
    id: "check",
    name: "Check it",
    emoji: "🔍",
    line: "Another pair of eyes reads the change, and a tester tries it in a real browser.",
  },
  {
    id: "land",
    name: "Land it",
    emoji: "🚢",
    line: "It is merged into main, and the loose ends are tied up.",
  },
];

export type StageId =
  | "discovery"
  | "intake"
  | "triage"
  | "claim"
  | "design"
  | "implement"
  | "pr"
  | "review"
  | "qa"
  | "merge"
  | "cleanup";

export type Stage = {
  id: StageId;
  /** Chart column number (1–10); the repo-only Design stop has none. */
  n: number | null;
  name: string;
  short: string;
  phase: PhaseId;
  layer: "product" | "delivery";
  what: string;
  doneWhen: string;
  /** Skills the repo names for this stop (SDLC.md "Driven by" plus the chart). */
  skills: string[];
  /** Where the chart and the repo say different things. */
  note?: string;
  repoOnly?: boolean;
};

export const STAGES: Stage[] = [
  {
    id: "discovery",
    n: 1,
    name: "Discovery & Design",
    short: "Discovery",
    phase: "decide",
    layer: "product",
    what: "Find out who has the problem, what hurts and what the product is not. Write it into a product brief, then talk each new idea through before anything is built.",
    doneWhen: "A product brief exists, or an idea has been talked through and routed somewhere.",
    skills: [
      "om-discover",
      "om-brainstorm",
      "om-synthetic-users",
      "om-mockup-prototype",
      "om-ux-shape",
      "om-ux-setup",
      "om-backlog",
      "om-setup-agent-pipeline",
      "om-setup-discovery-pipeline",
    ],
    note: "This stop belongs to the optional product layer, switched on with om-setup-discovery-pipeline. The chart also puts the one-off pipeline set-up here.",
  },
  {
    id: "intake",
    n: 2,
    name: "Intake",
    short: "Intake",
    phase: "decide",
    layer: "delivery",
    what: "The work becomes a ticket that is Ready: who has the problem, what result is expected, how it will be checked, and what is out of scope.",
    doneWhen: "The ticket exists and is ready, or what it lacks is written on it.",
    skills: ["om-prepare-issue", "om-auto-manage-issues"],
  },
  {
    id: "triage",
    n: 3,
    name: "Triage",
    short: "Triage",
    phase: "decide",
    layer: "delivery",
    what: "Before anyone builds anything, check that the problem is real, still broken on main, and not already being handled by someone else.",
    doneWhen: "Confirmed worth doing, or closed with nothing to do.",
    skills: ["om-verify-in-repo"],
  },
  {
    id: "claim",
    n: 4,
    name: "Claim",
    short: "Claim",
    phase: "build",
    layer: "delivery",
    what: "A person or an agent puts their name on the ticket (assignee, an in-progress label and a comment), so nobody else starts the same work.",
    doneWhen: "The claim is visible on the ticket.",
    skills: ["om-auto-fix-issue", "om-fix", "om-auto-create-pr"],
  },
  {
    id: "design",
    n: null,
    name: "Design",
    short: "Design",
    phase: "build",
    layer: "delivery",
    what: "For a change people will see, settle the screens before the code: what each one shows when empty, loading, failing, or when the user is not allowed in.",
    doneWhen: "The flow and its states are decided, or the ticket has no UI and skips this stop.",
    skills: ["om-ux-shape"],
    repoOnly: true,
    note: "SDLC.md has Design as its own stop between Claim and Implement. The chart has no such column: it folds design into “Discovery & Design” and into Implement (design support).",
  },
  {
    id: "implement",
    n: 5,
    name: "Implement",
    short: "Implement",
    phase: "build",
    layer: "delivery",
    what: "Find the smallest place to change, change it, add tests, and run the team's checks (the validation gate). A feature gets a written spec first.",
    doneWhen: "The change is complete and the checks are green.",
    skills: [
      "om-spec-writing",
      "om-auto-write-spec",
      "om-root-cause",
      "om-fix",
      "om-auto-create-pr",
      "om-auto-create-pr-loop",
      "om-auto-implement-spec",
      "om-prepare-test-env",
    ],
  },
  {
    id: "pr",
    n: 6,
    name: "Pull request",
    short: "PR",
    phase: "build",
    layer: "delivery",
    what: "The change is committed, pushed and opened as a pull request (PR), with labels saying what kind of change it is and how risky.",
    doneWhen: "An open, labelled PR.",
    skills: ["om-open-pr", "om-check-and-commit", "om-auto-create-pr"],
  },
  {
    id: "review",
    n: 7,
    name: "Review",
    short: "Review",
    phase: "check",
    layer: "delivery",
    what: "A reviewer reads the change and approves it or asks for fixes. Fixes go back and forth until it is approved. Screens also get an advisory design pass.",
    doneWhen: "An approving review is submitted.",
    skills: [
      "om-auto-review-pr",
      "om-code-review",
      "om-review-prs",
      "om-auto-continue-pr",
      "om-auto-continue-pr-loop",
      "om-auto-fix-pr",
      "om-pr-autopilot",
      "om-ux-review-pr",
    ],
  },
  {
    id: "qa",
    n: 8,
    name: "QA",
    short: "QA",
    phase: "check",
    layer: "delivery",
    what: "A tester runs the change in a real browser and says pass or fail. Lower-risk work may be self-checked instead, with evidence attached.",
    doneWhen: "qa-approved is on the PR, or qa-failed sends it back.",
    skills: ["om-prepare-test-env", "om-auto-qa-pr", "om-qa-buddy", "om-integration-tests"],
  },
  {
    id: "merge",
    n: 9,
    name: "Merge",
    short: "Merge",
    phase: "land",
    layer: "delivery",
    what: "Every gate is re-checked one last time, then the PR is squash-merged into main. Shipping it to users is the team's separate release process.",
    doneWhen: "The PR is squash-merged into main.",
    skills: ["om-merge-buddy", "om-approve-merge-pr"],
  },
  {
    id: "cleanup",
    n: 10,
    name: "Cleanup",
    short: "Cleanup",
    phase: "land",
    layer: "delivery",
    what: "Close the issues the merge fixed, file the leftovers as new tickets, and write the changelog.",
    doneWhen: "The tracker is tidy and the follow-ups are filed.",
    skills: ["om-close-fixed-issues", "om-followup-issue-from-pr", "om-auto-update-changelog", "om-pipeline-retro"],
    note: "SDLC.md calls this stop “Post-merge housekeeping”.",
  },
];

export const STAGE_BY_ID = Object.fromEntries(STAGES.map((s) => [s.id, s])) as Record<StageId, Stage>;
export const PHASE_BY_ID = Object.fromEntries(PHASES.map((p) => [p.id, p])) as Record<PhaseId, Phase>;

export function isStageId(value: string): value is StageId {
  return value in STAGE_BY_ID;
}

export function stagesOf(phase: PhaseId): Stage[] {
  return STAGES.filter((s) => s.phase === phase);
}

/** "Stop 5" for chart stops, "extra" for the repo's Design stop. */
export function stopLabel(stage: Stage): string {
  return stage.n === null ? "repo extra" : `stop ${stage.n}`;
}
