import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@atl/ui/components/badge";
import { cn } from "@atl/ui/lib/utils";
import { DutyLine, GateTag, SkillChip } from "../../_components/marks";
import { ModeBadge } from "../../_components/skill-list";
import { SourceNote } from "../../_components/source-note";
import { DocsShell, ExternalLink, PageHeader, Pager, Section } from "../../_components/shell";
import { SKILLS, STAGES, getSkill, href, placementsForSkill, roleById, stageById, upstream } from "../../_data";

export function generateStaticParams() {
  return SKILLS.map((s) => ({ skill: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/docs1/skills/[skill]">): Promise<Metadata> {
  const skill = getSkill((await params).skill);
  return {
    title: skill ? `${skill.id} · AI SDLC skills guide` : "Skill not found",
    robots: { index: false, follow: false },
  };
}

export default async function SkillPage({ params }: PageProps<"/docs1/skills/[skill]">) {
  const skill = getSkill((await params).skill);
  if (!skill) notFound();

  const placements = placementsForSkill(skill.id);
  const stagesUsed = new Set(placements.map((p) => p.stage));
  const usedBy = SKILLS.filter((s) => s.worksWith.includes(skill.id)).map((s) => s.id);
  const i = SKILLS.findIndex((s) => s.id === skill.id);
  const prev = SKILLS[i - 1];
  const next = SKILLS[i + 1];

  return (
    <DocsShell
      active="skills"
      crumbs={[
        { label: "Guide", href: href.home },
        { label: "Skills", href: href.skills },
        { label: skill.id },
      ]}
    >
      <PageHeader
        eyebrow={
          <>
            <span>Skill</span>
            <ModeBadge mode={skill.mode} />
            {skill.buildingBlock ? <Badge variant="secondary">building block</Badge> : null}
          </>
        }
        title={skill.id}
        lead={skill.summary}
      />

      <Section title="Stages where it is used" description="Highlighted stages are where the RACI chart places this skill.">
        <ol className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
          {STAGES.map((stage) => {
            const used = stagesUsed.has(stage.id);
            return (
              <li key={stage.id}>
                <Link
                  href={href.stage(stage.id)}
                  className={cn(
                    "flex h-full min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg border p-1.5 text-center text-[11px] leading-tight transition-colors",
                    used ? "border-foreground bg-foreground text-background" : "border-dashed text-muted-foreground hover:bg-muted",
                  )}
                  aria-label={`${stage.name}${used ? " (used here)" : ""}`}
                >
                  <span className="font-semibold tabular-nums">{stage.number}</span>
                  <span>{stage.name}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section title="What it does">
        <p className="max-w-3xl text-sm leading-relaxed">{skill.description}</p>
        {skill.example ? (
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Example call</p>
            <pre className="w-fit max-w-full overflow-x-auto rounded-lg border bg-muted/40 px-3 py-2 font-mono text-xs">
              {skill.example}
            </pre>
          </div>
        ) : null}
      </Section>

      <Section title="On the RACI chart">
        {placements.length === 0 ? (
          <p className="text-sm text-muted-foreground">This skill is not placed on the chart.</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {placements.map((cell) => {
              const stage = stageById(cell.stage);
              const role = roleById(cell.role);
              return (
                <li key={`${cell.role}-${cell.stage}`} className="flex flex-col gap-2 rounded-xl border bg-card p-4">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Link href={href.role(role.id)} className="font-medium hover:underline">
                      {role.name}
                    </Link>
                    <span className="text-muted-foreground">at</span>
                    <Link href={href.stage(stage.id)} className="font-medium hover:underline">
                      {stage.number}. {stage.name}
                    </Link>
                    {cell.gates?.map((g) => (
                      <GateTag key={g} id={g} />
                    ))}
                  </div>
                  <ul className="flex flex-col gap-1.5 text-sm">
                    {cell.duties.map((duty, k) => (
                      <DutyLine key={k} duty={duty} />
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Works with" description="Companion skills it invokes, hands off to, or pairs with.">
          {skill.worksWith.length === 0 ? (
            <p className="text-sm text-muted-foreground">No companion skills.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {skill.worksWith.map((id) => (
                <SkillChip key={id} id={id} />
              ))}
            </div>
          )}
        </Section>
        <Section title="Referenced by" description="Skills that list this one as a companion.">
          {usedBy.length === 0 ? (
            <p className="text-sm text-muted-foreground">None.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {usedBy.map((id) => (
                <SkillChip key={id} id={id} />
              ))}
            </div>
          )}
        </Section>
      </div>

      {skill.notes ? <SourceNote notes={skill.notes} /> : null}

      <Section title="Upstream">
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm">
          <li>
            <ExternalLink href={upstream(skill.card)}>{skill.card}</ExternalLink>
            {skill.card.startsWith("docs/") ? " (skill card with all parameters)" : ""}
          </li>
          {skill.card.startsWith("docs/") ? (
            <li>
              <ExternalLink href={upstream(`skills/${skill.id}/SKILL.md`)}>{`skills/${skill.id}/SKILL.md`}</ExternalLink>{" "}
              (full instructions)
            </li>
          ) : null}
        </ul>
      </Section>

      <Pager
        prev={prev ? { label: prev.id, href: href.skill(prev.id) } : { label: "Skills catalogue", href: href.skills }}
        next={next ? { label: next.id, href: href.skill(next.id) } : { label: "Skills catalogue", href: href.skills }}
      />
    </DocsShell>
  );
}
