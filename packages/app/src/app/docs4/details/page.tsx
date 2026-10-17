import type { Metadata } from "next";
import Link from "@/app/docs4/_components/link";
import { GATES, ROBOTS, ROLES, SKILLS, STAGES, gatesForStage, href, skillsForStage } from "../_data";
import { Avatar, ExternalLink, GateFlag, PageHeader, PrevNext, SectionNav, SectionTitle } from "../_components/ui";

export const metadata: Metadata = {
  title: "Details",
  robots: ROBOTS,
};

const UPSTREAM_DOCS = [
  { path: "README.md", label: "README.md", note: "the pipeline, the skill catalogue, workflows by role" },
  { path: "SDLC.md", label: "SDLC.md", note: "stages, Definition of Ready, labels, the QA gate, the claim protocol" },
  { path: "CODE_REVIEW.md", label: "CODE_REVIEW.md", note: "the review rules om-code-review applies" },
  { path: "DECISIONS.md", label: "DECISIONS.md", note: "why the collection is built the way it is" },
  { path: "docs/skills/README.md", label: "docs/skills/", note: "one card per skill, with parameters" },
];

export default function DetailsPage() {
  return (
    <>
      <SectionNav part="details" />
      <PageHeader
        eyebrow="Part 4"
        title="Details"
        lead="The reference layer: every role's full flow, every stage's cast, the gates with their enforcement and exceptions, and every skill. Organised for looking things up, with links upstream."
      />

      <section className="flex flex-col gap-3">
        <SectionTitle aside={<Link href={href.perspectives} className="text-sm text-muted-foreground hover:text-foreground">All lanes →</Link>}>
          Roles
        </SectionTitle>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((r) => (
            <li key={r.id} className="min-w-0">
              <Link href={href.role(r.id)} className="flex h-full min-w-0 items-center gap-3 rounded-xl border bg-card p-3 hover:bg-muted/50">
                <Avatar role={r.id} />
                <span className="flex min-w-0 flex-col">
                  <span className="font-medium">{r.name}</span>
                  <span className="text-xs text-muted-foreground">{r.owns}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="stages" className="flex scroll-mt-6 flex-col gap-3">
        <SectionTitle>Stages</SectionTitle>
        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {STAGES.map((s) => (
            <li key={s.id} className="min-w-0">
              <Link href={href.stage(s.id)} className="flex h-full min-w-0 items-start gap-3 rounded-xl border bg-card p-3 hover:bg-muted/50">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs">{s.number}</span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex flex-wrap items-center gap-1.5 font-medium">
                    {s.name}
                    {gatesForStage(s.id).map((g) => (
                      <GateFlag key={g.id} id={g.id} plain />
                    ))}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.question} · {skillsForStage(s.id).length} skills on the chart
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link href={href.gates} className="flex min-w-0 flex-col gap-2 rounded-xl border border-red-600/30 bg-card p-4 hover:bg-muted/50 dark:border-red-500/30">
          <span className="font-semibold">The seven gates</span>
          <span className="flex flex-wrap gap-1">
            {GATES.map((g) => (
              <GateFlag key={g.id} id={g.id} plain />
            ))}
          </span>
          <span className="text-sm text-muted-foreground">Who signs, what they approve, how it is enforced, and the written exceptions.</span>
        </Link>
        <Link href={href.skills} className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-4 hover:bg-muted/50">
          <span className="font-semibold">All {SKILLS.length} skills</span>
          <span className="text-sm text-muted-foreground">
            Grouped by stage, with mode, an example command, where the chart places them and where they appear in the story.
          </span>
        </Link>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>Upstream</SectionTitle>
        <ul className="flex flex-col gap-1.5 text-sm">
          {UPSTREAM_DOCS.map((d) => (
            <li key={d.path} className="min-w-0">
              <ExternalLink path={d.path}>{d.label}</ExternalLink>{" "}
              <span className="text-muted-foreground">: {d.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <PrevNext
        prev={{ href: href.perspectives, label: "Perspectives", hint: "Part 3" }}
        next={{ href: href.role(ROLES[0].id), label: ROLES[0].name, hint: "First role" }}
      />
    </>
  );
}
