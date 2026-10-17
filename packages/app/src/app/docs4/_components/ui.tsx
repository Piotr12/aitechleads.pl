/** Small building blocks shared by every /docs4 page. */
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import Link from "@/app/docs4/_components/link";
import {
  href,
  isSkillId,
  roleById,
  type GateId,
  type Mode,
  type RoleId,
  type SkillId,
} from "../_data";
import type { Presence } from "../_data/story";

const UPSTREAM_LINK = "https://github.com/open-mercato/skills";

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/* ───────────────────────────── navigation ───────────────────────────── */

export type Part = "home" | "story" | "overview" | "perspectives" | "details";

const PARTS: { id: Part; label: string; n?: string; href: string }[] = [
  { id: "story", n: "1", label: "The story", href: href.story },
  { id: "overview", n: "2", label: "30,000 feet", href: href.overview },
  { id: "perspectives", n: "3", label: "Perspectives", href: href.perspectives },
  { id: "details", n: "4", label: "Details", href: href.details },
];

export function SectionNav({ part }: { part: Part }) {
  return (
    <nav aria-label="Guide sections" className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        <Link href={href.home} className="font-medium text-foreground hover:underline">
          One appointment, ten stages
        </Link>{" "}
        · a story-led guide to the{" "}
        <a href={UPSTREAM_LINK} target="_blank" rel="noreferrer" className="underline underline-offset-2">
          open-mercato/skills
        </a>{" "}
        AI SDLC
      </p>
      <ol className="flex flex-wrap gap-1.5">
        {PARTS.map((p) => {
          const active = p.id === part;
          return (
            <li key={p.id}>
              <Link
                href={p.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors",
                  active ? "border-foreground bg-foreground text-background" : "hover:bg-muted",
                )}
              >
                <span className={cx("font-mono", active ? "text-background/70" : "text-muted-foreground")}>{p.n}</span>
                {p.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3">
      {eyebrow && <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>}
      <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
      {lead && <p className="max-w-3xl text-lg text-muted-foreground">{lead}</p>}
      {children}
    </header>
  );
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h2 className="text-xl font-semibold tracking-tight">{children}</h2>
      {aside}
    </div>
  );
}

type Target = { href: string; label: string; hint?: string };

export function PrevNext({ prev, next }: { prev?: Target; next?: Target }) {
  return (
    <nav aria-label="Previous and next" className="grid grid-cols-1 gap-3 border-t pt-6 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
            {prev.hint ?? "Previous"}
          </span>
          <span className="font-medium break-words">{prev.label}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next && (
        <Link
          href={next.href}
          className="group flex min-w-0 flex-col items-end gap-1 rounded-xl border bg-card p-4 text-right transition-colors hover:bg-muted/50"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            {next.hint ?? "Next"}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
          <span className="font-medium break-words">{next.label}</span>
        </Link>
      )}
    </nav>
  );
}

/* ───────────────────────────── prose ───────────────────────────── */

/** A paragraph where `backticks` become code, and `om-…` skill names link to the skills index. */
export function Prose({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/`([^`]+)`/g);
  return (
    <p className={cx("break-words", className)}>
      {parts.map((part, i) => {
        if (i % 2 === 0) return part;
        const name = part.split(" ")[0];
        if (isSkillId(name)) {
          return (
            <Link
              key={i}
              href={href.skill(name)}
              className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] break-words underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-foreground"
            >
              {part}
            </Link>
          );
        }
        return (
          <code key={i} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] break-words">
            {part}
          </code>
        );
      })}
    </p>
  );
}

export function Callout({
  title,
  children,
  tone = "note",
}: {
  title: string;
  children: ReactNode;
  tone?: "note" | "plain";
}) {
  return (
    <aside
      className={cx(
        "flex gap-3 rounded-xl border p-4 text-sm",
        tone === "note" ? "border-sky-500/30 bg-sky-500/5" : "bg-card",
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="font-medium">{title}</p>
        <div className="text-muted-foreground">{children}</div>
      </div>
    </aside>
  );
}

/* ───────────────────────────── marks ───────────────────────────── */

export const MODE_LABEL: Record<Mode | Presence | "agent", string> = {
  decides: "A person decides (at a gate)",
  supervises: "A person supervises: the agent works, a person can take over",
  agent: "An agent carries out delegated work",
  none: "Consulted or informed",
  consulted: "Consulted",
  informed: "Informed",
};

/** The chart's dots: red = decides, dark = supervises, hollow = agent. */
export function Dot({ kind, className }: { kind: "decides" | "supervises" | "agent"; className?: string }) {
  return (
    <span
      role="img"
      aria-label={MODE_LABEL[kind]}
      title={MODE_LABEL[kind]}
      className={cx(
        "inline-block size-2.5 shrink-0 rounded-full",
        kind === "decides" && "bg-red-600 dark:bg-red-500",
        kind === "supervises" && "bg-foreground",
        kind === "agent" && "border-[1.5px] border-foreground/70",
        className,
      )}
    />
  );
}

/** A presence in a chapter: a dot, or a C / I letter. */
export function PresenceMark({ as }: { as: Presence }) {
  if (as === "decides" || as === "supervises") return <Dot kind={as} />;
  return (
    <span
      title={MODE_LABEL[as]}
      className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full border font-mono text-[8px] leading-none text-muted-foreground"
    >
      {as === "consulted" ? "C" : "I"}
    </span>
  );
}

export function Legend({ className }: { className?: string }) {
  return (
    <ul className={cx("flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground", className)}>
      <li className="flex items-center gap-1.5">
        <Dot kind="decides" /> a person decides
      </li>
      <li className="flex items-center gap-1.5">
        <Dot kind="supervises" /> a person supervises, can take over
      </li>
      <li className="flex items-center gap-1.5">
        <Dot kind="agent" /> an agent does the delegated work
      </li>
      <li className="flex items-center gap-1.5">
        <PresenceMark as="consulted" /> consulted
      </li>
      <li className="flex items-center gap-1.5">
        <PresenceMark as="informed" /> informed
      </li>
      <li className="flex items-center gap-1.5">
        <GateFlag id="G1" plain /> approval gate
      </li>
    </ul>
  );
}

export function GateFlag({ id, plain }: { id: GateId; plain?: boolean }) {
  const cls =
    "inline-flex items-center rounded bg-red-600/10 px-1 font-mono text-[10px] font-semibold leading-4 text-red-700 dark:bg-red-500/15 dark:text-red-300";
  if (plain) return <span className={cls}>{id}</span>;
  return (
    <Link href={href.gate(id)} title={`Approval gate ${id}`} className={cx(cls, "hover:underline")}>
      {id}
    </Link>
  );
}

export function SkillChip({ id, muted }: { id: SkillId; muted?: boolean }) {
  return (
    <Link
      href={href.skill(id)}
      className={cx(
        "inline-flex max-w-full items-center rounded-md border px-1.5 py-0.5 font-mono text-xs break-all hover:bg-muted",
        muted ? "text-muted-foreground" : "bg-card",
      )}
    >
      {id}
    </Link>
  );
}

/* ───────────────────────────── people ───────────────────────────── */

export const ROLE_TONE: Record<RoleId, string> = {
  "product-owner": "bg-sky-600 text-white dark:bg-sky-500",
  "domain-expert": "bg-violet-600 text-white dark:bg-violet-500",
  architect: "bg-amber-600 text-white dark:bg-amber-500 dark:text-black",
  designer: "bg-pink-600 text-white dark:bg-pink-500",
  developer: "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-black",
  qa: "bg-orange-600 text-white dark:bg-orange-500 dark:text-black",
  maintainer: "bg-slate-700 text-white dark:bg-slate-300 dark:text-black",
};

export function Avatar({
  role,
  size = "md",
  dim,
}: {
  role: RoleId;
  size?: "sm" | "md" | "lg";
  dim?: boolean;
}) {
  const r = roleById(role);
  return (
    <span
      title={`${r.person} · ${r.name}`}
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        size === "sm" && "size-6 text-[10px]",
        size === "md" && "size-9 text-xs",
        size === "lg" && "size-14 text-base",
        dim ? "bg-muted text-muted-foreground/60" : ROLE_TONE[role],
      )}
    >
      {r.initials}
    </span>
  );
}

export function AgentBadge({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span
      title="An agent"
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-full border-2 border-dashed border-foreground/40 font-mono text-muted-foreground",
        size === "sm" ? "size-6 text-[9px]" : "size-9 text-[10px]",
      )}
    >
      om
    </span>
  );
}

export function ExternalLink({ path, children }: { path: string; children: ReactNode }) {
  return (
    <a
      href={`${UPSTREAM_LINK}/blob/main/${path}`}
      target="_blank"
      rel="noreferrer"
      className="break-words underline underline-offset-2 hover:text-foreground"
    >
      {children}
    </a>
  );
}
