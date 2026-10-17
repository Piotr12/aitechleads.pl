/** Small presentational pieces shared by every docs3 page. */
import Link from "@/app/docs3/_components/link";
import type { ReactNode } from "react";
import { cn } from "./cx";
import { ROLE_BY_ID, type RoleId } from "../_data/roles";
import type { HumanMark, RaciLetter } from "../_data/raci";
import { SKILLS, skillUrl, type SkillName } from "../_data/skills";
import { TERM_BY_ID } from "../_data/glossary";

// ── Dots from the chart legend ──────────────────────────────────────

export function MarkDot({ mark, className }: { mark: HumanMark | "agent"; className?: string }) {
  const label =
    mark === "decides"
      ? "A human decides (gate)"
      : mark === "supervises"
        ? "A human supervises"
        : mark === "agent"
          ? "Agent does delegated work"
          : "Human involvement";
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn(
        "inline-block size-2.5 shrink-0 rounded-full",
        mark === "decides" && "bg-red-500",
        mark === "supervises" && "bg-foreground",
        mark === "agent" && "border-2 border-foreground/70 bg-transparent",
        mark === "plain" && "bg-muted-foreground/40",
        className,
      )}
    />
  );
}

const RACI_NAMES: Record<RaciLetter, string> = {
  R: "Responsible: does the work",
  A: "Accountable: owns the outcome",
  C: "Consulted: asked before",
  I: "Informed: told after",
};

export function RaciLetters({ letters, className }: { letters: RaciLetter[]; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)}>
      {letters.map((l) => (
        <abbr
          key={l}
          title={RACI_NAMES[l]}
          className={cn(
            "inline-flex size-5 items-center justify-center rounded font-mono text-[11px] font-semibold no-underline",
            l === "A" && "bg-foreground text-background",
            l === "R" && "bg-primary/15 text-foreground ring-1 ring-foreground/30",
            l === "C" && "bg-muted text-foreground",
            l === "I" && "bg-transparent text-muted-foreground ring-1 ring-border",
          )}
        >
          {l}
        </abbr>
      ))}
    </span>
  );
}

