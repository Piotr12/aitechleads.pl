/**
 * One role as a lane across the ten stages: the chart's dots per cell, RACI letters where there is no dot,
 * and the gates the role holds. Ten equal columns, so it fits a phone.
 */
import Link from "@/app/docs4/_components/link";
import { STAGES, cellFor, href, type Duty, type RoleId } from "../_data";
import { cx, Dot, GateFlag } from "./ui";

function DutyMark({ duty }: { duty: Duty }) {
  if (duty.mode === "none") {
    return (
      <span title={`${duty.raci.join(", ")}: ${duty.text}`} className="font-mono text-[10px] leading-none text-muted-foreground">
        {duty.raci.join("")}
      </span>
    );
  }
  return (
    <span title={`${duty.raci.join(", ")}: ${duty.text}`} className="inline-flex">
      <Dot kind={duty.mode} />
    </span>
  );
}

export function LaneHeader() {
  return (
    <div className="grid grid-cols-10 gap-1" aria-hidden>
      {STAGES.map((s) => (
        <span key={s.id} className="min-w-0 text-center font-mono text-[10px] text-muted-foreground">
          {s.number}
          <span className="hidden truncate font-sans sm:block">{s.short}</span>
        </span>
      ))}
    </div>
  );
}

export function RoleLane({ role, className }: { role: RoleId; className?: string }) {
  return (
    <ol className={cx("grid grid-cols-10 gap-1", className)} aria-label="Involvement across the ten stages">
      {STAGES.map((s) => {
        const cell = cellFor(role, s.id);
        const decides = cell?.duties.some((d) => d.mode === "decides");
        return (
          <li key={s.id} className="min-w-0">
            <Link
              href={href.stage(s.id)}
              title={cell ? `${s.name}: ${cell.duties.map((d) => d.text).join(" / ")}` : `${s.name}: not involved`}
              className={cx(
                "flex h-full min-h-11 flex-col items-center justify-center gap-1 rounded-md border px-0.5 py-1 transition-colors hover:bg-muted",
                !cell && "border-dashed bg-transparent opacity-50",
                cell && "bg-card",
                decides && "border-red-600/50 dark:border-red-500/50",
              )}
            >
              {cell ? (
                <>
                  <span className="flex flex-wrap items-center justify-center gap-0.5">
                    {cell.duties.map((d, i) => (
                      <DutyMark key={i} duty={d} />
                    ))}
                  </span>
                  {cell.gates && (
                    <span className="flex flex-wrap justify-center gap-0.5">
                      {cell.gates.map((g) => (
                        <GateFlag key={g} id={g} plain />
                      ))}
                    </span>
                  )}
                </>
              ) : (
                <span className="sr-only">not involved</span>
              )}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
