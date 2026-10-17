import { createHash, randomBytes } from "node:crypto";
import type { EntityManager } from "@mikro-orm/sqlite";
import { Session, User } from "../entities";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface GithubProfile {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string | null;
}

/** Users and their login sessions. The cookie holds a random token; the database its hash. */
export function createSessionService({ em }: { em: EntityManager }) {
  return {
    ttlMs: SESSION_TTL_MS,

    /** Creates the user on first login and refreshes the profile on later ones. */
    async upsertGithubUser(profile: GithubProfile): Promise<User> {
      const fields = { login: profile.login, name: profile.name, avatarUrl: profile.avatar_url };
      let user = await em.findOne(User, { githubId: profile.id });
      if (user) em.assign(user, fields);
      else user = em.create(User, { githubId: profile.id, ...fields });
      await em.flush();
      return user;
    },

    /** Starts a session and returns the token to put in the cookie. */
    async create(user: User): Promise<{ token: string; expiresAt: Date }> {
      const token = randomBytes(32).toString("base64url");
      const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
      em.create(Session, { id: hashToken(token), user, expiresAt });
      await em.flush();
      return { token, expiresAt };
    },

    /** The signed-in user for a cookie token, or `null` if it's unknown or expired. */
    async validate(token: string): Promise<User | null> {
      const session = await em.findOne(Session, { id: hashToken(token) }, { populate: ["user"] });
      if (!session) return null;
      if (session.expiresAt.getTime() <= Date.now()) {
        await em.nativeDelete(Session, { id: session.id });
        return null;
      }
      return session.user;
    },

    async invalidate(token: string): Promise<void> {
      await em.nativeDelete(Session, { id: hashToken(token) });
    },

    async deleteExpired(): Promise<number> {
      return em.nativeDelete(Session, { expiresAt: { $lte: new Date() } });
    },
  };
}

export type SessionService = ReturnType<typeof createSessionService>;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
