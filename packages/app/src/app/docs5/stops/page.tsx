import Link from "../_components/link";
import { Frame } from "../_components/frame";
import { GateFlag, MarkLegend } from "../_components/marks";
import { Road } from "../_components/road";
import { gatesAt } from "../_data/gates";
import { meta } from "../_data/meta";
import { PHASES, stagesOf } from "../_data/stages";

export const metadata = meta("All stops");

export default function StopsPage() {
  return (
    <Frame
      href="/docs5/stops"
      kicker="🚏 Stop by stop"
      title="Every stop on the road"
      lead={<p>One small page per stop: what happens there, who is present, which skills run, and what “done” means.</p>}
    >
      <Road stops gates />
      <MarkLegend marks={[]} />

      {PHASES.map((p) => (
        <section key={p.id} aria-labelledby={`leg-${p.id}`} className="flex flex-col gap-2">
          <h2 id={`leg-${p.id}`} className="text-lg font-semibold">
            <span aria-hidden>{p.emoji}</span> {p.name}
          </h2>
          <ul className="flex flex-col gap-2">
            {stagesOf(p.id).map((s) => (
              <li key={s.id}>
                <Link
                  href={`/docs5/stops/${s.id}`}
                  className="flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <span className="flex flex-wrap items-center gap-2 font-semibold">
                    <span className="font-mono text-sm text-muted-foreground">{s.n ?? "+"}</span>
                    {s.name}
                    {s.repoOnly && <span className="text-xs font-normal text-muted-foreground">(repo extra)</span>}
                    {gatesAt(s.id).map((g) => (
                      <span key={g.id} className="text-xs font-semibold text-destructive">
                        ⚑ {g.id}
                      </span>
                    ))}
                  </span>
                  <span className="text-sm text-muted-foreground">{s.what}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        Gates are explained on <GateFlag id="G1" /> … <GateFlag id="G7" /> (zoom 5).
      </p>
    </Frame>
  );
}
