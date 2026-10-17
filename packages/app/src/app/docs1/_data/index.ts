import { GATES } from "./gates";
import { CELLS } from "./raci";
import { ROLES } from "./roles";
import { SKILLS } from "./skills";
import { STAGES } from "./stages";
import type { Cell, Gate, GateId, Role, RoleId, Skill, SkillId, Stage, StageId } from "./types";

export { CELLS, GATES, ROLES, SKILLS, STAGES };
export { HARD_BLOCKS } from "./gates";
export type * from "./types";

export const UPSTREAM = "https://github.com/open-mercato/skills";
export const upstream = (path: string) => `${UPSTREAM}/blob/main/${path}`;

export const BASE = "/docs1";
export const href = {
  home: BASE,
  flows: `${BASE}/flows`,
  stages: `${BASE}/stages`,
  stage: (id: StageId) => `${BASE}/stages/${id}`,
  roles: `${BASE}/roles`,
  role: (id: RoleId) => `${BASE}/roles/${id}`,
  gates: `${BASE}/gates`,
  gate: (id: GateId) => `${BASE}/gates#${id.toLowerCase()}`,
  skills: `${BASE}/skills`,
  skill: (id: SkillId) => `${BASE}/skills/${id}`,
  matrix: `${BASE}/matrix`,
};

export function getStage(id: string): Stage | undefined {
  return STAGES.find((s) => s.id === id);
}
export function getRole(id: string): Role | undefined {
  return ROLES.find((r) => r.id === id);
}
export function getSkill(id: string): Skill | undefined {
  return SKILLS.find((s) => s.id === id);
}
export function getGate(id: GateId): Gate {
  const gate = GATES.find((g) => g.id === id);
  if (!gate) throw new Error(`Unknown gate ${id}`);
  return gate;
}
export function stageById(id: StageId): Stage {
  const stage = getStage(id);
  if (!stage) throw new Error(`Unknown stage ${id}`);
  return stage;
}
export function roleById(id: RoleId): Role {
  const role = getRole(id);
  if (!role) throw new Error(`Unknown role ${id}`);
  return role;
}

export function cellFor(role: RoleId, stage: StageId): Cell | undefined {
  return CELLS.find((c) => c.role === role && c.stage === stage);
}
export function cellsForStage(stage: StageId): Cell[] {
  return CELLS.filter((c) => c.stage === stage);
}
export function cellsForRole(role: RoleId): Cell[] {
  return CELLS.filter((c) => c.role === role);
}
export function gatesForStage(stage: StageId): Gate[] {
  return GATES.filter((g) => g.stage === stage);
}
export function gatesOwnedBy(role: RoleId): Gate[] {
  return GATES.filter((g) => g.owners.includes(role));
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

export function skillsForStage(stage: StageId): SkillId[] {
  return unique(cellsForStage(stage).flatMap((c) => c.skills ?? []));
}
export function skillsForRole(role: RoleId): SkillId[] {
  return unique(cellsForRole(role).flatMap((c) => c.skills ?? []));
}
/** Where a skill appears on the chart: one entry per cell. */
export function placementsForSkill(skill: SkillId): Cell[] {
  return CELLS.filter((c) => c.skills?.includes(skill));
}

export function neighbours(stage: StageId): { prev?: Stage; next?: Stage } {
  const i = STAGES.findIndex((s) => s.id === stage);
  return { prev: STAGES[i - 1], next: STAGES[i + 1] };
}
