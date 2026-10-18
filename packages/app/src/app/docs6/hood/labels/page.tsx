import { Frame } from "../../_components/frame";
import { cn } from "../../_components/cx";
import { AGENT, H2, LabelChip, PERSON, Source } from "../../_components/marks";
import { Md } from "../../_components/md";
import { LABEL_GROUPS } from "../../_data/labels";
import { meta } from "../../_data/nav";

export const metadata = meta("Labels are the PR's state machine");

type Who = "agent" | "person" | "either";

const EDGE: Record<Who, string> = {
  agent: "stroke-sky-500",
  person: "stroke-amber-500",
  either: "stroke-foreground/60",
};

const FILL: Record<Who, string> = {
  agent: "fill-sky-500",
  person: "fill-amber-500",
  either: "fill-foreground/60",
};

function Node({ x, y, w = 150, label, pipeline = true }: { x: number; y: number; w?: number; label: string; pipeline?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={44}
        rx={8}
        className={pipeline ? "fill-foreground" : "fill-card stroke-foreground/50"}
        strokeWidth={pipeline ? 0 : 1.5}
        strokeDasharray={pipeline ? undefined : "4 3"}
      />
      <text
        x={x + w / 2}
        y={y + 27}
        textAnchor="middle"
        className={cn("font-mono text-[13px]", pipeline ? "fill-background" : "fill-foreground")}
      >
        {label}
      </text>
    </g>
  );
}

function Edge({ d, who, label, lx, ly, anchor = "middle", id = "w" }: { d: string; who: Who; label: string; lx: number; ly: number; anchor?: "start" | "middle" | "end"; id?: string }) {
  return (
    <g>
      <path d={d} fill="none" strokeWidth={2} className={EDGE[who]} markerEnd={`url(#${id}-arrow-${who})`} />
      <text x={lx} y={ly} textAnchor={anchor} className="fill-foreground text-[11px]">
        {label}
      </text>
    </g>
  );
}

