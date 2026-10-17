import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { MAX_PROJECTS_PER_USER } from "@atl/db";
import { Button } from "@atl/ui/components/button";
import { ProjectCard } from "@/components/project-card";
import { requireViewer } from "@/server/auth";
import { requestScope } from "@/server/container";

export const metadata: Metadata = { title: "My quests" };

export default function MyProjectsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Ook.</p>}>
        <MyProjects />
      </Suspense>
    </main>
  );
}

async function MyProjects() {
  await connection();
  const viewer = await requireViewer("/me");
  const projects = await (await requestScope()).cradle.projects.listByOwner(viewer.user);

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">My quests</h1>
          <p className="text-muted-foreground">
            What is your name? @{viewer.user.login}. What is your quest? These{" "}
            {projects.length} project{projects.length === 1 ? "" : "s"} (of {MAX_PROJECTS_PER_USER}{" "}
            allowed).
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">Add project</Link>
        </Button>
      </header>
      {projects.length === 0 ? (
        <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          No quests yet. Your favourite colour is noted, though.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
