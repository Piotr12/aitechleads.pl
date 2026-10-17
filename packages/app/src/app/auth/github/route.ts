import { connection, NextResponse, type NextRequest } from "next/server";
import { generateState } from "arctic";
import {
  OAUTH_NEXT_COOKIE,
  OAUTH_STATE_COOKIE,
  cookieOptions,
  githubClient,
  safeNextPath,
} from "@/server/auth";
import { getContainer } from "@/server/container";

// Step 1 of the GitHub login: remember where to go afterwards and send the visitor to GitHub.
export async function GET(request: NextRequest) {
  await connection();
  const { config } = (await getContainer()).cradle;
  const github = githubClient(config);
  if (!github) return NextResponse.redirect(new URL("/login", config.appUrl));

  const state = generateState();
  // No scopes: the public profile (id, login, name, avatar) is all we need.
  const response = NextResponse.redirect(github.createAuthorizationURL(state, []));
  const options = cookieOptions(config, 10 * 60);
  response.cookies.set(OAUTH_STATE_COOKIE, state, options);
  response.cookies.set(
    OAUTH_NEXT_COOKIE,
    safeNextPath(request.nextUrl.searchParams.get("next")),
    options,
  );
  return response;
}
