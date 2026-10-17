import type { Metadata } from "next";
import Link from "@/app/docs2/_components/link";
import { HANDOFFS, ROLES, ROBOTS, SKILLS, STAGE_IDS, UPSTREAM, roleSkills, type Role } from "./_data/model";
import { DocsNav, Pager, SectionTitle } from "./_components/chrome";
import { Dot, GateTag, Legend } from "./_components/marks";
import { RaciMatrix } from "./_components/raci-matrix";
import { StageRail } from "./_components/stage-rail";

export const metadata: Metadata = {
  title: "AI SDLC TL;DR",
  robots: ROBOTS,
};

const TLDR: { lead: string; rest: string }[] = [
  { lead: "Humans decide at gates.", rest: "Seven of them, G1–G7, each with a named owner. Red dot = a person signs." },
  { lead: "Agents do the delegated work.", rest: `${SKILLS.length} om-* skills draft, label, fix, review, test and merge; a human supervises and can take over.` },
  { lead: "Blocked can't merge.", rest: "needs-qa without qa-approved, qa-failed, blocked, do-not-merge: hard stops, whatever CI says." },
  { lead: "Escape hatches are explicit.", rest: "Waivers, self-QA on lower risk, exceptions: written on the ticket or PR, never implied." },
  { lead: "The process is code.", rest: "SDLC.md + .ai/agentic.config.json, owned by the Maintainer, changed together." },
];

export default function Docs2Overview() {
  return (
    <>
      <DocsNav current="/docs2" />

      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">AI SDLC in 30 seconds</h1>
        <p className="max-w-3xl text-muted-foreground">
          The open-mercato skills pipeline, compressed for people who already know what a PR is. One rail, seven
          gates, seven actors. Pick your role for your two-minute flow. No coconuts required.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="TL;DR">
        {TLDR.map((t, i) => (
          <div key={t.lead} className="rounded-xl border bg-card p-3">
            <p className="font-mono text-[10px] text-muted-foreground">0{i + 1}</p>
            <p className="mt-1 text-sm font-semibold leading-snug">{t.lead}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.rest}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle
          aside={
            <Link href="/docs2/gates" className="text-xs text-muted-foreground hover:text-foreground">
              gates in detail →
            </Link>
          }
        >
          The rail
        </SectionTitle>
        <StageRail />
        <p className="text-xs text-muted-foreground">
          Stage 1 is the product layer (<code className="font-mono">om-setup-discovery-pipeline</code>, optional); 2–10
          are the delivery layer (<code className="font-mono">om-setup-agent-pipeline</code>). Deployment is the
          team&apos;s release process, not this pipeline.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>Pick your role</SectionTitle>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((role) => (
            <li key={role.id}>
              <RoleCard role={role} />
            </li>
          ))}
          <li>
            <Link
              href="/docs2/handoffs"
              className="flex h-full flex-col justify-between gap-2 rounded-xl border border-dashed p-4 hover:bg-muted/60"
            >
              <span className="text-sm font-semibold">Who hands what to whom →</span>
              <span className="text-xs text-muted-foreground">
                {HANDOFFS.length} handoffs, brief to changelog, as one sequence diagram.
              </span>
            </Link>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle aside={<Legend />}>Who, when (the RACI chart)</SectionTitle>
        <RaciMatrix />
        <p className="text-xs text-muted-foreground">
          Source: the &ldquo;AI SDLC RACI&rdquo; chart, cross-checked against{" "}
          <a href={`${UPSTREAM}/SDLC.md`} className="underline underline-offset-2" target="_blank" rel="noreferrer">
            SDLC.md
          </a>
          . Where they disagree the repo wins:{" "}
          <Link href="/docs2/cheatsheet#chart-vs-repo" className="underline underline-offset-2">
            list of differences
          </Link>
          .
        </p>
      </section>

      <Pager current="/docs2" />
    </>
  );
}

function RoleCard({ role }: { role: Role }) {
  const decides = Object.values(role.cells).filter((c) => c?.dot === "decide").length;
  const supervises = Object.values(role.cells).filter((c) => c?.dot === "supervise").length;
  const gates = [...new Set(Object.values(role.cells).flatMap((c) => c?.gates ?? []))];
  const skills = roleSkills(role).length;
  return (
    <Link
      href={`/docs2/${role.id}`}
      className="flex h-full flex-col gap-2 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/30 hover:bg-muted/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] font-semibold text-muted-foreground">{role.code}</p>
          <p className="font-semibold leading-tight">{role.name}</p>
        </div>
        <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          {role.layer}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Owns {role.owns}. {role.tagline}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-muted-foreground">
        {decides > 0 && (
          <span className="inline-flex items-center gap-1">
            <Dot kind="decide" /> {decides}
          </span>
        )}
        {supervises > 0 && (
          <span className="inline-flex items-center gap-1">
            <Dot kind="supervise" /> {supervises}
          </span>
        )}
        <span>{skills} skills</span>
        {gates.map((g) => (
          <GateTag key={g} id={g} href={false} />
        ))}
      </div>
      <MiniLane role={role} />
    </Link>
  );
}

/** Ten ticks, one per stage, filled where the actor is involved. */
function MiniLane({ role }: { role: Role }) {
  return (
    <span className="grid grid-cols-10 gap-0.5" aria-hidden>
      {STAGE_IDS.map((id) => {
        const cell = role.cells[id];
        const cls = !cell
          ? "bg-muted"
          : cell.dot === "decide"
            ? "bg-red-600 dark:bg-red-500"
            : cell.dot === "supervise"
              ? "bg-foreground"
              : cell.agent
                ? "bg-muted-foreground/60"
                : "bg-muted-foreground/25";
        return <span key={id} className={`h-1.5 rounded-full ${cls}`} title={cell ? cell.raci : undefined} />;
      })}
    </span>
  );
}

