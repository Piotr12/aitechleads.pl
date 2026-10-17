import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { PROJECT_STATUSES, type ProjectFilter, type ProjectStatus } from "@atl/db";
import { Button } from "@atl/ui/components/button";
import { ProjectCard } from "@/components/project-card";
import { ProjectFilters } from "@/components/project-filters";
import { requestScope } from "@/server/container";

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-4">
        <span className="text-5xl" aria-hidden>
          🥥
        </span>
        <h1 className="text-4xl font-semibold tracking-tight">Bring out your demos!</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          A collaboration space for people who consider themselves AI Tech Leaders, and for those
          bravely, bravely working on it. See who&apos;s building what, find a fellow knight for
          your quest, or add your own.
        </p>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Unofficial and unaffiliated: we have nothing to do with the AI Tech Leaders training
          (aitechleaders.pl). We just liked the idea and brought coconuts.
        </p>
        <div>
          <Button asChild>
            <Link href="/projects/new">Add your project</Link>
          </Button>
        </div>
      </header>

      <section className="flex flex-col gap-6">
        <Suspense fallback={<Ook />}>
          <ProjectList searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}

async function ProjectList({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  await connection();
  const filter = parseFilter(await searchParams);
  const projects = await (await requestScope()).cradle.projects.list(filter);

  return (
    <>
      <ProjectFilters filter={filter} />
      {projects.length === 0 ? (
        <EmptyList filtered={!!(filter.q || filter.status || filter.tag)} />
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

function EmptyList({ filtered }: { filtered: boolean }) {
  return (
    <div className="rounded-xl border border-dashed p-10 text-center">
      <p className="font-medium">
        {filtered ? "Nobody expects an empty search result." : "This is an ex-list."}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {filtered
          ? "Our chief weapon is surprise. Try fewer filters."
          : "It has ceased to be. It is bereft of projects. Add the first one and restore it to life."}
      </p>
    </div>
  );
}

function Ook() {
  return <p className="text-sm text-muted-foreground">Ook. (The Librarian is fetching the projects.)</p>;
}

function parseFilter(params: Record<string, string | string[] | undefined>): ProjectFilter {
  const one = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value)?.trim().slice(0, 100) || undefined;
  };
  const status = one("status");
  return {
    q: one("q"),
    tag: one("tag")?.toLowerCase(),
    status: PROJECT_STATUSES.includes(status as ProjectStatus) ? (status as ProjectStatus) : undefined,
  };
}
