import type { Metadata } from "next";
import Link from "@/app/docs4/_components/link";
import { CHAPTERS, ROBOTS, href, stageById } from "../_data";
import { PRODUCT } from "../_data/story";
import { StageRail } from "../_components/stage-rail";
import { AgentBadge, Avatar, GateFlag, Legend, PageHeader, PrevNext, SectionNav } from "../_components/ui";

export const metadata: Metadata = {
  title: "The story",
  robots: ROBOTS,
};

export default function StoryIndex() {
  return (
    <>
      <SectionNav part="story" />
      <PageHeader
        eyebrow="Part 1"
        title="The story"
        lead={`Issue #${PRODUCT.issue}, “${PRODUCT.issueTitle}”, from the first call log to the last follow-up. A prologue and ten chapters, about two weeks of work, one PR.`}
      />

      <StageRail caption="Numbered stops are chapters, placed under the stage where they happen." />

      <ol className="relative flex flex-col gap-4 pl-8 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-0.5 before:bg-border">
        {CHAPTERS.map((c) => (
          <li key={c.slug} className="relative min-w-0">
            <span
              className={`absolute top-4 -left-8 flex size-6 items-center justify-center rounded-full border-2 bg-background font-mono text-[11px] ${c.gates.length ? "border-red-600 text-red-700 dark:border-red-500 dark:text-red-300" : ""}`}
              aria-hidden
            >
              {c.number}
            </span>
            <Link
              href={href.chapter(c.slug)}
              className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span>{c.number === 0 ? "Prologue" : `Chapter ${c.number}`}</span>
                <span aria-hidden>·</span>
                <span>{c.when}</span>
                <span aria-hidden>·</span>
                <span>{c.stages.map((s) => stageById(s).name).join(" + ")}</span>
                {c.gates.map((g) => (
                  <GateFlag key={g} id={g} plain />
                ))}
              </span>
              <span className="text-lg font-semibold">{c.title}</span>
              <span className="text-sm text-muted-foreground">{c.logline}</span>
              <span className="flex flex-wrap items-center gap-1">
                {c.cast.map((m) => (
                  <Avatar key={m.role} role={m.role} size="sm" />
                ))}
                <AgentBadge size="sm" />
                <span className="ml-1 text-xs text-muted-foreground">
                  {c.agents.length} skill{c.agents.length === 1 ? "" : "s"} at work
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <Legend />

      <PrevNext
        prev={{ href: href.home, label: "Contents", hint: "Back to the start" }}
        next={{ href: href.chapter(CHAPTERS[0].slug), label: CHAPTERS[0].title, hint: "Prologue" }}
      />
    </>
  );
}
