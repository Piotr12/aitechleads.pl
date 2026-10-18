import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CircleStop } from "lucide-react";
import { StationExtra } from "../../_components/extras";
import { Frame } from "../../_components/frame";
import { Callout, H2, Source, Specimen } from "../../_components/marks";
import { Md } from "../../_components/md";
import { Slip } from "../../_components/slip";
import { Tracker } from "../../_components/trip";
import { meta } from "../../_data/nav";
import { isStationId, STATION_BY_ID, STATIONS } from "../../_data/stations";

export function generateStaticParams() {
  return STATIONS.map((s) => ({ station: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/docs6/journey/[station]">): Promise<Metadata> {
  const { station } = await params;
  return meta(isStationId(station) ? `${STATION_BY_ID[station].n}. ${STATION_BY_ID[station].title}` : "Stop not found");
}

export default async function StationPage({ params }: PageProps<"/docs6/journey/[station]">) {
  const { station } = await params;
  if (!isStationId(station)) notFound();
  const s = STATION_BY_ID[station];
  // On these two stops the picture is the page's idea, so it comes before the slip.
  const extraFirst = s.id === "pickup" || s.id === "qa";

  return (
    <Frame
      href={`/docs6/journey/${s.id}`}
      kicker={`🛣️ The journey · stop ${s.n} of 9`}
      title={
        <>
          <span aria-hidden>{s.emoji} </span>
          {s.title}
        </>
      }
      idea={<Md text={s.idea} />}
      lead={
        <p>
          <Md text={s.lead} />
        </p>
      }
    >
      <Tracker current={s.id} />

      {extraFirst && <StationExtra id={s.id} />}

      <Slip s={s} />

      {!extraFirst && <StationExtra id={s.id} />}

      {s.specimen && (
        <section className="flex flex-col gap-3">
          <H2>What it looks like</H2>
          <Specimen kind={s.specimen.kind} title={s.specimen.title}>
            {s.specimen.body}
          </Specimen>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <H2>When the hand-off stops instead</H2>
        <p className="text-sm text-muted-foreground">
          A clean stop is a feature: the skill says why, leaves no stray lock, and the work waits where it is.
        </p>
        <ul className="flex flex-col gap-2">
          {s.stops.map((t) => (
            <li key={t} className="flex min-w-0 gap-2 rounded-lg border border-dashed border-foreground/30 bg-muted/30 p-3 text-sm">
              <CircleStop className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className="min-w-0 break-words">
                <Md text={t} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      {s.notes.length > 0 && (
        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {s.notes.map((n) => (
            <Callout key={n.title} title={n.title}>
              <p>
                <Md text={n.text} />
              </p>
            </Callout>
          ))}
        </section>
      )}

      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        Checked against:
        {s.sources.map((p) => (
          <Source key={p} path={p} />
        ))}
      </p>
    </Frame>
  );
}