function Arrows({ id }: { id: string }) {
  return (
    <defs>
      {(["agent", "person", "either"] as Who[]).map((w) => (
        <marker key={w} id={`${id}-arrow-${w}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className={FILL[w]} />
        </marker>
      ))}
    </defs>
  );
}

/** Phones: the same machine, drawn top to bottom. */
function MachineTall() {
  const e = "t";
  return (
    <svg viewBox="0 0 360 490" role="img" aria-labelledby="sm-title-tall" className="h-auto w-full">
      <title id="sm-title-tall">Pipeline label transitions on a pull request</title>
      <Arrows id={e} />
      <Node x={30} y={10} label="PR opened" pipeline={false} />
      <Node x={30} y={110} label="review" />
      <Node x={200} y={110} w={150} label="changes-requested" />
      <Node x={30} y={220} label="merge-queue" />
      <Node x={200} y={220} w={150} label="merged" pipeline={false} />
      <Node x={30} y={350} label="qa" />
      <Node x={200} y={350} w={150} label="qa-failed" />

      <Edge id={e} d="M105 54 L105 106" who="agent" label="ready" lx={113} ly={84} anchor="start" />
      <Edge id={e} d="M180 122 L196 122" who="either" label="" lx={0} ly={0} />
      <text x={275} y={102} textAnchor="middle" className="fill-foreground text-[11px]">↑ request changes</text>
      <Edge id={e} d="M200 144 L184 144" who="either" label="" lx={0} ly={0} />
      <text x={275} y={170} textAnchor="middle" className="fill-foreground text-[11px]">↓ fixed: back to review</text>
      <Edge id={e} d="M105 154 L105 216" who="either" label="approve" lx={113} ly={190} anchor="start" />
      <Edge id={e} d="M180 242 L196 242" who="person" label="" lx={0} ly={0} />
      <text x={275} y={212} textAnchor="middle" className="fill-foreground text-[11px]">→ merge, all gates</text>
      <Edge id={e} d="M70 264 L70 346" who="person" label="" lx={0} ly={0} />
      <Edge id={e} d="M140 350 L140 268" who="person" label="" lx={0} ly={0} />
      <text x={150} y={296} className="fill-foreground text-[11px]">↓ tester starts (needs-qa only)</text>
      <text x={150} y={316} className="fill-foreground text-[11px]">↑ pass: + qa-approved</text>
      <Edge id={e} d="M180 372 L196 372" who="person" label="" lx={0} ly={0} />
      <text x={275} y={410} textAnchor="middle" className="fill-foreground text-[11px]">fail: back to the author</text>

      <rect x={10} y={428} width={340} height={56} rx={8} className="fill-rose-50 stroke-rose-400 dark:fill-rose-950" strokeWidth={1.5} />
      <text x={22} y={450} className="fill-foreground font-mono text-[13px]">blocked · do-not-merge</text>
      <text x={22} y={471} className="fill-foreground text-[11px]">people set them; om-auto-fix-pr may also leave blocked</text>
    </svg>
  );
}

function Machine() {
  return (
    <svg viewBox="0 0 770 390" role="img" aria-labelledby="sm-title" className="h-auto w-full min-w-[700px]">
      <title id="sm-title">Pipeline label transitions on a pull request</title>
      <Arrows id="w" />

      <Node x={10} y={170} w={130} label="PR opened" pipeline={false} />
      <Node x={200} y={170} label="review" />
      <Node x={200} y={40} label="changes-requested" w={170} />
      <Node x={430} y={170} label="merge-queue" />
      <Node x={430} y={300} label="qa" />
      <Node x={630} y={300} w={130} label="qa-failed" />
      <Node x={630} y={170} w={130} label="merged" pipeline={false} />

      <g>
        <rect x={430} y={30} width={330} height={64} rx={8} className="fill-rose-50 stroke-rose-400 dark:fill-rose-950" strokeWidth={1.5} />
        <text x={445} y={55} className="fill-foreground font-mono text-[13px]">blocked · do-not-merge</text>
        <text x={445} y={77} className="fill-foreground text-[11px]">people set them; om-auto-fix-pr may also leave blocked</text>
      </g>

      <Edge d="M140 192 L196 192" who="agent" label="ready" lx={168} ly={184} />
      <Edge d="M300 170 L300 88" who="either" label="request changes" lx={308} ly={132} anchor="start" />
      <Edge d="M240 84 L240 166" who="either" label="fixed" lx={232} ly={132} anchor="end" />
      <Edge d="M350 192 L426 192" who="either" label="approve" lx={388} ly={184} />
      <Edge d="M475 214 L475 296" who="person" label="tester starts" lx={467} ly={260} anchor="end" />
      <Edge d="M540 300 L540 218" who="person" label="pass: + qa-approved" lx={548} ly={260} anchor="start" />
      <Edge d="M580 322 L626 322" who="person" label="fail" lx={603} ly={314} />
      <Edge d="M580 192 L626 192" who="person" label="merge" lx={603} ly={184} />
      <text x={467} y={274} textAnchor="end" className="fill-muted-foreground text-[10.5px]">
        (needs-qa PRs only)
      </text>
      <text x={603} y={210} textAnchor="middle" className="fill-muted-foreground text-[10.5px]">
        all gates
      </text>
      <text x={695} y={366} textAnchor="middle" className="fill-muted-foreground text-[11px]">
        back to the author
      </text>
    </svg>
  );
}

const MOVES: { from: string; to: string; who: Who; how: string }[] = [
  { from: "(new)", to: "review", who: "agent", how: "A ready, non-draft PR starts here: `om-open-pr` or the engine applies it." },
  { from: "review", to: "changes-requested", who: "either", how: "The reviewer, person or `om-auto-review-pr`, finds a blocker or an unwaived major." },
  { from: "changes-requested", to: "review", who: "either", how: "After fixes, back for a re-review." },
  { from: "review", to: "merge-queue", who: "either", how: "Approval. Routing, not proof of QA: `needs-qa` stays on." },
  { from: "merge-queue", to: "qa", who: "person", how: "Only a QA reviewer, while testing. Skills ask for QA with `needs-qa`; they never set `qa`." },
  { from: "qa", to: "merge-queue", who: "person", how: "Pass: the QA reviewer adds `qa-approved` with a `QA head:` line." },
  { from: "qa", to: "qa-failed", who: "person", how: "Fail. A hard block until QA re-runs." },
  { from: "merge-queue", to: "merged", who: "person", how: "A person runs `om-approve-merge-pr`, which re-checks every gate." },
];

const META: { label: string; who: string; means: string }[] = [
  { label: "needs-qa", who: "the authoring skill, or a person", means: "a person must exercise this before it merges (with `qaGate` on, a hard gate)" },
  { label: "skip-qa", who: "the authoring skill, or a person", means: "explicit opt-out for docs, dependency, CI or test-only changes; never with `needs-qa`" },
  { label: "qa-approved", who: "a QA reviewer; or `om-auto-qa-pr --self-qa-signoff`", means: "QA passed, pinned to the tested commit by `QA head: <sha>`" },
  { label: "qa-self-verified", who: "whoever used the self-QA exception", means: "makes the exception auditable; never on `risk-high`" },
  { label: "in-progress", who: "any skill actively working the item", means: "the claim lock: others back off, merge tooling skips the PR" },
  { label: "ci-monitoring", who: "a skill that finished and reported", means: "only a CI-result comment is still owed. Not a claim: anyone may act" },
];

export default function LabelsPage() {
  return (
    <Frame
      href="/docs6/hood/labels"
      title="Labels are the PR's state machine"
      idea="A PR carries exactly one pipeline label at a time, naming where it is; the other labels are additive signals. Who may move each label is part of the rules."
      lead={<p>This is how people and skills know where any piece of work stands without asking anyone: they read its labels. Arrow colours say who may make the move.</p>}
    >
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Arrows:</span>
          <span className={cn("rounded-full border px-2 py-0.5", AGENT)}>an agent</span>
          <span className={cn("rounded-full border px-2 py-0.5", PERSON)}>a person only</span>
          <span className="rounded-full border bg-card px-2 py-0.5">person or agent</span>
        </div>
        <div className="rounded-xl border bg-card p-3 sm:hidden">
          <MachineTall />
        </div>
        <div className="hidden overflow-x-auto rounded-xl border bg-card p-3 sm:block">
          <Machine />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <H2>Every move, in words</H2>
        <ul className="flex flex-col gap-2">
          {MOVES.map((m) => (
            <li
              key={m.from + m.to}
              className={cn(
                "grid grid-cols-1 gap-1 rounded-lg border p-3 text-sm md:grid-cols-[16rem_1fr] md:gap-4",
                m.who === "person" ? PERSON : m.who === "agent" ? AGENT : "bg-card",
              )}
            >
              <span className="flex flex-wrap items-center gap-1">
                {m.from === "(new)" ? <span className="text-xs">new PR</span> : <LabelChip name={m.from} />}
                <span aria-hidden>→</span>
                {m.to === "merged" ? <span className="text-xs font-semibold">merged</span> : <LabelChip name={m.to} />}
              </span>
              <span className="min-w-0">
                <Md text={m.how} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <H2>The signals that ride along</H2>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {META.map((m) => (
            <li key={m.label} className="flex min-w-0 flex-col gap-1 rounded-lg border bg-card p-3 text-sm">
              <LabelChip name={m.label} />
              <span>
                <Md text={m.means} />
              </span>
              <span className="text-xs text-muted-foreground">
                set by <Md text={m.who} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <H2>All five groups</H2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {LABEL_GROUPS.map((g) => (
            <div key={g.group} className="flex min-w-0 flex-col gap-2 rounded-lg border bg-card p-3">
              <p className="text-sm">
                <span className="font-semibold">{g.name}</span> <span className="text-muted-foreground">· {g.rule}</span>
              </p>
              <span className="flex flex-wrap gap-1">
                {g.labels.map((l) => (
                  <LabelChip key={l} name={l} />
                ))}
              </span>
            </div>
          ))}
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Priority is how urgent the work is; risk is how dangerous it is to ship. An outage fix can be{" "}
          <code className="font-mono">priority-extreme</code> and <code className="font-mono">risk-low</code>. A{" "}
          <code className="font-mono">risk-high</code> label is not advice: it rules out self-QA, requires extra tests, and for
          auth or money a second person’s review. One label lives outside the groups:{" "}
          <code className="font-mono">do-not-close</code>, which people put on issues that housekeeping must never close.
          Every time a skill changes a label it explains why, in one rationale comment it keeps up to date.
        </p>
      </section>

      <p className="text-xs text-muted-foreground">
        Checked against: <Source path="SDLC.md">SDLC.md, “Label state machine” and “The QA gate”</Source>
      </p>
    </Frame>
  );
}
