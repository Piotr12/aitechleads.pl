import { defineEntity, p, type InferEntity } from "@mikro-orm/core";
import { User } from "./User";

/**
 * A login session. `id` is the SHA-256 of the token in the cookie, so a leaked database can't be
 * replayed as cookies.
 */
export const Session = defineEntity({
  name: "Session",
  properties: {
    id: p.string().primary(),
    user: p.manyToOne(User).deleteRule("cascade"),
    expiresAt: p.datetime().index(),
    createdAt: p.datetime().onCreate(() => new Date()),
  },
});

export type Session = InferEntity<typeof Session>;
