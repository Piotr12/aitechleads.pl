/** Pieces for the reference pages (Part 4). */
import { ChevronRight } from "lucide-react";
import Link from "@/app/docs4/_components/link";
import { href, roleById, stageById, type Duty, type Gate } from "../_data";
import { Avatar, cx, Dot, GateFlag, MODE_LABEL } from "./ui";

export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3" aria-hidden />}
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function DutyLine({ duty }: { duty: Duty }) {
  return (
    <li className="flex min-w-0 items-start gap-2 text-sm">
      <span className="mt-1.5 flex w-3 shrink-0 justify-center" title={MODE_LABEL[duty.mode]}>
        {duty.mode === "none" ? (
          <span className="size-1.5 rounded-full bg-muted-foreground/40" />
        ) : (
          <Dot kind={duty.mode} />
        )}
      </span>
      <span className="shrink-0 font-mono text-xs leading-6 text-muted-foreground">{duty.raci.join(",")}</span>
      <span className="min-w-0">{duty.text}</span>
    </li>
  );
}

export function GateCard({ gate, compact }: { gate: Gate; compact?: boolean }) {
  return (
    <article
      id={gate.id.toLowerCase()}
      className="flex min-w-0 scroll-mt-6 flex-col gap-3 rounded-xl border border-red-600/30 bg-card p-4 dark:border-red-500/30"
    >
      <header className="flex flex-wrap items-center gap-2">
        <GateFlag id={gate.id} plain />
        <h3 className="font-semibold">{gate.name}</h3>
        <span className="text-xs text-muted-foreground">
          at{" "}
          <Link href={href.stage(gate.stage)} className="underline underline-offset-2">
            {stageById(gate.stage).name}
          </Link>
        </span>
      </header>
      <p className="text-sm font-medium">{gate.question}</p>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Signed by</span>
        {gate.owners.map((o) => (
          <Link key={o} href={href.role(o)} className="inline-flex items-center gap-1.5 hover:underline">
            <Avatar role={o} size="sm" />
            {roleById(o).name}
          </Link>
        ))}
        {gate.owners.length > 1 && <span className="text-xs text-muted-foreground">(whoever owns the decision)</span>}
      </div>
      {!compact && (
        <>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Approves: </span>
            {gate.approves}
          </p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">How it is enforced</p>
              <ul className="flex list-disc flex-col gap-1 pl-5 text-sm">
                {gate.enforcement.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
            {gate.exceptions && (
              <div className="min-w-0">
                <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Exceptions, always written down
                </p>
                <ul className="flex list-disc flex-col gap-1 pl-5 text-sm">
                  {gate.exceptions.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </article>
  );
}

export function ModeBadge({ mode }: { mode: "autonomous" | "interactive" }) {
  return (
    <span
      className={cx(
        "rounded-full border px-2 py-0.5 text-[11px]",
        mode === "autonomous" ? "border-foreground/30 bg-foreground/5" : "text-muted-foreground",
      )}
      title={
        mode === "autonomous"
          ? "Runs end to end unattended: claims its work, makes the most reversible call and documents it"
          : "Acts once, may ask questions, reports, and hands control back"
      }
    >
      {mode}
    </span>
  );
}
