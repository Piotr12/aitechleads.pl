import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "./link";
import { cn } from "./cx";
import { position, TRACKS } from "../_data/nav";

/**
 * Every page sits in this frame: the "where am I" bar (tracks, then the steps of the current track),
 * the page header, the content, and previous/next along the guide's reading order.
 * Server-only: the page passes its own href, so no client-side path reading is needed.
 */
export function Frame({
  href,
  kicker,
  title,
  lead,
  children,
}: {
  href: string;
  kicker?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
}) {
  const pos = position(href);
  const stepLabel =
    pos.inTrack.length > 1 ? `${pos.track.name} · ${pos.indexInTrack + 1} of ${pos.inTrack.length}` : pos.track.name;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
      <WhereAmI href={href} />

      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {kicker ?? stepLabel}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
        {lead && <div className="max-w-3xl text-lg text-muted-foreground">{lead}</div>}
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
            className="group flex min-w-0 flex-col items-end gap-1 rounded-xl border bg-card p-4 text-right transition-colors hover:bg-muted/50"
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

/** The always-visible "where am I": six tracks, then numbered steps inside the current one. */
function WhereAmI({ href }: { href: string }) {
  const pos = position(href);
  const pct = Math.round(((pos.globalIndex + 1) / pos.total) * 100);

  return (
    <div className="z-10 -mx-4 sm:sticky sm:top-0 flex flex-col gap-2 border-b bg-background/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
        <Link href="/docs5" className="mr-2 text-sm font-semibold whitespace-nowrap hover:underline">
          The AI SDLC, gently
        </Link>
        <nav aria-label="Guide tracks" className="min-w-0">
          <ol className="flex flex-wrap gap-1">
            {TRACKS.map((t) => {
              const active = t.id === pos.track.id;
              return (
                <li key={t.id}>
                  <Link
                    href={t.href}
                    aria-current={active ? "location" : undefined}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs whitespace-nowrap transition-colors",
                      active
                        ? "bg-foreground font-semibold text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span aria-hidden>{t.emoji}</span>
                    {t.name}
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {pos.inTrack.length > 1 && (
        <nav aria-label={`Pages in ${pos.track.name}`} className="flex flex-wrap items-center gap-1">
          {pos.inTrack.map((p, i) => {
            const here = p.href === href;
            const done = i < pos.indexInTrack;
            return (
              <Link
                key={p.href}
                href={p.href}
                title={p.title}
                aria-label={p.title}
                aria-current={here ? "page" : undefined}
                className={cn(
                  "flex h-6 min-w-6 items-center justify-center rounded-md px-1 text-[11px] font-medium tabular-nums transition-colors",
                  here && "bg-foreground px-2 text-background",
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

      <div className="h-0.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
        <div className="h-full bg-foreground/60" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function shortTitle(title: string): string {
  const cut = title.replace(/^(Zoom \d+: |Seat: |Stop: )/, "");
  return cut.length > 28 ? `${cut.slice(0, 26)}…` : cut;
}
