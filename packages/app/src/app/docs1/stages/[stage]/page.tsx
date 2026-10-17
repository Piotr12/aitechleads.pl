import type { Metadata } from "next";
import Link from "@/app/docs1/_components/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { StageRail } from "../../_components/diagrams";
import { DutyLine, GateTag, LayerTag, SkillChip } from "../../_components/marks";
import { SourceNote } from "../../_components/source-note";
import { DocsShell, PageHeader, Pager, Section } from "../../_components/shell";
import {
  ROLES,
  STAGES,
  cellFor,
  gatesForStage,
  getSkill,
  getStage,
  href,
  neighbours,
  roleById,
  skillsForStage,
} from "../../_data";

export function generateStaticParams() {
  return STAGES.map((s) => ({ stage: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/docs1/stages/[stage]">): Promise<Metadata> {
  const stage = getStage((await params).stage);
  return {
    title: stage ? `${stage.number}. ${stage.name} · AI SDLC skills guide` : "Stage not found",
    robots: { index: false, follow: false },
  };
}

export default async function StagePage({ params }: PageProps<"/docs1/stages/[stage]">) {
  const stage = getStage((await params).stage);
  if (!stage) notFound();

  const { prev, next } = neighbours(stage.id);
  const gates = gatesForStage(stage.id);
  const skills = skillsForStage(stage.id);
  const involved = ROLES.flatMap((role) => {
    const cell = cellFor(role.id, stage.id);
    return cell ? [{ role, cell }] : [];
  });
  const notInvolved = ROLES.filter((role) => !cellFor(role.id, stage.id));

  return (
    <DocsShell
      active={`stage:${stage.id}`}
      crumbs={[
        { label: "Guide", href: href.home },
        { label: "Stages", href: href.stages },
        { label: stage.name },
      ]}
    >
      <PageHeader
        eyebrow={
          <>
            <span>
              Stage {stage.number} of {STAGES.length}
            </span>
            <LayerTag layer={stage.layer} />
            <span>
              SDLC.md: <span className="text-foreground">{stage.sdlcName}</span>
            </span>
          </>
        }
        title={stage.name}
        lead={stage.summary}
      />

      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <StageRail active={stage.id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Section title="What happens">
          <div className="flex flex-col gap-3 text-sm leading-relaxed">
            {stage.purpose.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Section>
        <dl className="flex h-fit flex-col gap-4 rounded-xl border bg-card p-4 text-sm">
          <div className="flex flex-col gap-1">
            <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Driven by</dt>
            <dd>{stage.drivenBy}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Done when</dt>
            <dd>{stage.doneWhen}</dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Gates</dt>
            <dd className="flex flex-col gap-1.5">
              {gates.length === 0 ? (
                <span className="text-muted-foreground">No approval gate at this stage.</span>
              ) : (
                gates.map((g) => (
                  <span key={g.id} className="flex flex-wrap items-center gap-2">
                    <GateTag id={g.id} withName />
                    <span className="text-muted-foreground">{g.ownerLabel}</span>
                  </span>
                ))
              )}
            </dd>
          </div>
        </dl>
      </div>

      <Section title="Inputs and outputs">
        <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-xl border border-dashed p-4">
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Inputs</p>
            <ul className="flex list-disc flex-col gap-1 pl-4 text-sm">
              {stage.inputs.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <span className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm font-medium">
              {stage.name}
              <ArrowRight className="size-4 rotate-90 md:rotate-0" aria-hidden />
            </span>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Outputs</p>
            <ul className="flex list-disc flex-col gap-1 pl-4 text-sm">
              {stage.outputs.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        title="Who does what"
        description="Each actor's cell from the RACI chart for this stage, with the skills used in it."
      >
        <ul className="flex flex-col gap-3">
          {involved.map(({ role, cell }) => (
            <li
              key={role.id}
              className={
                cell.gates
                  ? "rounded-xl border border-destructive/40 bg-card p-4 shadow-[inset_3px_0_0_var(--destructive)]"
                  : "rounded-xl border bg-card p-4"
              }
            >
              <div className="flex flex-col gap-3 md:flex-row md:gap-6">
                <div className="flex flex-col gap-1.5 md:w-52 md:shrink-0">
                  <Link href={href.role(role.id)} className="font-medium hover:underline">
                    {role.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">{role.tagline}</span>
                  {cell.gates ? (
                    <span className="flex flex-wrap gap-1">
                      {cell.gates.map((g) => (
                        <GateTag key={g} id={g} withName />
                      ))}
                    </span>
                  ) : null}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  {cell.label || cell.skills ? (
                    <div className="flex flex-wrap items-center gap-1">
                      {cell.label ? (
                        <span className="mr-1 text-xs font-medium text-muted-foreground">{cell.label}</span>
                      ) : null}
                      {cell.skills?.map((s) => (
                        <SkillChip key={s} id={s} />
                      ))}
                    </div>
                  ) : null}
                  <ul className="flex flex-col gap-1.5 text-sm">
                    {cell.duties.map((duty, i) => (
                      <DutyLine key={i} duty={duty} />
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {notInvolved.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            Not involved at this stage:{" "}
            {notInvolved.map((role, i) => (
              <span key={role.id}>
                {i > 0 ? ", " : ""}
                <Link href={href.role(role.id)} className="underline-offset-4 hover:underline">
                  {roleById(role.id).name}
                </Link>
              </span>
            ))}
            .
          </p>
        ) : null}
      </Section>

      {gates.length > 0 ? (
        <Section title={gates.length > 1 ? "Gates at this stage" : "Gate at this stage"}>
          <div className="grid gap-3 md:grid-cols-2">
            {gates.map((gate) => (
              <div key={gate.id} className="flex flex-col gap-2 rounded-xl border border-destructive/40 bg-card p-4">
                <span className="flex flex-wrap items-center gap-2">
                  <GateTag id={gate.id} withName />
                  <span className="text-xs text-muted-foreground">Owner: {gate.ownerLabel}</span>
                </span>
                <p className="text-sm font-medium">{gate.question}</p>
                <p className="text-sm text-muted-foreground">{gate.approves}</p>
                <Link href={href.gate(gate.id)} className="text-sm font-medium hover:underline">
                  Enforcement and exceptions
                </Link>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title="Skills used at this stage" description="As placed on the RACI chart.">
        <ul className="grid gap-2 sm:grid-cols-2">
          {skills.map((id) => {
            const skill = getSkill(id);
            if (!skill) return null;
            return (
              <li key={id}>
                <Link
                  href={href.skill(id)}
                  className="flex h-full flex-col gap-1 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[13px] font-medium">{id}</span>
                    <span className="text-[11px] text-muted-foreground">{skill.mode}</span>
                  </span>
                  <span className="text-sm text-muted-foreground">{skill.summary}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      {stage.notes ? <SourceNote notes={stage.notes} /> : null}

      <Pager
        prev={prev ? { label: `${prev.number}. ${prev.name}`, href: href.stage(prev.id) } : { label: "Overview", href: href.home }}
        next={next ? { label: `${next.number}. ${next.name}`, href: href.stage(next.id) } : { label: "Approval gates", href: href.gates }}
      />
    </DocsShell>
  );
}
