import type { ReactNode } from "react";
import Link from "@/app/docs1/_components/link";
import { cn } from "@atl/ui/lib/utils";
import { href, type GateId, type SkillId } from "../_data";
import { GateTag } from "./marks";

type StepKind = "skill" | "decision" | "gate" | "human" | "artifact";

/** A box in a flow diagram. A skill box links to the skill's page. */
export function FlowStep({
  kind = "skill",
  skill,
  title,
  note,
  gate,
  optional,
  className,
}: {
  kind?: StepKind;
  skill?: SkillId;
  title?: string;
  note?: ReactNode;
  gate?: GateId;
  optional?: boolean;
  className?: string;
}) {
  const label = title ?? skill ?? "";
  const body = (
    <>
      <span className="flex flex-wrap items-center justify-center gap-1.5">
        <span className={cn(skill && !title ? "font-mono text-[13px]" : "font-medium")}>{label}</span>
        {optional ? <span className="text-[11px] text-muted-foreground">(optional)</span> : null}
      </span>
      {note ? <span className="text-xs text-muted-foreground">{note}</span> : null}
    </>
  );
  const classes = cn(
    "relative flex w-full max-w-xs flex-col items-center gap-0.5 px-3 py-2 text-center text-sm",
    kind === "skill" && "rounded-lg border bg-card",
    kind === "artifact" && "rounded-lg border border-dashed bg-muted/30",
    kind === "human" && "rounded-lg border-2 border-foreground/70 bg-card",
    kind === "decision" && "rounded-full border bg-muted/60 italic",
    kind === "gate" && "rounded-lg border border-destructive/50 bg-destructive/10",
    optional && "border-dashed",
    className,
  );
  return (
    <div className="flex flex-col items-center gap-1">
      {skill ? (
        <Link href={href.skill(skill)} className={cn(classes, "transition-colors hover:bg-muted")}>
          {body}
        </Link>
      ) : (
        <div className={classes}>{body}</div>
      )}
      {gate ? <GateTag id={gate} withName /> : null}
    </div>
  );
}

export function FlowArrow({ label, loop = false }: { label?: string; loop?: boolean }) {
  return (
    <div className="flex flex-col items-center py-0.5 text-muted-foreground" aria-hidden={label ? undefined : true}>
      <svg viewBox="0 0 12 28" className="h-7 w-3">
        <line x1="6" y1="0" x2="6" y2="22" stroke="currentColor" strokeWidth="1.25" strokeDasharray={loop ? "3 2" : undefined} />
        <path d="M2 20 L6 27 L10 20" fill="none" stroke="currentColor" strokeWidth="1.25" />
      </svg>
      {label ? <span className="-mt-0.5 mb-0.5 text-[11px]">{label}</span> : null}
    </div>
  );
}

/** Side-by-side branches below a decision; stacks on narrow screens. */
export function FlowBranches({
  branches,
  className,
}: {
  branches: { label: string; children: ReactNode }[];
  className?: string;
}) {
  return (
    <div className="@container w-full">
      <div
        className={cn(
          "grid w-full gap-4 @xl:gap-3",
          branches.length === 2 && "@xl:grid-cols-2",
          branches.length >= 3 && "@xl:grid-cols-3",
          className,
        )}
      >
        {branches.map((b) => (
          <div key={b.label} className="flex flex-col items-center rounded-xl border border-dashed p-3">
            <span className="mb-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">{b.label}</span>
            <FlowArrow />
            {b.children}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FlowColumn({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex w-full flex-col items-center", className)}>{children}</div>;
}

export function FlowLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
      <li className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-5 rounded-sm border bg-card" /> Skill
      </li>
      <li className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-5 rounded-sm border-2 border-foreground/70 bg-card" /> Human step
      </li>
      <li className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-5 rounded-full border bg-muted/60" /> Decision
      </li>
      <li className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-5 rounded-sm border border-destructive/50 bg-destructive/10" /> Gate
      </li>
      <li className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-5 rounded-sm border border-dashed bg-muted/30" /> Artifact / optional
      </li>
    </ul>
  );
}
