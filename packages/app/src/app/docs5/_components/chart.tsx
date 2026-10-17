import { Flag } from "lucide-react";
import Link from "./link";
import { cn } from "./cx";
import { MarkDot, RoleAvatar } from "./marks";
import { gatesAt } from "../_data/gates";
import { momentAt, ROLES } from "../_data/roles";
import { isAuto, skillUrl } from "../_data/skills";
import { PHASES, STAGES, stagesOf } from "../_data/stages";

/**
 * The full chart, rebuilt: people down the side, stops along the top, red flags over the gate columns.
 * Wide on purpose, so it scrolls sideways inside its own box on small screens.
 */
export function FullChart({ skills = true }: { skills?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-[1080px] border-collapse text-left text-xs">
        <caption className="sr-only">Who does what at each stop, with which skill</caption>
        <thead>
          <tr className="border-b">
            <th scope="col" className="w-40 p-2" />
            {PHASES.map((p) => (
              <th
                key={p.id}
                scope="colgroup"
                colSpan={stagesOf(p.id).length}
                className="border-l p-2 text-center text-[11px] font-semibold tracking-wide text-muted-foreground uppercase"
              >
                {p.emoji} {p.name}
              </th>
            ))}
          </tr>
          <tr className="border-b">
            <th scope="col" className="p-2 text-[11px] font-medium text-muted-foreground">
              Person ↓ · Stop →
            </th>
            {STAGES.map((s) => {
              const flags = gatesAt(s.id);
              return (
                <th
                  key={s.id}
                  scope="col"
                  className={cn("border-l p-2 align-bottom", flags.length > 0 && "border-t-4 border-t-destructive")}
                >
                  <Link href={`/docs5/stops/${s.id}`} className="flex flex-col gap-1 hover:underline">
                    <span className="font-mono text-[10px] text-muted-foreground">{s.n ?? "+ repo"}</span>
                    <span className={cn("font-semibold", s.repoOnly && "italic")}>{s.short}</span>
                  </Link>
                  {flags.length > 0 && (
                    <span className="mt-1 flex flex-wrap gap-1">
                      {flags.map((g) => (
                        <Link
                          key={g.id}
                          href={`/docs5/zoom/gates#${g.id}`}
                          title={`${g.name}, held by ${g.holderLabel}`}
                          className="inline-flex items-center gap-0.5 rounded bg-destructive/10 px-1 text-[10px] font-semibold text-destructive hover:bg-destructive/20"
                        >
                          <Flag className="size-2.5" aria-hidden />
                          {g.id}
                        </Link>
                      ))}
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {ROLES.map((r) => (
            <tr key={r.id} className="border-b last:border-b-0">
              <th scope="row" className="p-2 align-top">
                <Link href={`/docs5/seats/${r.id}`} className="flex items-center gap-2 hover:underline">
                  <RoleAvatar role={r.id} size="sm" />
                  <span className="font-semibold">{r.name}</span>
                </Link>
              </th>
              {STAGES.map((s) => {
                const m = momentAt(r, s.id);
                const gated = (m?.gates?.length ?? 0) > 0;
                return (
                  <td
                    key={s.id}
                    className={cn(
                      "border-l p-2 align-top",
                      s.repoOnly && "bg-muted/30",
                      gated && "bg-destructive/5",
                    )}
                  >
                    {m && (
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1">
                          {m.mark !== "agent" && <MarkDot mark={m.mark} />}
                          {m.agent && <MarkDot mark="agent" />}
                          <span className="font-mono text-[10px] font-semibold">{m.raci}</span>
                        </span>
                        {skills && m.skills && (
                          <span className="flex flex-col gap-0.5">
                            {m.skills.map((name) => (
                              <a
                                key={name}
                                href={skillUrl(name)}
                                target="_blank"
                                rel="noreferrer"
                                className={cn(
                                  "font-mono text-[10px] leading-tight break-words hover:underline",
                                  isAuto(name) ? "text-foreground" : "text-muted-foreground",
                                )}
                              >
                                {name.replace(/^om-/, "")}
                              </a>
                            ))}
                          </span>
                        )}
                      </div>
                    )}
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
