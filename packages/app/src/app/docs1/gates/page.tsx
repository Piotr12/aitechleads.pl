import type { Metadata } from "next";
import Link from "@/app/docs1/_components/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@atl/ui/components/table";
import { StageRail } from "../_components/diagrams";
import { FlowArrow, FlowBranches, FlowColumn, FlowStep } from "../_components/flow";
import { LabelStateMachine } from "../_components/label-machine";
import { GateTag } from "../_components/marks";
import { DocsShell, ExternalLink, PageHeader, Pager, Section } from "../_components/shell";
import { GATES, HARD_BLOCKS, href, roleById, stageById, upstream } from "../_data";

export const metadata: Metadata = {
  title: "Approval gates · AI SDLC skills guide",
  robots: { index: false, follow: false },
};

const LABEL_GROUPS = [
  { group: "Pipeline", labels: "review, changes-requested, qa, qa-failed, merge-queue, blocked, do-not-merge", rule: "One at a time", meaning: "Workflow state" },
  { group: "Category", labels: "bug, feature, refactor, security, dependencies, documentation", rule: "Additive", meaning: "Kind of change" },
  { group: "Meta", labels: "needs-qa, skip-qa, qa-approved, qa-self-verified, in-progress, ci-monitoring", rule: "Additive", meaning: "Process signals" },
  { group: "Priority", labels: "priority-low, priority-medium, priority-high, priority-extreme", rule: "One at a time; unset = medium", meaning: "Urgency of the work" },
  { group: "Risk", labels: "risk-low, risk-medium, risk-high", rule: "One at a time; unset = medium", meaning: "Blast radius of the change" },
];

export default function GatesPage() {
  return (
    <DocsShell active="gates" crumbs={[{ label: "Guide", href: href.home }, { label: "Approval gates" }]}>
      <PageHeader
        title="Approval gates"
        lead="Seven points where a person must approve before work continues. Agents prepare evidence and request approvals; they do not grant them. Blocked work cannot merge."
      />

      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <StageRail />
      </div>

      <Section title="The gates">
        <ol className="flex flex-col gap-4">
          {GATES.map((gate) => {
            const stage = stageById(gate.stage);
            return (
              <li
                key={gate.id}
                id={gate.id.toLowerCase()}
                className="scroll-mt-6 rounded-xl border border-destructive/40 bg-card p-4 shadow-[inset_4px_0_0_var(--destructive)] sm:p-5"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <GateTag id={gate.id} withName link={false} className="text-xs" />
                    <span className="text-sm text-muted-foreground">
                      at{" "}
                      <Link href={href.stage(stage.id)} className="text-foreground hover:underline">
                        {stage.number}. {stage.name}
                      </Link>
                    </span>
                    <span className="text-sm text-muted-foreground">
                      · owner:{" "}
                      {gate.owners.map((o, i) => (
                        <span key={o}>
                          {i > 0 ? " or " : ""}
                          <Link href={href.role(o)} className="text-foreground hover:underline">
                            {roleById(o).name}
                          </Link>
                        </span>
                      ))}
                      {gate.owners.length > 1 ? " (whoever owns the decision)" : ""}
                    </span>
                  </div>
                  <p className="font-medium">{gate.question}</p>
                  <div className="grid gap-4 text-sm md:grid-cols-3">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">What is approved</p>
                      <p>{gate.approves}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">How it is enforced</p>
                      <ul className="flex list-disc flex-col gap-1 pl-4">
                        {gate.enforcement.map((e) => (
                          <li key={e}>{e}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Exceptions</p>
                      {gate.exceptions ? (
                        <ul className="flex list-disc flex-col gap-1 pl-4">
                          {gate.exceptions.map((e) => (
                            <li key={e}>{e}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">None documented.</p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section
        id="blocked"
        title="What “blocked work cannot merge” means"
        description="Any of the signals below stops a merge, whatever else is green. om-merge-buddy reports them; om-approve-merge-pr refuses to merge while one is present."
      >
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Signal</TableHead>
                <TableHead>Meaning</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {HARD_BLOCKS.map((b) => (
                <TableRow key={b.label}>
                  <TableCell className="font-mono text-xs whitespace-nowrap">{b.label}</TableCell>
                  <TableCell className="text-sm whitespace-normal">{b.meaning}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-muted-foreground">
          <code className="font-mono text-xs">qa-approved</code> is pinned to a commit by a{" "}
          <code className="font-mono text-xs">QA head: &lt;sha&gt;</code> line. A later push leaves the label but stales
          it: om-merge-buddy reports &ldquo;QA evidence older than head&rdquo; and om-approve-merge-pr asks for
          confirmation.
        </p>
      </Section>

      <Section title="Pipeline labels" description="Where a PR sits in the flow is carried by its single pipeline label.">
        <LabelStateMachine />
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead>Labels</TableHead>
                <TableHead>Exclusivity</TableHead>
                <TableHead>Meaning</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LABEL_GROUPS.map((g) => (
                <TableRow key={g.group}>
                  <TableCell className="font-medium">{g.group}</TableCell>
                  <TableCell className="min-w-64 font-mono text-xs whitespace-normal">{g.labels}</TableCell>
                  <TableCell className="text-sm">{g.rule}</TableCell>
                  <TableCell className="text-sm">{g.meaning}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section
        title="Who may sign off QA (G6)"
        description="The QA path depends on the risk label. A change to auth or money also needs a second person's review regardless of the QA path."
      >
        <div className="rounded-xl border bg-card p-4">
          <FlowColumn>
            <FlowStep kind="artifact" title="PR carries needs-qa" note="UI changes, new features, user-facing behaviour" />
            <FlowArrow />
            <FlowStep kind="decision" title="Risk label?" />
            <FlowBranches
              branches={[
                {
                  label: "risk-low / risk-medium",
                  children: (
                    <FlowColumn>
                      <FlowStep kind="human" title="QA reviewer tests" gate="G6" />
                      <FlowArrow label="no QA capacity in time" />
                      <FlowStep
                        kind="human"
                        title="Self-QA by an engineer"
                        note="or om-auto-qa-pr --self-qa-signoff; evidence + QA head line; qa-approved + qa-self-verified"
                      />
                    </FlowColumn>
                  ),
                },
                {
                  label: "risk-high",
                  children: (
                    <FlowColumn>
                      <FlowStep kind="human" title="QA reviewer tests" gate="G6" />
                      <FlowArrow label="exception only" />
                      <FlowStep kind="human" title="Maintainer's explicit exception" note="stated on the PR; no self-QA" />
                    </FlowColumn>
                  ),
                },
              ]}
            />
          </FlowColumn>
        </div>
        <p className="text-sm text-muted-foreground">
          Source: <ExternalLink href={upstream("SDLC.md")}>SDLC.md</ExternalLink>, sections &ldquo;Label state
          machine&rdquo; and &ldquo;The QA gate&rdquo;.
        </p>
      </Section>

      <Pager prev={{ label: "Roles", href: href.roles }} next={{ label: "Skills catalogue", href: href.skills }} />
    </DocsShell>
  );
}
