import Link from "../_components/link";
import { Frame } from "../_components/frame";
import { cn } from "../_components/cx";
import { DECIDE, H2, PERSON } from "../_components/marks";
import { Swimlane } from "../_components/swimlane";
import { meta } from "../_data/nav";
import { ROLES } from "../_data/roles";

export const metadata = meta("Six people along the road");

export default function PeoplePage() {
  return (
    <Frame
      href="/docs6/people"
      title="Six people along the road"
      idea="Each person meets the work at only a few stops; between those, agents carry it. Knowing your stops is most of knowing your job."
      lead={
        <p>
          For every stop: who acts there and what they run. Rose with a hand marks a call that person makes and nobody
          else may. One person can wear several hats.
        </p>
      }
    >
      <section className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Cells:</span>
          <span className={cn("rounded-md border px-2 py-0.5", PERSON)}>runs these skills here</span>
          <span className={cn("rounded-md border px-2 py-0.5", DECIDE)}>✋ and decides here</span>
        </div>
        <Swimlane />
      </section>

      <section className="flex flex-col gap-3">
        <H2>Pick yourself</H2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((r) => (
            <li key={r.id}>
              <Link href={`/docs6/people/${r.id}`} className="flex h-full min-w-0 flex-col gap-1 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50">
                <span className="font-semibold">
                  <span aria-hidden>{r.emoji}</span> {r.name}
                </span>
                <span className="text-sm text-muted-foreground">{r.tagline}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-sm">
          Or jump to the summary of every decision point:{" "}
          <Link href="/docs6/people/red-lines" className="font-medium underline">
            Where people decide, what agents never do
          </Link>
          .
        </p>
      </section>
    </Frame>
  );
}
