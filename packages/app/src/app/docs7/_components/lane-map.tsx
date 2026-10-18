import { cn } from "./cx";
import { DecisionMark, KindIcon, SkillChip } from "./marks";
import { DECISIONS, LANES, SKILLS } from "../_data/skills";

/**
 * The guide's one growing picture: the pipeline's eight lanes, holding every skill the team has met by chapter
 * `upTo` (new ones ringed) and every human decision point shown so far (diamonds). Skills still to come are only
 * counted, so the reader sees the picture fill in without being shown everything at once.
 */
export function LaneMap({ upTo, heading = true, ring = true }: { upTo: number; heading?: boolean; ring?: boolean }) {
  const met = SKILLS.filter((s) => s.ch <= upTo);
  const decisions = DECISIONS.filter((d) => d.ch <= upTo);
  const complete = met.length === SKILLS.length;

  return (
    <section aria-label="The map so far" className="flex min-w-0 flex-col gap-3">
      {heading && (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-xl font-semibold tracking-tight">{complete ? "The whole map" : "The map so far"}</h2>
          <p className="text-sm text-muted-foreground tabular-nums">
            {met.length} of {SKILLS.length} skills met · {decisions.length} of {DECISIONS.length} human decisions
          </p>
        </div>
      )}

      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {LANES.map((lane, i) => {
          const all = SKILLS.filter((s) => s.lane === lane.id);
          const here = all.filter((s) => s.ch <= upTo);
          const later = all.length - here.length;
          const ds = decisions.filter((d) => d.lane === lane.id);
          const empty = here.length === 0 && ds.length === 0;
          return (
            <li
              key={lane.id}
              className={cn(
                "flex min-w-0 flex-col gap-2 rounded-xl border p-3",
                empty ? "border-dashed bg-transparent" : "bg-card",
              )}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-muted-foreground tabular-nums">{i + 1}</span>
                <span className="font-semibold">{lane.name}</span>
                <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                  {here.length}/{all.length}
                </span>
              </div>
              <p className="-mt-1 text-xs text-muted-foreground">{lane.question}</p>

              {here.length > 0 && (
                <ul className="flex flex-wrap gap-1">
                  {here.map((s) => (
                    <li key={s.name} className="min-w-0 max-w-full">
                      <SkillChip name={s.name} fresh={ring && s.ch === upTo && upTo > 0} />
                    </li>
                  ))}
                </ul>
              )}

              {ds.length > 0 && (
                <ul className="flex flex-col gap-1">
                  {ds.map((d) => (
                    <li
                      key={d.id}
                      className={cn(
                        "flex items-start gap-1.5 text-xs leading-5",
                        ring && d.ch === upTo && upTo > 0 && "font-semibold",
                      )}
                    >
                      <DecisionMark className="mt-0.5" />
                      <span className="min-w-0">{d.text}</span>
                    </li>
                  ))}
                </ul>
              )}

              {later > 0 && (
                <p className="mt-auto text-xs text-muted-foreground">
                  {here.length === 0 ? `${later} skills, met later` : `+${later} later`}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <MapLegend fresh={ring && upTo > 0} />
    </section>
  );
}

export function MapLegend({ fresh = true }: { fresh?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
      <li className="flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-md border border-foreground bg-foreground px-1.5 py-0.5 text-background">
          <KindIcon kind="auto" />
          om-auto-…
        </span>
        autonomous: runs to the end, no questions
      </li>
      <li className="flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-md border border-foreground/40 px-1.5 py-0.5 text-foreground">
          <KindIcon kind="interactive" />
          om-…
        </span>
        interactive: acts once, may ask, hands back
      </li>
      {fresh && (
        <li className="flex items-center gap-1.5">
          <span className="inline-block size-3.5 rounded-sm ring-2 ring-amber-500" aria-hidden />
          new in this chapter
        </li>
      )}
      <li className="flex items-center gap-1.5">
        <DecisionMark />a person decides
      </li>
    </ul>
  );
}
