import { GATES, HARD_BLOCKS } from "./gates";
import { CELLS } from "./raci";
import { ROLES } from "./roles";
import { SKILLS } from "./skills";
import { STAGES } from "./stages";
import { CHAPTERS, type Chapter } from "./story";
import {
  SKILL_IDS,
  type Cell,
  type Gate,
  type GateId,
  type Role,
  type RoleId,
  type Skill,
  type SkillId,
  type Stage,
  type StageId,
} from "./types";

export { CELLS, CHAPTERS, GATES, HARD_BLOCKS, ROLES, SKILLS, STAGES };
export type * from "./types";
export type { Chapter } from "./story";

export const ROBOTS = { index: false, follow: false } as const;

export const UPSTREAM = "https://github.com/open-mercato/skills";
export const upstream = (path: string) => `${UPSTREAM}/blob/main/${path}`;

const BASE = "/docs4";
export const href = {
  home: BASE,
  story: `${BASE}/story`,
  chapter: (slug: string) => `${BASE}/story/${slug}`,
  overview: `${BASE}/overview`,
  perspectives: `${BASE}/perspectives`,
  details: `${BASE}/details`,
  role: (id: RoleId) => `${BASE}/roles/${id}`,
  stage: (id: StageId) => `${BASE}/stages/${id}`,
  gates: `${BASE}/gates`,
  gate: (id: GateId) => `${BASE}/gates#${id.toLowerCase()}`,
  skills: `${BASE}/skills`,
  skill: (id: SkillId) => `${BASE}/skills#${id}`,
};

export function isSkillId(value: string): value is SkillId {
  return (SKILL_IDS as readonly string[]).includes(value);
}

export function getStage(id: string): Stage | undefined {
  return STAGES.find((s) => s.id === id);
}
export function getRole(id: string): Role | undefined {
  return ROLES.find((r) => r.id === id);
}
export function getChapter(slug: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
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
export function skillById(id: SkillId): Skill {
  const skill = SKILLS.find((s) => s.id === id);
  if (!skill) throw new Error(`Unknown skill ${id}`);
  return skill;
}
export function gateById(id: GateId): Gate {
  const gate = GATES.find((g) => g.id === id);
  if (!gate) throw new Error(`Unknown gate ${id}`);
  return gate;
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

const unique = <T,>(items: T[]): T[] => [...new Set(items)];

export function skillsForStage(stage: StageId): SkillId[] {
  return unique(cellsForStage(stage).flatMap((c) => c.skills ?? []));
}
export function skillsForRole(role: RoleId): SkillId[] {
  return unique(cellsForRole(role).flatMap((c) => c.skills ?? []));
}
/** Chart placements of a skill: one entry per cell. */
export function placementsForSkill(skill: SkillId): Cell[] {
  return CELLS.filter((c) => c.skills?.includes(skill));
}

export function chaptersForStage(stage: StageId): Chapter[] {
  return CHAPTERS.filter((c) => c.stages.includes(stage));
}
export function chaptersForRole(role: RoleId): Chapter[] {
  return CHAPTERS.filter((c) => c.cast.some((m) => m.role === role));
}
export function chaptersForSkill(skill: SkillId): Chapter[] {
  return CHAPTERS.filter((c) => c.agents.some((a) => a.skill === skill));
}

export function stageNeighbours(id: StageId): { prev?: Stage; next?: Stage } {
  const i = STAGES.findIndex((s) => s.id === id);
  return { prev: STAGES[i - 1], next: STAGES[i + 1] };
}
export function roleNeighbours(id: RoleId): { prev?: Role; next?: Role } {
  const i = ROLES.findIndex((r) => r.id === id);
  return { prev: ROLES[i - 1], next: ROLES[i + 1] };
}
export function chapterNeighbours(slug: string): { prev?: Chapter; next?: Chapter } {
  const i = CHAPTERS.findIndex((c) => c.slug === slug);
  return { prev: CHAPTERS[i - 1], next: CHAPTERS[i + 1] };
}
