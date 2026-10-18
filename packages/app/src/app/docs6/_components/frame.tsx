import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "./link";
import { cn } from "./cx";
import { GUIDE, PARTS, position } from "../_data/nav";

/**
 * Every page sits in this frame: the "where am I" bar (the seven parts, then the pages of the current part),
 * the page header with its one idea, the content, and back/next along the reading order.
 * Server-only: each page passes its own href.
 */
export function Frame({
  href,
  kicker,
  title,
  idea,
  lead,
  children,
}: {
  href: string;
  kicker?: ReactNode;
  title: ReactNode;
  /** The one idea this page carries, shown as a highlighted sentence. */
  idea?: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
}) {
  const pos = position(href);
  const stepLabel =
    pos.inPart.length > 1
      ? `${pos.part.emoji} ${pos.part.name} · page ${pos.indexInPart + 1} of ${pos.inPart.length}`
      : `${pos.part.emoji} ${pos.part.name}`;

  return (
    <div className="mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
      <WhereAmI href={href} />

      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{kicker ?? stepLabel}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-balance break-words sm:text-4xl">{title}</h1>
        {idea && (
          <p className="max-w-3xl border-l-4 border-foreground pl-3 text-lg font-medium text-pretty">{idea}</p>
        )}
        {lead && <div className="max-w-3xl text-base leading-relaxed text-muted-foreground">{lead}</div>}
      </header>

      <main className="flex min-w-0 flex-col gap-10">{children}</main>

      <nav aria-label="Previous and next page" className="grid grid-cols-1 gap-3 border-t pt-6 sm:grid-cols-2">
        {pos.prev ? (
          <Link
            href={pos.prev.href}
            className="group flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
              Back
            </span>
            <span className="font-medium break-words">{pos.prev.title}</span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {pos.next && (
          <Link
            href={pos.next.href}
            className="group flex min-w-0 flex-col items-end gap-1 rounded-xl border-2 border-foreground/70 bg-card p-4 text-right transition-colors hover:bg-muted/50"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              Next
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
            <span className="font-medium break-words">{pos.next.title}</span>
          </Link>
        )}
      </nav>
    </div>
  );
}

function WhereAmI({ href }: { href: string }) {
  const pos = position(href);
  const pct = Math.round(((pos.index + 1) / pos.total) * 100);

  return (
    <div className="z-10 -mx-4 flex flex-col gap-2 border-b bg-background/95 px-4 py-2 backdrop-blur sm:sticky sm:top-0 sm:-mx-6 sm:px-6">
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
        <Link href="/docs6" className="mr-2 text-sm font-semibold whitespace-nowrap hover:underline">
          📦 {GUIDE}
        </Link>
        <nav aria-label="Parts of the guide" className="min-w-0">
          <ol className="flex flex-wrap gap-1">
            {PARTS.map((p, i) => {
              const active = p.id === pos.part.id;
              return (
                <li key={p.id}>
                  <Link
                    href={p.href}
                    aria-current={active ? "location" : undefined}
                    title={`${p.name}: ${p.blurb}`}
                    aria-label={`Part ${i + 1}: ${p.name}`}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs whitespace-nowrap transition-colors",
                      active
                        ? "bg-foreground font-semibold text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span className="tabular-nums opacity-60">{i + 1}</span>
                    <span className={active ? undefined : "hidden sm:inline"}>{p.name}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {pos.inPart.length > 1 && (
        <nav aria-label={`Pages in ${pos.part.name}`} className="flex flex-wrap items-center gap-1">
          {pos.inPart.map((p, i) => {
            const here = p.href === href;
            const done = i < pos.indexInPart;
            return (
              <Link
                key={p.href}
                href={p.href}
                title={p.title}
                aria-label={p.title}
                aria-current={here ? "page" : undefined}
                className={cn(
                  "flex h-6 min-w-6 items-center justify-center rounded-md px-1 text-[11px] font-medium tabular-nums transition-colors",
                  here && "max-w-full truncate bg-foreground px-2 text-background",
                  !here && done && "bg-muted text-foreground hover:bg-muted/70",
                  !here && !done && "border text-muted-foreground hover:bg-muted",
                )}
              >
                {here ? `${i + 1} · ${shortTitle(p.title)}` : i + 1}
              </Link>
            );
          })}
        </nav>
      )}

      <div className="flex items-center gap-2">
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
          <div className="h-full bg-foreground/60" style={{ width: `${pct}%` }} />
        </div>
        <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
          {pos.index + 1}/{pos.total}
        </span>
      </div>
    </div>
  );
}

function shortTitle(title: string): string {
  const cut = title.replace(/^\d+\. /, "");
  return cut.length > 30 ? `${cut.slice(0, 28)}…` : cut;
}
