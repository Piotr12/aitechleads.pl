/**
 * The pipeline-label state machine from SDLC.md, drawn as one SVG. `focus="review"` (chapter 3) draws the QA
 * half faintly; `focus="qa"` (chapter 8) draws the review half faintly; `focus="all"` draws everything.
 */
export function StateMachine({ focus = "all" }: { focus?: "review" | "qa" | "all" }) {
  const dimReview = focus === "qa";
  const dimQa = focus === "review";

  const moves: { from: string; to: string; how: string; half: "review" | "qa" | "human" }[] = [
    { from: "review", to: "changes-requested", how: "the reviewer requests changes", half: "review" },
    { from: "changes-requested", to: "review", how: "fixes pushed; re-review", half: "review" },
    { from: "review", to: "merge-queue", how: "approve (routing, not proof of QA)", half: "review" },
    { from: "merge-queue", to: "qa", how: "a QA reviewer starts testing (needs-qa only)", half: "qa" },
    { from: "qa", to: "merge-queue + qa-approved", how: "pass, with a QA head: <sha> line", half: "qa" },
    { from: "qa", to: "qa-failed", how: "fail: a hard block", half: "qa" },
    { from: "any state", to: "blocked / do-not-merge", how: "people set them to stop the flow; no skill merges past them", half: "human" },
  ];

  return (
    <>
      <ol className="flex flex-col gap-1.5 rounded-xl border bg-card p-3 sm:hidden" aria-label="Pipeline label moves">
        {moves.map((m) => (
          <li
            key={m.from + m.to}
            className={
              (m.half === "review" && dimReview) || (m.half === "qa" && dimQa) ? "opacity-40" : undefined
            }
          >
            <p className="font-mono text-[12px] leading-5 break-words">
              <span className="font-semibold">{m.from}</span> → <span className="font-semibold">{m.to}</span>
            </p>
            <p className="text-xs leading-5 text-muted-foreground">{m.how}</p>
          </li>
        ))}
      </ol>
      <StateMachineSvg dimReview={dimReview} dimQa={dimQa} />
    </>
  );
}

function StateMachineSvg({ dimReview, dimQa }: { dimReview: boolean; dimQa: boolean }) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border bg-card p-2 sm:block">
      <svg
        viewBox="0 0 780 330"
        role="img"
        aria-label="Pipeline labels: review moves to changes-requested and back, approval moves to merge-queue; a QA reviewer moves a needs-qa PR from merge-queue to qa, then back to merge-queue with qa-approved, or to qa-failed. blocked and do-not-merge are set by people at any time."
        className="h-auto w-full min-w-[640px] text-foreground"
      >
        <defs>
          <marker id="sm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>

        <g opacity={dimReview ? 0.35 : 1}>
          <Node x={30} y={50} w={170} label="review" sub="ready, waiting" tone="pipe" />
          <Node x={30} y={180} w={170} label="changes-requested" sub="back to the author" tone="pipe" />
          <Edge d="M95,92 L95,176" label="request changes" lx={88} ly={140} anchor="end" />
          <Edge d="M140,176 L140,92" label="fixes pushed, re-review" lx={147} ly={124} anchor="start" />
          <Edge d="M200,70 L306,70" label="approve" lx={253} ly={62} anchor="middle" />
        </g>

        <Node x={310} y={50} w={170} label="merge-queue" sub="approved; routing, not proof" tone="pipe" />

        <g opacity={dimQa ? 0.35 : 1}>
          <Node x={590} y={50} w={160} label="qa" sub="a tester is on it" tone="pipe" />
          <Node x={590} y={180} w={160} label="qa-failed" sub="hard block" tone="bad" />
          <Node x={310} y={180} w={170} label="merge-queue" sub="+ qa-approved, QA head: <sha>" tone="good" />
          <Edge d="M480,70 L586,70" label="QA reviewer starts" lx={533} ly={62} anchor="middle" />
          <Edge d="M670,92 L670,176" label="fail" lx={677} ly={140} anchor="start" />
          <Edge d="M600,92 L484,184" label="pass" lx={548} ly={152} anchor="middle" />
          <text x={395} y={255} textAnchor="middle" className="fill-muted-foreground" fontSize="12">
            only on PRs carrying needs-qa
          </text>
        </g>

        <g>
          <rect x={30} y={270} width={720} height={44} rx={10} className="fill-muted" />
          <text x={46} y={297} fontSize="13" className="fill-foreground" fontWeight={600}>
            blocked · do-not-merge
          </text>
          <text x={215} y={297} fontSize="12.5" className="fill-muted-foreground">
            people set them at any point to stop the flow; no skill merges past them
          </text>
        </g>
      </svg>
    </div>
  );
}

function Node({
  x,
  y,
  w,
  label,
  sub,
  tone,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  sub: string;
  tone: "pipe" | "good" | "bad";
}) {
  const stroke = tone === "good" ? "#059669" : tone === "bad" ? "#e11d48" : "#0284c7";
  return (
    <g>
      <rect x={x} y={y} width={w} height={42} rx={21} fill="none" stroke={stroke} strokeWidth={2} />
      <text x={x + w / 2} y={y + 18} textAnchor="middle" fontSize="13.5" fontFamily="ui-monospace, monospace" className="fill-foreground" fontWeight={600}>
        {label}
      </text>
      <text x={x + w / 2} y={y + 33} textAnchor="middle" fontSize="11" className="fill-muted-foreground">
        {sub}
      </text>
    </g>
  );
}

function Edge({ d, label, lx, ly, anchor }: { d: string; label: string; lx: number; ly: number; anchor: "start" | "middle" | "end" }) {
  return (
    <g>
      <path d={d} fill="none" stroke="currentColor" strokeWidth={1.5} markerEnd="url(#sm-arrow)" />
      <text x={lx} y={ly} textAnchor={anchor} fontSize="11.5" className="fill-muted-foreground">
        {label}
      </text>
    </g>
  );
}
