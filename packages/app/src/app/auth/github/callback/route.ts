import { connection, NextResponse, type NextRequest } from "next/server";
import type { GithubProfile } from "@atl/db";
import {
  OAUTH_NEXT_COOKIE,
  OAUTH_STATE_COOKIE,
  SESSION_COOKIE,
  cookieOptions,
  githubClient,
  safeNextPath,
} from "@/server/auth";
import { requestScope } from "@/server/container";

// Step 2 of the GitHub login: GitHub sends the visitor back here with a one-time code.
export async function GET(request: NextRequest) {
  await connection();
  const { config, sessions } = (await requestScope()).cradle;
  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`/login?error=${reason}`, config.appUrl));

  const github = githubClient(config);
  if (!github) return NextResponse.redirect(new URL("/login", config.appUrl));

  const params = request.nextUrl.searchParams;
  if (params.get("error") === "access_denied") return fail("denied");

  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state || state !== request.cookies.get(OAUTH_STATE_COOKIE)?.value) {
    return fail("state");
  }

  let profile: GithubProfile;
  try {
    const tokens = await github.validateAuthorizationCode(code);
    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "aitechleads.pl",
      },
    });
    if (!res.ok) throw new Error(`GitHub /user answered ${res.status}`);
    profile = (await res.json()) as GithubProfile;
  } catch (error) {
    console.error("GitHub login failed:", error);
    return fail("github");
  }

  const user = await sessions.upsertGithubUser(profile);
  const { token } = await sessions.create(user);

  const next = safeNextPath(request.cookies.get(OAUTH_NEXT_COOKIE)?.value);
  const response = NextResponse.redirect(new URL(next, config.appUrl));
  response.cookies.set(SESSION_COOKIE, token, cookieOptions(config, sessions.ttlMs / 1000));
  response.cookies.delete(OAUTH_STATE_COOKIE);
  response.cookies.delete(OAUTH_NEXT_COOKIE);
  return response;
}
