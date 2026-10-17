import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/app/docs4/_components/link";
import {
  ROBOTS,
  ROLES,
  STAGES,
  cellFor,
  chaptersForStage,
  gatesForStage,
  getStage,
  href,
  skillById,
  skillsForStage,
  stageNeighbours,
} from "../../_data";
import { Crumbs, DutyLine, GateCard, ModeBadge } from "../../_components/reference";
import { StageRail } from "../../_components/stage-rail";
import { Avatar, Callout, GateFlag, Legend, PageHeader, PrevNext, SectionNav, SectionTitle, SkillChip } from "../../_components/ui";

export function generateStaticParams() {
  return STAGES.map((s) => ({ stage: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/docs4/stages/[stage]">): Promise<Metadata> {
  const stage = getStage((await params).stage);
  return { title: stage ? `Stage ${stage.number}: ${stage.name}` : "Stage not found", robots: ROBOTS };
}

export default async function StagePage({ params }: PageProps<"/docs4/stages/[stage]">) {
  const stage = getStage((await params).stage);
  if (!stage) notFound();
  const { prev, next } = stageNeighbours(stage.id);
  const gates = gatesForStage(stage.id);
  const skills = skillsForStage(stage.id);
  const chapters = chaptersForStage(stage.id);
  const involved = ROLES.flatMap((r) => {
    const cell = cellFor(r.id, stage.id);
    return cell ? [{ role: r, cell }] : [];
  });
  const absent = ROLES.filter((r) => !cellFor(r.id, stage.id));

  return (
    <>
      <SectionNav part="details" />
      <Crumbs items={[{ label: "Details", href: href.details }, { label: "Stages", href: href.details + "#stages" }, { label: stage.name }]} />
      <StageRail active={[stage.id]} />

      <PageHeader
        eyebrow={`Stage ${stage.number} of ${STAGES.length} · ${stage.layer} layer`}
        title={stage.name}
        lead={stage.question}
      />

      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-4 md:col-span-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">What happens</p>
          <p className="text-sm">{stage.what}</p>
        </div>
        <div className="flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-4 md:col-span-2">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Driven by</p>
          <p className="font-mono text-xs break-words">{stage.drivenBy}</p>
        </div>
        <div className="flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Done when</p>
          <p className="text-sm">{stage.doneWhen}</p>
        </div>
      </section>

      {gates.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionTitle>Gates at this stage</SectionTitle>
          {gates.map((g) => (
            <GateCard key={g.id} gate={g} compact />
          ))}
          <Link href={href.gates} className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground">
            Enforcement and exceptions for every gate →
          </Link>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <SectionTitle>Who does what here</SectionTitle>
        <ul className="flex flex-col gap-3">
          {involved.map(({ role, cell }) => (
            <li key={role.id} className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-4">
              <p className="flex flex-wrap items-center gap-2">
                <Avatar role={role.id} size="sm" />
                <Link href={href.role(role.id)} className="font-medium hover:underline">
                  {role.name}
                </Link>
                {cell.label && <span className="text-xs text-muted-foreground italic">{cell.label}</span>}
                {cell.gates?.map((g) => (
                  <GateFlag key={g} id={g} />
                ))}
              </p>
              <ul className="flex flex-col gap-1">
                {cell.duties.map((d, i) => (
                  <DutyLine key={i} duty={d} />
                ))}
              </ul>
              {cell.skills && (
                <p className="flex flex-wrap gap-1.5">
                  {cell.skills.map((s) => (
                    <SkillChip key={s} id={s} muted />
                  ))}
                </p>
              )}
            </li>
          ))}
        </ul>
        {absent.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Not on the chart at this stage: {absent.map((r) => r.name).join(", ")}.
          </p>
        )}
        <Legend />
      </section>

      {skills.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionTitle>Skills placed here on the chart</SectionTitle>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {skills.map((s) => {
              const skill = skillById(s);
              return (
                <li key={s} className="flex min-w-0 flex-col gap-1.5 rounded-lg border bg-card p-3">
                  <span className="flex flex-wrap items-center gap-2">
                    <SkillChip id={s} />
                    <ModeBadge mode={skill.mode} />
                  </span>
                  <span className="text-sm text-muted-foreground">{skill.summary}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {chapters.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionTitle>This stage in the story</SectionTitle>
          <ul className="flex flex-col divide-y rounded-xl border bg-card">
            {chapters.map((c) => (
              <li key={c.slug}>
                <Link href={href.chapter(c.slug)} className="flex min-w-0 items-start gap-3 px-4 py-3 hover:bg-muted/50">
                  <span className="w-5 shrink-0 text-right font-mono text-sm text-muted-foreground">{c.number}</span>
                  <span className="flex min-w-0 flex-col">
                    <span className="font-medium">{c.title}</span>
                    <span className="text-sm text-muted-foreground">{c.logline}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {stage.repoNote && <Callout title="The chart and the repository">{stage.repoNote}</Callout>}

      <PrevNext
        prev={prev ? { href: href.stage(prev.id), label: `${prev.number}. ${prev.name}`, hint: "Previous stage" } : { href: href.details, label: "Details", hint: "Back to" }}
        next={next ? { href: href.stage(next.id), label: `${next.number}. ${next.name}`, hint: "Next stage" } : { href: href.gates, label: "The seven gates", hint: "Next" }}
      />
    </>
  );
}
