/**
 * The whole system on one picture: layers, stages, what agents do, where people sign, and where the story's
 * chapters sit. A grid on wide screens, a vertical list on narrow ones.
 */
import type { ReactNode } from "react";
import Link from "@/app/docs4/_components/link";
import { STAGES, chaptersForStage, gatesForStage, href, type SkillId, type StageId } from "../_data";
import { cx, Dot, GateFlag, SkillChip } from "./ui";

/** The skills that carry most of each stage, for the map. The full lists live on the stage pages. */
export const KEY_SKILLS: Record<StageId, SkillId[]> = {
  discovery: ["om-discover", "om-mockup-prototype", "om-backlog"],
  intake: ["om-prepare-issue", "om-auto-manage-issues"],
  triage: ["om-verify-in-repo"],
  claim: ["om-auto-fix-issue"],
  implement: ["om-auto-write-spec", "om-auto-create-pr", "om-fix"],
  "pull-request": ["om-open-pr"],
  review: ["om-auto-review-pr", "om-ux-review-pr"],
  qa: ["om-auto-qa-pr", "om-prepare-test-env"],
  merge: ["om-merge-buddy", "om-approve-merge-pr"],
  cleanup: ["om-close-fixed-issues", "om-followup-issue-from-pr"],
};

function RowLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("pr-2 text-right text-[11px] font-medium text-muted-foreground", className)}>{children}</div>;
}

function ChapterStops({ stage }: { stage: StageId }) {
  return (
    <span className="flex flex-wrap justify-center gap-1">
      {chaptersForStage(stage).map((c) => (
        <Link
          key={c.slug}
          href={href.chapter(c.slug)}
          title={`Chapter ${c.number}: ${c.title}`}
          className="flex size-6 items-center justify-center rounded-full border bg-background font-mono text-[11px] hover:bg-muted"
        >
          {c.number}
        </Link>
      ))}
    </span>
  );
}

function GateCell({ stage }: { stage: StageId }) {
  const gates = gatesForStage(stage);
  if (gates.length === 0) return <span className="text-[11px] text-muted-foreground/50">no gate</span>;
  return (
    <span className="flex flex-col items-center gap-1">
      {gates.map((g) => (
        <Link key={g.id} href={href.gate(g.id)} className="flex flex-col items-center gap-0.5 hover:underline">
          <span className="flex items-center gap-1">
            <Dot kind="decides" />
            <GateFlag id={g.id} plain />
          </span>
          <span className="text-[11px] leading-tight">{g.name}</span>
          <span className="text-[10px] leading-tight text-muted-foreground">{g.ownerLabel}</span>
        </Link>
      ))}
    </span>
  );
}

