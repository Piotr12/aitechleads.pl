import type { Metadata } from "next";
import Link from "@/app/docs4/_components/link";
import {
  ROBOTS,
  SKILLS,
  STAGES,
  chaptersForSkill,
  href,
  placementsForSkill,
  roleById,
  stageById,
  type Skill,
  type StageId,
} from "../_data";
import { Crumbs, ModeBadge } from "../_components/reference";
import { Avatar, ExternalLink, PageHeader, PrevNext, SectionNav, SectionTitle } from "../_components/ui";

export const metadata: Metadata = {
  title: "Every skill, by stage",
  robots: ROBOTS,
};

/** Each skill under the first stage where the chart places it; the rest at the end. */
function groupByStage(): { stage?: StageId; skills: Skill[] }[] {
  const order = STAGES.map((s) => s.id);
  const groups = new Map<StageId | "none", Skill[]>();
  for (const skill of SKILLS) {
    const stages = placementsForSkill(skill.id).map((c) => c.stage);
    const first = stages.length ? [...stages].sort((a, b) => order.indexOf(a) - order.indexOf(b))[0] : "none";
    groups.set(first, [...(groups.get(first) ?? []), skill]);
  }
  return [
    ...order.filter((s) => groups.has(s)).map((s) => ({ stage: s, skills: groups.get(s) ?? [] })),
    ...(groups.has("none") ? [{ stage: undefined, skills: groups.get("none") ?? [] }] : []),
  ];
}

function SkillCard({ skill }: { skill: Skill }) {
  const placements = placementsForSkill(skill.id);
  const chapters = chaptersForSkill(skill.id);
  return (
    <article id={skill.id} className="flex min-w-0 scroll-mt-6 flex-col gap-2 rounded-xl border bg-card p-4">
      <header className="flex flex-wrap items-center gap-2">
        <h3 className="font-mono text-sm font-semibold break-all">{skill.id}</h3>
        <ModeBadge mode={skill.mode} />
        {skill.buildingBlock && (
          <span className="rounded-full border border-dashed px-2 py-0.5 text-[11px] text-muted-foreground" title="Mainly composed by other skills">
            building block
          </span>
        )}
      </header>
      <p className="text-sm">{skill.summary}</p>
      <details className="group text-sm text-muted-foreground">
        <summary className="cursor-pointer text-xs font-medium text-foreground/80 hover:text-foreground">More</summary>
        <p className="mt-2">{skill.description}</p>
        {skill.notes?.map((n) => (
          <p key={n} className="mt-2 text-xs italic">
            {n}
          </p>
        ))}
      </details>
      {skill.example && (
        <code className="block overflow-x-auto rounded bg-zinc-950 px-2 py-1 font-mono text-xs whitespace-pre text-zinc-100">
          {skill.example}
        </code>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        {placements.length > 0 ? (
          <span className="flex flex-wrap items-center gap-1.5">
            On the chart:
            {placements.map((c) => (
              <Link
                key={`${c.role}-${c.stage}`}
                href={href.role(c.role)}
                title={`${roleById(c.role).name} at ${stageById(c.stage).name}`}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                <Avatar role={c.role} size="sm" />
                <span>{stageById(c.stage).short}</span>
              </Link>
            ))}
          </span>
        ) : (
          <span>Not on the chart.</span>
        )}
        {chapters.length > 0 && (
          <span>
            In the story:{" "}
            {chapters.map((c, i) => (
              <span key={c.slug}>
                {i > 0 && ", "}
                <Link href={href.chapter(c.slug)} className="underline underline-offset-2 hover:text-foreground">
                  ch. {c.number}
                </Link>
              </span>
            ))}
          </span>
        )}
        <ExternalLink path={skill.card}>{skill.card.startsWith("skills/") ? "SKILL.md" : "skill card"} ↗</ExternalLink>
      </div>
    </article>
  );
}

export default function SkillsPage() {
  const groups = groupByStage();
  return (
    <>
      <SectionNav part="details" />
      <Crumbs items={[{ label: "Details", href: href.details }, { label: "Skills" }]} />
      <PageHeader
        eyebrow="Reference"
        title="Every skill, by stage"
        lead={`All ${SKILLS.length} skills of the collection, each under the first stage where the chart places it. Autonomous skills run end to end unattended; interactive ones act once, may ask a question, and hand control back.`}
      />

      <nav aria-label="Skills by stage" className="flex flex-col gap-2 rounded-2xl border bg-card p-4">
        {groups.map((g) => (
          <div key={g.stage ?? "none"} className="flex min-w-0 flex-col gap-1 sm:flex-row sm:gap-3">
            <span className="w-36 shrink-0 text-xs font-medium text-muted-foreground">
              {g.stage ? `${stageById(g.stage).number}. ${stageById(g.stage).name}` : "Not on the chart"}
            </span>
            <span className="flex min-w-0 flex-wrap gap-1">
              {g.skills.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="rounded border px-1.5 py-0.5 font-mono text-[11px] break-all hover:bg-muted">
                  {s.id.replace(/^om-/, "")}
                </a>
              ))}
            </span>
          </div>
        ))}
      </nav>

      {groups.map((g) => (
        <section key={g.stage ?? "none"} className="flex flex-col gap-3">
          <SectionTitle
            aside={
              g.stage && (
                <Link href={href.stage(g.stage)} className="text-sm text-muted-foreground hover:text-foreground">
                  The stage →
                </Link>
              )
            }
          >
            {g.stage ? `${stageById(g.stage).number}. ${stageById(g.stage).name}` : "Not on the chart"}
          </SectionTitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {g.skills.map((s) => (
              <SkillCard key={s.id} skill={s} />
            ))}
          </div>
        </section>
      ))}

      <p className="text-sm text-muted-foreground">
        Upstream catalogue: <ExternalLink path="docs/skills/README.md">docs/skills/README.md</ExternalLink>. A
        repository can override any skill with a local copy at{" "}
        <code className="font-mono text-xs break-all">.ai/skills/&lt;name&gt;/SKILL.md</code>; local rules win, but cannot
        relax the installed skill&apos;s safety rules.
      </p>

      <PrevNext
        prev={{ href: href.gates, label: "The seven gates", hint: "Previous" }}
        next={{ href: href.home, label: "Contents", hint: "Back to the start" }}
      />
    </>
  );
}
