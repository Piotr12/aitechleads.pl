import { Frame } from "../_components/frame";
import { LaneMap } from "../_components/lane-map";
import Link from "../_components/link";
import { Cmd, DecisionMark, LabelChip, SectionTitle, SkillChip } from "../_components/marks";
import { meta } from "../_data/links";
import { CHAPTERS, chapterHref } from "../_data/story";

export const metadata = meta("The whole picture");

type Step = {
  lane: string;
  what: string;
  skills: string[];
  leaves: React.ReactNode;
  decide?: string;
  ch: number;
};

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

const QUESTIONS: { q: string; a: React.ReactNode; ch: number[] }[] = [
  {
    q: "What does the system do, in one sentence?",
    a: "It runs a team's whole GitHub workflow, idea to merged and tidied PR, with agents doing the work and labels, locks and gates keeping the decisions that matter with people.",
    ch: [],
  },
  {
    q: "What are its moving parts?",
    a: <>Skills (autonomous <Cmd>om-auto-*</Cmd> and interactive), artefacts (config, SDLC.md, plans, specs, PRs, comments), labels (pipeline, category, meta, priority, risk), one config file, and six roles.</>,
    ch: [1, 3],
  },
  {
    q: "How does one piece of work travel?",
    a: "Along the strip above: shape, build, review, QA, merge, tidy, improve. A bug skips shaping: om-auto-fix-issue takes it from issue to reviewed PR.",
    ch: [2, 4],
  },
  {
    q: "Where must a person decide, and what may agents never do?",
    a: "Every diamond on this page. Agents never grant qa-approved (except audited self-QA), never set qa, blocked or do-not-merge, never merge past a gate, never fake a green build.",
    ch: [7, 8, 9],
  },
  {
    q: "I'm a developer, product person, QA, reviewer, maintainer or designer: what do I run?",
    a: <>Your flow is one page in <Link href="/docs7/people" className="underline underline-offset-2">Who runs what</Link>.</>,
    ch: [],
  },
  {
    q: "What would I do first on Monday?",
    a: <>Each role page ends with a Monday list. For the team as a whole: install, run <Cmd>/om-setup-agent-pipeline</Cmd>, read SDLC.md together, take one small bug through by hand.</>,
    ch: [1, 2],
  },
];

export default function Picture() {
  return (
    <Frame
      href="/docs7/picture"
      kicker="After the month"
      title="The whole picture"
      lead="Everything the team met in eleven chapters, on one page: the full map, one piece of work end to end, and the six questions a newcomer should now be able to answer."
    >
      <LaneMap upTo={CHAPTERS.length} ring={false} />

      <section className="flex flex-col gap-4">
        <SectionTitle>One feature, from idea to tidied</SectionTitle>
        <p className="max-w-prose text-muted-foreground">
          The bulk-reschedule feature from chapters 5 to 10, step by step: the skills that carried it, what each step
          left behind, and where a person had to decide.
        </p>
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
          <Cmd>om-auto-review-pr</Cmd> (→ <Cmd>om-auto-qa-pr</Cmd> when a screen changed) and joins this strip at step
          5. A task with no ticket joins at step 4 through <Cmd>om-auto-create-pr</Cmd>.
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>Check yourself</SectionTitle>
        <p className="max-w-prose text-muted-foreground">
          If these answers sound obvious now, the month worked. If one does not, its chapter is linked.
        </p>
        <ol className="flex flex-col gap-2">
          {QUESTIONS.map((x, i) => (
            <li key={x.q}>
              <details className="group rounded-xl border bg-card p-3 open:bg-muted/30">
                <summary className="cursor-pointer list-none font-medium">
                  <span className="mr-2 text-muted-foreground tabular-nums">{i + 1}.</span>
                  {x.q}
                  <span className="ml-2 text-xs text-muted-foreground group-open:hidden">(show answer)</span>
                </summary>
                <div className="mt-2 flex flex-col gap-1 pl-6 text-sm leading-6">
                  <p>{x.a}</p>
                  {x.ch.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Chapter{x.ch.length > 1 ? "s" : ""}{" "}
                      {x.ch.map((n, j) => (
                        <span key={n}>
                          {j > 0 && ", "}
                          <Link href={chapterHref(CHAPTERS[n - 1])} className="underline underline-offset-2">
                            {n}
                          </Link>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ol>
      </section>
    </Frame>
  );
}
