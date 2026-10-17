import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { HANDOFFS, ROBOTS, ROLES, STAGES, type Handoff, type RoleId } from "../_data/model";
import { DocsNav, Pager } from "../_components/chrome";
import { GateTag } from "../_components/marks";

export const metadata: Metadata = {
  title: "Handoffs · AI SDLC TL;DR",
  robots: ROBOTS,
};

const COLS = ROLES.length;
const col = (id: RoleId) => ROLES.findIndex((r) => r.id === id);

export default function HandoffsPage() {
  return (
    <>
      <DocsNav current="/docs2/handoffs" />

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Handoffs</h1>
        <p className="max-w-3xl text-muted-foreground">
          Who passes what to whom, brief to changelog. One lifeline per actor; an arrow is an artifact changing
          hands. Red flag = it only moves once the gate is signed.
        </p>
      </header>

      <div className="rounded-xl border bg-card p-2 sm:p-4">
        {/* lifeline heads */}
        <div className="sticky top-0 z-20 grid gap-0 bg-card pb-2" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
          {ROLES.map((r) => (
            <Link
              key={r.id}
              href={`/docs2/${r.id}`}
              title={r.name}
              className="mx-auto rounded-md border bg-card px-1 py-0.5 text-center font-mono text-[10px] font-semibold hover:bg-muted sm:px-2 sm:text-xs"
            >
              {r.code}
            </Link>
          ))}
        </div>

        <div className="relative">
          {/* lifelines */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 grid"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          >
            {ROLES.map((r) => (
              <span key={r.id} className="mx-auto h-full w-px border-l border-dashed border-border" />
            ))}
          </div>

          <ol className="relative flex flex-col">
            {STAGES.map((stage) => {
              const rows = HANDOFFS.map((h, i) => ({ h, i })).filter(({ h }) => h.stage === stage.id);
              if (rows.length === 0) return null;
              return (
                <li key={stage.id} className="flex flex-col">
                  <p className="relative z-10 my-2 self-start rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {stage.n} · {stage.name}
                  </p>
                  <ol className="flex flex-col gap-1">
                    {rows.map(({ h, i }) => (
                      <Arrow key={i} n={i + 1} h={h} />
                    ))}
                  </ol>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Not drawn: the &ldquo;informed&rdquo; edges (claim comments, triage outcome, merged). They are on each actor&apos;s
        page under their lane.
      </p>

      <Pager current="/docs2/handoffs" />
    </>
  );
}

function Arrow({ n, h }: { n: number; h: Handoff }) {
  const a = col(h.from);
  const b = col(h.to);
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const span = hi - lo + 1;
  const rightward = b > a;
  // Line runs between the centres of the first and last spanned columns.
  const inset = `${50 / span}%`;
  const gate = Boolean(h.gate);
  const stroke = gate ? "bg-red-600 dark:bg-red-500" : "bg-foreground/70";

  return (
    <li className="flex flex-col">
      <div className="grid h-5 items-center" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
        <div className="relative h-full" style={{ gridColumn: `${lo + 1} / span ${span}` }}>
          <span className={`absolute top-1/2 h-0.5 -translate-y-1/2 ${stroke}`} style={{ left: inset, right: inset }} />
          {/* tail dot */}
          <span
            className={`absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${stroke}`}
            style={{ left: rightward ? inset : `calc(100% - ${inset})` }}
          />
          {/* head */}
          <svg
            viewBox="0 0 8 8"
            aria-hidden
            className={`absolute top-1/2 size-2.5 -translate-y-1/2 ${gate ? "fill-red-600 dark:fill-red-500" : "fill-foreground/70"}`}
            style={
              rightward
                ? { left: `calc(100% - ${inset} - 10px)` }
                : { left: inset, transform: "scaleX(-1)" }
            }
          >
            <path d="M0 0L8 4L0 8z" />
          </svg>
        </div>
      </div>
      <p
        className="relative z-10 mb-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 self-start rounded-md bg-card/90 px-1 text-xs leading-snug sm:ml-[var(--ml)]"
        style={{ "--ml": `min(${((lo / COLS) * 100).toFixed(1)}%, 40%)` } as CSSProperties}
      >
        <span className="font-mono text-[10px] text-muted-foreground">{String(n).padStart(2, "0")}</span>
        <span>{h.artifact}</span>
        {h.gate && <GateTag id={h.gate} />}
        {h.via && <code className="font-mono text-[10px] text-muted-foreground">{h.via}</code>}
      </p>
    </li>
  );
}
