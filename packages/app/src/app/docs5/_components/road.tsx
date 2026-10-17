import { ArrowDown, ArrowRight, Flag } from "lucide-react";
import Link from "./link";
import { cn } from "./cx";
import { MarkDot, RoleAvatar } from "./marks";
import { gatesAt } from "../_data/gates";
import { momentAt, ROLE_BY_ID, ROLES, type RoleId } from "../_data/roles";
import { PHASES, STAGES, stagesOf, type StageId } from "../_data/stages";

/**
 * The one picture the whole guide keeps coming back to: the road, in four legs.
 * Each zoom level switches on one more layer of it.
 */
export function Road({
  stops = false,
  gates = false,
  role,
  highlight,
  compact = false,
}: {
  /** Show the stops inside each leg (zoom 2 and later). */
  stops?: boolean;
  /** Show the red gate flags and who holds them (zoom 5 and later). */
  gates?: boolean;
  /** Show one person's marks along the road, and dim the stops they are not at. */
  role?: RoleId;
  highlight?: StageId;
  compact?: boolean;
}) {
  const person = role ? ROLE_BY_ID[role] : undefined;

  return (
    <figure className="flex flex-col gap-3">
      {!compact && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span aria-hidden>📥</span> In: an idea, a bug report, or a task in someone&apos;s head
        </p>
      )}
      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PHASES.map((phase, pi) => (
          <li key={phase.id} className="relative flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2">
              <span aria-hidden className="text-2xl leading-none">
                {phase.emoji}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Leg {pi + 1}
                </span>
                <span className="font-semibold leading-tight">{phase.name}</span>
              </div>
            </div>
            {!stops && <p className="text-sm text-muted-foreground">{phase.line}</p>}
            {stops && (
              <ol className="flex flex-col gap-1.5">
                {stagesOf(phase.id).map((s) => {
                  const m = person ? momentAt(person, s.id) : undefined;
                  const dim = person !== undefined && m === undefined;
                  const flags = gates ? gatesAt(s.id) : [];
                  return (
                    <li key={s.id}>
                      <Link
                        href={`/docs5/stops/${s.id}`}
                        className={cn(
                          "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border px-2 py-1.5 text-sm transition-colors hover:bg-muted",
                          s.repoOnly && "border-dashed",
                          highlight === s.id && "border-foreground bg-muted ring-2 ring-foreground/20",
                          dim && "opacity-40",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold tabular-nums",
                            s.repoOnly ? "border border-dashed" : "bg-foreground text-background",
                          )}
                        >
                          {s.n ?? "+"}
                        </span>
                        {/* min width so the flags wrap to a second line instead of squeezing the name to one letter per line */}
                        <span className="min-w-28 flex-1 font-medium break-words">{s.name}</span>
                        {m && <MarkDot mark={m.mark} size="md" />}
                        {flags.map((g) => (
                          <span
                            key={g.id}
                            className="inline-flex items-center gap-1 rounded bg-destructive/10 px-1 text-[11px] font-semibold text-destructive"
                            title={`${g.id}: ${g.name}, held by ${g.holderLabel}`}
                          >
                            <Flag className="size-3" aria-hidden />
                            {g.id}
                            {g.holders.map((h) => (
                              <RoleAvatar key={h} role={h} size="sm" />
                            ))}
                          </span>
                        ))}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
            {pi < PHASES.length - 1 && (
              <>
                <ArrowRight
                  aria-hidden
                  className="absolute top-1/2 -right-4 z-10 hidden size-4 -translate-y-1/2 text-muted-foreground lg:block"
                />
                <ArrowDown
                  aria-hidden
                  className="absolute -bottom-4 left-1/2 z-10 size-4 -translate-x-1/2 text-muted-foreground sm:hidden"
                />
              </>
            )}
          </li>
        ))}
      </ol>
      {!compact && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span aria-hidden>📤</span> Out: the change, merged into main. Deploying it is the team&apos;s own release
          process, outside this road.
        </p>
      )}
    </figure>
  );
}

/** One person's presence along the road: one little square per stop. */
export function PresenceStrip({ role }: { role: RoleId }) {
  const person = ROLE_BY_ID[role];
  return (
    <ol className="flex flex-wrap gap-1" aria-label={`Where the ${person.name} appears on the road`}>
      {STAGES.map((s) => {
        const m = momentAt(person, s.id);
        const gate = (m?.gates?.length ?? 0) > 0;
        return (
          <li key={s.id} title={`${s.name}: ${m ? m.you : "not here"}`} className="flex w-6 flex-col items-center gap-0.5">
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-md border",
                s.repoOnly && "border-dashed",
                !m && "bg-muted/40",
                gate && "border-destructive bg-destructive/5",
              )}
            >
              {m ? <MarkDot mark={m.mark} /> : null}
              <span className="sr-only">
                {s.name}: {m ? m.you : "not here"}
              </span>
            </span>
            <span className="text-[9px] text-muted-foreground tabular-nums" aria-hidden>
              {s.n ?? "+"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Seven strips stacked: who stands where, at a glance. */
export function PresenceTable() {
  return (
    <ul className="flex flex-col divide-y rounded-xl border bg-card">
      {ROLES.map((r) => (
        <li key={r.id}>
          <Link
            href={`/docs5/seats/${r.id}`}
            className="flex flex-col gap-2 p-3 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:gap-4"
          >
            <span className="flex min-w-0 items-center gap-2 sm:w-56 sm:shrink-0">
              <RoleAvatar role={r.id} size="sm" />
              <span className="min-w-0 text-sm font-medium break-words">
                {r.name}
                {r.optional && <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>}
              </span>
            </span>
            <PresenceStrip role={r.id} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
