import { defineEntity, p, type InferEntity } from "@mikro-orm/core";

/** Someone who signed in with GitHub. Profile fields are refreshed on every login. */
export const User = defineEntity({
  name: "User",
  properties: {
    id: p.integer().primary(),
    githubId: p.integer().unique(),
    login: p.string(),
    name: p.string().nullable(),
    avatarUrl: p.string().nullable(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});

export type User = InferEntity<typeof User>;
