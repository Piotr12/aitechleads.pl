/** Renders an example artefact (issue, comment, PR, terminal output…) the way you'd meet it. */
import { Bot, FileText, GitPullRequest, MessageSquare, SquareTerminal, CircleDot, ScanSearch, ClipboardList } from "lucide-react";
import type { Artefact, ArtefactKind } from "../_data/story";
import { IllustrativeBadge } from "./bits";
import { cn } from "./cx";

const KIND: Record<ArtefactKind, { label: string; Icon: typeof Bot }> = {
  issue: { label: "Issue", Icon: CircleDot },
  comment: { label: "Comment", Icon: MessageSquare },
  pr: { label: "Pull request", Icon: GitPullRequest },
  review: { label: "Review", Icon: ScanSearch },
  terminal: { label: "Terminal", Icon: SquareTerminal },
  file: { label: "File", Icon: FileText },
  report: { label: "Report", Icon: ClipboardList },
  code: { label: "Code", Icon: FileText },
};

export function labelTone(label: string): string {
  if (["blocked", "do-not-merge", "qa-failed", "risk-high", "priority-extreme", "changes-requested"].includes(label))
    return "bg-red-500/15 text-red-800 dark:text-red-300 ring-red-500/30";
  if (["qa-approved", "merge-queue", "risk-low"].includes(label))
    return "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 ring-emerald-500/30";
  if (["review", "qa", "in-progress", "ci-monitoring"].includes(label))
    return "bg-sky-500/15 text-sky-800 dark:text-sky-300 ring-sky-500/30";
  if (["needs-qa", "qa-self-verified", "risk-medium", "priority-high"].includes(label))
    return "bg-amber-500/15 text-amber-800 dark:text-amber-300 ring-amber-500/30";
  if (["bug", "feature", "refactor", "security", "documentation", "dependencies"].includes(label))
    return "bg-violet-500/15 text-violet-800 dark:text-violet-300 ring-violet-500/30";
  return "bg-muted text-muted-foreground ring-border";
}

export function LabelChip({ label }: { label: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[11px] ring-1", labelTone(label))}>
      {label}
    </span>
  );
}

export function ArtefactCard({ artefact }: { artefact: Artefact }) {
  const { label, Icon } = KIND[artefact.kind];
  const dark = artefact.kind === "terminal";
  // Tables and trees must keep their columns: scroll sideways instead of wrapping.
  const keepColumns = /\n\||\n[├└│]/.test(artefact.body) || artefact.kind === "code";
  return (
    <figure className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b bg-muted/40 px-3 py-2 text-xs">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Icon className="size-3.5" aria-hidden />
            {label}
          </span>
          <span className="text-muted-foreground">{artefact.where}</span>
          <span className="ml-auto">
            <IllustrativeBadge />
          </span>
        </div>
        <div className="flex flex-col gap-2 px-3 pt-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
                artefact.agent ? "border border-dashed border-foreground/30" : "bg-muted",
              )}
            >
              {artefact.agent && <Bot className="size-3" aria-hidden />}
              {artefact.author}
            </span>
            <span className="text-muted-foreground">
              {artefact.agent ? "posted by an agent" : "written by a human"}
            </span>
          </div>
          {artefact.heading && <p className="font-semibold">{artefact.heading}</p>}
          {artefact.labels && artefact.labels.length > 0 && (
            <div className="flex flex-wrap gap-1.5" aria-label="Labels">
              {artefact.labels.map((l) => (
                <LabelChip key={l} label={l} />
              ))}
            </div>
          )}
        </div>
        <pre
          className={cn(
            "m-3 overflow-x-auto rounded-lg p-3 font-mono text-[12px] leading-relaxed",
            keepColumns ? "whitespace-pre" : "whitespace-pre-wrap break-words",
            dark ? "bg-zinc-950 text-zinc-100 dark:bg-black" : "bg-muted/50",
          )}
        >
          {artefact.body}
        </pre>
      </div>
      {artefact.notice && (
        <figcaption className="flex gap-2 px-1 text-sm text-muted-foreground">
          <span aria-hidden>👀</span>
          <span>
            <span className="font-medium text-foreground">What to notice: </span>
            {artefact.notice}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
