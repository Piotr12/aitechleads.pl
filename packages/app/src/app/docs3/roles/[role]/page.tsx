import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cellsForRole } from "../../_data/raci";
import { ROLE_BY_ID, ROLES, type RoleId } from "../../_data/roles";
import { STAGE_BY_ID } from "../../_data/stages";
import {
  Callout,
  IllustrativeBadge,
  Legend,
  MarkDot,
  RaciLetters,
  RoleAvatar,
  SectionTitle,
  SkillCard,
  SkillChip,
} from "../../_components/bits";
import { cn } from "../../_components/cx";
import { PrevNext } from "../../_components/prev-next";
import { RoleLane } from "../../_components/raci-views";

export const metadata: Metadata = {
  title: "A day in the life",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return ROLES.map((r) => ({ role: r.id }));
}

export default function RolePage({ params }: PageProps<"/docs3/roles/[role]">) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Fetching the job description…</p>}>
      <RoleDetails params={params} />
    </Suspense>
  );
}

async function RoleDetails({ params }: Pick<PageProps<"/docs3/roles/[role]">, "params">) {
  const { role: roleParam } = await params;
  if (!(roleParam in ROLE_BY_ID)) notFound();
  const id = roleParam as RoleId;
  const role = ROLE_BY_ID[id];
  const cells = cellsForRole(id);
  const i = ROLES.findIndex((r) => r.id === id);
  const prev = ROLES[i - 1];
  const next = ROLES[i + 1];

  return (
    <main className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <Link href="/docs3/roles" className="text-sm text-muted-foreground hover:text-foreground">
          ← All roles
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <RoleAvatar role={id} size="lg" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-muted-foreground">A day in the life of…</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {role.title} {role.emoji}
            </h1>
            <p className="text-muted-foreground">played in our examples by {role.person}</p>
          </div>
        </div>
        <p className="max-w-3xl text-lg">{role.oneLiner}</p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Owns: </span>
          {role.owns}
        </p>
        {role.optionalNote && <Callout tone="note">{role.optionalNote}</Callout>}
        {role.repoGuide && (
          <p className="text-sm">
            Repo guide for this role:{" "}
            <a href={role.repoGuide.href} target="_blank" rel="noreferrer" className="font-mono underline underline-offset-2">
              {role.repoGuide.label}
            </a>
          </p>
        )}
      </header>

      <section className="flex flex-col gap-4">
        <SectionTitle>Where {role.person} shows up on the road</SectionTitle>
        <RoleLane role={id} />
        <Legend compact />
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>{role.person}&apos;s flow, stop by stop</SectionTitle>
        <ol className="flex flex-col">
          {cells.map((cell, k) => {
            const stage = STAGE_BY_ID[cell.stage];
            const last = k === cells.length - 1;
            return (
              <li key={cell.stage} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full border-2 bg-background text-lg",
                      cell.gates.length > 0 ? "border-red-500" : "border-border",
                    )}
                  >
                    <span aria-hidden>{stage.emoji}</span>
                  </span>
                  {!last && <span aria-hidden className="w-0.5 flex-1 bg-border" />}
                </div>
                <div className={cn("flex min-w-0 flex-1 flex-col gap-2 break-words rounded-xl border bg-card p-4", !last && "mb-4")}>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/docs3/story/${stage.id}`} className="font-semibold hover:underline">
                      {stage.n}. {stage.name}
                    </Link>
                    <RaciLetters letters={cell.letters} />
                    {cell.gates.map((g) => (
                      <Link
                        key={g}
                        href={`/docs3/gates#${g}`}
                        className="rounded bg-red-500/15 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-red-700 hover:underline dark:text-red-300"
                      >
                        ⚑ {g}: you decide
                      </Link>
                    ))}
                  </div>
                  {cell.human && (
                    <p className="flex gap-2 text-sm">
                      <MarkDot mark={cell.human.mark} className="mt-1.5" />
                      <span>
                        <span className="font-medium">You: </span>
                        {cell.human.text}
                      </span>
                    </p>
                  )}
                  {cell.agent && (
                    <p className="flex gap-2 text-sm text-muted-foreground">
                      <MarkDot mark="agent" className="mt-1.5" />
                      <span>
                        <span className="font-medium text-foreground">Your agent: </span>
                        {cell.agent}
                      </span>
                    </p>
                  )}
                  {cell.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {cell.skills.map((s) => (
                        <SkillChip key={s} name={s} />
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <SectionTitle>A day in the life</SectionTitle>
          <IllustrativeBadge />
        </div>
        <ol className="flex flex-col gap-3">
          {role.day.map((d, k) => {
            const stage = STAGE_BY_ID[d.stage];
            return (
              <li key={k} className="grid gap-2 rounded-xl border bg-card p-4 sm:grid-cols-[5rem_1fr]">
                <span className="font-mono text-sm font-semibold">{d.time}</span>
                <div className="flex min-w-0 flex-col gap-2">
                  <Link
                    href={`/docs3/story/${stage.id}`}
                    className={cn("w-fit rounded-full px-2 py-0.5 text-xs font-medium hover:underline", role.colors.chip)}
                  >
                    {stage.emoji} {stage.name}
                  </Link>
                  <p className="text-sm">{d.what}</p>
                  {d.command && (
                    <code className="w-fit max-w-full overflow-x-auto rounded-md bg-zinc-950 px-2 py-1 font-mono text-xs whitespace-pre text-zinc-100 dark:bg-black">
                      {d.command}
                    </code>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>Decisions {role.person} makes</SectionTitle>
        <ul className="grid gap-3 md:grid-cols-2">
          {role.decisions.map((d) => (
            <li key={d.situation} className={cn("flex flex-col gap-2 rounded-xl border border-l-4 bg-card p-4 text-sm", role.colors.border)}>
              <p>
                <span className="font-medium">Situation: </span>
                {d.situation}
              </p>
              <p>
                <span className="font-medium">Decision: </span>
                {d.decision}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Why: </span>
                {d.why}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>Things {role.person} never does</SectionTitle>
        <ul className="flex flex-col gap-2">
          {role.never.map((n) => (
            <li key={n} className="flex gap-2 rounded-lg border bg-card p-3 text-sm">
              <span aria-hidden>🚫</span>
              {n}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>{role.person}&apos;s toolbox</SectionTitle>
        <ul className="grid gap-2 sm:grid-cols-2">
          {role.favouriteSkills.map((s) => (
            <SkillCard key={s} name={s} />
          ))}
        </ul>
      </section>

      <PrevNext
        prev={prev ? { href: `/docs3/roles/${prev.id}`, label: `${prev.title} (${prev.person})`, hint: "Previous role" } : undefined}
        next={
          next
            ? { href: `/docs3/roles/${next.id}`, label: `${next.title} (${next.person})`, hint: "Next role" }
            : { href: "/docs3/gates", label: "The 7 gates, with examples", hint: "Up next" }
        }
      />
    </main>
  );
}
