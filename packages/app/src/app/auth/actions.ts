"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/server/auth";
import { requestScope } from "@/server/container";

export async function signOut() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await (await requestScope()).cradle.sessions.invalidate(token);
  jar.delete(SESSION_COOKIE);
  redirect("/");
}
