import { cn } from "@atl/ui/lib/utils";

export type DiagramIconKind = "flow" | "rail" | "lane" | "gate" | "grid" | "matrix";

/** Small pictograms for the section entry points, drawn in the chart's own vocabulary. */
export function DiagramIcon({ kind, className }: { kind: DiagramIconKind; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden
      className={cn("size-10 shrink-0 rounded-lg border bg-muted/40 p-1.5 text-foreground", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {kind === "flow" ? (
        <>
          <rect x="13" y="3" width="14" height="7" rx="2" />
          <path d="M20 10v5M20 15l-8 5M20 15l8 5" />
          <rect x="5" y="20" width="14" height="7" rx="2" />
          <rect x="21" y="20" width="14" height="7" rx="2" />
          <path d="M12 27v4l8 3M28 27v4l-8 3" />
        </>
      ) : null}
      {kind === "rail" ? (
        <>
          <path d="M5 20h30" className="text-muted-foreground" />
          <circle cx="7" cy="20" r="3" fill="currentColor" />
          <circle cx="16" cy="20" r="3" className="fill-background" />
          <circle cx="25" cy="20" r="3" className="fill-background" />
          <circle cx="34" cy="20" r="3" className="fill-background" />
          <path d="M25 26v6" className="stroke-destructive" strokeWidth="2.5" />
        </>
      ) : null}
      {kind === "lane" ? (
        <>
          <rect x="4" y="8" width="32" height="8" rx="2" />
          <rect x="4" y="22" width="32" height="8" rx="2" strokeDasharray="2 2" />
          <circle cx="11" cy="12" r="2" className="fill-destructive stroke-destructive" />
          <circle cx="20" cy="12" r="2" fill="currentColor" />
          <circle cx="29" cy="12" r="2" />
        </>
      ) : null}
      {kind === "gate" ? (
        <>
          <path d="M6 20h10M24 20h10" />
          <path d="M20 8v24" className="stroke-destructive" strokeWidth="3" />
          <circle cx="20" cy="20" r="3" className="fill-destructive stroke-destructive" />
        </>
      ) : null}
      {kind === "grid" ? (
        <>
          <rect x="5" y="5" width="12" height="12" rx="2" />
          <rect x="23" y="5" width="12" height="12" rx="2" />
          <rect x="5" y="23" width="12" height="12" rx="2" />
          <rect x="23" y="23" width="12" height="12" rx="2" />
        </>
      ) : null}
      {kind === "matrix" ? (
        <>
          <path d="M4 12h32M4 20h32M4 28h32M14 4v32" className="text-muted-foreground" />
          <circle cx="20" cy="16" r="2" className="fill-destructive stroke-destructive" />
          <circle cx="27" cy="24" r="2" fill="currentColor" />
          <circle cx="33" cy="32" r="2" />
        </>
      ) : null}
    </svg>
  );
}
