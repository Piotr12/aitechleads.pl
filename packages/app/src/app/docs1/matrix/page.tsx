import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@atl/ui/lib/utils";
import { Legend } from "../_components/legend";
import { DutyLine, GateTag, SkillChip } from "../_components/marks";
import { MatrixFilter } from "../_components/matrix-filter";
import { DocsShell, PageHeader, Pager } from "../_components/shell";
import { ROLES, STAGES, cellFor, href, type Mode } from "../_data";

export const metadata: Metadata = {
  title: "RACI matrix · AI SDLC skills guide",
  robots: { index: false, follow: false },
};

const DIM: Record<Mode, string> = {
  decides: "group-data-[filter=supervises]/matrix:opacity-20 group-data-[filter=agent]/matrix:opacity-20",
  supervises: "group-data-[filter=decides]/matrix:opacity-20 group-data-[filter=agent]/matrix:opacity-20",
  agent: "group-data-[filter=decides]/matrix:opacity-20 group-data-[filter=supervises]/matrix:opacity-20",
  none: "group-data-[filter=decides]/matrix:opacity-20 group-data-[filter=supervises]/matrix:opacity-20 group-data-[filter=agent]/matrix:opacity-20",
};

export default function MatrixPage() {
  return (
    <DocsShell active="matrix" crumbs={[{ label: "Guide", href: href.home }, { label: "RACI matrix" }]}>
      <PageHeader
        title="RACI matrix"
        lead="Who, with which skill, at which stage. Every cell of the chart, in full. Use the buttons to highlight one kind of involvement; scroll sideways on small screens."
      />

      <Legend />

      <MatrixFilter>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[110rem] border-collapse text-xs">
            <caption className="sr-only">AI SDLC RACI: actors by stage</caption>
            <thead>
              <tr className="border-b bg-muted/40">
                <th scope="col" className="sticky left-0 z-10 w-40 bg-muted p-3 text-left font-medium">
                  Actor \ Stage
                </th>
                {STAGES.map((stage) => (
                  <th key={stage.id} scope="col" className="w-[10rem] p-3 text-left align-bottom font-medium">
                    <span className="block text-[10px] font-normal text-muted-foreground uppercase">
                      {stage.layer === "product" ? "Product layer" : "Delivery layer"}
                    </span>
                    <Link href={href.stage(stage.id)} className="text-sm hover:underline">
                      {stage.number}. {stage.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((role) => (
                <tr key={role.id} className="border-b last:border-b-0">
                  <th scope="row" className="sticky left-0 z-10 bg-background p-3 text-left align-top">
                    <Link href={href.role(role.id)} className="text-sm font-medium hover:underline">
                      {role.name}
                    </Link>
                    <span className="mt-1 block font-normal text-muted-foreground">{role.tagline}</span>
                  </th>
                  {STAGES.map((stage) => {
                    const cell = cellFor(role.id, stage.id);
                    return (
                      <td
                        key={stage.id}
                        className={cn(
                          "border-l p-3 align-top",
                          cell?.gates && "bg-destructive/5 shadow-[inset_3px_0_0_var(--destructive)]",
                        )}
                      >
                        {cell ? (
                          <div
                            className={cn(
                              "flex flex-col gap-2 transition-opacity",
                              !cell.gates && "group-data-[filter=gates]/matrix:opacity-20",
                            )}
                          >
                            {cell.gates ? (
                              <div className="flex flex-wrap gap-1">
                                {cell.gates.map((g) => (
                                  <GateTag key={g} id={g} withName />
                                ))}
                              </div>
                            ) : null}
                            {cell.label || cell.skills ? (
                              <div className="flex flex-wrap gap-1">
                                {cell.label ? (
                                  <span className="w-full text-[11px] font-medium text-muted-foreground">{cell.label}</span>
                                ) : null}
                                {cell.skills?.map((s) => (
                                  <SkillChip key={s} id={s} />
                                ))}
                              </div>
                            ) : null}
                            <ul className="flex flex-col gap-1.5 leading-snug">
                              {cell.duties.map((duty, i) => (
                                <DutyLine key={i} duty={duty} className={cn("transition-opacity", DIM[duty.mode])} />
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MatrixFilter>

      <p className="text-sm text-muted-foreground">
        Human approval gates: product brief, backlog and changes to owned decisions. QA owns test approval; lower-risk
        work may use the agreed self-check process. Blocked work cannot merge. Deployment and operations follow the
        team&apos;s release process.
      </p>

      <Pager prev={{ label: "Skills catalogue", href: href.skills }} next={{ label: "Overview", href: href.home }} />
    </DocsShell>
  );
}
