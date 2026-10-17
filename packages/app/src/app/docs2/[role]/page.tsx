import type { Metadata } from "next";
import Link from "@/app/docs2/_components/link";
import { notFound } from "next/navigation";
import {
  GATES,
  HANDOFFS,
  ROBOTS,
  ROLES,
  STAGES,
  isRoleId,
  roleById,
  roleSkills,
  skillByName,
  stageById,
  type Handoff,
  type Role,
  type RoleId,
} from "../_data/model";
import { DocsNav, Pager, SectionTitle } from "../_components/chrome";
import { CellMarks, Dot, GateTag, RoleChip, SkillChip } from "../_components/marks";
import { StageRail } from "../_components/stage-rail";

export function generateStaticParams() {
  return ROLES.map((r) => ({ role: r.id }));
}

export async function generateMetadata({ params }: PageProps<"/docs2/[role]">): Promise<Metadata> {
  const { role } = await params;
  return {
    title: isRoleId(role) ? `${roleById(role).name} · AI SDLC TL;DR` : "AI SDLC TL;DR",
    robots: ROBOTS,
  };
}

export default async function RolePage({ params }: PageProps<"/docs2/[role]">) {
  const { role: id } = await params;
  if (!isRoleId(id)) notFound();
  const role = roleById(id);
  const href = `/docs2/${role.id}`;

  return (
    <>
      <DocsNav current={href} />

      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs font-semibold text-muted-foreground">
          {role.code} · {role.layer} layer
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{role.name}</h1>
        <p className="max-w-3xl text-muted-foreground">
          Owns <span className="font-medium text-foreground">{role.owns}</span>. {role.tagline}
        </p>
        <p className="text-xs text-muted-foreground">
          In the repo: {role.repoName} ·{" "}
          <a href={role.repoDoc.href} target="_blank" rel="noreferrer" className="underline underline-offset-2">
            {role.repoDoc.label} ↗
          </a>
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <SectionTitle>Your lane</SectionTitle>
        <StageRail cells={role.cells} anchorPrefix="stage-" />
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="flex flex-col gap-3">
          <SectionTitle>Your flow</SectionTitle>
          <Flow role={role} />
        </section>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-4 lg:self-start">
          <Gates role={role} />
          <Commands role={role} />
          <StopStart role={role} />
        </aside>
      </div>

      <Handoffs role={role} />

      <Pager current={href} />
    </>
  );
}

