"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@atl/ui/lib/utils";

export type MatrixFilterValue = "all" | "decides" | "supervises" | "agent" | "gates";

const OPTIONS: { value: MatrixFilterValue; label: string; dot?: ReactNode }[] = [
  { value: "all", label: "Everything" },
  {
    value: "decides",
    label: "Human decides",
    dot: <span className="size-2.5 rounded-full bg-destructive" />,
  },
  {
    value: "supervises",
    label: "Human supervises",
    dot: <span className="size-2.5 rounded-full bg-foreground" />,
  },
  {
    value: "agent",
    label: "Agent does",
    dot: <span className="size-2.5 rounded-full border-[1.5px] border-foreground" />,
  },
  {
    value: "gates",
    label: "Gates only",
    dot: <span className="h-2.5 w-1 rounded-sm bg-destructive" />,
  },
];

/**
 * Highlights one kind of duty in the server-rendered matrix. The table reads the choice from
 * `data-filter` on this wrapper (Tailwind `group-data-[filter=…]/matrix` variants).
 */
export function MatrixFilter({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<MatrixFilterValue>("all");
  return (
    <div className="group/matrix flex flex-col gap-3" data-filter={filter}>
      <div role="radiogroup" aria-label="Highlight" className="flex flex-wrap gap-1.5">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={filter === o.value}
            onClick={() => setFilter(o.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors",
              filter === o.value ? "border-foreground bg-foreground text-background" : "hover:bg-muted",
            )}
          >
            {o.dot ? <span className="flex items-center rounded-full bg-background p-0.5">{o.dot}</span> : null}
            {o.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
