import type { Metadata } from "next";
import { GATES, ROBOTS, UPSTREAM, stageById } from "../_data/model";
import { DocsNav, Pager, SectionTitle } from "../_components/chrome";
import { GateTag, RoleChip } from "../_components/marks";
import { StageRail } from "../_components/stage-rail";

export const metadata: Metadata = {
  title: "Gates G1–G7 · AI SDLC TL;DR",
  robots: ROBOTS,
};

const HARD_BLOCKS = [
  { label: "needs-qa without qa-approved", note: "the one hard rule" },
  { label: "qa-failed", note: "back to the author" },
  { label: "blocked", note: "human-set, human-cleared" },
  { label: "do-not-merge", note: "human-set, human-cleared" },
  { label: "qa (active)", note: "a tester is on it now" },
  { label: "in-progress", note: "claimed; merge tooling skips it" },
  { label: "red required checks", note: "reporting early is fine; merging early is not" },
];

const RISK_HIGH = [
  { area: "Auth, sessions, permissions", needs: "denied-path + wrong-scope integration tests; second person's review" },
  { area: "Data scoping", needs: "isolation test: one scope cannot read another" },
  { area: "Money", needs: "failure, retry, idempotency tests; second person's review" },
  { area: "Schema migrations", needs: "migration test up and down; rollback plan in the PR body" },
  { area: "Shared contracts", needs: "consuming side exercised (BACKWARD_COMPATIBILITY.md)" },
  { area: "Any risk-high", needs: "needs-qa if user-facing; no self-QA; om-code-review blocks without evidence unless waived" },
];

