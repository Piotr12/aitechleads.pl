import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Badge } from "@atl/ui/components/badge";
import { Button } from "@atl/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@atl/ui/components/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@atl/ui/components/table";
import { DeleteProjectButton } from "@/components/delete-project-button";
import { StatusBadge } from "@/components/status-badge";
import { setProjectHidden } from "@/app/admin/actions";
import { deleteProject } from "@/app/projects/actions";
import { requireViewer } from "@/server/auth";
import { requestScope } from "@/server/container";

export const metadata: Metadata = { title: "The Patrician's office" };

export default function AdminPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">The Patrician&apos;s office</h1>
        <p className="text-muted-foreground">
          The city works. Mostly. Here you may hide what shouldn&apos;t be seen and remove what
          shouldn&apos;t be.
        </p>
      </header>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Ook. (Counting rocks…)</p>}>
        <Admin />
      </Suspense>
    </main>
  );
}

async function Admin() {
  await connection();
  const viewer = await requireViewer("/admin");
  if (!viewer.isAdmin) {
    return (
      <p className="text-muted-foreground">
        None shall pass. This office is for admins (<code>ADMIN_GITHUB_IDS</code>).
      </p>
    );
  }

  const { config, orm, projects } = (await requestScope()).cradle;
  const [executed, pending, stats, all] = await Promise.all([
    orm.migrator.getExecuted(),
    orm.migrator.getPending(),
    projects.stats(),
    projects.list({ includeHidden: true }),
  ]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Census</CardTitle>
            <CardDescription>Everyone who ever crossed the bridge.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">{stats.users} users</Badge>
            <Badge variant="secondary">{stats.projects} projects</Badge>
            <Badge variant={stats.hidden ? "destructive" : "outline"}>{stats.hidden} hidden</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Database</CardTitle>
            <CardDescription className="font-mono break-all">{config.databasePath}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">{executed.length} migrations applied</Badge>
            <Badge variant={pending.length ? "destructive" : "outline"}>{pending.length} pending</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {all.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    Nothing to moderate. Suspicious.
                  </TableCell>
                </TableRow>
              )}
              {all.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="max-w-64 truncate">
                    <Link href={`/projects/${project.slug}`} className="hover:underline">
                      {project.title}
                    </Link>
                    {project.hidden && (
                      <Badge variant="destructive" className="ml-2">
                        hidden
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>@{project.owner.login}</TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell>{project.updatedAt.toISOString().slice(0, 10)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <form action={setProjectHidden.bind(null, project.id, !project.hidden)}>
                        <Button type="submit" variant="outline" size="sm">
                          {project.hidden ? "Unhide" : "Hide"}
                        </Button>
                      </form>
                      <DeleteProjectButton
                        title={project.title}
                        action={deleteProject.bind(null, project.id)}
                        size="sm"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
