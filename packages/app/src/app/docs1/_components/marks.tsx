import Link from "@/app/docs1/_components/link";
import { cn } from "@atl/ui/lib/utils";
import { getGate, href, type Duty, type GateId, type Mode, type Raci, type SkillId } from "../_data";

export const MODE_LABEL: Record<Mode, string> = {
  decides: "A human decides (at a gate)",
  supervises: "A human supervises; the agent works alone and a human can take over",
  agent: "An agent carries out delegated work",
  none: "No agent involvement marked",
};

export const MODE_SHORT: Record<Mode, string> = {
  decides: "Human decides",
  supervises: "Human supervises",
  agent: "Agent does",
  none: "Plain RACI",
};

/** The chart's dot: red = decides, dark = supervises, hollow = agent. */
export function ModeDot({ mode, className }: { mode: Mode; className?: string }) {
  if (mode === "none") {
    return (
      <svg viewBox="0 0 12 12" className={cn("size-3 shrink-0 text-muted-foreground", className)} aria-hidden>
        <line x1="3" y1="6" x2="9" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 12 12"
      role="img"
      aria-label={MODE_SHORT[mode]}
      className={cn(
        "size-3 shrink-0",
        mode === "decides" && "text-destructive",
        mode === "supervises" && "text-foreground",
        mode === "agent" && "text-foreground",
        className,
      )}
    >
      <title>{MODE_LABEL[mode]}</title>
      {mode === "agent" ? (
        <circle cx="6" cy="6" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      ) : (
        <circle cx="6" cy="6" r="5" fill="currentColor" />
      )}
    </svg>
  );
}

const RACI_TITLE: Record<Raci, string> = {
  R: "Responsible: does the work",
  A: "Accountable: owns the outcome",
  C: "Consulted",
  I: "Informed",
};

export function RaciLetters({ raci, className }: { raci: Raci[]; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 gap-0.5", className)}>
      {raci.map((r) => (
        <abbr
          key={r}
          title={RACI_TITLE[r]}
          className={cn(
            "inline-flex size-4 items-center justify-center rounded-[3px] font-mono text-[10px] leading-none font-semibold no-underline",
            r === "A" && "bg-foreground text-background",
            r === "R" && "border border-foreground/60 text-foreground",
            (r === "C" || r === "I") && "bg-muted text-muted-foreground",
          )}
        >
          {r}
        </abbr>
      ))}
    </span>
  );
}

export function DutyLine({ duty, className }: { duty: Duty; className?: string }) {
  return (
    <li className={cn("flex items-start gap-2", className)}>
      <span className="mt-1 flex items-center gap-1.5">
        <ModeDot mode={duty.mode} />
        <RaciLetters raci={duty.raci} />
      </span>
      <span className="min-w-0">{duty.text}</span>
    </li>
  );
}

export function GateTag({
  id,
  withName = false,
  link = true,
  className,
}: {
  id: GateId;
  withName?: boolean;
  link?: boolean;
  className?: string;
}) {
  const gate = getGate(id);
  const classes = cn(
    "inline-flex w-fit items-center gap-1 rounded-md border border-destructive/40 bg-destructive/10 px-1.5 py-0.5 text-[11px] leading-none font-semibold text-destructive",
    link && "transition-colors hover:bg-destructive/20",
    className,
  );
  const content = (
    <>
      <span className="font-mono">{id}</span>
      {withName ? <span className="font-medium">{gate.name}</span> : null}
    </>
  );
  return link ? (
    <Link href={href.gate(id)} className={classes} title={`${id}: ${gate.name} (${gate.ownerLabel})`}>
      {content}
    </Link>
  ) : (
    <span className={classes} title={`${id}: ${gate.name} (${gate.ownerLabel})`}>
      {content}
    </span>
  );
}

export function SkillChip({ id, className }: { id: SkillId; className?: string }) {
  return (
    <Link
      href={href.skill(id)}
      className={cn(
        "inline-flex w-fit items-center rounded-md border bg-muted/40 px-1.5 py-0.5 font-mono text-[11px] leading-tight text-foreground transition-colors hover:bg-muted",
        className,
      )}
    >
      {id}
    </Link>
  );
}

export function LayerTag({ layer, className }: { layer: "product" | "delivery"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
        layer === "product" ? "border-dashed" : "border-solid",
        className,
      )}
    >
      {layer === "product" ? "Product layer" : "Delivery layer"}
    </span>
  );
}
