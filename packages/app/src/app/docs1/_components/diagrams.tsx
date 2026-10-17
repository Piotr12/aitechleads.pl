import Link from "next/link";
import { cn } from "@atl/ui/lib/utils";
import {
  ROLES,
  STAGES,
  cellFor,
  gatesForStage,
  href,
  type Cell,
  type RoleId,
  type StageId,
} from "../_data";
import { GateTag, ModeDot, RaciLetters } from "./marks";

const STAGE_SHORT: Record<StageId, string> = {
  discovery: "Discovery & Design",
  intake: "Intake",
  triage: "Triage",
  claim: "Claim",
  implement: "Implement",
  "pull-request": "Pull request",
  review: "Review",
  qa: "QA",
  merge: "Merge",
  cleanup: "Cleanup",
};

function StageNumber({ n, active }: { n: number; active?: boolean }) {
  return (
    <span
      className={cn(
        "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums",
        active ? "border-foreground bg-foreground text-background" : "bg-background text-foreground",
      )}
    >
      {n}
    </span>
  );
}

/**
 * The ten stages as a rail, with the two layers bracketed above and the gates marked below.
 * Horizontal in a wide container, vertical in a narrow one.
 */
export function StageRail({ active, showSummary = false }: { active?: StageId; showSummary?: boolean }) {
  return (
    <div className="@container">
      {/* Wide: horizontal rail */}
      <div className="hidden @3xl:block">
        <div className="mb-3 grid grid-cols-10 gap-2 text-[11px] font-medium text-muted-foreground">
          <div className="col-span-1 border-t-2 border-dashed border-foreground/40 pt-1">
            Product layer
            <span className="block font-mono font-normal">om-setup-discovery-pipeline</span>
          </div>
          <div className="col-span-9 border-t-2 border-foreground/40 pt-1">
            Delivery layer
            <span className="block font-mono font-normal">om-setup-agent-pipeline</span>
          </div>
        </div>
        <div className="relative">
          <span aria-hidden className="absolute top-4 right-[5%] left-[5%] h-px bg-border" />
          <ol className="relative grid grid-cols-10 gap-2">
            {STAGES.map((stage) => (
              <li key={stage.id} className="flex flex-col items-center gap-2 text-center">
                <Link
                  href={href.stage(stage.id)}
                  aria-current={stage.id === active ? "page" : undefined}
                  className="group flex flex-col items-center gap-2"
                >
                  <StageNumber n={stage.number} active={stage.id === active} />
                  <span
                    className={cn(
                      "text-xs leading-tight group-hover:underline group-hover:underline-offset-4",
                      stage.id === active ? "font-semibold" : "font-medium",
                    )}
                  >
                    {STAGE_SHORT[stage.id]}
                  </span>
                </Link>
                <div className="flex flex-wrap justify-center gap-1">
                  {gatesForStage(stage.id).map((g) => (
                    <GateTag key={g.id} id={g.id} />
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Narrow: vertical rail */}
      <ol className="flex flex-col @3xl:hidden">
        {STAGES.map((stage, i) => (
          <li key={stage.id} className="relative flex gap-3 pb-4 last:pb-0">
            {i < STAGES.length - 1 ? (
              <span aria-hidden className="absolute top-8 bottom-0 left-4 w-px bg-border" />
            ) : null}
            <StageNumber n={stage.number} active={stage.id === active} />
            <div className="flex min-w-0 flex-col gap-1 pt-1">
              {i === 0 || stage.layer !== STAGES[i - 1].layer ? (
                <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {stage.layer === "product" ? "Product layer" : "Delivery layer"}
                </span>
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={href.stage(stage.id)}
                  aria-current={stage.id === active ? "page" : undefined}
                  className={cn(
                    "text-sm hover:underline hover:underline-offset-4",
                    stage.id === active ? "font-semibold" : "font-medium",
                  )}
                >
                  {stage.name}
                </Link>
                {gatesForStage(stage.id).map((g) => (
                  <GateTag key={g.id} id={g.id} />
                ))}
              </div>
              {showSummary ? <p className="text-sm text-muted-foreground">{stage.summary}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CellMarks({ cell, compact = false }: { cell: Cell; compact?: boolean }) {
  return (
    <div className="flex flex-col items-start gap-1">
      {cell.gates?.map((g) => <GateTag key={g} id={g} />)}
      <ul className={cn("flex flex-col", compact ? "gap-0.5" : "gap-1")}>
        {cell.duties.map((duty, i) => (
          <li key={i} className="flex items-center gap-1" title={duty.text}>
            <ModeDot mode={duty.mode} />
            <RaciLetters raci={duty.raci} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** One actor's lane across the ten stages. */
export function RoleLane({ role }: { role: RoleId }) {
  return (
    <div className="@container">
      <ol className="hidden grid-cols-10 gap-1.5 @3xl:grid">
        {STAGES.map((stage) => {
          const cell = cellFor(role, stage.id);
          return (
            <li key={stage.id} className="flex flex-col gap-1.5">
              <Link
                href={href.stage(stage.id)}
                className="truncate text-center text-[11px] font-medium text-muted-foreground hover:text-foreground"
                title={stage.name}
              >
                {stage.number}. {STAGE_SHORT[stage.id]}
              </Link>
              <div
                className={cn(
                  "flex min-h-24 flex-col rounded-lg p-2",
                  cell
                    ? cn("border bg-card", cell.gates ? "border-destructive/50 shadow-[inset_3px_0_0_var(--destructive)]" : "")
                    : "border border-dashed bg-muted/20",
                  stage.layer === "product" && cell ? "border-dashed" : "",
                )}
              >
                {cell ? (
                  <CellMarks cell={cell} />
                ) : (
                  <span className="m-auto text-xs text-muted-foreground/60" aria-label="Not involved">
                    &mdash;
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <ol className="flex flex-col gap-1.5 @3xl:hidden">
        {STAGES.map((stage) => {
          const cell = cellFor(role, stage.id);
          return (
            <li
              key={stage.id}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2",
                cell ? "border bg-card" : "text-muted-foreground",
                cell?.gates ? "border-destructive/50 shadow-[inset_3px_0_0_var(--destructive)]" : "",
              )}
            >
              <span className="w-5 text-right text-xs tabular-nums text-muted-foreground">{stage.number}</span>
              <Link href={href.stage(stage.id)} className="min-w-0 flex-1 text-sm hover:underline">
                {stage.name}
              </Link>
              {cell ? (
                <span className="flex flex-wrap items-center justify-end gap-1.5">
                  {cell.gates?.map((g) => <GateTag key={g} id={g} />)}
                  {cell.duties.map((duty, i) => (
                    <span key={i} className="inline-flex items-center gap-1" title={duty.text}>
                      <ModeDot mode={duty.mode} />
                      <RaciLetters raci={duty.raci} />
                    </span>
                  ))}
                </span>
              ) : (
                <span className="text-xs">not involved</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Compact actors x stages map: dots, RACI letters and gates only. */
export function DotMatrix({ highlightRole, highlightStage }: { highlightRole?: RoleId; highlightStage?: StageId }) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[52rem] border-collapse text-xs">
        <caption className="sr-only">Actors by stage: who decides, supervises or delegates to an agent</caption>
        <thead>
          <tr className="border-b bg-muted/40">
            <th scope="col" className="sticky left-0 z-10 bg-muted p-2 text-left font-medium">
              Actor
            </th>
            {STAGES.map((stage) => (
              <th
                key={stage.id}
                scope="col"
                className={cn(
                  "p-2 text-left align-bottom font-medium",
                  stage.id === highlightStage && "bg-foreground/5",
                )}
              >
                <Link href={href.stage(stage.id)} className="hover:underline">
                  <span className="text-muted-foreground tabular-nums">{stage.number}.</span>{" "}
                  {STAGE_SHORT[stage.id]}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROLES.map((role) => (
            <tr key={role.id} className={cn("border-b last:border-b-0", role.id === highlightRole && "bg-foreground/5")}>
              <th scope="row" className="sticky left-0 z-10 bg-background p-2 text-left align-top font-medium">
                <Link href={href.role(role.id)} className="hover:underline">
                  {role.name}
                </Link>
              </th>
              {STAGES.map((stage) => {
                const cell = cellFor(role.id, stage.id);
                return (
                  <td
                    key={stage.id}
                    className={cn(
                      "border-l p-2 align-top",
                      stage.id === highlightStage && "bg-foreground/5",
                      cell?.gates && "shadow-[inset_3px_0_0_var(--destructive)]",
                    )}
                  >
                    {cell ? <CellMarks cell={cell} compact /> : null}
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
