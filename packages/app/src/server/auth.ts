import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { GitHub } from "arctic";
import type { AppConfig } from "@atl/core";
import type { Project, User } from "@atl/db";
import { requestScope } from "./container";

export const SESSION_COOKIE = "atl_session";
export const OAUTH_STATE_COOKIE = "atl_oauth_state";
export const OAUTH_NEXT_COOKIE = "atl_oauth_next";

export const GITHUB_CALLBACK_PATH = "/auth/github/callback";

export interface Viewer {
  user: User;
  isAdmin: boolean;
}

/** The signed-in user, or `null`. Reads a cookie, so callers must sit inside `<Suspense>`. */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  // Without this, Next's prerender validation reaches the query (MikroORM calls `Date.now()`).
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const { sessions, config } = (await requestScope()).cradle;
  const user = await sessions.validate(token);
  return user ? { user, isAdmin: config.adminGithubIds.includes(user.githubId) } : null;
});

/** Like `getViewer`, but sends anonymous visitors to the login page and back to `next` after. */
export async function requireViewer(next: string): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer) redirect(`/login?next=${encodeURIComponent(next)}`);
  return viewer;
}

export function canEdit(viewer: Viewer | null, project: Project): boolean {
  return !!viewer && (viewer.isAdmin || project.owner.id === viewer.user.id);
}

export function githubClient(config: AppConfig): GitHub | null {
  if (!config.github) return null;
  const { clientId, clientSecret } = config.github;
  return new GitHub(clientId, clientSecret, `${config.appUrl}${GITHUB_CALLBACK_PATH}`);
}

/** Options shared by every auth cookie; `Secure` whenever the site is served over HTTPS. */
export function cookieOptions(config: AppConfig, maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: config.appUrl.startsWith("https://"),
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

/** Only same-site paths are allowed as post-login destinations (no `//evil.example`). */
export function safeNextPath(next: string | null | undefined): string {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")
    ? next
    : "/";
}
