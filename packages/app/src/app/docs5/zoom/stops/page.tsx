import Link from "../../_components/link";
import { Remember, RepoNote } from "../../_components/marks";
import { Road } from "../../_components/road";
import { H2, Prose, ZoomFrame } from "../../_components/zoom";
import { meta } from "../../_data/meta";
import { STAGES } from "../../_data/stages";

export const metadata = meta("Zoom 2: Ten stops");

export default function ZoomStops() {
  return (
    <ZoomFrame slug="stops" title="Each leg has a few stops">
      <Road stops />
      <Prose>
        <p>
          The four legs from the last page split into ten stops. Each stop has one job and one plain test for
          “done”. You don&apos;t move to the next stop until that test is true. Click a stop for its own page.
        </p>
      </Prose>

      <section aria-labelledby="done" className="flex flex-col gap-3">
        <H2 id="done">“Done when”, stop by stop</H2>
        <ol className="flex flex-col divide-y rounded-xl border bg-card">
          {STAGES.map((s) => (
            <li key={s.id}>
              <Link
                href={`/docs5/stops/${s.id}`}
                className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 gap-y-0.5 p-3 transition-colors hover:bg-muted/50 sm:grid-cols-[2rem_10rem_minmax(0,1fr)]"
              >
                <span className="row-span-2 font-mono text-sm text-muted-foreground sm:row-span-1">{s.n ?? "+"}</span>
                <span className="font-medium">
                  {s.name}
                  {s.repoOnly && <span className="ml-1 text-xs font-normal text-muted-foreground">(repo)</span>}
                </span>
                <span className="text-sm text-muted-foreground">{s.doneWhen}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <Prose>
        <p>
          Two words you will meet a lot: a <strong className="text-foreground">ticket</strong> (or issue) is the
          written-down piece of work on GitHub; a <strong className="text-foreground">pull request</strong> (PR) is a
          proposed change to the code, waiting to be reviewed and merged.
        </p>
      </Prose>

      <RepoNote>
        The chart has ten stops. The repo&apos;s SDLC.md adds an eleventh, <strong>Design</strong>, between Claim and
        Implement, for changes people will see (dashed above). This guide shows it, because the repo is the source of
        truth.
      </RepoNote>

      <Remember>Ten stops, each with a “done when”. You don&apos;t move on until it is true.</Remember>
    </ZoomFrame>
  );
}