export function SystemMap() {
  return (
    <>
      {/* Wide screens: one grid, ten columns */}
      <div className="hidden overflow-x-auto rounded-2xl border bg-card p-4 lg:block">
        <div className="grid min-w-[56rem] grid-cols-[6.5rem_repeat(10,minmax(0,1fr))] gap-x-1.5 gap-y-3">
          <RowLabel className="self-center">Layer</RowLabel>
          <div className="rounded-lg border border-dashed border-sky-500/60 bg-sky-500/10 p-2 text-center text-xs text-sky-900 dark:text-sky-200">
            <p className="font-semibold">Product</p>
            <p className="font-mono text-[10px] break-all">om-setup-discovery-pipeline</p>
          </div>
          <div className="col-span-9 rounded-lg border border-dashed border-amber-600/60 bg-amber-500/10 p-2 text-center text-xs text-amber-900 dark:text-amber-200">
            <p className="font-semibold">Delivery</p>
            <p className="font-mono text-[10px]">om-setup-agent-pipeline</p>
          </div>

          <RowLabel className="self-center">Stage</RowLabel>
          {STAGES.map((s) => (
            <Link
              key={s.id}
              href={href.stage(s.id)}
              className="flex min-w-0 flex-col gap-1 rounded-lg border bg-background p-2 hover:bg-muted"
            >
              <span className="font-mono text-[10px] text-muted-foreground">{s.number}</span>
              <span className="text-xs leading-tight font-semibold">{s.name}</span>
              <span className="text-[11px] leading-snug text-muted-foreground">{s.question}</span>
            </Link>
          ))}

          <RowLabel>
            <span className="inline-flex items-center gap-1">
              <Dot kind="agent" /> Agents do
            </span>
          </RowLabel>
          {STAGES.map((s) => (
            <div key={s.id} className="flex min-w-0 flex-col items-stretch gap-1">
              {KEY_SKILLS[s.id].map((k) => (
                <Link
                  key={k}
                  href={href.skill(k)}
                  className="rounded border border-dashed px-1 py-0.5 text-center font-mono text-[10px] leading-tight break-all text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {k.replace(/^om-/, "")}
                </Link>
              ))}
            </div>
          ))}

          <RowLabel>
            <span className="inline-flex items-center gap-1">
              <Dot kind="decides" /> People sign
            </span>
          </RowLabel>
          {STAGES.map((s) => (
            <div key={s.id} className="flex min-w-0 justify-center text-center">
              <GateCell stage={s.id} />
            </div>
          ))}

          <RowLabel className="self-center">The story</RowLabel>
          {STAGES.map((s) => (
            <div key={s.id} className="flex min-w-0 justify-center">
              <ChapterStops stage={s.id} />
            </div>
          ))}

          <RowLabel className="self-center">Merge rule</RowLabel>
          <div className="col-span-8 flex items-center justify-end gap-2 rounded-lg bg-muted/60 px-3 py-2 text-xs">
            Everything upstream feeds one question at Merge: are all the gates satisfied?
            <span aria-hidden>→</span>
          </div>
          <div className="flex items-center justify-center rounded-lg bg-red-600 px-1 py-2 text-center text-[11px] leading-tight font-semibold text-white dark:bg-red-500">
            blocked work cannot merge
          </div>
          <div className="flex items-center justify-center rounded-lg border border-dashed px-1 py-2 text-center text-[10px] leading-tight text-muted-foreground">
            then: the release process
          </div>
        </div>
      </div>

      {/* Narrow screens: the same map, stage by stage */}
      <ol className="flex flex-col gap-2 lg:hidden">
        {STAGES.map((s) => (
          <li key={s.id} className="min-w-0">
            {(s.number === 1 || s.number === 2) && (
              <p
                className={cx(
                  "mb-1 text-xs font-semibold",
                  s.number === 1 ? "text-sky-800 dark:text-sky-300" : "mt-2 text-amber-800 dark:text-amber-300",
                )}
              >
                {s.number === 1 ? "Product layer · om-setup-discovery-pipeline" : "Delivery layer · om-setup-agent-pipeline"}
              </p>
            )}
            <div
              className={cx(
                "flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-3",
                s.layer === "product" ? "border-l-4 border-l-sky-500/70" : "border-l-4 border-l-amber-500/70",
              )}
            >
              <Link href={href.stage(s.id)} className="flex items-baseline gap-2 hover:underline">
                <span className="font-mono text-xs text-muted-foreground">{s.number}</span>
                <span className="font-semibold">{s.name}</span>
              </Link>
              <p className="text-sm text-muted-foreground">{s.question}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <Dot kind="agent" />
                {KEY_SKILLS[s.id].map((k) => (
                  <SkillChip key={k} id={k} muted />
                ))}
              </div>
              {gatesForStage(s.id).length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {gatesForStage(s.id).map((g) => (
                    <Link key={g.id} href={href.gate(g.id)} className="inline-flex items-center gap-1.5 hover:underline">
                      <Dot kind="decides" />
                      <GateFlag id={g.id} plain /> {g.name}
                      <span className="text-xs text-muted-foreground">· {g.ownerLabel}</span>
                    </Link>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                Chapters <ChapterStops stage={s.id} />
              </div>
            </div>
            {s.id === "merge" && (
              <p className="mt-2 rounded-lg bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white dark:bg-red-500">
                Blocked work cannot merge
              </p>
            )}
          </li>
        ))}
        <li className="rounded-xl border border-dashed p-3 text-center text-xs text-muted-foreground">
          After Merge: the team&apos;s release process (deployment, smoke tests, rollback), not this pipeline.
        </li>
      </ol>
    </>
  );
}
