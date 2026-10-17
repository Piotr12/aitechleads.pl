import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowDownLeft, ArrowDownRight } from "lucide-react";
import { cn } from "../../_components/cx";
import { Frame } from "../../_components/frame";
import {
  Ext,
  GateFlag,
  MarkDot,
  MarkLegend,
  RepoNote,
  RoleAvatar,
  RoleChip,
  SkillChip,
  StopChip,
} from "../../_components/marks";
import { Road } from "../../_components/road";
import { GATE_BY_ID } from "../../_data/gates";
import { meta } from "../../_data/meta";
import { isActive, isRoleId, MARK_TEXT, ROLE_BY_ID, ROLES, type Handoff, type RoleId } from "../../_data/roles";
import { STAGE_BY_ID } from "../../_data/stages";

export function generateStaticParams() {
  return ROLES.map((r) => ({ role: r.id }));
}

export async function generateMetadata({ params }: PageProps<"/docs5/seats/[role]">): Promise<Metadata> {
  const { role } = await params;
  return meta(isRoleId(role) ? `Seat: ${ROLE_BY_ID[role].name}` : "Seat not found");
}

export default async function SeatPage({ params }: PageProps<"/docs5/seats/[role]">) {
  const { role: id } = await params;
  if (!isRoleId(id)) notFound();
  const role = ROLE_BY_ID[id];
  const active = role.moments.filter(isActive);
  const told = role.moments.filter((m) => !isActive(m));
  const gates = role.moments.flatMap((m) => m.gates ?? []);
  const neighbours = [
    ...new Set(role.moments.flatMap((m) => [m.from?.role, m.to?.role]).filter((r): r is RoleId => !!r && r !== id)),
  ];

  return (
    <Frame
      href={`/docs5/seats/${id}`}
      kicker={`💺 Your seat${role.optional ? " · optional role" : ""}`}
      title={
        <span className="flex flex-wrap items-center gap-3">
          <RoleAvatar role={id} size="lg" />
          <span className="min-w-0 break-words">{role.name}</span>
        </span>
      }
      lead={
        <p>
          You own <strong className="text-foreground">{role.owns}</strong>: {role.youAre}. You act at{" "}
          {active.length} stops{gates.length > 0 ? ` and hold ${gates.length === 1 ? "one gate" : `${gates.length} gates`}` : ""}.
        </p>
      }
    >
      <section aria-labelledby="strip" className="flex flex-col gap-3">
        <h2 id="strip" className="text-xl font-semibold">
          Your stops on the road
        </h2>
        <p className="text-sm text-muted-foreground">
          The same road as everywhere in this guide, with your marks on it. Faded stops are not yours.
        </p>
        <Road stops gates role={id} compact />
        <MarkLegend />
      </section>

      <section aria-labelledby="path" className="flex flex-col gap-3">
        <h2 id="path" className="text-xl font-semibold">
          Your path, in order
        </h2>
        <ol className="relative flex flex-col gap-2 border-l-2 border-muted pl-5 sm:ml-2">
          {active.map((m) => {
            const stage = STAGE_BY_ID[m.stage];
            return (
              <li key={m.stage} className="relative flex min-w-0 flex-col gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-5 -left-[33px] flex size-6 items-center justify-center rounded-full border-2 bg-background text-[10px] font-semibold",
                    m.gates?.length ? "border-destructive text-destructive" : "border-foreground",
                  )}
                >
                  {stage.n ?? "+"}
                </span>
                {m.from && <HandoffRow dir="in" handoff={m.from} />}
                <article
                  className={cn(
                    "flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-4",
                    (m.gates?.length ?? 0) > 0 && "border-destructive/60",
                  )}
                >
                  <header className="flex flex-wrap items-center gap-2">
                    <StopChip stage={m.stage} />
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MarkDot mark={m.mark} size="md" />
                      {MARK_TEXT[m.mark].name}
                    </span>
                    {m.gates?.map((g) => (
                      <GateFlag key={g} id={g} withName />
                    ))}
                  </header>
                  <p>
                    <span className="font-semibold">You: </span>
                    {m.you}
                  </p>
                  {m.agent && (
                    <p className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MarkDot mark="agent" size="md" className="mt-0.5" />
                      <span className="min-w-0">
                        <span className="font-medium text-foreground">Your agents: </span>
                        {m.agent}
                      </span>
                    </p>
                  )}
                  {m.skills && m.skills.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5" aria-label="Skills">
                      {m.skills.map((s) => (
                        <li key={s} className="max-w-full">
                          <SkillChip name={s} />
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
                {m.to && <HandoffRow dir="out" handoff={m.to} />}
              </li>
            );
          })}
        </ol>
      </section>

      {told.length > 0 && (
        <section aria-labelledby="told" className="flex flex-col gap-2">
          <h2 id="told" className="text-xl font-semibold">
            You are also kept in the loop
          </h2>
          <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            {told.map((m) => (
              <li key={m.stage} className="flex flex-wrap items-center gap-2">
                <StopChip stage={m.stage} />
                {m.you}
              </li>
            ))}
          </ul>
        </section>
      )}

      {gates.length > 0 && (
        <section aria-labelledby="gates" className="flex flex-col gap-2">
          <h2 id="gates" className="text-xl font-semibold">
            Your red lights
          </h2>
          <ul className="flex flex-col gap-2">
            {gates.map((g) => (
              <li key={g} className="flex flex-wrap items-center gap-2 rounded-lg border border-destructive/40 p-3 text-sm">
                <GateFlag id={g} withName />
                <span>“{GATE_BY_ID[g].question}”</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {neighbours.length > 0 && (
        <section aria-labelledby="neighbours" className="flex flex-col gap-2">
          <h2 id="neighbours" className="text-xl font-semibold">
            The people you trade with
          </h2>
          <ul className="flex flex-wrap gap-2">
            {neighbours.map((r) => (
              <li key={r}>
                <RoleChip role={r} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <RepoNote title="In the repo">
        {role.repo}{" "}
        <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {role.docs.map((d) => (
            <Ext key={d.href} href={d.href}>
              {d.label}
            </Ext>
          ))}
        </span>
      </RepoNote>
    </Frame>
  );
}

function HandoffRow({ dir, handoff }: { dir: "in" | "out"; handoff: Handoff }) {
  const Icon = dir === "in" ? ArrowDownRight : ArrowDownLeft;
  return (
    <p className="flex flex-wrap items-center gap-2 pl-2 text-xs text-muted-foreground">
      <Icon className="size-4 shrink-0" aria-hidden />
      {dir === "in" ? "From" : "You hand"}
      <RoleChip role={handoff.role} />
      {dir === "in" ? "you get" : ""}
      <span className="min-w-0 break-words text-foreground">{handoff.what}</span>
    </p>
  );
}
