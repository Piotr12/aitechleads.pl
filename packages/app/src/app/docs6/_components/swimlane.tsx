import { Hand } from "lucide-react";
import Link from "./link";
import { cn } from "./cx";
import { DECIDE, PERSON } from "./marks";
import { ROLES, type Moment, type RoleId, type Where } from "../_data/roles";
import { STATIONS } from "../_data/stations";

const COLS: { where: Where[]; name: string; href: string }[] = [
  { where: ["setup"], name: "Set-up", href: "/docs6/hood/rulebook" },
  { where: ["product-road"], name: "Product road", href: "/docs6/onramps/product" },
  ...STATIONS.map((s) => ({
    where: (s.id === "review" ? ["review", "stalled"] : [s.id]) as Where[],
    name: `${s.n}. ${s.short}`,
    href: `/docs6/journey/${s.id}`,
  })),
];

/** "om-auto-fix-issue 412 --flag" -> "auto-fix-issue" */
function shortCmd(cmd: string) {
  const first = cmd.replace(/^\//, "").split(" ")[0];
  return first.replace(/^om-/, "");
}

function cell(moments: Moment[]) {
  const names = [...new Set(moments.flatMap((m) => m.run.map(shortCmd)))];
  const decides = moments.some((m) => m.decide);
  return { names, decides };
}

/** Who touches the work where: people down the side, the road along the top. */
export function Swimlane({ highlight }: { highlight?: RoleId }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-[960px] table-fixed border-collapse text-xs">
        <thead>
          <tr className="bg-muted/50">
            <th className="w-28 p-2 text-left font-medium">Who</th>
            {COLS.map((c) => (
              <th key={c.name} className="p-1.5 text-left font-medium">
                <Link href={c.href} className="hover:underline">
                  {c.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROLES.map((r) => (
            <tr key={r.id} className={cn("border-t align-top", highlight === r.id && "bg-amber-50/60 dark:bg-amber-950/30")}>
              <th className="p-2 text-left font-medium">
                <Link href={`/docs6/people/${r.id}`} className="hover:underline">
                  <span aria-hidden>{r.emoji}</span> {r.name}
                </Link>
              </th>
              {COLS.map((c) => {
                const ms = r.moments.filter((m) => c.where.includes(m.where));
                if (ms.length === 0) return <td key={c.name} className="p-1" />;
                const { names, decides } = cell(ms);
                return (
                  <td key={c.name} className="p-1">
                    <div className={cn("flex flex-col gap-0.5 rounded-md border p-1", decides ? DECIDE : PERSON)}>
                      {decides && <Hand className="size-3" aria-label="decides here" />}
                      {names.map((n) => (
                        <span key={n} className="font-mono text-[10px] leading-tight">
                          {n.replaceAll("-", "-\u200b")}
                        </span>
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
