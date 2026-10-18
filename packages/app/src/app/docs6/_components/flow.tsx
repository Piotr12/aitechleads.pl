import type { ReactNode } from "react";
import { ArrowDown, Bot, CircleStop, Hand, User } from "lucide-react";
import { cn } from "./cx";
import { Md } from "./md";
import { AGENT, DECIDE, PERSON } from "./marks";

/** Small building blocks for vertical flow diagrams that stay readable at 375px. */

export type Tone = "agent" | "person" | "decide" | "stop" | "plain" | "goal";

const TONE: Record<Tone, string> = {
  agent: AGENT,
  person: PERSON,
  decide: DECIDE,
  stop: "border-dashed border-foreground/40 bg-muted/40 text-muted-foreground",
  plain: "border-foreground/25 bg-card",
  goal: "border-2 border-foreground bg-card font-semibold",
};

export function Box({
  tone = "plain",
  title,
  children,
  here,
  className,
}: {
  tone?: Tone;
  title: ReactNode;
  children?: ReactNode;
  here?: boolean;
  className?: string;
}) {
  const Icon = tone === "agent" ? Bot : tone === "person" ? User : tone === "decide" ? Hand : tone === "stop" ? CircleStop : null;
  return (
    <div className={cn("flex min-w-0 flex-col gap-1 rounded-lg border px-3 py-2 text-sm", TONE[tone], here && "ring-4 ring-foreground/25", className)}>
      <p className="flex min-w-0 items-start gap-1.5 font-medium break-words">
        {Icon && <Icon className="mt-0.5 size-3.5 shrink-0" aria-hidden />}
        <span className="min-w-0">{typeof title === "string" ? <Md text={title} /> : title}</span>
      </p>
      {children && <div className="text-xs leading-relaxed opacity-90">{typeof children === "string" ? <Md text={children} /> : children}</div>}
    </div>
  );
}

export function Down({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-1 pl-4 text-xs text-muted-foreground">
      <ArrowDown className="size-4 shrink-0" aria-hidden />
      {label && <Md text={label} />}
    </div>
  );
}

/** Branches side by side on wide screens, stacked on phones. */
export function Branches({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 }) {
  return (
    <div className={cn("grid grid-cols-1 gap-3", cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3")}>{children}</div>
  );
}

export function Branch({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col rounded-xl border border-dashed border-foreground/25 p-3">
      <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <Md text={label} />
      </p>
      {children}
    </div>
  );
}

export function FlowKey() {
  return (
    <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span>Key:</span>
      <Box tone="agent" title="a skill" className="py-0.5" />
      <Box tone="person" title="a person" className="py-0.5" />
      <Box tone="decide" title="a person decides" className="py-0.5" />
      <Box tone="stop" title="a clean stop" className="py-0.5" />
    </p>
  );
}
