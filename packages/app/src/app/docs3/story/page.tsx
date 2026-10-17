import type { Metadata } from "next";
import Link from "@/app/docs3/_components/link";
import { STAGES } from "../_data/stages";
import { EXAMPLE, STORY_BY_STAGE } from "../_data/story";
import { IllustrativeBadge, PageIntro } from "../_components/bits";
import { StageRail } from "../_components/stage-rail";

export const metadata: Metadata = {
  title: "The story, stage by stage",
  robots: { index: false, follow: false },
};

export default function StoryIndex() {
  return (
    <main className="flex flex-col gap-10">
      <PageIntro eyebrow="🗺️ The story" title="Ten stages, two examples, one road">
        <p>
          We follow feature #{EXAMPLE.feature.issue} (“{EXAMPLE.feature.title}”) and bug #{EXAMPLE.bug.issue} (“
          {EXAMPLE.bug.title}”) through every stage of {EXAMPLE.product}, {EXAMPLE.productBlurb}.
        </p>
      </PageIntro>

      <StageRail />

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <IllustrativeBadge />
        <span>All issues, PRs, people and outputs in the story are invented, shaped like real skill output.</span>
      </div>

      <ol className="flex flex-col gap-3">
        {STAGES.map((s) => {
          const step = STORY_BY_STAGE[s.id];
          return (
            <li key={s.id}>
              <Link
                href={`/docs3/story/${s.id}`}
                className="flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center"
              >
                <span className="flex items-center gap-3 sm:w-56 sm:shrink-0">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-lg">
                    <span aria-hidden>{s.emoji}</span>
                  </span>
                  <span className="flex flex-col">
                    <span className="font-mono text-xs text-muted-foreground">Stage {s.n}</span>
                    <span className="font-semibold">{s.name}</span>
                  </span>
                </span>
                <span className="flex flex-1 flex-col gap-1">
                  <span className="font-medium">{step.title}</span>
                  <span className="text-sm text-muted-foreground">{s.question}</span>
                </span>
                <span className="flex flex-wrap items-center gap-1.5 text-xs">
                  {s.gates.map((g) => (
                    <span
                      key={g}
                      className="rounded bg-red-500/15 px-1.5 py-0.5 font-mono font-semibold text-red-700 dark:text-red-300"
                    >
                      ⚑ {g}
                    </span>
                  ))}
                  {step.feature && (
                    <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-violet-800 dark:text-violet-300">
                      {EXAMPLE.feature.emoji} feature
                    </span>
                  )}
                  {step.bug && (
                    <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-red-800 dark:text-red-300">
                      {EXAMPLE.bug.emoji} bug
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
