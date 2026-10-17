import type { ReactNode } from "react";
import { Bot, ExternalLink, Flag } from "lucide-react";
import Link from "./link";
import { cn } from "./cx";
import { GATE_BY_ID, type GateId } from "../_data/gates";
import { MARK_TEXT, ROLE_BY_ID, type Mark, type RoleId } from "../_data/roles";
import { isAuto, SKILL_BY_NAME, skillUrl } from "../_data/skills";
import { STAGE_BY_ID, type StageId } from "../_data/stages";

/** The chart's three dots, plus "no dot". */
export function MarkDot({ mark, size = "sm", className }: { mark: Mark; size?: "sm" | "md" | "lg"; className?: string }) {
  const box = size === "lg" ? "size-6" : size === "md" ? "size-4" : "size-3";
  const label = MARK_TEXT[mark].name;
  if (mark === "plain") {
    return (
      <span
        role="img"
        aria-label={label}
        title={label}
        className={cn(box, "inline-block shrink-0 rounded-full border border-dashed border-muted-foreground/50", className)}
      />
    );
  }
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn(
        box,
        "inline-block shrink-0 rounded-full",
        mark === "decides" && "bg-destructive",
        mark === "supervises" && "bg-foreground",
        mark === "agent" && "border-2 border-foreground/70 bg-transparent",
        className,
      )}
    />
  );
}

/** The hollow ring on its own: "agents carry out delegated work". */
export function AgentRing({ size = "sm" }: { size?: "sm" | "md" }) {
  return <MarkDot mark="agent" size={size} />;
}

export function RoleAvatar({ role, size = "md" }: { role: RoleId; size?: "sm" | "md" | "lg" }) {
  const r = ROLE_BY_ID[role];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full ring-2",
        r.tone.avatar,
        r.tone.ring,
        size === "lg" ? "size-14 text-3xl" : size === "md" ? "size-9 text-lg" : "size-6 text-xs",
      )}
    >
      {r.emoji}
    </span>
  );
}

export function RoleChip({ role, link = true, className }: { role: RoleId; link?: boolean; className?: string }) {
  const r = ROLE_BY_ID[role];
  const inner = (
    <>
      <RoleAvatar role={role} size="sm" />
      <span className="min-w-0 break-words">{r.name}</span>
    </>
  );
  const cls = cn(
    "inline-flex max-w-full items-center gap-1.5 rounded-full border bg-card py-0.5 pr-2.5 pl-0.5 text-xs font-medium",
    link && "transition-colors hover:bg-muted",
    className,
  );
  return link ? (
    <Link href={`/docs5/seats/${role}`} className={cls}>
      {inner}
    </Link>
  ) : (
    <span className={cls}>{inner}</span>
  );
}

/** A skill name linking to its upstream card. A robot icon marks om-auto-* (runs on its own). */
export function SkillChip({ name, className }: { name: string; className?: string }) {
  const skill = SKILL_BY_NAME[name];
  const auto = isAuto(name);
  return (
    <a
      href={skillUrl(name)}
      target="_blank"
      rel="noreferrer"
      title={skill ? skill.line : name}
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-xs break-words transition-colors hover:bg-muted",
        auto ? "border-foreground/30 bg-muted/60" : "bg-card",
        className,
      )}
    >
      {auto && <Bot className="size-3 shrink-0" aria-label="runs on its own" />}
      {name}
    </a>
  );
}

export function GateFlag({ id, withName = false, className }: { id: GateId; withName?: boolean; className?: string }) {
  const g = GATE_BY_ID[id];
  return (
    <Link
      href={`/docs5/zoom/gates#${id}`}
      title={`${id}: ${g.name}, held by ${g.holderLabel}`}
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-destructive/10 px-1.5 py-0.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/20",
        className,
      )}
    >
      <Flag className="size-3 shrink-0" aria-hidden />
      {id}
      {withName && <span className="font-medium">· {g.name}</span>}
    </Link>
  );
}

export function StopChip({ stage, className }: { stage: StageId; className?: string }) {
  const s = STAGE_BY_ID[stage];
  return (
    <Link
      href={`/docs5/stops/${stage}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-card px-2 py-0.5 text-xs font-medium transition-colors hover:bg-muted",
        s.repoOnly && "border-dashed",
        className,
      )}
    >
      <span className="font-mono text-[10px] text-muted-foreground">{s.n ?? "+"}</span>
      {s.name}
    </Link>
  );
}

/** "If you remember one thing" box at the end of a zoom level. */
export function Remember({ children }: { children: ReactNode }) {
  return (
    <aside className="flex gap-3 rounded-xl border-2 border-foreground/80 bg-card p-4">
      <span aria-hidden className="text-2xl leading-none">
        📌
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">If you remember one thing</p>
        <div className="font-medium">{children}</div>
      </div>
    </aside>
  );
}

/** A small note about where the chart and the repo differ. */
export function RepoNote({ children, title = "Chart vs. repo" }: { children: ReactNode; title?: string }) {
  return (
    <aside className="rounded-lg border border-dashed bg-muted/30 p-3 text-sm text-muted-foreground">
      <span className="font-semibold text-foreground">{title}: </span>
      {children}
    </aside>
  );
}

export function Ext({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn("inline-flex items-center gap-1 underline underline-offset-4 hover:text-foreground", className)}
    >
      {children}
      <ExternalLink className="size-3 shrink-0" aria-hidden />
    </a>
  );
}

/** A label as it appears on GitHub. */
export function Label({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "good" | "bad" | "wait" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-xs whitespace-nowrap",
        tone === "plain" && "bg-card",
        tone === "good" && "border-emerald-600/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
        tone === "bad" && "border-destructive/40 bg-destructive/10 text-destructive",
        tone === "wait" && "border-amber-600/40 bg-amber-500/10 text-amber-800 dark:text-amber-300",
      )}
    >
      {children}
    </span>
  );
}

/** The marks legend, compact. */
export function MarkLegend({ marks = ["decides", "supervises", "agent", "plain"] }: { marks?: Mark[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
      {marks.map((m) => (
        <li key={m} className="flex items-center gap-1.5">
          <MarkDot mark={m} />
          {MARK_TEXT[m].name}
        </li>
      ))}
      <li className="flex items-center gap-1.5">
        <Flag className="size-3 text-destructive" aria-hidden />
        Gate (approval)
      </li>
    </ul>
  );
}
