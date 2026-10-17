import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RoleLane } from "../../_components/diagrams";
import { DutyLine, GateTag, LayerTag, SkillChip } from "../../_components/marks";
import { DocsShell, ExternalLink, PageHeader, Pager, Section } from "../../_components/shell";
import {
  ROLES,
  cellsForRole,
  gatesOwnedBy,
  getRole,
  getSkill,
  href,
  skillsForRole,
  stageById,
  upstream,
} from "../../_data";

export function generateStaticParams() {
  return ROLES.map((r) => ({ role: r.id }));
}

export async function generateMetadata({ params }: PageProps<"/docs1/roles/[role]">): Promise<Metadata> {
  const role = getRole((await params).role);
  return {
    title: role ? `${role.name} · AI SDLC skills guide` : "Role not found",
    robots: { index: false, follow: false },
  };
}

export default async function RolePage({ params }: PageProps<"/docs1/roles/[role]">) {
  const role = getRole((await params).role);
  if (!role) notFound();

  const cells = cellsForRole(role.id);
  const gates = gatesOwnedBy(role.id);
  const skills = skillsForRole(role.id);
  const i = ROLES.findIndex((r) => r.id === role.id);
  const prev = ROLES[i - 1];
  const next = ROLES[i + 1];

  return (
    <DocsShell
      active={`role:${role.id}`}
      crumbs={[{ label: "Guide", href: href.home }, { label: "Roles", href: href.roles }, { label: role.name }]}
    >
      <PageHeader
        eyebrow={
          <>
            <span>Actor</span>
            <LayerTag layer={role.layer} />
            <span>{role.tagline}</span>
          </>
        }
        title={role.name}
        lead={role.summary}
      />

      <Section
        title="Lane across the stages"
        description={`Touches ${cells.length} of 10 stages. Red-edged cells hold a gate this actor takes part in.`}
      >
        <div className="rounded-xl border bg-card p-3 sm:p-4">
          <RoleLane role={role.id} />
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Responsibilities">
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm">
            {role.responsibilities.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Section>
        <Section title="In the skills repository">
          <p className="text-sm text-muted-foreground">{role.repoMapping}</p>
          {role.guide ? (
            <p className="text-sm">
              Role guide:{" "}
              <ExternalLink href={upstream(role.guide.path)}>{role.guide.title}</ExternalLink>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No dedicated role guide upstream.</p>
          )}
        </Section>
      </div>

      <Section
        title="Flow, stage by stage"
        description="The stages this actor touches, in order, with their duties and the skills used."
      >
        <ol className="flex flex-col">
          {cells.map((cell, idx) => {
            const stage = stageById(cell.stage);
            const last = idx === cells.length - 1;
            return (
              <li key={cell.stage} className="relative flex gap-4 pb-5 last:pb-0">
                {!last ? <span aria-hidden className="absolute top-9 bottom-0 left-[17px] w-px bg-border" /> : null}
                <span
                  className={
                    cell.gates
                      ? "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-destructive bg-background text-sm font-semibold tabular-nums"
                      : "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border bg-background text-sm font-semibold tabular-nums"
                  }
                >
                  {stage.number}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-xl border bg-card p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={href.stage(stage.id)} className="font-medium hover:underline">
                      {stage.name}
                    </Link>
                    {cell.gates?.map((g) => (
                      <GateTag key={g} id={g} withName />
                    ))}
                  </div>
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
                    {cell.duties.map((duty, k) => (
                      <DutyLine key={k} duty={duty} />
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section title="Gates">
        {gates.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            This actor owns no approval gate. Its decisions at gates owned by others are shown in the flow above.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {gates.map((gate) => (
              <Link
                key={gate.id}
                href={href.gate(gate.id)}
                className="flex flex-col gap-2 rounded-xl border border-destructive/40 bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <GateTag id={gate.id} withName link={false} />
                  <span className="text-xs text-muted-foreground">{stageById(gate.stage).name}</span>
                </span>
                <span className="text-sm">{gate.question}</span>
              </Link>
            ))}
          </div>
        )}
      </Section>

      <Section title="Skills on this actor's lane">
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No skills are attached to this actor on the chart.</p>
        ) : (
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
                    <span className="font-mono text-[13px] font-medium">{id}</span>
                    <span className="text-sm text-muted-foreground">{skill.summary}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Pager
        prev={prev ? { label: prev.name, href: href.role(prev.id) } : { label: "All roles", href: href.roles }}
        next={next ? { label: next.name, href: href.role(next.id) } : { label: "Approval gates", href: href.gates }}
      />
    </DocsShell>
  );
}
