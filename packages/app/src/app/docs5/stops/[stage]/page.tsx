import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Flag } from "lucide-react";
import { Frame } from "../../_components/frame";
import { MarkDot, MarkLegend, RepoNote, RoleAvatar, RoleChip, SkillChip } from "../../_components/marks";
import { Road } from "../../_components/road";
import { gatesAt } from "../../_data/gates";
import { meta } from "../../_data/meta";
import { isActive, momentAt, ROLES } from "../../_data/roles";
import { SKILL_BY_NAME } from "../../_data/skills";
import { isStageId, PHASE_BY_ID, STAGE_BY_ID, STAGES } from "../../_data/stages";

export function generateStaticParams() {
  return STAGES.map((s) => ({ stage: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/docs5/stops/[stage]">): Promise<Metadata> {
  const { stage } = await params;
  return meta(isStageId(stage) ? `Stop: ${STAGE_BY_ID[stage].name}` : "Stop not found");
}

export default async function StopPage({ params }: PageProps<"/docs5/stops/[stage]">) {
  const { stage: id } = await params;
  if (!isStageId(id)) notFound();
  const stage = STAGE_BY_ID[id];
  const phase = PHASE_BY_ID[stage.phase];
  const present = ROLES.flatMap((r) => {
    const m = momentAt(r, id);
    return m ? [{ role: r, m }] : [];
  });
  const acting = present.filter((p) => isActive(p.m));
  const told = present.filter((p) => !isActive(p.m));
  const gates = gatesAt(id);

  return (
    <Frame
      href={`/docs5/stops/${id}`}
      kicker={`🚏 ${stage.n === null ? "Repo extra stop" : `Stop ${stage.n} of 10`} · ${phase.emoji} ${phase.name}${stage.layer === "product" ? " · product layer" : ""}`}
      title={stage.name}
      lead={<p>{stage.what}</p>}
    >
      <Road stops gates highlight={id} compact />

      <section className="flex flex-col gap-1 rounded-xl border-2 border-foreground/80 bg-card p-4">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Done when</p>
        <p className="text-lg font-medium">{stage.doneWhen}</p>
      </section>

      {gates.map((g) => (
        <section key={g.id} className="flex flex-col gap-2 rounded-xl border border-l-4 border-l-destructive bg-destructive/5 p-4">
          <p className="flex flex-wrap items-center gap-2 font-semibold text-destructive">
            <Flag className="size-4" aria-hidden /> Gate {g.id}: {g.name}
          </p>
          <p className="font-medium">“{g.question}”</p>
          <p className="flex flex-wrap items-center gap-2 text-sm">
            Says yes:
            {g.holders.map((h) => (
              <RoleChip key={h} role={h} />
            ))}
          </p>
          <p className="text-sm text-muted-foreground">{g.repo}</p>
        </section>
      ))}

      <section aria-labelledby="who" className="flex flex-col gap-3">
        <h2 id="who" className="text-xl font-semibold">
          Who is here
        </h2>
        {acting.length === 0 && stage.repoOnly && (
          <div className="flex flex-col gap-2 rounded-xl border border-dashed bg-card p-4 text-sm">
            <span className="flex items-center gap-2 font-semibold">
              <RoleAvatar role="designer" size="sm" /> The Designer (or om-ux-shape)
            </span>
            <span className="text-muted-foreground">
              SDLC.md gives this stop to the Designer: a person, or om-ux-shape doing the shaping. The chart has no
              column for it, so there are no RACI marks here.
            </span>
          </div>
        )}
        <ul className="flex flex-col gap-2">
          {acting.map(({ role, m }) => (
            <li key={role.id} className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-4">
              <span className="flex flex-wrap items-center gap-2">
                <RoleChip role={role.id} />
                <MarkDot mark={m.mark} size="md" />
                <span className="font-mono text-xs text-muted-foreground">{m.raci}</span>
              </span>
              <p className="text-sm">{m.you}</p>
              {m.agent && (
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MarkDot mark="agent" size="md" className="mt-0.5" />
                  <span className="min-w-0">{m.agent}</span>
                </p>
              )}
            </li>
          ))}
        </ul>
        {told.length > 0 && (
          <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            Kept informed:
            {told.map(({ role }) => (
              <RoleChip key={role.id} role={role.id} />
            ))}
          </p>
        )}
        <MarkLegend />
      </section>

      <section aria-labelledby="skills" className="flex flex-col gap-3">
        <h2 id="skills" className="text-xl font-semibold">
          Skills that run here
        </h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {stage.skills.map((name) => (
            <li key={name} className="flex min-w-0 flex-col gap-1 rounded-lg border bg-card p-3">
              <SkillChip name={name} className="self-start" />
              <span className="text-xs text-muted-foreground">{SKILL_BY_NAME[name]?.line}</span>
            </li>
          ))}
        </ul>
      </section>

      {stage.note && <RepoNote>{stage.note}</RepoNote>}
    </Frame>
  );
}
