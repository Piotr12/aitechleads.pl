import type { ReactNode } from "react";
import { Check } from "lucide-react";
import Link from "./link";
import { cn } from "./cx";
import { Frame } from "./frame";
import { ZOOM } from "../_data/nav";

/** A zoom level: the frame, plus the ladder of ideas so far (old ones ticked, the new one bold). */
export function ZoomFrame({ slug, title, children }: { slug: string; title: ReactNode; children: ReactNode }) {
  const i = ZOOM.findIndex((z) => z.slug === slug);
  const level = ZOOM[i];
  return (
    <Frame
      href={`/docs5/zoom/${slug}`}
      kicker={`🔎 Zoom ${i + 1} of ${ZOOM.length} · one new idea`}
      title={title}
      lead={<p>{level.idea}</p>}
    >
      <IdeaLadder current={i} />
      {children}
    </Frame>
  );
}

function IdeaLadder({ current }: { current: number }) {
  return (
    <ol aria-label="Ideas so far" className="flex flex-wrap gap-1.5">
      {ZOOM.map((z, i) => (
        <li key={z.slug}>
          <Link
            href={`/docs5/zoom/${z.slug}`}
            aria-current={i === current ? "step" : undefined}
            className={cn(
              "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors",
              i < current && "bg-muted text-foreground hover:bg-muted/70",
              i === current && "border-foreground bg-foreground font-semibold text-background",
              i > current && "border-dashed text-muted-foreground hover:bg-muted",
            )}
          >
            {i < current ? <Check className="size-3" aria-label="seen" /> : <span className="tabular-nums">{i + 1}</span>}
            {z.title}
          </Link>
        </li>
      ))}
    </ol>
  );
}

/** Short explanatory text block under a diagram. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex max-w-3xl flex-col gap-3 text-muted-foreground", className)}>{children}</div>;
}

export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="text-xl font-semibold">
      {children}
    </h2>
  );
}
