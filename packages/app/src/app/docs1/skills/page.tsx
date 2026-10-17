import type { Metadata } from "next";
import Link from "@/app/docs1/_components/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@atl/ui/components/tabs";
import { GateTag } from "../_components/marks";
import { DocsShell, ExternalLink, PageHeader, Pager, Section } from "../_components/shell";
import { SkillList } from "../_components/skill-list";
import {
  CELLS,
  ROLES,
  SKILLS,
  STAGES,
  gatesForStage,
  href,
  skillsForRole,
  skillsForStage,
  upstream,
  type SkillId,
} from "../_data";

export const metadata: Metadata = {
  title: "Skills catalogue · AI SDLC skills guide",
  robots: { index: false, follow: false },
};

export default function SkillsPage() {
  const onChart = new Set(CELLS.flatMap((c) => c.skills ?? []));
  const offChart = SKILLS.filter((s) => !onChart.has(s.id)).map((s) => s.id);
  const alphabetical = [...SKILLS].map((s) => s.id).sort() as SkillId[];
  const autonomous = SKILLS.filter((s) => s.mode === "autonomous").length;

  return (
    <DocsShell active="skills" crumbs={[{ label: "Guide", href: href.home }, { label: "Skills catalogue" }]}>
      <PageHeader
        title="Skills catalogue"
        lead={`${SKILLS.length} skills: ${autonomous} autonomous, ${SKILLS.length - autonomous} interactive. Grouped as on the RACI chart; a skill used at several stages or by several actors appears in each group.`}
      />

      <dl className="grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <dt className="font-medium">Autonomous</dt>
          <dd className="text-muted-foreground">
            Mostly the <code className="font-mono text-xs">om-auto-*</code> prefix. Runs end-to-end without supervision:
            claim lock, isolated worktree, validation gate, self-review. Safe to schedule.
          </dd>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <dt className="font-medium">Interactive</dt>
          <dd className="text-muted-foreground">Acts once, may ask questions, reports and hands control back.</dd>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <dt className="font-medium">Building block</dt>
          <dd className="text-muted-foreground">
            Mainly composed by other skills (for example the autofix chain), though it can be called directly.
          </dd>
        </div>
      </dl>

      <Tabs defaultValue="stage" className="gap-6">
        <TabsList className="w-full sm:w-fit">
          <TabsTrigger value="stage">By stage</TabsTrigger>
          <TabsTrigger value="role">By role</TabsTrigger>
          <TabsTrigger value="az">A–Z</TabsTrigger>
        </TabsList>

        <TabsContent value="stage" className="flex flex-col gap-8">
          {STAGES.map((stage) => (
            <Section
              key={stage.id}
              title={`${stage.number}. ${stage.name}`}
              description={stage.summary}
            >
              <div className="-mt-2 flex flex-wrap items-center gap-2">
                {gatesForStage(stage.id).map((g) => (
                  <GateTag key={g.id} id={g.id} withName />
                ))}
                <Link href={href.stage(stage.id)} className="text-sm font-medium hover:underline">
                  Stage details
                </Link>
              </div>
              <SkillList ids={skillsForStage(stage.id)} />
            </Section>
          ))}
          <Section
            title="Not on the chart"
            description="Skills in the repository that the RACI chart does not place at a stage."
          >
            <SkillList ids={offChart} />
          </Section>
        </TabsContent>

        <TabsContent value="role" className="flex flex-col gap-8">
          {ROLES.map((role) => (
            <Section key={role.id} title={role.name} description={role.tagline}>
              <Link href={href.role(role.id)} className="-mt-2 text-sm font-medium hover:underline">
                Role details
              </Link>
              <SkillList ids={skillsForRole(role.id)} />
            </Section>
          ))}
        </TabsContent>

        <TabsContent value="az">
          <SkillList ids={alphabetical} />
        </TabsContent>
      </Tabs>

      <p className="text-sm text-muted-foreground">
        Upstream: <ExternalLink href={upstream("docs/skills/README.md")}>skill cards</ExternalLink> and the{" "}
        <ExternalLink href={upstream("README.md#-skill-catalog")}>README catalogue</ExternalLink>. Install with{" "}
        <code className="font-mono text-xs">npx skills add open-mercato/skills --skill &apos;*&apos;</code>.
      </p>

      <Pager prev={{ label: "Approval gates", href: href.gates }} next={{ label: "RACI matrix", href: href.matrix }} />
    </DocsShell>
  );
}