function Flow({ role }: { role: Role }) {
  const stages = STAGES.filter((s) => role.cells[s.id]);
  return (
    <ol className="relative flex flex-col gap-3 border-l-2 border-border pl-5">
      {stages.map((stage) => {
        const cell = role.cells[stage.id]!;
        const tone =
          cell.dot === "decide"
            ? "border-red-600/50 dark:border-red-500/50"
            : cell.dot === "supervise"
              ? "border-foreground/30"
              : "border-border";
        return (
          <li key={stage.id} id={`stage-${stage.id}`} className="relative scroll-mt-6">
            <span
              aria-hidden
              className={`absolute top-3 -left-[27px] size-3 rounded-full border-2 bg-background ${
                cell.dot === "decide" ? "border-red-600 dark:border-red-500" : "border-foreground/50"
              }`}
            />
            <div className={`rounded-xl border bg-card p-3 ${tone}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{stage.n}</span>
                <h3 className="text-sm font-semibold">{stage.name}</h3>
                <CellMarks cell={cell} size="lg" />
                {cell.gates?.map((g) => <GateTag key={g} id={g} />)}
              </div>
              <dl className="mt-2 grid gap-1.5 text-sm">
                {cell.human && (
                  <div className="flex gap-2">
                    <dt className="mt-1">
                      {cell.dot ? (
                        <Dot kind={cell.dot} />
                      ) : (
                        <span className="block w-3 text-center font-mono text-[10px] text-muted-foreground">
                          {cell.raci.charAt(0)}
                        </span>
                      )}
                      <span className="sr-only">You</span>
                    </dt>
                    <dd>{cell.human}</dd>
                  </div>
                )}
                {cell.agent && (
                  <div className="flex gap-2 text-muted-foreground">
                    <dt className="mt-1">
                      <Dot kind="agent" />
                      <span className="sr-only">Agent</span>
                    </dt>
                    <dd>{cell.agent}</dd>
                  </div>
                )}
              </dl>
              {cell.skills && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {cell.skills.map((s) => (
                    <SkillChip key={s} name={s} />
                  ))}
                </div>
              )}
              {(cell.note || stage.note) && (
                <p className="mt-2 border-t pt-2 text-xs text-muted-foreground">
                  <span className="font-medium">Note:</span> {cell.note ?? stage.note}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Gates({ role }: { role: Role }) {
  const owned = GATES.filter((g) => g.owner.includes(role.id));
  const onPath = GATES.filter((g) => !g.owner.includes(role.id) && role.cells[g.stage]);
  if (owned.length === 0 && onPath.length === 0) return null;
  return (
    <section className="flex flex-col gap-2">
      <SectionTitle>Gates</SectionTitle>
      <ul className="flex flex-col gap-1.5 text-sm">
        {owned.map((g) => (
          <li key={g.id} className="flex items-start gap-2 rounded-lg border border-red-600/30 bg-red-500/5 p-2">
            <GateTag id={g.id} />
            <span>
              <span className="font-medium">You sign: {g.name}.</span>{" "}
              <span className="text-muted-foreground">{g.signal}.</span>
            </span>
          </li>
        ))}
        {onPath.map((g) => (
          <li key={g.id} className="flex items-start gap-2 p-2">
            <GateTag id={g.id} />
            <span className="text-muted-foreground">
              {g.name}, signed by {g.ownerLabel}.
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Commands({ role }: { role: Role }) {
  const skills = roleSkills(role);
  if (skills.length === 0) return null;
  return (
    <section className="flex flex-col gap-2">
      <SectionTitle>
        Commands <span className="font-normal normal-case tracking-normal">({skills.length})</span>
      </SectionTitle>
      <ul className="flex flex-col divide-y rounded-xl border bg-card">
        {skills.map((name) => {
          const skill = skillByName(name);
          return (
            <li key={name} className="flex flex-col gap-1 p-2.5">
              <SkillChip name={name} className="self-start" />
              {skill && (
                <>
                  <code className="block overflow-x-auto font-mono text-[11px] whitespace-nowrap text-muted-foreground">
                    {skill.example}
                  </code>
                  <span className="text-xs">{skill.line}</span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function StopStart({ role }: { role: Role }) {
  return (
    <section className="grid grid-cols-2 gap-3 text-xs lg:grid-cols-1">
      <div className="rounded-xl border bg-card p-3">
        <p className="mb-1.5 font-semibold uppercase tracking-wider text-muted-foreground">Stop</p>
        <ul className="flex flex-col gap-1">
          {role.stop.map((s) => (
            <li key={s} className="flex gap-1.5">
              <span aria-hidden className="text-muted-foreground">✕</span>
              <span className="min-w-0 break-words text-muted-foreground line-through decoration-muted-foreground/40">{s}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border bg-card p-3">
        <p className="mb-1.5 font-semibold uppercase tracking-wider text-muted-foreground">Start</p>
        <ul className="flex flex-col gap-1">
          {role.start.map((s) => (
            <li key={s} className="flex gap-1.5">
              <span aria-hidden>→</span>
              <span className="min-w-0 break-words">{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Handoffs({ role }: { role: Role }) {
  const incoming = HANDOFFS.filter((h) => h.to === role.id);
  const outgoing = HANDOFFS.filter((h) => h.from === role.id);
  return (
    <section className="flex flex-col gap-3">
      <SectionTitle
        aside={
          <Link href="/docs2/handoffs" className="text-xs text-muted-foreground hover:text-foreground">
            all handoffs →
          </Link>
        }
      >
        Handoffs
      </SectionTitle>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">← In ({incoming.length})</p>
          {incoming.length ? (
            <ul className="divide-y">
              {incoming.map((h, i) => (
                <HandoffRow key={i} other={h.from} h={h} />
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Nothing handed to you directly; you are kept informed.</p>
          )}
        </div>
        <div className="rounded-xl border bg-card p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Out → ({outgoing.length})</p>
          {outgoing.length ? (
            <ul className="divide-y">
              {outgoing.map((h, i) => (
                <HandoffRow key={i} other={h.to} h={h} />
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">You hand nothing on directly.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function HandoffRow({ other, h }: { other: RoleId; h: Handoff }) {
  return (
    <li className="flex items-start gap-2 py-1.5 text-sm">
      <RoleChip id={other} className="mt-0.5" />
      <span className="min-w-0 flex-1">
        {h.artifact}
        <span className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
          <span>{stageById(h.stage).short}</span>
          {h.gate && <GateTag id={h.gate} />}
          {h.via && <code className="font-mono">{h.via}</code>}
        </span>
      </span>
    </li>
  );
}
