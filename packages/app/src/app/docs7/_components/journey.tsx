import type { ReactNode } from "react";
import Link from "./link";
import { Cmd, DecisionMark, LabelChip, SkillChip } from "./marks";
import { CHAPTERS, chapterHref } from "../_data/story";

/** One feature from idea to tidied: the strip shown compact on the home page and in full on /picture. */
type Step = { lane: string; what: string; skills: string[]; leaves: ReactNode; decide?: string; ch: number };

const FEATURE: Step[] = [
  { lane: "Shape", what: "Talk the idea through", skills: ["om-brainstorm"], leaves: <>a brief and a <Cmd>Next:</Cmd> line</>, decide: "confirm the route", ch: 5 },
  { lane: "Shape", what: "Make it a ready ticket", skills: ["om-prepare-issue", "om-auto-manage-issues"], leaves: <>a labelled issue, or a comment naming what is missing</>, decide: "supply the ticket-level Definition of Ready", ch: 5 },
  { lane: "Shape", what: "Write the spec", skills: ["om-auto-write-spec", "om-auto-review-pr"], leaves: <>a spec PR: <LabelChip name="documentation" /> <LabelChip name="skip-qa" />, assumptions comment</>, decide: "confirm or correct the assumptions", ch: 5 },
  { lane: "Build", what: "Build it", skills: ["om-auto-implement-spec", "om-auto-create-pr-loop"], leaves: <>an implementation PR with plan, labels, screenshots</>, ch: 6 },
  { lane: "Review", what: "Review until clean", skills: ["om-auto-review-pr", "om-auto-fix-pr"], leaves: <><LabelChip name="review" /> → <LabelChip name="changes-requested" /> → <LabelChip name="merge-queue" /></>, decide: "second person's review on auth or money", ch: 3 },
  { lane: "QA", what: "Test it as a user", skills: ["om-prepare-test-env", "om-auto-qa-pr", "om-qa-buddy"], leaves: <>evidence, then <LabelChip name="qa-approved" /> + <Cmd>QA head:</Cmd></>, decide: "grant qa-approved, or fail it", ch: 8 },
  { lane: "Merge", what: "Merge it", skills: ["om-merge-buddy", "om-approve-merge-pr"], leaves: <>a squash-merge, after every gate is re-checked</>, decide: "decide to merge", ch: 9 },
  { lane: "Tidy", what: "Make the tracker true", skills: ["om-close-fixed-issues", "om-followup-issue-from-pr", "om-auto-update-changelog"], leaves: <>closed issues, follow-ups, a changelog docs PR</>, decide: "write the Highlights", ch: 10 },
  { lane: "Improve", what: "Learn from the month", skills: ["om-pipeline-retro"], leaves: <>causes ranked by hours of rework</>, decide: "decide what changes in the process", ch: 11 },
];

/** Nine numbered boxes: what happens, and whether a person decides there. Links to the chapter that tells it. */
export function JourneyCompact() {
  return (
    <ol className="grid grid-cols-1 gap-1.5 sm:grid-cols-3 lg:grid-cols-9">
      {FEATURE.map((s, i) => (
        <li key={s.what}>
          <Link
            href={chapterHref(CHAPTERS[s.ch - 1])}
            className="flex h-full min-w-0 flex-row items-center gap-2 rounded-lg border bg-card p-2 hover:bg-muted/50 lg:flex-col lg:items-start lg:gap-1"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold tabular-nums">
              {i + 1}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">{s.lane}</span>
              <span className="text-sm leading-5 font-medium">{s.what}</span>
            </span>
            {s.decide && <DecisionMark className="ml-auto lg:mt-auto lg:ml-0" />}
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function Journey() {
  return (
    <div className="flex flex-col gap-2">
      <ol className="flex flex-col gap-2">
        {FEATURE.map((s, i) => (
          <li
            key={s.what}
            className="grid grid-cols-[2rem_1fr] gap-x-3 gap-y-2 rounded-xl border bg-card p-3 lg:grid-cols-[2rem_7rem_1fr_1.1fr_1fr]"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums">
              {i + 1}
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase lg:pt-1.5">
              {s.lane} ·{" "}
              <Link href={chapterHref(CHAPTERS[s.ch - 1])} className="underline underline-offset-2">
                ch {s.ch}
              </Link>
            </span>
            <div className="col-start-2 flex min-w-0 flex-col gap-1.5 lg:col-start-3">
              <span className="font-medium">{s.what}</span>
              <ul className="flex flex-wrap gap-1">
                {s.skills.map((k) => (
                  <li key={k} className="min-w-0 max-w-full">
                    <SkillChip name={k} />
                  </li>
                ))}
              </ul>
            </div>
            <p className="col-start-2 min-w-0 text-sm leading-6 text-muted-foreground lg:col-start-4">{s.leaves}</p>
            <p className="col-start-2 min-w-0 text-sm leading-6 lg:col-start-5">
              {s.decide && (
                <span className="inline-flex items-start gap-1.5">
                  <DecisionMark className="mt-1" />
                  {s.decide}
                </span>
              )}
            </p>
          </li>
        ))}
      </ol>
      <div className="rounded-xl border-2 border-dashed p-3 text-sm leading-6">
        <span className="font-semibold">A bug&apos;s shortcut:</span> <SkillChip name="om-auto-fix-issue" /> runs{" "}
        <Cmd>om-verify-in-repo</Cmd> → <Cmd>om-root-cause</Cmd> → <Cmd>om-fix</Cmd> → <Cmd>om-open-pr</Cmd> →{" "}
        <Cmd>om-auto-review-pr</Cmd> (→ <Cmd>om-auto-qa-pr</Cmd> when a screen changed) and joins this strip at step 5.
        A task with no ticket joins at step 4 through <Cmd>om-auto-create-pr</Cmd>.
      </div>
    </div>
  );
}
