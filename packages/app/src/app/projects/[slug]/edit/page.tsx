import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ProjectForm } from "@/components/project-form";
import { updateProject } from "@/app/projects/actions";
import { canEdit, requireViewer } from "@/server/auth";
import { requestScope } from "@/server/container";

export const metadata: Metadata = { title: "Edit project" };

export default function EditProjectPage({ params }: PageProps<"/projects/[slug]/edit">) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Ook.</p>}>
        <EditProject params={params} />
      </Suspense>
    </main>
  );
}

async function EditProject({ params }: Pick<PageProps<"/projects/[slug]/edit">, "params">) {
  await connection();
  const { slug } = await params;
  const viewer = await requireViewer(`/projects/${slug}/edit`);
  const project = await (await requestScope()).cradle.projects.findBySlug(slug);
  if (!project) notFound();

  if (!canEdit(viewer, project)) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">None shall pass.</h1>
        <p className="text-muted-foreground">
          Only the project&apos;s owner may edit it. You may, however, admire it from a respectful
          distance.
        </p>
      </div>
    );
  }

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Edit “{project.title}”</h1>
        <p className="text-muted-foreground">The address stays the same, so old links keep working.</p>
      </header>
      <ProjectForm
        action={updateProject.bind(null, project.id)}
        initial={{
          title: project.title,
          summary: project.summary,
          description: project.description ?? "",
          repoUrl: project.repoUrl ?? "",
          demoUrl: project.demoUrl ?? "",
          status: project.status,
          tags: project.tags.join(", "),
        }}
        submitLabel="Save changes"
        cancelHref={`/projects/${project.slug}`}
      />
    </>
  );
}
