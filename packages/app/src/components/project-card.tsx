import Link from "next/link";
import type { Project } from "@atl/db";
import { Badge } from "@atl/ui/components/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@atl/ui/components/card";
import { StatusBadge } from "./status-badge";
import { UserChip } from "./user-chip";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={project.status} />
          {project.hidden && <Badge variant="destructive">Hidden</Badge>}
        </div>
        <CardTitle className="text-lg">
          <Link href={`/projects/${project.id}`} className="hover:underline">
            {project.title}
          </Link>
        </CardTitle>
        <CardDescription>{project.summary}</CardDescription>
      </CardHeader>
      {project.tags.length > 0 && (
        <CardContent className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" asChild>
              <Link href={`/?tag=${encodeURIComponent(tag)}`}>#{tag}</Link>
            </Badge>
          ))}
        </CardContent>
      )}
      <CardFooter className="mt-auto">
        <UserChip user={project.owner} />
      </CardFooter>
    </Card>
  );
}
