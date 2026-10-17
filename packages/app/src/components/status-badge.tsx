import type { ProjectStatus } from "@atl/db";
import { Badge } from "@atl/ui/components/badge";
import { STATUS_INFO } from "@/lib/statuses";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const info = STATUS_INFO[status];
  return (
    <Badge variant={info.variant} title={info.hint}>
      {info.label}
    </Badge>
  );
}
