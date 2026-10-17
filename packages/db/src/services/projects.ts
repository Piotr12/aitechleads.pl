import type { EntityManager, FilterQuery } from "@mikro-orm/sqlite";
import { Project, User, type ProjectStatus } from "../entities";

/** How many projects one person may own. Generous for humans, annoying for spam bots. */
export const MAX_PROJECTS_PER_USER = 25;

export interface ProjectInput {
  title: string;
  summary: string;
  description: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  status: ProjectStatus;
  tags: string[];
}

export interface ProjectFilter {
  q?: string;
  status?: ProjectStatus;
  tag?: string;
  /** Include projects hidden by an admin (admin views only). */
  includeHidden?: boolean;
}

export class ProjectLimitError extends Error {}

export function createProjectService({ em }: { em: EntityManager }) {
  return {
    async list({ q, status, tag, includeHidden = false }: ProjectFilter = {}): Promise<Project[]> {
      const where: FilterQuery<Project> = {};
      if (!includeHidden) where.hidden = false;
      if (status) where.status = status;
      if (q) {
        // SQLite LIKE has no default escape character, so wildcards are dropped, not escaped.
        const like = `%${q.replace(/[%_]/g, "")}%`;
        where.$or = [{ title: { $like: like } }, { summary: { $like: like } }];
      }
      const projects = await em.find(Project, where, {
        populate: ["owner"],
        orderBy: { updatedAt: "desc" },
      });
      // Tags are a JSON array; the list is small enough to filter here instead of in SQL.
      return tag ? projects.filter((project) => project.tags.includes(tag)) : projects;
    },

    listByOwner(owner: User): Promise<Project[]> {
      return em.find(Project, { owner }, { populate: ["owner"], orderBy: { updatedAt: "desc" } });
    },

    findById(id: number): Promise<Project | null> {
      return em.findOne(Project, { id }, { populate: ["owner"] });
    },

    async create(owner: User, input: ProjectInput): Promise<Project> {
      if ((await em.count(Project, { owner })) >= MAX_PROJECTS_PER_USER) {
        throw new ProjectLimitError();
      }
      const project = em.create(Project, {
        ...input,
        owner,
        hidden: false,
      });
      await em.flush();
      return project;
    },

    /** Updates the fields; the id (and so the address) never changes. */
    async update(project: Project, input: ProjectInput): Promise<Project> {
      em.assign(project, input);
      await em.flush();
      return project;
    },

    async setHidden(project: Project, hidden: boolean): Promise<void> {
      project.hidden = hidden;
      await em.flush();
    },

    async remove(project: Project): Promise<void> {
      await em.remove(project).flush();
    },

    async stats(): Promise<{ projects: number; hidden: number; users: number }> {
      const [projects, hidden, users] = await Promise.all([
        em.count(Project),
        em.count(Project, { hidden: true }),
        em.count(User),
      ]);
      return { projects, hidden, users };
    },
  };
}

export type ProjectService = ReturnType<typeof createProjectService>;

