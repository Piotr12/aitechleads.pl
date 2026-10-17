import type { ReactNode } from "react";
import { ArrowDown, CornerDownLeft } from "lucide-react";
import { cn } from "./cx";

/** Tiny building blocks for vertical flow diagrams (HTML + Tailwind, so they wrap on any screen). */

export function Step({
  tone = "step",
  title,
  children,
  className,
}: {
  tone?: "start" | "step" | "decision" | "gate" | "end" | "stop";
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1 rounded-xl border p-3 text-sm",
        tone === "start" && "border-foreground/60 bg-muted/60",
        tone === "step" && "bg-card",
        tone === "decision" && "border-dashed border-foreground/50 bg-card",
        tone === "gate" && "border-destructive/60 bg-destructive/5",
        tone === "end" && "border-emerald-600/50 bg-emerald-500/10",
        tone === "stop" && "border-muted-foreground/40 bg-muted/40",
        className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2 font-semibold break-words">
        {tone === "decision" && (
          <span aria-hidden className="text-muted-foreground">
            ◇
          </span>
        )}
        {title}
      </div>
      {children && <div className="text-muted-foreground">{children}</div>}
    </div>
  );
}

export function Down({ label }: { label?: ReactNode }) {
  return (
    <div className="flex items-center gap-2 py-1 pl-4 text-xs text-muted-foreground">
      <ArrowDown className="size-4 shrink-0" aria-hidden />
      {label && <span className="min-w-0 break-words">{label}</span>}
    </div>
  );
}

export function LoopBack({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 py-1 pl-4 text-xs text-muted-foreground">
      <CornerDownLeft className="mt-0.5 size-4 shrink-0 -scale-y-100" aria-hidden />
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}
