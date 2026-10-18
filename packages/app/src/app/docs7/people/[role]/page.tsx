import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarCheck, Hand } from "lucide-react";
import { Frame } from "../../_components/frame";
import Link from "../../_components/link";
import { Avatar, Cmd, DecisionMark, Ext, SectionTitle } from "../../_components/marks";
import { FLOW_BY_ID } from "../../_data/flows";
import { meta } from "../../_data/links";
import { LANES } from "../../_data/skills";
import { CHAPTERS, chapterHref, PEOPLE, PERSON, type PersonId } from "../../_data/story";

const isPerson = (id: string): id is PersonId => PEOPLE.some((p) => p.id === id);

export function generateStaticParams() {
  return PEOPLE.map((p) => ({ role: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/docs7/people/[role]">): Promise<Metadata> {
  const { role } = await params;
  return meta(isPerson(role) ? `${PERSON[role].role}: ${PERSON[role].name}'s flow` : "Role not found");
}

export default async function RolePage({ params }: PageProps<"/docs7/people/[role]">) {
  const { role } = await params;
  if (!isPerson(role)) notFound();
  const p = PERSON[role];
  const flow = FLOW_BY_ID[role];
  const appears = CHAPTERS.filter((c) => c.cast.includes(role));

  return (
    <Frame
      href={`/docs7/people/${role}`}
      kicker={`Reference · ${p.repoRole} in SDLC.md`}
      title={
        <span className="inline-flex items-center gap-3">
          <Avatar id={role} />
          {p.role}
        </span>
      }
      lead={flow.oneLine}
    >
      <section aria-label="Where you act on the map" className="flex flex-col gap-2">
        <ol className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-8">
          {LANES.map((l, i) => {
            const steps = flow.steps.filter((s) => s.lane === l.id);
            const on = steps.length > 0;
            return (
              <li
                key={l.id}
                className={`flex min-w-0 flex-col gap-0.5 rounded-lg border px-2 py-1.5 text-xs ${
                  on ? `${p.tone} border-transparent text-white` : "border-dashed text-muted-foreground"
                }`}
              >
                <span className="font-semibold">
                  <span className="opacity-70 tabular-nums">{i + 1}</span> {l.name}
                </span>
                <span className="flex items-center gap-1">
                  {on ? (steps.some((s) => s.decide) ? "you act and decide" : "you act") : "·"}
                  {steps.some((s) => s.decide) && <DecisionMark className="size-3 fill-white text-white" />}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="text-xs text-muted-foreground">Your lanes on the map; the diamond marks a decision of yours.</p>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>Your flow</SectionTitle>
        <p className="max-w-prose text-sm text-muted-foreground">
          The moments you act, in the order they usually come. The lane tells you where on the map you are; the diamond,
          what is yours to decide.
        </p>
        <ol className="relative flex flex-col gap-2 border-l-2 border-border pl-4 sm:pl-6">
          {flow.steps.map((s, i) => {
            const lane = LANES.find((l) => l.id === s.lane)!;
            return (
              <li key={i} className="relative flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-3">
                <span
                  className={`absolute top-4 -left-[1.45rem] size-3 rounded-full border-2 border-background sm:-left-[1.95rem] ${p.tone}`}
                  aria-hidden
                />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-semibold">{s.when}</span>
                  <span className="text-xs text-muted-foreground">
                    {lane.name} ·{" "}
                    <Link href={chapterHref(CHAPTERS[s.ch - 1])} className="underline underline-offset-2">
                      chapter {s.ch}
                    </Link>
                  </span>
                </div>
                <p className="min-w-0">
                  {s.skill ? (
                    <Cmd className="text-[12.5px]">{s.run}</Cmd>
                  ) : (
                    <span className="text-sm italic">By hand: {s.run}</span>
                  )}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  <span className="font-medium text-foreground">You get: </span>
                  {s.get}
                </p>
                {s.decide && (
                  <p className="flex items-start gap-1.5 text-sm leading-6">
                    <DecisionMark className="mt-1" />
                    <span>
                      <span className="font-medium">You decide: </span>
                      {s.decide}
                    </span>
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <section className="flex flex-col gap-2 rounded-xl border-2 border-amber-500/60 bg-amber-500/5 p-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <CalendarCheck className="size-4 text-amber-600" aria-hidden /> Your first Monday
          </h2>
          <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm leading-6">
            {flow.monday.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ol>
        </section>
        <section className="flex flex-col gap-2 rounded-xl border bg-card p-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <Hand className="size-4 text-muted-foreground" aria-hidden /> Not your call
          </h2>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-6">
            {flow.notYours.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="flex flex-col gap-2 text-sm">
        <p>
          <span className="font-medium">{p.name} in the story:</span>{" "}
          {appears.map((c, i) => (
            <span key={c.slug}>
              {i > 0 && ", "}
              <Link href={chapterHref(c)} className="underline underline-offset-2">
                {c.n}. {c.title}
              </Link>
            </span>
          ))}
          .
        </p>
        {flow.guide && (
          <p className="text-muted-foreground">
            Upstream role guide: <Ext href={flow.guide.href}>{flow.guide.name}</Ext>
          </p>
        )}
      </section>
    </Frame>
  );
}
