"use server";

import { redirect } from "next/navigation";
import { requireViewer } from "@/server/auth";
import { requestScope } from "@/server/container";

/** Hides a project from the public list (or shows it again). Admins only. */
export async function setProjectHidden(id: number, hidden: boolean): Promise<void> {
  const viewer = await requireViewer("/admin");
  if (!viewer.isAdmin) redirect("/");

  const { projects } = (await requestScope()).cradle;
  const project = await projects.findById(id);
  if (project) await projects.setHidden(project, hidden);
  redirect("/admin");
}
