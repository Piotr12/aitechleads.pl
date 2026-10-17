import Link from "next/link";
import { cx as cn } from "./cx";
import {
  gateById,
  isAutonomous,
  roleById,
  skillHref,
  type Cell,
  type GateId,
  type RoleId,
} from "../_data/model";

/** Red = a human decides (gates). Filled = a human supervises. Hollow = an agent does delegated work. */
export function Dot({ kind, className }: { kind: "decide" | "supervise" | "agent"; className?: string }) {
  const label =
    kind === "decide" ? "a human decides" : kind === "supervise" ? "a human supervises" : "agents do delegated work";
  return (
    <svg viewBox="0 0 12 12" className={cn("size-3 shrink-0", className)} role="img" aria-label={label}>
      <title>{label}</title>
      {kind === "agent" ? (
        <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-muted-foreground" />
      ) : (
        <circle
          cx="6"
          cy="6"
          r="5"
          className={kind === "decide" ? "fill-red-600 dark:fill-red-500" : "fill-foreground"}
        />
      )}
    </svg>
  );
}

/** The marks of one RACI cell: human dot, agent ring, RACI letters. */
export function CellMarks({ cell, size = "sm" }: { cell: Cell; size?: "sm" | "lg" }) {
  const quiet = !cell.dot && !cell.agent;
  return (
    <span className={cn("inline-flex items-center gap-1", size === "lg" && "gap-1.5")}>
      {cell.dot && <Dot kind={cell.dot} className={size === "lg" ? "size-3.5" : undefined} />}
      {cell.agent && <Dot kind="agent" className={size === "lg" ? "size-3.5" : undefined} />}
      <span
        className={cn(
          "font-mono font-semibold tracking-tight",
          size === "lg" ? "text-xs" : "text-[10px]",
          quiet ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {cell.raci}
      </span>
    </span>
  );
}

export function GateTag({ id, href = true, className }: { id: GateId; href?: boolean; className?: string }) {
  const gate = gateById(id);
  const cls = cn(
    "inline-flex items-center gap-1 rounded-sm border border-red-600/40 bg-red-500/10 px-1 font-mono text-[10px] font-semibold leading-4 text-red-700 dark:border-red-400/40 dark:text-red-400",
    href && "hover:bg-red-500/20",
    className,
  );
  const content = (
    <>
      <svg viewBox="0 0 8 10" className="size-2 fill-current" aria-hidden>
        <path d="M1 0v10M1 1h6l-1.5 2L7 5H1z" stroke="currentColor" strokeWidth="1" />
      </svg>
      {id}
    </>
  );
  return href ? (
    <Link href={`/docs2/gates#${id}`} className={cls} title={`${id} · ${gate.name}`}>
      {content}
    </Link>
  ) : (
    <span className={cls} title={`${id} · ${gate.name}`}>
      {content}
    </span>
  );
}

export function SkillChip({ name, className }: { name: string; className?: string }) {
  return (
    <a
      href={skillHref(name)}
      target="_blank"
      rel="noreferrer"
      title={isAutonomous(name) ? "autonomous (om-auto-*)" : "interactive"}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border bg-muted/60 px-1.5 py-0.5 font-mono text-[11px] leading-4 text-foreground hover:bg-muted",
        className,
      )}
    >
      <span className="text-muted-foreground">/</span>
      {name}
      {isAutonomous(name) && (
        <span aria-label="autonomous" className="text-[9px] text-muted-foreground">
          auto
        </span>
      )}
    </a>
  );
}

export function RoleChip({ id, className }: { id: RoleId; className?: string }) {
  const role = roleById(id);
  return (
    <Link
      href={`/docs2/${id}`}
      title={role.name}
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-semibold leading-4 hover:bg-muted",
        className,
      )}
    >
      {role.code}
    </Link>
  );
}

export function Legend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground", className)}>
      <li className="inline-flex items-center gap-1.5">
        <Dot kind="decide" /> human decides
      </li>
      <li className="inline-flex items-center gap-1.5">
        <Dot kind="supervise" /> human supervises
      </li>
      <li className="inline-flex items-center gap-1.5">
        <Dot kind="agent" /> agent does the work
      </li>
      <li className="inline-flex items-center gap-1.5">
        <GateTag id="G1" href={false} /> gate
      </li>
      <li>
        <span className="font-mono font-semibold text-foreground">R</span> does ·{" "}
        <span className="font-mono font-semibold text-foreground">A</span> owns ·{" "}
        <span className="font-mono font-semibold text-foreground">C</span> consulted ·{" "}
        <span className="font-mono font-semibold text-foreground">I</span> informed
      </li>
    </ul>
  );
}
