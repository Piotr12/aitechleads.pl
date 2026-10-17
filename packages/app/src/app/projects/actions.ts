"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { MAX_PROJECTS_PER_USER, ProjectLimitError } from "@atl/db";
import { formValues, projectSchema, type ProjectFormState } from "@/lib/project-schema";
import { canEdit, requireViewer } from "@/server/auth";
import { requestScope } from "@/server/container";

// Every action re-checks the session and the permissions itself: anyone can call a server action.

export async function createProject(prev: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const viewer = await requireViewer("/projects/new");
  const values = formValues(formData);
  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) return invalid(prev, values, parsed.error);

  const { projects } = (await requestScope()).cradle;
  let slug: string;
  try {
    slug = (await projects.create(viewer.user, parsed.data)).slug;
  } catch (error) {
    if (!(error instanceof ProjectLimitError)) throw error;
    return {
      attempt: prev.attempt + 1,
      values,
      message: `You already have ${MAX_PROJECTS_PER_USER} projects. Finish one. Or let one pine for the fjords and delete it.`,
    };
  }
  redirect(`/projects/${slug}`);
}

export async function updateProject(
  id: number,
  prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const { projects } = (await requestScope()).cradle;
  const project = await projects.findById(id);
  const viewer = await requireViewer(project ? `/projects/${project.slug}/edit` : "/");
  if (!project || !canEdit(viewer, project)) {
    return { attempt: prev.attempt + 1, message: "None shall pass. This project isn't yours to change." };
  }

  const values = formValues(formData);
  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) return invalid(prev, values, parsed.error);

  await projects.update(project, parsed.data);
  redirect(`/projects/${project.slug}`);
}

export async function deleteProject(id: number): Promise<void> {
  const { projects } = (await requestScope()).cradle;
  const project = await projects.findById(id);
  const viewer = await requireViewer("/me");
  if (project && canEdit(viewer, project)) await projects.remove(project);
  redirect(viewer.isAdmin && project?.owner.id !== viewer.user.id ? "/admin" : "/me");
}

function invalid(
  prev: ProjectFormState,
  values: ProjectFormState["values"],
  error: z.ZodError<z.output<typeof projectSchema>>,
): ProjectFormState {
  return {
    attempt: prev.attempt + 1,
    values,
    errors: z.flattenError(error).fieldErrors,
    message: "Some answers didn't satisfy the bridgekeeper. See below.",
  };
}
