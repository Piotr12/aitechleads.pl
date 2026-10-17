/**
 * The ten stages as one rail, with the gates under them and the story's chapters as numbered stops.
 * Ten equal columns fit a 375px screen; the stage names appear from `sm` up.
 */
import Link from "@/app/docs4/_components/link";
import { STAGES, chaptersForStage, gatesForStage, href, type StageId } from "../_data";
import { cx, GateFlag } from "./ui";

export function StageRail({
  active = [],
  chapter,
  showChapters = true,
  caption,
}: {
  active?: StageId[];
  /** Number of the current chapter, highlighted among the stops. */
  chapter?: number;
  showChapters?: boolean;
  caption?: string;
}) {
  const activeStages = STAGES.filter((s) => active.includes(s.id));
  return (
    <figure className="flex flex-col gap-2 rounded-2xl border bg-card p-3 sm:p-4">
      <div className="grid grid-cols-10 gap-1 text-[10px] font-medium">
        <div className="truncate rounded border border-dashed border-sky-500/60 bg-sky-500/10 px-1 py-0.5 text-center text-sky-800 dark:text-sky-300">
          <span className="hidden sm:inline">product</span>
          <span className="sm:hidden">P</span>
        </div>
        <div className="col-span-9 truncate rounded border border-dashed border-amber-600/60 bg-amber-500/10 px-1 py-0.5 text-center text-amber-800 dark:text-amber-300">
          delivery layer
        </div>
      </div>

      <ol className="grid grid-cols-10 gap-1">
        {STAGES.map((s) => {
          const on = active.includes(s.id);
          const gates = gatesForStage(s.id);
          return (
            <li key={s.id} className="min-w-0">
              <Link
                href={href.stage(s.id)}
                title={`${s.number}. ${s.name}`}
                className={cx(
                  "flex h-full min-w-0 flex-col items-center gap-1 rounded-lg px-0.5 py-1.5 text-center transition-colors hover:bg-muted",
                  on && "bg-foreground/[0.07] ring-1 ring-foreground/30",
                )}
              >
                <span
                  className={cx(
                    "flex size-6 items-center justify-center rounded-full border font-mono text-[11px]",
                    on ? "border-foreground bg-foreground text-background" : "text-muted-foreground",
                  )}
                >
                  {s.number}
                </span>
                <span className={cx("hidden w-full truncate text-[11px] leading-tight sm:block", on && "font-semibold")}>
                  {s.short}
                </span>
                <span className="flex min-h-4 flex-wrap justify-center gap-0.5">
                  {gates.map((g) => (
                    <GateFlag key={g.id} id={g.id} plain />
                  ))}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      {showChapters && (
        <div className="grid grid-cols-10 gap-1 border-t pt-2" aria-label="Chapters of the story, by stage">
          {STAGES.map((s) => (
            <div key={s.id} className="flex min-w-0 flex-wrap content-start justify-center gap-0.5">
              {chaptersForStage(s.id).map((c) => (
                <Link
                  key={c.slug}
                  href={href.chapter(c.slug)}
                  title={`Chapter ${c.number}: ${c.title}`}
                  aria-current={c.number === chapter ? "step" : undefined}
                  className={cx(
                    "flex size-5 items-center justify-center rounded-full font-mono text-[10px] transition-colors",
                    c.number === chapter
                      ? "bg-red-600 text-white dark:bg-red-500"
                      : "border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {c.number}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}

      {(caption || activeStages.length > 0) && (
        <figcaption className="text-xs text-muted-foreground">
          {activeStages.length > 0 && (
            <span className="font-medium text-foreground">
              {activeStages.map((s) => `${s.number}. ${s.name}`).join(" → ")}
            </span>
          )}
          {activeStages.length > 0 && caption ? " · " : ""}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
