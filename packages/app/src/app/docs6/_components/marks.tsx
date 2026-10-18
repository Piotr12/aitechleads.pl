import type { ReactNode } from "react";
import { Bot, ExternalLink, Hand, Info, User, Users } from "lucide-react";
import Link from "./link";
import { cn } from "./cx";
import { Md } from "./md";
import { labelGroup } from "../_data/labels";
import { SKILL_BY_NAME, skillUrl } from "../_data/skills";

/* ---------- colours with meaning (the same everywhere) ---------- */

export const PERSON = "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-100";
export const AGENT = "border-sky-300 bg-sky-50 text-sky-950 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-100";
export const DECIDE = "border-rose-300 bg-rose-50 text-rose-950 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-100";

export type Holder = "person" | "agent" | "both";

export function HolderIcon({ holder, className }: { holder: Holder; className?: string }) {
  const Icon = holder === "person" ? User : holder === "agent" ? Bot : Users;
  return <Icon className={cn("size-4 shrink-0", className)} aria-hidden />;
}

export function HolderBadge({ holder, children }: { holder: Holder; children?: ReactNode }) {
  const text = children ?? (holder === "person" ? "a person" : holder === "agent" ? "an agent" : "a person and an agent");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        holder === "person" ? PERSON : holder === "agent" ? AGENT : "border-foreground/20 bg-muted",
      )}
    >
      <HolderIcon holder={holder} className="size-3.5" />
      {text}
    </span>
  );
}

export function DecideBadge({ children = "a person decides" }: { children?: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", DECIDE)}>
      <Hand className="size-3.5" aria-hidden />
      {children}
    </span>
  );
}

/** Legend for the three colours. */
export function ColourKey() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span>Key:</span>
      <HolderBadge holder="person">a person holds it</HolderBadge>
      <HolderBadge holder="agent">an agent holds it</HolderBadge>
      <DecideBadge>a person must decide</DecideBadge>
    </div>
  );
}

/* ---------- labels, skills, commands ---------- */

export function LabelChip({ name, struck }: { name: string; struck?: boolean }) {
  const g = labelGroup(name);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-xs whitespace-nowrap",
        g === "pipeline" && "border-foreground/60 bg-foreground text-background",
        g === "meta" && "border-dashed border-foreground/40",
        (g === "category" || g === "priority" || g === "risk") && "border-foreground/25 bg-muted/60",
        struck && "line-through opacity-50",
      )}
      title={`${g} label`}
    >
      {name}
    </span>
  );
}

export function LabelRow({ labels }: { labels: string[] }) {
  return (
    <span className="flex flex-wrap gap-1">
      {labels.map((l) => (
        <LabelChip key={l} name={l} />
      ))}
    </span>
  );
}

export function LabelKey() {
  return (
    <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span>Labels:</span>
      <LabelChip name="review" /> pipeline (one at a time)
      <LabelChip name="needs-qa" /> meta (signals)
      <LabelChip name="feature" /> category, priority, risk
    </p>
  );
}

/** A skill name that links to its SKILL.md upstream. */
export function SkillChip({ name, plain }: { name: string; plain?: boolean }) {
  const s = SKILL_BY_NAME[name];
  return (
    <a
      href={skillUrl(name)}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex max-w-full items-center gap-1 font-mono text-[0.85em] [overflow-wrap:anywhere] underline-offset-2 hover:underline",
        !plain && "rounded-md border px-1.5 py-0.5",
        !plain && (s?.kind === "auto" ? AGENT : "border-foreground/25 bg-card"),
      )}
      title={s ? `${s.kind === "auto" ? "Autonomous" : "Interactive"}: ${s.one.replaceAll("`", "")}` : name}
    >
      {!plain && s?.kind === "auto" && <Bot className="size-3 shrink-0" aria-hidden />}
      {name}
    </a>
  );
}

/** A command a person types, or a line a skill prints. */
export function Cmd({ children, who }: { children: string; who?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      {who && <span className="text-xs text-muted-foreground">{who}</span>}
      <pre className="overflow-x-auto rounded-lg border bg-muted/50 px-3 py-2 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words">
        {children}
      </pre>
    </div>
  );
}

/* ---------- framing blocks ---------- */

/** An illustrative artefact: shaped like what the skills produce, but invented. */
export function Specimen({ title, kind, children }: { title: string; kind: string; children: string }) {
  return (
    <figure className="flex min-w-0 flex-col overflow-hidden rounded-xl border-2 border-dashed border-foreground/25 bg-card">
      <figcaption className="flex items-start justify-between gap-2 border-b border-dashed border-foreground/25 bg-muted/40 px-3 py-2 text-xs">
        <span className="min-w-0 flex-1 font-medium">
          {kind} · <span className="text-muted-foreground">{title}</span>
        </span>
        <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
          Illustrative
        </span>
      </figcaption>
      <pre className="overflow-x-auto px-3 py-3 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap break-words">
        {children}
      </pre>
    </figure>
  );
}

export function Callout({ title, children, tone = "info" }: { title?: string; children: ReactNode; tone?: "info" | "decide" }) {
  return (
    <aside
      className={cn(
        "flex min-w-0 gap-3 rounded-xl border p-4 text-sm",
        tone === "decide" ? DECIDE : "bg-muted/40",
      )}
    >
      {tone === "decide" ? <Hand className="mt-0.5 size-4 shrink-0" aria-hidden /> : <Info className="mt-0.5 size-4 shrink-0" aria-hidden />}
      <div className="flex min-w-0 flex-col gap-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="flex flex-col gap-2 leading-relaxed">{children}</div>
      </div>
    </aside>
  );
}

export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed marker:text-muted-foreground">
      {items.map((t) => (
        <li key={t}>
          <Md text={t} />
        </li>
      ))}
    </ul>
  );
}

export function Source({ path, children }: { path: string; children?: ReactNode }) {
  return (
    <a
      href={`https://github.com/open-mercato/skills/blob/main/${path}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
    >
      <ExternalLink className="size-3" aria-hidden />
      {children ?? path}
    </a>
  );
}

export function InternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-medium underline underline-offset-2 hover:text-muted-foreground">
      {children}
    </Link>
  );
}
