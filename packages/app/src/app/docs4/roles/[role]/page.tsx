import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/app/docs4/_components/link";
import {
  CHAPTERS,
  ROBOTS,
  ROLES,
  STAGES,
  cellFor,
  gatesOwnedBy,
  getRole,
  href,
  roleNeighbours,
  skillById,
  skillsForRole,
} from "../../_data";
import { LaneHeader, RoleLane } from "../../_components/lane";
import { Crumbs, DutyLine, GateCard, ModeBadge } from "../../_components/reference";
import {
  Avatar,
  Callout,
  Dot,
  ExternalLink,
  GateFlag,
  Legend,
  PageHeader,
  PrevNext,
  PresenceMark,
  SectionNav,
  SectionTitle,
  SkillChip,
} from "../../_components/ui";

export function generateStaticParams() {
  return ROLES.map((r) => ({ role: r.id }));
}

export async function generateMetadata({ params }: PageProps<"/docs4/roles/[role]">): Promise<Metadata> {
  const role = getRole((await params).role);
  return { title: role ? `${role.name}, stage by stage` : "Role not found", robots: ROBOTS };
}

const LISTS = [
  { key: "decides", title: "Decides", mark: "decides" },
  { key: "supervises", title: "Supervises", mark: "supervises" },
  { key: "delegates", title: "Delegates", mark: "agent" },
  { key: "offTheDesk", title: "Off the desk", mark: undefined },
] as const;

export default async function RolePage({ params }: PageProps<"/docs4/roles/[role]">) {
  const role = getRole((await params).role);
  if (!role) notFound();
  const { prev, next } = roleNeighbours(role.id);
  const gates = gatesOwnedBy(role.id);
  const skills = skillsForRole(role.id);
  const flow = STAGES.flatMap((s) => {
    const cell = cellFor(role.id, s.id);
    return cell ? [{ stage: s, cell }] : [];
  });
  const appearances = CHAPTERS.flatMap((c) => {
    const member = c.cast.find((m) => m.role === role.id);
    return member ? [{ chapter: c, member }] : [];
  });

  return (
    <>
      <SectionNav part="details" />
      <Crumbs items={[{ label: "Details", href: href.details }, { label: "Roles", href: href.perspectives }, { label: role.name }]} />

      <PageHeader eyebrow={`Role · ${role.layer} layer${role.optional ? " · optional" : ""}`} title={role.name} lead={`Owns ${role.owns.charAt(0).toLowerCase()}${role.owns.slice(1)}.`}>
        <div className="flex min-w-0 items-center gap-3 rounded-xl border bg-card p-3">
          <Avatar role={role.id} size="lg" />
          <p className="min-w-0 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">In the story: </span>
            {role.character}
          </p>
        </div>
      </PageHeader>

      <section className="flex flex-col gap-2">
        <SectionTitle>The lane</SectionTitle>
        <div className="flex flex-col gap-1 rounded-2xl border bg-card p-3 sm:p-4">
          <LaneHeader />
          <RoleLane role={role.id} />
        </div>
        <Legend />
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {LISTS.map((l) => (
          <div key={l.key} className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              {l.mark ? <Dot kind={l.mark} /> : <span aria-hidden className="inline-block size-2.5 rounded-sm border border-dashed border-foreground/40" />}
              {l.title}
            </h2>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
              {role[l.key].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>The flow, stage by stage</SectionTitle>
        <ol className="relative flex flex-col gap-4 border-l-2 pl-5">
          {flow.map(({ stage, cell }) => (
            <li key={stage.id} className="relative flex min-w-0 flex-col gap-2">
              <span className="absolute top-1 -left-[29px] flex size-4 items-center justify-center rounded-full border-2 bg-background" aria-hidden />
              <p className="flex flex-wrap items-center gap-2">
                <Link href={href.stage(stage.id)} className="font-semibold hover:underline">
                  {stage.number}. {stage.name}
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
                <ul className="flex flex-col gap-1.5">
                  {cell.skills.map((s) => {
                    const skill = skillById(s);
                    return (
                      <li key={s} className="flex min-w-0 flex-col gap-0.5 rounded-lg bg-muted/40 px-3 py-2 sm:flex-row sm:items-baseline sm:gap-3">
                        <SkillChip id={s} />
                        <span className="min-w-0 text-sm text-muted-foreground">{skill.summary}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>

      {gates.length > 0 && (
        <section className="flex flex-col gap-4">
          <SectionTitle>{gates.length === 1 ? "The gate this role signs" : "The gates this role signs"}</SectionTitle>
          <div className="grid grid-cols-1 gap-3">
            {gates.map((g) => (
              <GateCard key={g.id} gate={g} />
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionTitle>Commands to start from</SectionTitle>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {skills.map((s) => {
              const skill = skillById(s);
              return (
                <li key={s} className="flex min-w-0 flex-col gap-1.5 rounded-lg border bg-card p-3">
                  <span className="flex flex-wrap items-center gap-2">
                    <SkillChip id={s} />
                    <ModeBadge mode={skill.mode} />
                  </span>
                  {skill.example && (
                    <code className="block overflow-x-auto rounded bg-zinc-950 px-2 py-1 font-mono text-xs whitespace-pre text-zinc-100">
                      {skill.example}
                    </code>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <SectionTitle>{role.person} in the story</SectionTitle>
        <ul className="flex flex-col divide-y rounded-xl border bg-card">
          {appearances.map(({ chapter, member }) => (
            <li key={chapter.slug}>
              <Link href={href.chapter(chapter.slug)} className="flex min-w-0 items-start gap-3 px-4 py-3 hover:bg-muted/50">
                <span className="w-5 shrink-0 text-right font-mono text-sm text-muted-foreground">{chapter.number}</span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-medium">{chapter.title}</span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <PresenceMark as={member.as} /> {member.note}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Callout title="In the skills repository">
        {role.repoMapping}
        {role.guide && (
          <>
            {" "}Upstream guide: <ExternalLink path={role.guide}>{role.guide}</ExternalLink>.
          </>
        )}
      </Callout>

      <PrevNext
        prev={prev ? { href: href.role(prev.id), label: prev.name, hint: "Previous role" } : { href: href.details, label: "Details", hint: "Back to" }}
        next={next ? { href: href.role(next.id), label: next.name, hint: "Next role" } : { href: href.stage(STAGES[0].id), label: "The stages, one by one", hint: "Next" }}
      />
    </>
  );
}
