/** The pipeline-label state machine from SDLC.md, drawn as inline SVG (list on small screens). */

type Node = { id: string; x: number; y: number; w: number; label: string; tone?: "gate" | "end" | "fail" };

const NODES: Node[] = [
  { id: "review", x: 20, y: 40, w: 110, label: "review" },
  { id: "changes", x: 20, y: 170, w: 150, label: "changes-requested" },
  { id: "queue", x: 230, y: 40, w: 120, label: "merge-queue" },
  { id: "qa", x: 450, y: 40, w: 70, label: "qa" },
  { id: "failed", x: 435, y: 170, w: 100, label: "qa-failed", tone: "fail" },
  { id: "merged", x: 230, y: 170, w: 130, label: "squash-merged", tone: "end" },
];

const H = 34;

function node(id: string) {
  const n = NODES.find((x) => x.id === id);
  if (!n) throw new Error(id);
  return n;
}

function Edge({
  d,
  label,
  lx,
  ly,
  dashed,
  anchor = "middle",
}: {
  d: string;
  label: string;
  lx: number;
  ly: number;
  dashed?: boolean;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <g>
      <path
        d={d}
        fill="none"
        className="stroke-muted-foreground"
        strokeWidth="1.25"
        strokeDasharray={dashed ? "4 3" : undefined}
        markerEnd="url(#docs1-arrow)"
      />
      <text x={lx} y={ly} textAnchor={anchor} className="fill-muted-foreground text-[11px]">
        {label}
      </text>
    </g>
  );
}

export function LabelStateMachine() {
  const review = node("review");
  const changes = node("changes");
  const queue = node("queue");
  const qa = node("qa");
  const failed = node("failed");
  const merged = node("merged");

  return (
    <div className="rounded-xl border bg-card p-4">
      <svg viewBox="0 0 560 250" role="img" aria-labelledby="docs1-lsm-title" className="hidden h-auto w-full sm:block">
        <title id="docs1-lsm-title">Pipeline label state machine</title>
        <defs>
          <marker id="docs1-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-muted-foreground" />
          </marker>
        </defs>

        {/* review -> changes-requested and back */}
        <Edge d={`M${review.x + 25} ${review.y + H} L${review.x + 25} ${changes.y}`} label="↓ request changes" lx={review.x + 92} ly={110} anchor="start" />
        <Edge d={`M${review.x + 80} ${changes.y} L${review.x + 80} ${review.y + H + 4}`} label="↑ fixes pushed" lx={review.x + 92} ly={140} anchor="start" />
        {/* review -> merge-queue */}
        <Edge d={`M${review.x + review.w} ${review.y + H / 2} L${queue.x} ${queue.y + H / 2}`} label="approve" lx={(review.x + review.w + queue.x) / 2} ly={review.y + H / 2 - 6} />
        {/* merge-queue -> qa and back */}
        <Edge d={`M${queue.x + queue.w} ${queue.y + 10} L${qa.x} ${qa.y + 10}`} label="needs-qa: tester starts" lx={(queue.x + queue.w + qa.x) / 2} ly={queue.y - 8} />
        <Edge d={`M${qa.x} ${qa.y + H - 8} L${queue.x + queue.w} ${queue.y + H - 8}`} label="pass + qa-approved" lx={(queue.x + queue.w + qa.x) / 2} ly={queue.y + H + 14} />
        {/* qa -> qa-failed */}
        <Edge d={`M${qa.x + 35} ${qa.y + H} L${qa.x + 35} ${failed.y}`} label="fail" lx={qa.x + 41} ly={115} anchor="start" />
        {/* merge-queue -> merged */}
        <Edge d={`M${queue.x + 60} ${queue.y + H} L${queue.x + 60} ${merged.y}`} label="G7: every gate re-checked" lx={queue.x + 66} ly={115} anchor="start" />

        {NODES.map((n) => (
          <g key={n.id}>
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={H}
              rx={n.tone === "end" ? 17 : 8}
              className={
                n.tone === "fail"
                  ? "fill-destructive/10 stroke-destructive"
                  : n.tone === "end"
                    ? "fill-foreground stroke-foreground"
                    : "fill-background stroke-foreground/60"
              }
              strokeWidth="1.25"
            />
            <text
              x={n.x + n.w / 2}
              y={n.y + H / 2 + 4}
              textAnchor="middle"
              className={
                n.tone === "end"
                  ? "fill-background font-mono text-[12px]"
                  : n.tone === "fail"
                    ? "fill-destructive font-mono text-[12px]"
                    : "fill-foreground font-mono text-[12px]"
              }
            >
              {n.label}
            </text>
          </g>
        ))}
        <text x={failed.x + failed.w / 2} y={failed.y + H + 16} textAnchor="middle" className="fill-muted-foreground text-[11px]">
          routes the PR back
        </text>
      </svg>

      <ol className="flex flex-col gap-2 text-sm sm:hidden">
        <li>
          <code className="font-mono">review</code>: a ready, non-draft PR.
        </li>
        <li>
          Reviewer requests changes: <code className="font-mono">changes-requested</code>; after fixes it returns to{" "}
          <code className="font-mono">review</code>.
        </li>
        <li>
          Approval: <code className="font-mono">merge-queue</code> (routing, not proof of QA).
        </li>
        <li>
          A <code className="font-mono">needs-qa</code> PR: the QA reviewer moves it to <code className="font-mono">qa</code>{" "}
          while testing, then back to <code className="font-mono">merge-queue</code> with{" "}
          <code className="font-mono">qa-approved</code>, or to <code className="font-mono">qa-failed</code>.
        </li>
        <li>Merge (G7): every gate re-checked, then squash-merged.</li>
      </ol>

      <p className="mt-3 border-t pt-3 text-sm text-muted-foreground">
        <code className="font-mono text-destructive">blocked</code> and{" "}
        <code className="font-mono text-destructive">do-not-merge</code> are set and cleared by humans and stop the flow
        wherever it is. Pipeline labels are mutually exclusive: a PR carries at most one.
      </p>
    </div>
  );
}
