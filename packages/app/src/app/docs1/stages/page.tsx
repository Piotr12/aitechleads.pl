import type { Metadata } from "next";
import Link from "next/link";
import { StageRail } from "../_components/diagrams";
import { GateTag, LayerTag, SkillChip } from "../_components/marks";
import { DocsShell, PageHeader, Section } from "../_components/shell";
import { STAGES, gatesForStage, href, skillsForStage } from "../_data";

export const metadata: Metadata = {
  title: "Stages · AI SDLC skills guide",
  robots: { index: false, follow: false },
};

export default function StagesIndex() {
  return (
    <DocsShell active="stages" crumbs={[{ label: "Guide", href: href.home }, { label: "Stages" }]}>
      <PageHeader
        title="Stages"
        lead="Work moves through ten stages. The first belongs to the optional product layer; the other nine form the delivery pipeline described in SDLC.md."
      />

      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <StageRail showSummary />
      </div>

      <Section title="All stages">
        <ol className="grid gap-3 md:grid-cols-2">
          {STAGES.map((stage) => (
            <li key={stage.id}>
              <Link
                href={href.stage(stage.id)}
                className="flex h-full flex-col gap-2 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-full border text-xs font-semibold tabular-nums">
                    {stage.number}
                  </span>
                  <span className="font-medium">{stage.name}</span>
                  <LayerTag layer={stage.layer} />
                  {gatesForStage(stage.id).map((g) => (
                    <GateTag key={g.id} id={g.id} link={false} />
                  ))}
                </span>
                <span className="text-sm text-muted-foreground">{stage.summary}</span>
                <span className="text-xs text-muted-foreground">
                  Done when: {stage.doneWhen}
                </span>
              </Link>
              <div className="mt-2 flex flex-wrap gap-1 px-1">
                {skillsForStage(stage.id).map((s) => (
                  <SkillChip key={s} id={s} />
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </DocsShell>
  );
}
