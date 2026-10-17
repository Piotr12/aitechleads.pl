import type { Metadata } from "next";
import { ArrowRight, OctagonX } from "lucide-react";
import Link from "@/app/docs4/_components/link";
import { CHAPTERS, GATES, HARD_BLOCKS, ROBOTS, STAGES, href } from "../_data";
import { Crumbs, GateCard } from "../_components/reference";
import { LabelChip } from "../_components/story-bits";
import { StageRail } from "../_components/stage-rail";
import { ExternalLink, PageHeader, PrevNext, SectionNav, SectionTitle } from "../_components/ui";

export const metadata: Metadata = {
  title: "The seven gates",
  robots: ROBOTS,
};

/** Pipeline labels as SDLC.md moves them: one at a time, each naming where the PR sits. */
const LABEL_PATH: { label: string; who: string }[] = [
  { label: "review", who: "a ready PR" },
  { label: "changes-requested", who: "reviewer asks for changes" },
  { label: "review", who: "fixes pushed" },
  { label: "merge-queue", who: "reviewer approves" },
  { label: "qa", who: "QA reviewer is testing" },
  { label: "merge-queue", who: "+ qa-approved, QA head: <sha>" },
];

export default function GatesPage() {
  return (
    <>
      <SectionNav part="details" />
      <Crumbs items={[{ label: "Details", href: href.details }, { label: "Gates" }]} />
      <PageHeader
        eyebrow="Reference"
        title="The seven gates"
        lead="Places where a named person must say yes before the work moves on. Agents prepare everything a gate needs; none of them signs one."
      />
      <StageRail showChapters={false} caption="Gates sit under the stage where they close." />

      <section className="flex flex-col gap-4">
        {GATES.map((g) => {
          const chapter = CHAPTERS.find((c) => c.gates.includes(g.id));
          return (
            <div key={g.id} className="flex flex-col gap-1.5">
              <GateCard gate={g} />
              {chapter && (
                <p className="pl-1 text-xs text-muted-foreground">
                  In the story:{" "}
                  <Link href={href.chapter(chapter.slug)} className="underline underline-offset-2 hover:text-foreground">
                    chapter {chapter.number}, {chapter.title}
                  </Link>
                </p>
              )}
            </div>
          );
        })}
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>How a PR&apos;s label moves</SectionTitle>
        <p className="max-w-3xl text-sm text-muted-foreground">
          A PR carries at most one pipeline label, and it names where the PR is. Only a QA reviewer sets{" "}
          <code className="font-mono text-xs">qa</code>; automated skills ask for QA with{" "}
          <code className="font-mono text-xs">needs-qa</code> and never grant it. A failed test goes to{" "}
          <code className="font-mono text-xs">qa-failed</code>; a push after the QA head line makes the approval stale.
        </p>
        <ol className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start">
          {LABEL_PATH.map((step, i) => (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && <ArrowRight className="hidden size-4 shrink-0 text-muted-foreground sm:block" aria-hidden />}
              <span className="flex min-w-0 flex-col gap-1 rounded-lg border bg-card px-3 py-2">
                <LabelChip label={step.label} />
                <span className="text-xs text-muted-foreground">{step.who}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>Blocked work cannot merge</SectionTitle>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {HARD_BLOCKS.map((b) => (
            <li key={b.label} className="flex min-w-0 gap-3 rounded-lg border bg-card p-3 text-sm">
              <OctagonX className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden />
              <span className="min-w-0">
                <code className="font-mono text-xs break-words">{b.label}</code>
                <span className="block text-muted-foreground">{b.meaning}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Source: <ExternalLink path="SDLC.md">SDLC.md</ExternalLink> (the QA gate, the label state machine, risk-high
          gates).
        </p>
      </section>

      <PrevNext
        prev={{ href: href.stage(STAGES[STAGES.length - 1].id), label: "10. Cleanup", hint: "Last stage" }}
        next={{ href: href.skills, label: "Every skill, by stage", hint: "Next" }}
      />
    </>
  );
}
