import { Bot, MessageCircle, Star } from "lucide-react";
import Link from "../../_components/link";
import { cn } from "../../_components/cx";
import { Remember, RepoNote, SkillChip } from "../../_components/marks";
import { H2, Prose, ZoomFrame } from "../../_components/zoom";
import { meta } from "../../_data/meta";
import { DRAWERS, SKILLS, skillsIn, STARTERS } from "../../_data/skills";

export const metadata = meta("Zoom 6: 42 skills, 5 drawers");

export default function ZoomSkills() {
  return (
    <ZoomFrame slug="skills" title={`${SKILLS.length} skills, sorted into five drawers`}>
      <Prose>
        <p>
          A <strong className="text-foreground">skill</strong> is a ready-made set of instructions for an AI coding
          agent, for one job: file a ticket, fix a bug, review a PR. You start one by typing its name, like{" "}
          <code className="font-mono text-foreground">/om-prepare-issue</code>. Sort them by the leg of the road they
          serve, add one drawer for looking after the road itself, and the heap becomes a tidy chest.
        </p>
      </Prose>

      <section aria-labelledby="drawers" className="flex flex-col gap-3">
        <H2 id="drawers">The chest of drawers</H2>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="size-3 fill-current" aria-hidden /> one of the nine to learn first
          </span>
          <span>faded = mostly runs inside other skills</span>
          <span className="flex items-center gap-1">
            <Bot className="size-3" aria-hidden /> runs on its own
          </span>
        </p>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {DRAWERS.map((d) => {
            const list = skillsIn(d.id);
            return (
              <li key={d.id} className="flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex min-w-0 flex-col">
                    <span className="font-semibold">
                      <span aria-hidden>{d.emoji}</span> {d.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{d.line}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums">
                    {list.length}
                  </span>
                </div>
                <ul className="flex flex-wrap gap-1.5">
                  {list.map((s) => (
                    <li key={s.name} className={cn("flex max-w-full items-center gap-1", s.inside && "opacity-55")}>
                      {s.starter && <Star className="size-3 shrink-0 fill-current" aria-label="learn first" />}
                      <SkillChip name={s.name} className={s.starter ? "border-foreground font-semibold" : undefined} />
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="names" className="flex flex-col gap-3">
        <H2 id="names">Read the name, know the behaviour</H2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-4">
            <span className="flex items-center gap-2 font-semibold">
              <Bot className="size-5" aria-hidden /> om-auto-…
            </span>
            <p className="text-sm text-muted-foreground">
              Runs from start to finish without asking: claims the work so other agents back off, works in its own copy
              of the code, runs the checks, reviews itself, and leaves a PR or a verdict. Safe to run on a schedule.
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-4">
            <span className="flex items-center gap-2 font-semibold">
              <MessageCircle className="size-5" aria-hidden /> om-… (no “auto”)
            </span>
            <p className="text-sm text-muted-foreground">
              A conversation: it does one thing, may ask you questions on the way, reports, and hands control back to
              you.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="nine" className="flex flex-col gap-3">
        <H2 id="nine">The nine to learn first</H2>
        <p className="text-sm text-muted-foreground">
          Around ten others run inside these nine without you typing them (the faded ones, the spec writers, the review and QA steps). The rest are variants and specialist tools you reach for when you need them.
        </p>
        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {STARTERS.map((s, i) => (
            <li key={s.name} className="flex min-w-0 gap-3 rounded-lg border bg-card p-3">
              <span className="font-mono text-sm text-muted-foreground">{i + 1}</span>
              <span className="flex min-w-0 flex-col gap-1">
                <SkillChip name={s.name} className="self-start" />
                <span className="text-xs text-muted-foreground">{s.line}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted-foreground">
          Still not sure which one fits? The{" "}
          <Link href="/docs5/ask/which-skill" className="underline underline-offset-4">
            “Which skill do I run?”
          </Link>{" "}
          picker asks what you have in front of you and answers with one name.
        </p>
      </section>

      <RepoNote>
        The README says “forty-one skills”; the repo now holds {SKILLS.length}. The chart lists 41 of them
        (om-create-skill, a tool for writing new skills, is not on it), and om-qa-buddy has no docs card, so its link
        goes to its SKILL.md.
      </RepoNote>

      <Remember>
        Skills sort into the leg they serve. Learn nine to start; the others run inside them, or wait until you need
        them.
      </Remember>
    </ZoomFrame>
  );
}
