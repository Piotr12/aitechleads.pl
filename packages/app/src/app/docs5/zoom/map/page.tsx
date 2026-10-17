import Link from "../../_components/link";
import { FullChart } from "../../_components/chart";
import { MarkDot, MarkLegend, Remember, RepoNote } from "../../_components/marks";
import { H2, Prose, ZoomFrame } from "../../_components/zoom";
import { meta } from "../../_data/meta";

export const metadata = meta("Zoom 7: The whole chart");

const RACI = [
  { l: "R", name: "Responsible", text: "does the work (often through an agent)" },
  { l: "A", name: "Accountable", text: "owns the outcome; the buck stops here" },
  { l: "C", name: "Consulted", text: "is asked before it is decided" },
  { l: "I", name: "Informed", text: "is told afterwards" },
];

export default function ZoomMap() {
  return (
    <ZoomFrame slug="map" title="Now read the whole chart">
      <Prose>
        <p>
          Here is everything from the last six pages in one grid: the four legs and their stops along the top, the
          seven people down the side, red bars over the gate stops, and in each square the marks and the skills used
          there. This is the chart that looked like a cathedral&apos;s wiring. You can read it now.
        </p>
      </Prose>

      <section aria-labelledby="how" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 text-sm">
          <p className="font-semibold">→ A row is a seat</p>
          <p className="text-muted-foreground">Read across to see one person&apos;s whole journey.</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-sm">
          <p className="font-semibold">↓ A column is a stop</p>
          <p className="text-muted-foreground">Read down to see everyone who is there at that moment.</p>
        </div>
        <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-4 text-sm">
          <p className="font-semibold">▬ A red bar is a gate</p>
          <p className="text-muted-foreground">Someone in that column must say yes before the work moves on.</p>
        </div>
      </section>

      <section aria-labelledby="chart" className="flex flex-col gap-3">
        <H2 id="chart">The chart</H2>
        <p className="text-xs text-muted-foreground sm:hidden">Wide on purpose: swipe sideways inside the box.</p>
        <FullChart />
        <MarkLegend />
        <p className="text-xs text-muted-foreground">
          Skill names drop the “om-” prefix to fit; darker names are om-auto skills that run on their own. Click a
          person for their seat, a stop for its page, a skill for its upstream card.
        </p>
      </section>

      <section aria-labelledby="raci" className="flex flex-col gap-3">
        <H2 id="raci">The last new idea: four letters</H2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Each square also carries letters from a common project-management shorthand called{" "}
          <strong className="text-foreground">RACI</strong>. Together with the dot{" "}
          <MarkDot mark="decides" className="inline-block align-middle" /> they say how involved that person is:
        </p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {RACI.map((r) => (
            <li key={r.l} className="flex min-w-0 items-start gap-3 rounded-lg border bg-card p-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground font-mono font-semibold text-background">
                {r.l}
              </span>
              <span className="flex min-w-0 flex-col text-sm">
                <span className="font-semibold">{r.name}</span>
                <span className="text-muted-foreground">{r.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <RepoNote>
        The chart shows ten columns; the “+ repo” column is SDLC.md&apos;s Design stop, empty in the chart&apos;s own
        terms (SDLC.md gives it to the Designer, through om-ux-shape).
      </RepoNote>

      <Remember>
        Row = your seat, column = a stop, red bar = a gate. That is the whole chart. Next: find{" "}
        <Link href="/docs5/seats" className="underline underline-offset-4">
          your own seat
        </Link>
        .
      </Remember>
    </ZoomFrame>
  );
}
