import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Ban, CalendarCheck, Hand } from "lucide-react";
import Link from "../../_components/link";
import { Frame } from "../../_components/frame";
import { cn } from "../../_components/cx";
import { Cmd, DECIDE, H2, PERSON, Source } from "../../_components/marks";
import { Md } from "../../_components/md";
import { Swimlane } from "../../_components/swimlane";
import { meta } from "../../_data/nav";
import { isRoleId, ROLE_BY_ID, ROLES, type Where } from "../../_data/roles";
import { STATION_BY_ID, STATIONS, isStationId } from "../../_data/stations";

export function generateStaticParams() {
  return ROLES.map((r) => ({ role: r.id }));
}

export async function generateMetadata({ params }: PageProps<"/docs6/people/[role]">): Promise<Metadata> {
  const { role } = await params;
  return meta(isRoleId(role) ? ROLE_BY_ID[role].name : "Person not found");
}

const SIDE: Record<string, { name: string; href: string }> = {
  setup: { name: "Set-up, once per repo", href: "/docs6/hood/rulebook" },
  "product-road": { name: "The product road", href: "/docs6/onramps/product" },
  stalled: { name: "A stalled PR", href: "/docs6/onramps/stalled" },
};

function whereLabel(w: Where) {
  if (isStationId(w)) {
    const s = STATION_BY_ID[w];
    return { name: `Stop ${s.n}: ${s.title}`, href: `/docs6/journey/${s.id}`, emoji: s.emoji };
  }
  return { ...SIDE[w], emoji: w === "setup" ? "🧰" : w === "product-road" ? "🧭" : "🧩" };
}

const PLACES: { where: Where[]; label: string; emoji: string }[] = [
  { where: ["setup"], label: "Set-up", emoji: "🧰" },
  { where: ["product-road"], label: "Product road", emoji: "🧭" },
  ...STATIONS.map((s) => ({
    where: (s.id === "review" ? ["review", "stalled"] : [s.id]) as Where[],
    label: `${s.n}. ${s.short}`,
    emoji: s.emoji,
  })),
];

/** The whole road in one row, with this person's stops lit up. */
function RoleStrip({ moments }: { moments: { where: Where; decide?: string }[] }) {
  return (
    <ol className="flex flex-wrap gap-1.5" aria-label="Your stops on the road">
      {PLACES.map((p) => {
        const mine = moments.filter((m) => p.where.includes(m.where));
        const decides = mine.some((m) => m.decide);
        return (
          <li
            key={p.label}
            className={cn(
              "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs",
              mine.length === 0 && "border-dashed text-muted-foreground opacity-60",
              mine.length > 0 && cn("font-semibold", decides ? DECIDE : PERSON),
            )}
          >
            <span aria-hidden>{p.emoji}</span>
            {p.label}
            {decides && <Hand className="size-3" aria-label="you decide here" />}
          </li>
        );
      })}
    </ol>
  );
}

export default async function RolePage({ params }: PageProps<"/docs6/people/[role]">) {
  const { role } = await params;
  if (!isRoleId(role)) notFound();
  const r = ROLE_BY_ID[role];

  return (
    <Frame
      href={`/docs6/people/${r.id}`}
      title={
        <>
          <span aria-hidden>{r.emoji} </span>
          {r.name}
        </>
      }
      idea={r.tagline}
      lead={<p>Your moments on the road, in the order the work reaches you. Everything between them is carried by agents, or by the other people in the table below.</p>}
    >
      <section className="flex flex-col gap-2 rounded-xl border bg-card p-3 sm:p-4">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Your stops on the road</p>
        <RoleStrip moments={r.moments} />
        <p className="text-xs text-muted-foreground">
          Lit: you act there. Rose with a hand: you decide there. Dashed: agents or other people carry the work.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <H2>When the work reaches you</H2>
        <ol className="flex flex-col gap-3">
          {r.moments.map((m, i) => {
            const w = whereLabel(m.where);
            return (
              <li key={i} className="flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-4">
                <Link href={w.href} className="flex flex-wrap items-center gap-2 text-sm font-semibold hover:underline">
                  <span aria-hidden>{w.emoji}</span>
                  {w.name}
                </Link>
                <div className="flex flex-col gap-2">
                  {m.run.map((c) => (
                    <Cmd key={c}>{c}</Cmd>
                  ))}
                </div>
                <p className="text-sm leading-relaxed">
                  <Md text={m.does} />
                </p>
                {m.decide && (
                  <p className={cn("flex items-start gap-2 rounded-lg border p-3 text-sm", DECIDE)}>
                    <Hand className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>
                      <strong>You decide: </strong>
                      <Md text={m.decide} />
                    </span>
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-2 rounded-xl border bg-muted/30 p-4">
          <p className="flex items-center gap-2 font-semibold">
            <Ban className="size-4" aria-hidden /> Good to know
          </p>
          <ul className="flex list-disc flex-col gap-1.5 pl-4 text-sm">
            {r.never.map((n) => (
              <li key={n}>
                <Md text={n} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex min-w-0 flex-col gap-2 rounded-xl border-2 border-foreground/70 bg-card p-4">
          <p className="flex items-center gap-2 font-semibold">
            <CalendarCheck className="size-4" aria-hidden /> Your first Monday
          </p>
          <ol className="flex list-decimal flex-col gap-1.5 pl-4 text-sm">
            {r.monday.map((n) => (
              <li key={n}>
                <Md text={n} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <H2>You, among the others</H2>
        <Swimlane highlight={r.id} />
      </section>

      <p className="text-xs text-muted-foreground">
        Checked against: <Source path={r.source} /> <Source path="README.md">README, “Workflows by role”</Source>
      </p>
    </Frame>
  );
}
