/**
 * Data model for the /docs1 reference guide to the open-mercato AI SDLC skills.
 * Sources: the "AI SDLC RACI" chart and https://github.com/open-mercato/skills
 * (README.md, SDLC.md, docs/roles/*, docs/skills/*).
 */

export const STAGE_IDS = [
  "discovery",
  "intake",
  "triage",
  "claim",
  "implement",
  "pull-request",
  "review",
  "qa",
  "merge",
  "cleanup",
] as const;
export type StageId = (typeof STAGE_IDS)[number];

export const ROLE_IDS = [
  "product-owner",
  "domain-expert",
  "architect",
  "designer",
  "developer",
  "qa",
  "maintainer",
] as const;
export type RoleId = (typeof ROLE_IDS)[number];

export const GATE_IDS = ["G1", "G2", "G3", "G4", "G5", "G6", "G7"] as const;
export type GateId = (typeof GATE_IDS)[number];

export const SKILL_IDS = [
  "om-setup-agent-pipeline",
  "om-setup-discovery-pipeline",
  "om-apply-upgrade-notes",
  "om-pipeline-retro",
  "om-discover",
  "om-brainstorm",
  "om-synthetic-users",
  "om-mockup-prototype",
  "om-backlog",
  "om-ux-shape",
  "om-ux-setup",
  "om-prepare-issue",
  "om-auto-manage-issues",
  "om-verify-in-repo",
  "om-auto-fix-issue",
  "om-spec-writing",
  "om-auto-write-spec",
  "om-auto-implement-spec",
  "om-root-cause",
  "om-fix",
  "om-auto-create-pr",
  "om-auto-create-pr-loop",
  "om-open-pr",
  "om-check-and-commit",
  "om-auto-review-pr",
  "om-code-review",
  "om-ux-review-pr",
  "om-auto-continue-pr",
  "om-auto-continue-pr-loop",
  "om-auto-fix-pr",
  "om-review-prs",
  "om-pr-autopilot",
  "om-prepare-test-env",
  "om-auto-qa-pr",
  "om-qa-buddy",
  "om-integration-tests",
  "om-merge-buddy",
  "om-approve-merge-pr",
  "om-followup-issue-from-pr",
  "om-close-fixed-issues",
  "om-auto-update-changelog",
  "om-create-skill",
] as const;
export type SkillId = (typeof SKILL_IDS)[number];

/** R does the work · A owns the outcome · C is consulted · I is informed. */
export type Raci = "R" | "A" | "C" | "I";

/**
 * How a duty is carried out, as marked on the chart:
 * - `decides`: red dot, a human decides (at gates)
 * - `supervises`: dark dot, the agent works alone and a human can take over
 * - `agent`: hollow dot, agents carry out delegated work
 * - `none`: no dot (typically consulted / informed)
 */
export type Mode = "decides" | "supervises" | "agent" | "none";

export type Layer = "product" | "delivery";

export interface Duty {
  mode: Mode;
  raci: Raci[];
  text: string;
}

/** One cell of the RACI chart: what one role does at one stage. */
export interface Cell {
  role: RoleId;
  stage: StageId;
  gates?: GateId[];
  skills?: SkillId[];
  /** Extra label shown above the skills on the chart, e.g. "Design support". */
  label?: string;
  duties: Duty[];
}

export interface Stage {
  id: StageId;
  number: number;
  name: string;
  layer: Layer;
  /** Name of the matching row in SDLC.md's ticket lifecycle table. */
  sdlcName: string;
  summary: string;
  purpose: string[];
  inputs: string[];
  outputs: string[];
  drivenBy: string;
  doneWhen: string;
  notes?: string[];
}

export interface Role {
  id: RoleId;
  name: string;
  short: string;
  tagline: string;
  layer: Layer;
  summary: string;
  responsibilities: string[];
  /** How the role maps to the roles named in the skills repository. */
  repoMapping: string;
  /** Path of the role guide in the skills repo, when one exists. */
  guide?: { title: string; path: string };
}

export interface Gate {
  id: GateId;
  name: string;
  stage: StageId;
  owners: RoleId[];
  ownerLabel: string;
  question: string;
  approves: string;
  enforcement: string[];
  exceptions?: string[];
}

export interface Skill {
  id: SkillId;
  mode: "autonomous" | "interactive";
  /** Listed in the README as a building block that other skills compose. */
  buildingBlock?: boolean;
  summary: string;
  description: string;
  worksWith: SkillId[];
  example?: string;
  /** Path of the skill card in the upstream repo. */
  card: string;
  notes?: string[];
}
