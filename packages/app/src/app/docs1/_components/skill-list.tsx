import Link from "next/link";
import { Badge } from "@atl/ui/components/badge";
import { getSkill, href, type SkillId } from "../_data";

export function ModeBadge({ mode }: { mode: "autonomous" | "interactive" }) {
  return (
    <Badge variant={mode === "autonomous" ? "default" : "outline"} title={mode === "autonomous" ? "Runs end-to-end without supervision" : "Acts once, may ask questions, hands control back"}>
      {mode}
    </Badge>
  );
}

export function SkillList({ ids }: { ids: SkillId[] }) {
  return (
    <ul className="grid gap-2 md:grid-cols-2">
      {ids.map((id) => {
        const skill = getSkill(id);
        if (!skill) return null;
        return (
          <li key={id}>
            <Link
              href={href.skill(id)}
              className="flex h-full flex-col gap-1.5 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
            >
              <span className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 font-mono text-[13px] font-medium">{id}</span>
                <ModeBadge mode={skill.mode} />
                {skill.buildingBlock ? <Badge variant="secondary">building block</Badge> : null}
              </span>
              <span className="text-sm text-muted-foreground">{skill.summary}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
