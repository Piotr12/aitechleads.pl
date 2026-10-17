import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DiagramIcon } from "./_components/icons";
import { DotMatrix, StageRail } from "./_components/diagrams";
import { Legend } from "./_components/legend";
import { GateTag, LayerTag } from "./_components/marks";
import { DocsShell, ExternalLink, PageHeader, Section } from "./_components/shell";
import { GATES, ROLES, SKILLS, STAGES, cellsForRole, gatesOwnedBy, href, upstream, UPSTREAM } from "./_data";

export const metadata: Metadata = {
  title: "AI SDLC skills: reference guide",
  robots: { index: false, follow: false },
};

const ENTRY_POINTS = [
  {
    title: "Flows & entry paths",
    href: href.flows,
    text: "How work enters (idea, brief, spec, issue) and how the skills chain to a merged PR.",
    icon: "flow" as const,
  },
  {
    title: "Stages",
    href: href.stages,
    text: "The ten stages: purpose, inputs and outputs, who does what, skills, gates.",
    icon: "rail" as const,
  },
  {
    title: "Roles",
    href: href.roles,
    text: "The seven actors and each one's lane across the stages.",
    icon: "lane" as const,
  },
  {
    title: "Approval gates",
    href: href.gates,
    text: "G1 to G7: who approves what, how it is enforced, and the allowed exceptions.",
    icon: "gate" as const,
  },
  {
    title: "Skills catalogue",
    href: href.skills,
    text: `All ${SKILLS.length} skills by stage, by role and A to Z, with links to the upstream cards.`,
    icon: "grid" as const,
  },
  {
    title: "RACI matrix",
    href: href.matrix,
    text: "The full chart: every actor, every stage, every duty, filterable.",
    icon: "matrix" as const,
  },
];

export default function Docs1Home() {
  return (
    <DocsShell active="home" crumbs={[{ label: "AI SDLC skills guide" }]}>
      <PageHeader
        eyebrow={<span>Reference guide · open-mercato/skills</span>}
        title="The AI SDLC skills, stage by stage"
        lead={
          <>
            The open-mercato skills are a set of {SKILLS.length} agent skills that run a software delivery
            process from product discovery to a merged pull request. Agents carry out the work; people own
            the decisions and the approvals. This guide maps which actor, with which skill, acts at which
            stage.
          </>
        }
      />

      <Section
        title="Two layers"
        description="The process is installed in two parts. The delivery layer is the core; the product layer is optional and added on top."
      >
        <div className="grid gap-3 md:grid-cols-[1fr_3fr]">
          <div className="flex flex-col gap-2 rounded-xl border border-dashed bg-card p-4">
            <LayerTag layer="product" />
            <p className="font-medium">Product / discovery</p>
            <p className="text-sm text-muted-foreground">
              Establishes the product context, shapes ideas and designs the flow before any ticket exists.
              Set up by <code className="font-mono text-xs">om-setup-discovery-pipeline</code>.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border bg-card p-4">
            <LayerTag layer="delivery" />
            <p className="font-medium">Delivery</p>
            <p className="text-sm text-muted-foreground">
              Takes a ready ticket or task brief through triage, implementation, pull request, review, QA,
              merge and cleanup. Set up by <code className="font-mono text-xs">om-setup-agent-pipeline</code>,
              which writes <code className="font-mono text-xs">.ai/agentic.config.json</code> and{" "}
              <code className="font-mono text-xs">SDLC.md</code>.
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="The ten stages"
        description="Select a stage for its purpose, inputs and outputs, actors and skills. Red markers are approval gates."
      >
        <div className="rounded-xl border bg-card p-4 sm:p-6">
          <StageRail />
        </div>
      </Section>

      <Section
        title="The seven actors"
        description="Each actor has a lane across the stages. Counts show the stages each one touches and the gates they own."
      >
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {ROLES.map((role) => {
            const touched = cellsForRole(role.id).length;
            const gates = gatesOwnedBy(role.id);
            return (
              <li key={role.id}>
                <Link
                  href={href.role(role.id)}
                  className="flex h-full flex-col gap-2 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <span className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-full bg-muted font-mono text-xs font-semibold">
                      {role.short}
                    </span>
                    <span className="font-medium">{role.name}</span>
                  </span>
                  <span className="text-sm text-muted-foreground">{role.tagline}</span>
                  <span className="mt-auto flex flex-wrap items-center gap-1.5 pt-1 text-xs text-muted-foreground">
                    <span>
                      {touched} of {STAGES.length} stages
                    </span>
                    {gates.map((g) => (
                      <GateTag key={g.id} id={g.id} link={false} />
                    ))}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section
        title="Who acts where"
        description="A compact view of the RACI chart. Hover a mark for the duty, or open the full matrix for the text."
      >
        <DotMatrix />
        <Link href={href.matrix} className="inline-flex w-fit items-center gap-1 text-sm font-medium hover:underline">
          Open the full RACI matrix <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>

      <Section
        title="Seven approval gates"
        description="People approve; agents never grant an approval on a person's behalf. Blocked work cannot merge."
      >
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {GATES.map((gate) => (
            <li key={gate.id}>
              <Link
                href={href.gate(gate.id)}
                className="flex h-full flex-col gap-1.5 rounded-xl border border-destructive/30 bg-card p-3 transition-colors hover:bg-muted/50"
              >
                <GateTag id={gate.id} link={false} />
                <span className="text-sm font-medium">{gate.name}</span>
                <span className="text-xs text-muted-foreground">
                  {gate.ownerLabel} · {STAGES.find((s) => s.id === gate.stage)?.name}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Legend">
        <Legend />
      </Section>

      <Section title="Where to go next">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ENTRY_POINTS.map((entry) => (
            <li key={entry.href}>
              <Link
                href={entry.href}
                className="group flex h-full gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <DiagramIcon kind={entry.icon} />
                <span className="flex flex-col gap-1">
                  <span className="flex items-center gap-1 font-medium">
                    {entry.title}
                    <ArrowRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  </span>
                  <span className="text-sm text-muted-foreground">{entry.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Sources">
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
          <li>
            The chart &ldquo;AI SDLC RACI: who, with which skill, at which stage&rdquo; (AI_TechLeaders).
          </li>
          <li>
            The skills repository: <ExternalLink href={UPSTREAM}>open-mercato/skills</ExternalLink>, in particular{" "}
            <ExternalLink href={upstream("README.md")}>README.md</ExternalLink>,{" "}
            <ExternalLink href={upstream("SDLC.md")}>SDLC.md</ExternalLink>, the role guides under{" "}
            <code className="font-mono text-xs">docs/roles/</code> and the skill cards under{" "}
            <code className="font-mono text-xs">docs/skills/</code>.
          </li>
          <li>
            Where the chart and the repository differ, this guide follows the repository and says so on the
            page concerned.
          </li>
        </ul>
      </Section>
    </DocsShell>
  );
}
