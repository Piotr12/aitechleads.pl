import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Badge } from "@atl/ui/components/badge";
import { Button } from "@atl/ui/components/button";
import { Separator } from "@atl/ui/components/separator";
import { DeleteProjectButton } from "@/components/delete-project-button";
import { StatusBadge } from "@/components/status-badge";
import { UserChip } from "@/components/user-chip";
import { deleteProject } from "@/app/projects/actions";
import { canEdit, getViewer } from "@/server/auth";
import { requestScope } from "@/server/container";

export const metadata: Metadata = { title: "Project" };

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← All projects
      </Link>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Ook.</p>}>
        <ProjectDetails params={params} />
      </Suspense>
    </main>
  );
}

async function ProjectDetails({ params }: Pick<PageProps<"/projects/[slug]">, "params">) {
  await connection();
  const { slug } = await params;
  const viewer = await getViewer();
  const project = await (await requestScope()).cradle.projects.findBySlug(slug);
  // Hidden projects are visible to their owner and admins only.
  if (!project || (project.hidden && !canEdit(viewer, project))) notFound();

  const editable = canEdit(viewer, project);
  const links = [
    { label: "Repository", url: project.repoUrl },
    { label: "Demo", url: project.demoUrl },
  ].filter((link): link is { label: string; url: string } => !!link.url);

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={project.status} />
          {project.hidden && <Badge variant="destructive">Hidden by an admin</Badge>}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
        <p className="text-lg text-muted-foreground">{project.summary}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <UserChip user={project.owner} />
          <span className="text-sm text-muted-foreground">
            Updated {project.updatedAt.toISOString().slice(0, 10)}
          </span>
        </div>
      </header>

      {(links.length > 0 || project.tags.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <Button key={link.label} asChild variant="outline" size="sm">
              <a href={link.url} target="_blank" rel="noreferrer nofollow">
                {link.label} ↗
              </a>
            </Button>
          ))}
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" asChild>
              <Link href={`/?tag=${encodeURIComponent(tag)}`}>#{tag}</Link>
            </Badge>
          ))}
        </div>
      )}

      {project.description && (
        <>
          <Separator />
          <div className="whitespace-pre-line leading-7">{project.description}</div>
        </>
      )}

      {editable && (
        <>
          <Separator />
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/projects/${project.slug}/edit`}>Edit</Link>
            </Button>
            <DeleteProjectButton title={project.title} action={deleteProject.bind(null, project.id)} />
          </div>
        </>
      )}
    </article>
  );
}
