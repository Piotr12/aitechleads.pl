import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { ProjectForm } from "@/components/project-form";
import { createProject } from "@/app/projects/actions";
import { requireViewer } from "@/server/auth";

export const metadata: Metadata = { title: "Add a project" };

export default function NewProjectPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Add a project</h1>
        <p className="text-muted-foreground">
          Every great quest starts with a form. Ask any knight. Ideas and half-built things are
          welcome: they&apos;re not dead yet.
        </p>
      </header>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Ook.</p>}>
        <NewProject />
      </Suspense>
    </main>
  );
}

async function NewProject() {
  await connection();
  await requireViewer("/projects/new");
  return (
    <ProjectForm
      action={createProject}
      initial={{ status: "idea" }}
      submitLabel="Add project"
      cancelHref="/"
    />
  );
}
