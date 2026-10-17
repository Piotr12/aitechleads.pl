import { defineEntity, p, type InferEntity } from "@mikro-orm/core";
import { User } from "./User";

/** Status keys as stored in the database. Display labels live in the app. */
export const PROJECT_STATUSES = ["idea", "in-progress", "shipped", "abandoned"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** A project someone is building. Only its owner (or an admin) may change it. */
export const Project = defineEntity({
  name: "Project",
  properties: {
    id: p.integer().primary(),
    title: p.string(),
    summary: p.string().length(280),
    description: p.text().nullable(),
    repoUrl: p.string().nullable(),
    demoUrl: p.string().nullable(),
    status: p.enum(PROJECT_STATUSES).default("idea"),
    tags: p.json<string[]>(),
    owner: p.manyToOne(User).deleteRule("cascade").index(),
    /** Hidden by an admin: kept, but shown only to its owner and admins. */
    hidden: p.boolean().default(false),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date())
      .index(),
  },
});

export type Project = InferEntity<typeof Project>;