export function Legend({ compact = false }: { compact?: boolean }) {
  const items: { node: ReactNode; text: string }[] = [
    { node: <MarkDot mark="decides" />, text: "a human decides (at a gate)" },
    { node: <MarkDot mark="supervises" />, text: "a human supervises: the agent works, the human can take over" },
    { node: <MarkDot mark="agent" />, text: "an agent does delegated work" },
  ];
  const raci: { l: RaciLetter; t: string }[] = [
    { l: "R", t: "does the work" },
    { l: "A", t: "owns the outcome" },
    { l: "C", t: "is consulted" },
    { l: "I", t: "is informed" },
  ];
  return (
    <div className={cn("flex flex-col gap-3 rounded-xl border bg-card p-4 text-sm", compact && "p-3 text-xs")}>
      <ul className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-5">
        {items.map((i) => (
          <li key={i.text} className="flex items-center gap-2">
            {i.node}
            <span className="text-muted-foreground">{i.text}</span>
          </li>
        ))}
      </ul>
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {raci.map((r) => (
          <li key={r.l} className="flex items-center gap-1.5">
            <RaciLetters letters={[r.l]} />
            <span className="text-muted-foreground">{r.t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── People ──────────────────────────────────────────────────────────

export function RoleAvatar({ role, size = "md" }: { role: RoleId | "agent"; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "size-6 text-[10px]", md: "size-9 text-xs", lg: "size-14 text-base" };
  if (role === "agent") {
    return (
      <span
        aria-label="Agent"
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full border-2 border-dashed border-foreground/40 bg-background font-mono font-semibold text-muted-foreground",
          sizes[size],
        )}
      >
        🤖
      </span>
    );
  }
  const r = ROLE_BY_ID[role];
  return (
    <span
      aria-label={`${r.person}, ${r.title}`}
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-semibold", r.colors.solid, sizes[size])}
    >
      {r.person.slice(0, 1)}
    </span>
  );
}

export function RoleChip({ role, link = true }: { role: RoleId; link?: boolean }) {
  const r = ROLE_BY_ID[role];
  const inner = (
    <>
      <RoleAvatar role={role} size="sm" />
      <span>
        {r.person} <span className="opacity-70">· {r.title}</span>
      </span>
    </>
  );
  const cls = cn(
    "inline-flex items-center gap-1.5 rounded-full py-0.5 pr-2.5 pl-0.5 text-xs font-medium",
    r.colors.chip,
  );
  return link ? (
    <Link href={`/docs3/roles/${role}`} className={cn(cls, "hover:opacity-80")}>
      {inner}
    </Link>
  ) : (
    <span className={cls}>{inner}</span>
  );
}

// ── Skills ──────────────────────────────────────────────────────────

export function SkillChip({ name, showMode = false }: { name: SkillName; showMode?: boolean }) {
  const info = SKILLS[name];
  return (
    <a
      href={skillUrl(name)}
      target="_blank"
      rel="noreferrer"
      title={info.summary}
      className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-1.5 py-0.5 font-mono text-xs text-foreground hover:bg-muted"
    >
      {name}
      {showMode && <span className="font-sans text-[10px] text-muted-foreground">· {info.mode}</span>}
    </a>
  );
}

export function SkillCard({ name }: { name: SkillName }) {
  const info = SKILLS[name];
  return (
    <li className="flex flex-col gap-1 rounded-lg border bg-card p-3">
      <div className="flex flex-wrap items-center gap-2">
        <SkillChip name={name} />
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
            info.mode === "auto" && "bg-violet-500/15 text-violet-800 dark:text-violet-300",
            info.mode === "interactive" && "bg-sky-500/15 text-sky-800 dark:text-sky-300",
            info.mode === "building block" && "bg-muted text-muted-foreground",
          )}
        >
          {info.mode === "auto" ? "runs on its own" : info.mode === "interactive" ? "asks you, then hands back" : "used by other skills"}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{info.summary}</p>
    </li>
  );
}

// ── Terms ───────────────────────────────────────────────────────────

export function TermLink({ id, children }: { id: string; children?: ReactNode }) {
  const t = TERM_BY_ID[id];
  if (!t) return <>{children}</>;
  return (
    <Link
      href={`/docs3/glossary#${id}`}
      title={t.meaning}
      className="underline decoration-dotted underline-offset-4 hover:decoration-solid"
    >
      {children ?? t.term}
    </Link>
  );
}

// ── Layout helpers ──────────────────────────────────────────────────

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3">
      {eyebrow && <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>}
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {children && <div className="max-w-3xl text-lg text-muted-foreground">{children}</div>}
    </header>
  );
}

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn" | "tip" | "note";
  title?: string;
  children: ReactNode;
}) {
  const icon = { info: "💡", warn: "⚠️", tip: "🎯", note: "📌" }[tone];
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border p-4 text-sm",
        tone === "warn" && "border-amber-500/40 bg-amber-500/5",
        tone === "tip" && "border-emerald-500/40 bg-emerald-500/5",
        tone === "info" && "bg-muted/40",
        tone === "note" && "border-sky-500/40 bg-sky-500/5",
      )}
    >
      <span aria-hidden className="text-base leading-5">
        {icon}
      </span>
      <div className="flex flex-col gap-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-muted-foreground [&_a]:text-foreground">{children}</div>
      </div>
    </div>
  );
}

export function SectionTitle({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="scroll-mt-20 text-xl font-semibold tracking-tight sm:text-2xl">
      {children}
    </h2>
  );
}

export function IllustrativeBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-amber-500/60 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-800 uppercase dark:text-amber-300">
      Illustrative example
    </span>
  );
}
