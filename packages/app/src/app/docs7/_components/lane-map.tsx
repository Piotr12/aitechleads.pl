import { ArrowRight } from "lucide-react";
import { cn } from "./cx";
import Link from "./link";
import { DecisionMark, KindIcon, SkillChip } from "./marks";
import { DECISIONS, LANES, SKILLS, type Lane } from "../_data/skills";

/**
 * The guide's one growing picture: the pipeline's eight lanes. Each chapter ends with `ChapterMap` (a progress line,
 * an eight-lane strip, and only the lanes this chapter added to); /picture shows `LaneMap`, everything at once.
 * The four optional discovery skills are never counted as "met"; they appear on the whole map, marked optional.
 */

const CORE = SKILLS.filter((s) => !s.optional);

function LaneCard({ lane, index, upTo, ring }: { lane: Lane; index: number; upTo: number; ring: boolean }) {
  const all = SKILLS.filter((s) => s.lane === lane.id && (upTo === Infinity || !s.optional));
  const met = all.filter((s) => s.ch <= upTo);
  // In a chapter (ring), show only what this chapter added and count the rest; the whole map shows everything.
  const here = ring ? met.filter((s) => s.ch === upTo) : met;
  const earlier = met.length - here.length;
  const ds = DECISIONS.filter((d) => d.lane === lane.id && (ring ? d.ch === upTo : d.ch <= upTo));
  const later = all.length - met.length;
  return (
    <li className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-3">
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-semibold text-muted-foreground tabular-nums">{index + 1}</span>
        <span className="font-semibold">{lane.name}</span>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {met.length}/{all.length}
        </span>
      </div>
      <p className="-mt-1 text-xs text-muted-foreground">{lane.question}</p>
      {here.length > 0 && (
        <ul className="flex flex-wrap gap-1">
          {here.map((s) => (
            <li key={s.name} className={cn("min-w-0 max-w-full", s.optional && "rounded-md outline-1 outline-offset-1 outline-dashed outline-muted-foreground/60")}>
              <SkillChip name={s.name} />
            </li>
          ))}
        </ul>
      )}
      {ds.length > 0 && (
        <ul className="flex flex-col gap-1">
          {ds.map((d) => (
            <li key={d.id} className="flex items-start gap-1.5 text-xs leading-5">
              <DecisionMark className="mt-0.5" />
              <span className="min-w-0">{d.text}</span>
            </li>
          ))}
        </ul>
      )}
      {(earlier > 0 || later > 0) && (
        <p className="mt-auto text-xs text-muted-foreground">
          {[earlier > 0 && `${earlier} met earlier`, later > 0 && `${later} still to come`].filter(Boolean).join(" · ")}
        </p>
      )}
    </li>
  );
}

/** The whole map: every lane, every skill, every decision. Used on /picture. */
export function LaneMap() {
  return (
    <section aria-label="The whole map" className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-xl font-semibold tracking-tight">The whole map</h2>
        <p className="text-sm text-muted-foreground tabular-nums">
          {SKILLS.length} skills · {DECISIONS.length} human decisions
        </p>
      </div>
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {LANES.map((lane, i) => (
          <LaneCard key={lane.id} lane={lane} index={i} upTo={Infinity} ring={false} />
        ))}
      </ol>
      <MapLegend optional />
    </section>
  );
}

/** Eight lanes in one row, each filled by the share of its core skills met by chapter `upTo`. */
export function LaneStrip({ upTo, highlight = [] }: { upTo: number; highlight?: string[] }) {
  return (
    <ol className="grid grid-cols-4 gap-1 sm:grid-cols-8" aria-label="Lanes of the pipeline">
      {LANES.map((l, i) => {
        const all = CORE.filter((s) => s.lane === l.id);
        const met = all.filter((s) => s.ch <= upTo).length;
        const pct = Math.round((met / all.length) * 100);
        const hot = highlight.includes(l.id);
        return (
          <li
            key={l.id}
            className={cn(
              "flex min-w-0 flex-col gap-1 rounded-md border px-1.5 py-1 text-[11px] leading-4",
              hot ? "border-amber-500 bg-amber-500/10" : "bg-card",
            )}
          >
            <span className="truncate font-medium">
              <span className="text-muted-foreground tabular-nums">{i + 1}</span> {l.name}
            </span>
            <span className="h-1 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
              <span className="block h-full bg-foreground/60" style={{ width: `${pct}%` }} />
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** The end of every chapter: progress, the strip, and only the lanes this chapter added something to. */
export function ChapterMap({ upTo }: { upTo: number }) {
  const met = CORE.filter((s) => s.ch <= upTo).length;
  const decisions = DECISIONS.filter((d) => d.ch <= upTo).length;
  const touched = LANES.filter(
    (l) =>
      SKILLS.some((s) => !s.optional && s.lane === l.id && s.ch === upTo) ||
      DECISIONS.some((d) => d.lane === l.id && d.ch === upTo),
  );

  return (
    <section aria-label="The map so far" className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-xl font-semibold tracking-tight">The map so far</h2>
        <p className="text-sm text-muted-foreground tabular-nums">
          {met} of {CORE.length} core skills met · {decisions} of {DECISIONS.length} human decisions
        </p>
      </div>
      <LaneStrip upTo={upTo} highlight={touched.map((l) => l.id)} />
      <p className="text-xs text-muted-foreground">
        The bars fill as the team meets each lane&apos;s skills. What this chapter added, lane by lane:
      </p>
      <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {touched.map((lane) => (
          <LaneCard key={lane.id} lane={lane} index={LANES.indexOf(lane)} upTo={upTo} ring />
        ))}
      </ol>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <MapLegend />
        <Link href="/docs7/picture" className="inline-flex items-center gap-1 text-xs font-medium underline underline-offset-2">
          The whole map <ArrowRight className="size-3" aria-hidden />
        </Link>
      </div>
    </section>
  );
}

export function MapLegend({ fresh = false, optional = false }: { fresh?: boolean; optional?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
      <li className="flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-md border border-foreground bg-foreground px-1.5 py-0.5 text-background">
          <KindIcon kind="auto" />
          filled
        </span>
        autonomous, per its card: every om-auto-* plus om-pr-autopilot
      </li>
      <li className="flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-md border border-foreground/40 px-1.5 py-0.5 text-foreground">
          <KindIcon kind="interactive" />
          outlined
        </span>
        interactive: acts once, may ask, hands back
      </li>
      {fresh && (
        <li className="flex items-center gap-1.5">
          <span className="inline-block size-3.5 rounded-sm ring-2 ring-amber-500" aria-hidden />
          new in this chapter
        </li>
      )}
      {optional && (
        <li className="flex items-center gap-1.5">
          <span className="inline-block size-3.5 rounded-sm outline-1 outline-dashed outline-muted-foreground" aria-hidden />
          optional discovery layer
        </li>
      )}
      <li className="flex items-center gap-1.5">
        <DecisionMark />a person decides
      </li>
    </ul>
  );
}
