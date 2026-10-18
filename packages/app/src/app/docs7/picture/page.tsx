import { Frame } from "../_components/frame";
import { LaneMap } from "../_components/lane-map";
import Link from "../_components/link";
import { Journey } from "../_components/journey";
import { Cmd, SectionTitle } from "../_components/marks";
import { meta } from "../_data/links";
import { CHAPTERS, chapterHref } from "../_data/story";

export const metadata = meta("The whole picture");

const QUESTIONS: { q: string; a: React.ReactNode; ch: number[] }[] = [
  {
    q: "What does the system do, in one sentence?",
    a: "It runs a team's whole GitHub workflow, idea to merged and tidied PR, with agents doing the work and labels, locks and gates keeping the decisions that matter with people.",
    ch: [],
  },
  {
    q: "What are its moving parts?",
    a: <>Skills (autonomous ones, which run to the end alone, and interactive ones), artefacts (config, SDLC.md, plans, specs, PRs, comments), labels (pipeline, category, meta, priority, risk), one config file, and six roles.</>,
    ch: [1, 3],
  },
  {
    q: "How does one piece of work travel?",
    a: "Along the strip above: shape, build, review, QA, merge, tidy, improve. A bug skips shaping: om-auto-fix-issue takes it from issue to reviewed PR.",
    ch: [2, 4],
  },
  {
    q: "Where must a person decide, and what may agents never do?",
    a: "Every diamond on this page. Agents never grant qa-approved (except audited self-QA), never set qa, never merge past a gate (blocked, do-not-merge, qa-failed, the QA gate), never fake a green build.",
    ch: [7, 8, 9],
  },
  {
    q: "I'm a developer, product person, QA, reviewer, maintainer or designer: what do I run?",
    a: <>Your flow is one page in <Link href="/docs7/people" className="underline underline-offset-2">Who runs what</Link>.</>,
    ch: [],
  },
  {
    q: "What would I do first on Monday?",
    a: <>Each role page ends with a Monday list. For the team as a whole: install, run <Cmd>/om-setup-agent-pipeline</Cmd>, read SDLC.md together, take one small bug through the four building blocks by hand, then let <Cmd>/om-auto-fix-issue</Cmd> do the next one.</>,
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
      <LaneMap />

      <section className="flex flex-col gap-4">
        <SectionTitle>One feature, from idea to tidied</SectionTitle>
        <p className="max-w-prose text-muted-foreground">
          The bulk-reschedule feature from chapters 5 to 10, step by step: the skills that carried it, what each step
          left behind, and where a person had to decide.
        </p>
        <Journey />
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
