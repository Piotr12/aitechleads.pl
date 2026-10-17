/** The ten stages as a picture: a rail on desktop, a vertical line on phones. */
import Link from "next/link";
import { STAGES, type StageId } from "../_data/stages";
import { cn } from "./cx";

function GateFlags({ gates }: { gates: string[] }) {
  if (gates.length === 0) return null;
  return (
    <span className="flex flex-wrap justify-center gap-1">
      {gates.map((g) => (
        <span
          key={g}
          title={`Approval gate ${g}`}
          className="inline-flex items-center gap-0.5 rounded bg-red-500/15 px-1 font-mono text-[10px] font-semibold text-red-700 dark:text-red-300"
        >
          ⚑ {g}
        </span>
      ))}
    </span>
  );
}

/** Big rail for overview pages. */
export function StageRail({ current }: { current?: StageId }) {
  return (
    <div className="rounded-2xl border bg-card p-4 sm:p-6">
      {/* Desktop: one row of ten stops */}
      <div className="hidden lg:block">
        <div className="mb-3 grid grid-cols-10 gap-2 text-center text-[11px] font-medium">
          <div className="rounded-md border border-dashed border-sky-500/60 bg-sky-500/5 py-1 text-sky-800 dark:text-sky-300">
            product layer
          </div>
          <div className="col-span-9 rounded-md border border-dashed border-amber-600/60 bg-amber-500/5 py-1 text-amber-800 dark:text-amber-300">
            delivery layer
          </div>
        </div>
        <ol className="relative grid grid-cols-10 gap-2">
          <span aria-hidden className="absolute top-5 right-[5%] left-[5%] h-0.5 bg-border" />
          {STAGES.map((s) => {
            const active = s.id === current;
            return (
              <li key={s.id} className="relative">
                <Link
                  href={`/docs3/story/${s.id}`}
                  className="group flex flex-col items-center gap-1.5 text-center"
                >
                  <span
                    className={cn(
                      "relative z-10 flex size-10 items-center justify-center rounded-full border-2 bg-background text-lg transition-transform group-hover:scale-110",
                      active ? "border-foreground ring-4 ring-foreground/15" : "border-border",
                    )}
                  >
                    <span aria-hidden>{s.emoji}</span>
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{s.n}</span>
                  <span className={cn("text-xs leading-tight font-medium", active && "underline underline-offset-4")}>
                    {s.name}
                  </span>
                  <GateFlags gates={s.gates} />
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Phones and tablets: a vertical line */}
      <ol className="relative flex flex-col gap-1 lg:hidden">
        <span aria-hidden className="absolute top-4 bottom-4 left-[19px] w-0.5 bg-border" />
        {STAGES.map((s) => {
          const active = s.id === current;
          return (
            <li key={s.id} className="relative">
              {(s.n === 1 || s.n === 2) && (
                <p
                  className={cn(
                    "mb-1 ml-12 text-[11px] font-medium",
                    s.n === 1 ? "text-sky-700 dark:text-sky-300" : "mt-2 text-amber-700 dark:text-amber-300",
                  )}
                >
                  {s.n === 1 ? "Product layer" : "Delivery layer"}
                </p>
              )}
              <Link href={`/docs3/story/${s.id}`} className="flex items-center gap-3 rounded-lg py-1 pr-2 hover:bg-muted/50">
                <span
                  className={cn(
                    "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 bg-background text-lg",
                    active ? "border-foreground ring-4 ring-foreground/15" : "border-border",
                  )}
                >
                  <span aria-hidden>{s.emoji}</span>
                </span>
                <span className="flex flex-1 flex-col">
                  <span className={cn("text-sm font-medium", active && "underline underline-offset-4")}>
                    <span className="mr-1.5 font-mono text-xs text-muted-foreground">{s.n}</span>
                    {s.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{s.question}</span>
                </span>
                <GateFlags gates={s.gates} />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Compact, scrollable strip for the top of a story page. */
export function StageStrip({ current }: { current: StageId }) {
  const idx = STAGES.findIndex((s) => s.id === current);
  return (
    <nav aria-label="Story progress" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ol className="flex min-w-max items-center gap-1">
        {STAGES.map((s, i) => {
          const active = s.id === current;
          const done = i < idx;
          return (
            <li key={s.id} className="flex items-center gap-1">
              <Link
                href={`/docs3/story/${s.id}`}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs whitespace-nowrap transition-colors",
                  active && "border-foreground bg-foreground text-background",
                  done && !active && "bg-muted text-foreground",
                  !active && !done && "text-muted-foreground hover:bg-muted/50",
                )}
              >
                <span aria-hidden>{s.emoji}</span>
                <span className={cn(!active && "hidden sm:inline")}>{s.name}</span>
                {s.gates.length > 0 && (
                  <span className={cn("font-mono text-[10px]", active ? "text-red-500" : "text-red-600 dark:text-red-400")}>
                    ⚑
                  </span>
                )}
              </Link>
              {i < STAGES.length - 1 && <span aria-hidden className="h-px w-2 bg-border" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