export default function GatesPage() {
  return (
    <>
      <DocsNav current="/docs2/gates" />

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Gates G1–G7</h1>
        <p className="max-w-3xl text-muted-foreground">
          Where a named human signs. Everything between gates is delegated to agents. Every escape hatch is
          written down on the ticket or PR, or it didn&apos;t happen.
        </p>
      </header>

      <StageRail />

      <section className="flex flex-col gap-3">
        <SectionTitle>Owner · check · escape hatch</SectionTitle>
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="hidden grid-cols-[11rem_9rem_minmax(0,1fr)_minmax(0,0.8fr)] gap-4 border-b bg-muted/50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
            <span>Gate</span>
            <span>Owner</span>
            <span>Check</span>
            <span>Escape hatch</span>
          </div>
          <ol className="divide-y">
            {GATES.map((g) => (
              <li
                key={g.id}
                id={g.id}
                className="grid scroll-mt-6 gap-3 px-4 py-3 text-sm md:grid-cols-[11rem_9rem_minmax(0,1fr)_minmax(0,0.8fr)] md:gap-4"
              >
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2">
                    <GateTag id={g.id} href={false} />
                    <span className="font-semibold">{g.name}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Stage {stageById(g.stage).n} · {stageById(g.stage).name}
                  </span>
                </div>
                <div className="flex flex-wrap items-start gap-1">
                  {g.owner.map((o) => (
                    <RoleChip key={o} id={o} />
                  ))}
                  <span className="w-full text-xs text-muted-foreground">{g.ownerLabel}</span>
                </div>
                <div>
                  <ul className="flex list-disc flex-col gap-0.5 pl-4 marker:text-muted-foreground">
                    {g.check.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Signal:</span> {g.signal}
                  </p>
                </div>
                <div>
                  <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:hidden">
                    Escape hatch
                  </p>
                  <ul className="flex flex-col gap-0.5 text-muted-foreground">
                    {g.escape.map((e) => (
                      <li key={e} className="flex gap-1.5">
                        <span aria-hidden>↳</span>
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-3">
          <SectionTitle>Hard blocks at G7</SectionTitle>
          <ul className="flex flex-wrap gap-2">
            {HARD_BLOCKS.map((b) => (
              <li key={b.label} className="rounded-lg border border-red-600/30 bg-red-500/5 px-2.5 py-1.5">
                <code className="font-mono text-xs font-semibold text-red-700 dark:text-red-400">{b.label}</code>
                <span className="block text-[11px] text-muted-foreground">{b.note}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            Automation grants <code className="font-mono">qa-approved</code> only via{" "}
            <code className="font-mono">om-auto-qa-pr --self-qa-signoff</code>, always with{" "}
            <code className="font-mono">qa-self-verified</code>, never on risk-high. No authoring, review or merge skill
            ever applies it.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <SectionTitle>Pipeline labels (one at a time)</SectionTitle>
          <LabelMachine />
        </section>
      </div>

      <section className="flex flex-col gap-3">
        <SectionTitle>risk-high is not advice, it triggers G4 + G6</SectionTitle>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {RISK_HIGH.map((r) => (
            <div key={r.area} className="rounded-xl border bg-card p-3 text-sm">
              <p className="font-semibold">{r.area}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{r.needs}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Priority = how urgent; risk = how dangerous to ship. Unset reads as medium. Conflicting signals: pick the
          higher label and say why. Full rules:{" "}
          <a
            href={`${UPSTREAM}/SDLC.md#label-state-machine`}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            SDLC.md › Label state machine ↗
          </a>
        </p>
      </section>

      <Pager current="/docs2/gates" />
    </>
  );
}

/** review ⇄ changes-requested → merge-queue ⇄ qa → (qa-approved) merge / qa-failed. Inline SVG, theme-coloured. */
function LabelMachine() {
  const box = "fill-card stroke-border";
  const txt = "fill-foreground font-mono text-[11px]";
  const sub = "fill-muted-foreground text-[9px]";
  const line = "stroke-muted-foreground";
  return (
    <div className="rounded-xl border bg-card p-3">
      <svg viewBox="0 0 420 190" className="h-auto w-full" role="img" aria-labelledby="lsm-title">
        <title id="lsm-title">
          Pipeline label state machine: review, changes-requested, merge-queue, qa, qa-failed, then merge
        </title>
        <defs>
          <marker id="lsm-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0L8 4L0 8z" className="fill-muted-foreground" />
          </marker>
        </defs>
        {/* nodes */}
        <rect x="10" y="20" width="90" height="30" rx="6" className={box} />
        <text x="55" y="39" textAnchor="middle" className={txt}>review</text>

        <rect x="10" y="110" width="120" height="30" rx="6" className={box} />
        <text x="70" y="129" textAnchor="middle" className={txt}>changes-requested</text>

        <rect x="165" y="20" width="100" height="30" rx="6" className={box} />
        <text x="215" y="39" textAnchor="middle" className={txt}>merge-queue</text>

        <rect x="185" y="110" width="60" height="30" rx="6" className={box} />
        <text x="215" y="129" textAnchor="middle" className={txt}>qa</text>

        <rect x="300" y="110" width="80" height="30" rx="6" className="fill-red-500/10 stroke-red-600/60" />
        <text x="340" y="129" textAnchor="middle" className="fill-red-700 font-mono text-[11px] dark:fill-red-400">
          qa-failed
        </text>

        <rect x="310" y="20" width="100" height="30" rx="6" className="fill-foreground" />
        <text x="360" y="39" textAnchor="middle" className="fill-background font-mono text-[11px]">merged</text>

        {/* edges */}
        <path d="M40 50 V110" className={line} markerEnd="url(#lsm-arrow)" />
        <text x="2" y="84" className={sub}>request</text>
        <path d="M85 110 V50" className={line} markerEnd="url(#lsm-arrow)" />
        <text x="90" y="84" className={sub}>fixed</text>

        <path d="M100 35 H163" className={line} markerEnd="url(#lsm-arrow)" />
        <text x="110" y="29" className={sub}>approve</text>

        <path d="M200 50 V108" className={line} markerEnd="url(#lsm-arrow)" />
        <text x="150" y="84" className={sub}>needs-qa</text>
        <path d="M230 110 V52" className={line} markerEnd="url(#lsm-arrow)" />
        <text x="236" y="84" className={sub}>+qa-approved</text>

        <path d="M245 125 H298" className={line} markerEnd="url(#lsm-arrow)" />
        <text x="252" y="119" className={sub}>fail</text>

        <path d="M265 35 H308" className="stroke-red-600 dark:stroke-red-500" strokeWidth="1.5" markerEnd="url(#lsm-arrow)" />
        <text x="270" y="29" className="fill-red-700 text-[9px] font-semibold dark:fill-red-400">G7</text>

        <path d="M340 140 V165 H40 V142" className={line} strokeDasharray="3 3" fill="none" markerEnd="url(#lsm-arrow)" />
        <text x="150" y="180" className={sub}>back to the author, fix, re-review</text>
      </svg>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Only a QA reviewer sets <code className="font-mono">qa</code>; skills request QA with{" "}
        <code className="font-mono">needs-qa</code>. <code className="font-mono">blocked</code> /{" "}
        <code className="font-mono">do-not-merge</code> stop the flow anywhere.
      </p>
    </div>
  );
}
