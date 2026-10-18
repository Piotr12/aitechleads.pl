import { ArrowRight, Hand } from "lucide-react";
import Link from "./link";
import { cn } from "./cx";
import { AGENT, DECIDE, HolderIcon, PERSON } from "./marks";
import { STATIONS, type StationId } from "../_data/stations";

const holderRing = (h: string) => (h === "person" ? PERSON : h === "agent" ? AGENT : "border-foreground/30 bg-muted");

/**
 * The whole trip as a metro line: one row per hand-off, coloured by who holds the work, with a hand where a
 * person must decide, and what the work is called when it leaves the stop.
 */
export function Trip({ highlight }: { highlight?: StationId }) {
  return (
    <ol className="flex flex-col">
      {STATIONS.map((s, i) => {
        const last = i === STATIONS.length - 1;
        const here = s.id === highlight;
        return (
          <li key={s.id} className="relative flex min-w-0 gap-3 sm:gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "z-[1] flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-lg",
                  holderRing(s.holder),
                  here && "ring-4 ring-foreground/30",
                )}
                aria-hidden
              >
                {s.emoji}
              </span>
              {!last && <span className="w-0.5 flex-1 bg-foreground/20" aria-hidden />}
            </div>
            <div className={cn("flex min-w-0 flex-1 flex-col gap-1.5 pb-6", last && "pb-0")}>
              <Link
                href={`/docs6/journey/${s.id}`}
                className="group flex min-w-0 flex-wrap items-baseline gap-x-2 font-medium hover:underline"
              >
                <span className="text-xs text-muted-foreground tabular-nums">Stop {s.n}</span>
                <span className="break-words">{s.title}</span>
              </Link>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 break-words">
                  {s.arrives}
                  <ArrowRight className="size-3 shrink-0" aria-hidden />
                  <strong className="font-semibold">{s.leaves}</strong>
                </span>
                <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5", holderRing(s.holder))}>
                  <HolderIcon holder={s.holder} className="size-3.5" />
                  {s.holder === "person" ? "a person" : s.holder === "agent" ? "an agent" : "person + agent"}
                </span>
                {s.decide && (
                  <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5", DECIDE)}>
                    <Hand className="size-3.5" aria-hidden />
                    <span>
                      <strong className="font-semibold">{s.decide.who.split(" (")[0].split(",")[0]}</strong> {s.decide.short}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** The compact parcel tracker on every journey page: where the work is, and what it is called now. */
export function Tracker({ current }: { current: StationId }) {
  const idx = STATIONS.findIndex((s) => s.id === current);
  const s = STATIONS[idx];
  return (
    <section aria-label="Where the work is now" className="flex flex-col gap-3 rounded-xl border bg-card p-3 sm:p-4">
      <ol className="grid grid-cols-9 gap-0.5 sm:gap-1">
        {STATIONS.map((st, i) => {
          const here = i === idx;
          const done = i < idx;
          return (
            <li key={st.id} className="flex min-w-0 flex-col items-center gap-1">
              <Link
                href={`/docs6/journey/${st.id}`}
                aria-label={`Stop ${st.n}: ${st.title}`}
                aria-current={here ? "step" : undefined}
                title={`Stop ${st.n}: ${st.title}`}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 text-sm transition-transform hover:scale-110 sm:size-9",
                  here ? cn(holderRing(st.holder), "ring-4 ring-foreground/25") : done ? "border-foreground/40 bg-muted" : "border-dashed border-foreground/25 opacity-60",
                )}
              >
                <span aria-hidden>{st.emoji}</span>
              </Link>
              <span
                className={cn(
                  "hidden max-w-full truncate text-[11px] sm:block",
                  here ? "font-semibold" : "text-muted-foreground",
                )}
              >
                {st.short}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <span className="text-muted-foreground">
          Following <em>“Bulk-archive orders from the grid”</em> (illustrative):
        </span>
        <span className="inline-flex flex-wrap items-center gap-1">
          the work arrives as <strong>{s.arrives}</strong>
          <ArrowRight className="size-3.5 shrink-0" aria-hidden />
          leaves as <strong>{s.leaves}</strong>
        </span>
      </div>
    </section>
  );
}
