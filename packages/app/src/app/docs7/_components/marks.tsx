import type { ReactNode } from "react";
import { Bot, Diamond, ExternalLink, Lightbulb, MessagesSquare } from "lucide-react";
import { cn } from "./cx";
import Link from "./link";
import { LABEL_BY_NAME, type LabelGroup } from "../_data/labels";
import { skill as getSkill, type Kind } from "../_data/skills";
import { PERSON, type PersonId } from "../_data/story";

/** Small, reusable marks: skill chips, label chips, people, commands, artefacts and the end-of-chapter box. */

export function Cmd({ children, className }: { children: ReactNode; className?: string }) {
  // Short commands and flags (--dry-run, qaGate) never break at their hyphens; long ones wrap as needed.
  const short = typeof children === "string" && children.length <= 24;
  return (
    <code
      className={cn(
        "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]",
        short ? "whitespace-nowrap" : "break-words",
        className,
      )}
    >
      {children}
    </code>
  );
}

export function KindIcon({ kind, className }: { kind: Kind; className?: string }) {
  return kind === "auto" ? (
    <Bot className={cn("size-3.5 shrink-0", className)} aria-label="autonomous" />
  ) : (
    <MessagesSquare className={cn("size-3.5 shrink-0", className)} aria-label="interactive" />
  );
}

/** A skill, styled by kind: filled = autonomous, outlined = interactive. Links to its entry in the skills list. */
export function SkillChip({ name, fresh, muted }: { name: string; fresh?: boolean; muted?: boolean }) {
  const s = getSkill(name);
  return (
    <Link
      href={`/docs7/skills#${name}`}
      title={s.does}
      className={cn(
        "inline-flex max-w-full items-center gap-1 self-start rounded-md border px-1.5 py-0.5 font-mono text-[12px] leading-5 break-words transition-colors",
        s.kind === "auto"
          ? "border-foreground bg-foreground text-background hover:bg-foreground/85"
          : "border-foreground/40 bg-background text-foreground hover:bg-muted",
        fresh && "ring-2 ring-amber-500 ring-offset-1 ring-offset-background",
        muted && "opacity-60",
      )}
    >
      <KindIcon kind={s.kind} />
      <span className="min-w-0">{name}</span>
    </Link>
  );
}

const LABEL_TONE: Record<LabelGroup, string> = {
  pipeline: "border-sky-600/50 bg-sky-600/10 text-sky-900 dark:text-sky-200",
  category: "border-zinc-500/40 bg-zinc-500/10 text-zinc-800 dark:text-zinc-200",
  meta: "border-amber-600/50 bg-amber-500/10 text-amber-900 dark:text-amber-200",
  priority: "border-violet-600/50 bg-violet-600/10 text-violet-900 dark:text-violet-200",
  risk: "border-rose-600/50 bg-rose-600/10 text-rose-900 dark:text-rose-200",
  human: "border-zinc-500/40 bg-background text-foreground",
};

/** A GitHub-style label pill, coloured by its group (pipeline, category, meta, priority, risk). */
export function LabelChip({ name, className }: { name: string; className?: string }) {
  const info = LABEL_BY_NAME[name];
  return (
    <span
      title={info?.means}
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0 font-mono text-[12px] leading-5 whitespace-nowrap",
        LABEL_TONE[info?.group ?? "human"],
        className,
      )}
    >
      {name}
    </span>
  );
}

export function Avatar({ id, size = "md" }: { id: PersonId; size?: "sm" | "md" }) {
  const p = PERSON[id];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        p.tone,
        size === "sm" ? "size-5 text-[10px]" : "size-8 text-sm",
      )}
    >
      {p.initial}
    </span>
  );
}

export function PersonTag({ id }: { id: PersonId }) {
  const p = PERSON[id];
  return (
    <span className="inline-flex items-center gap-1.5 align-middle">
      <Avatar id={id} size="sm" />
      <span className="font-medium">{p.name}</span>
      <span className="text-muted-foreground">({p.role.toLowerCase()})</span>
    </span>
  );
}

export function Cast({ ids }: { ids: PersonId[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="People in this chapter">
      {ids.map((id) => {
        const p = PERSON[id];
        return (
          <li key={id}>
            <Link
              href={`/docs7/people/${id}`}
              className="flex items-center gap-2 rounded-full border bg-card py-1 pr-3 pl-1 text-sm hover:bg-muted"
            >
              <Avatar id={id} size="sm" />
              <span className="font-medium">{p.name}</span>
              <span className="text-muted-foreground">{p.role}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** A human decision point: the one shape (a diamond) the guide uses for "a person must decide here". */
export function DecisionMark({ className }: { className?: string }) {
  return <Diamond className={cn("size-3.5 shrink-0 fill-rose-600 text-rose-600", className)} aria-label="person decides" />;
}

export function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-baseline gap-1 underline underline-offset-2 hover:text-foreground"
    >
      {children}
      <ExternalLink className="size-3 shrink-0 self-center" aria-hidden />
    </a>
  );
}

export function SectionTitle({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="text-xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

export function Story({ children }: { children: ReactNode }) {
  return <div className="flex max-w-prose flex-col gap-4 text-[1.02rem] leading-7">{children}</div>;
}

/**
 * An example of something a skill posts or writes. Always labelled as illustrative: the shapes follow the
 * skills' templates, the content is invented.
 */
export function Artefact({
  title,
  where,
  children,
  className,
}: {
  title: ReactNode;
  where: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn("flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card", className)}>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2 text-xs">
        <span className="font-medium">{title}</span>
        <span className="text-muted-foreground">
          {where} · <em>illustrative</em>
        </span>
      </figcaption>
      <pre className="overflow-x-auto p-3 font-mono text-[12.5px] leading-5 whitespace-pre-wrap break-words">
        {children}
      </pre>
    </figure>
  );
}

/** The end-of-chapter box: what the reader can now say or do. */
export function Know({ items }: { items: ReactNode[] }) {
  return (
    <section
      aria-label="What you now know"
      className="flex flex-col gap-3 rounded-xl border-2 border-amber-500/60 bg-amber-500/5 p-4 sm:p-5"
    >
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <Lightbulb className="size-4 text-amber-600" aria-hidden />
        What you now know
      </h2>
      <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[0.97rem] leading-6">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </section>
  );
}

export function Callout({ title, children, tone = "info" }: { title: ReactNode; children: ReactNode; tone?: "info" | "warn" }) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-1.5 rounded-xl border p-4 text-sm leading-6",
        tone === "warn" ? "border-rose-600/40 bg-rose-600/5" : "bg-muted/40",
      )}
    >
      <p className="font-semibold">{title}</p>
      <div className="text-muted-foreground [&_strong]:text-foreground">{children}</div>
    </aside>
  );
}

/** A caption under a diagram: one sentence that says what the picture shows. */
export function Caption({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function Figure({ title, caption, children }: { title: ReactNode; caption?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex min-w-0 flex-col gap-3">
      <SectionTitle>{title}</SectionTitle>
      {children}
      {caption && <Caption>{caption}</Caption>}
    </section>
  );
}
