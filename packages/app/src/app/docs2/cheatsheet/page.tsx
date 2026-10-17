import type { Metadata } from "next";
import {
  DISCREPANCIES,
  ROBOTS,
  SKILLS,
  STAGES,
  UPSTREAM,
  gatesAt,
  skillRoles,
  type Skill,
  type SkillGroup,
} from "../_data/model";
import { DocsNav, Pager, SectionTitle } from "../_components/chrome";
import { GateTag, RoleChip, SkillChip } from "../_components/marks";

export const metadata: Metadata = {
  title: "Skills cheatsheet · AI SDLC TL;DR",
  robots: ROBOTS,
};

const GROUPS: { id: SkillGroup; n: string; name: string }[] = [
  { id: "setup", n: "0", name: "Setup & process (once, then after upgrades and retros)" },
  ...STAGES.map((s) => ({ id: s.id as SkillGroup, n: String(s.n), name: s.name })),
];

export default function CheatsheetPage() {
  return (
    <>
      <DocsNav current="/docs2/cheatsheet" />

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Skills cheatsheet</h1>
        <p className="max-w-3xl text-muted-foreground">
          All {SKILLS.length} skills by stage, one line each. <code className="font-mono text-foreground">auto</code> ={" "}
          <code className="font-mono">om-auto-*</code>: unattended, claims its work, safe in CI. Everything else is
          interactive: acts once, may ask, hands back. Install:{" "}
          <code className="font-mono text-foreground">npx skills add open-mercato/skills --skill &apos;*&apos;</code>
        </p>
      </header>

      <div className="flex flex-col gap-5">
        {GROUPS.map((g) => {
          const skills = SKILLS.filter((s) => s.group === g.id);
          if (skills.length === 0) return null;
          const gates = g.id === "setup" ? [] : gatesAt(g.id);
          return (
            <section key={g.id} id={`group-${g.id}`} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full border font-mono text-[10px] font-semibold">
                  {g.n}
                </span>
                <h2 className="text-sm font-semibold">{g.name}</h2>
                {gates.map((gate) => (
                  <GateTag key={gate.id} id={gate.id} />
                ))}
              </div>
              <ul className="divide-y rounded-xl border bg-card">
                {skills.map((s) => (
                  <SkillRow key={s.name} skill={s} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <section id="chart-vs-repo" className="flex scroll-mt-6 flex-col gap-3">
        <SectionTitle>Chart vs repo (the repo wins)</SectionTitle>
        <ul className="divide-y rounded-xl border bg-card text-sm">
          {DISCREPANCIES.map((d) => (
            <li key={d.topic} className="grid gap-1 p-3 md:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-4">
              <span className="font-semibold">{d.topic}</span>
              <span className="text-muted-foreground">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Chart:</span> {d.chart}
              </span>
              <span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Repo:</span>{" "}
                {d.repo}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Upstream:{" "}
          <a href={`${UPSTREAM}/README.md`} target="_blank" rel="noreferrer" className="underline underline-offset-2">
            README ↗
          </a>{" "}
          ·{" "}
          <a href={`${UPSTREAM}/SDLC.md`} target="_blank" rel="noreferrer" className="underline underline-offset-2">
            SDLC.md ↗
          </a>{" "}
          ·{" "}
          <a
            href={`${UPSTREAM}/docs/skills/README.md`}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            skill cards ↗
          </a>
        </p>
      </section>

      <Pager current="/docs2/cheatsheet" />
    </>
  );
}

function SkillRow({ skill }: { skill: Skill }) {
  const roles = skill.roles ?? skillRoles(skill.name).map((r) => r.id);
  return (
    <li className="grid gap-1 px-3 py-2 text-sm md:grid-cols-[17rem_minmax(0,1fr)_auto] md:items-center md:gap-4">
      <span className="flex flex-wrap items-center gap-1.5">
        <SkillChip name={skill.name} />
        {skill.block && (
          <span className="text-[10px] text-muted-foreground" title="Mostly composed by other skills">
            block
          </span>
        )}
      </span>
      <span className="min-w-0">
        {skill.line}
        <code className="mt-0.5 block overflow-x-auto font-mono text-[11px] whitespace-nowrap text-muted-foreground">
          {skill.example}
        </code>
      </span>
      <span className="flex flex-wrap gap-1 md:justify-end">
        {roles.length ? (
          roles.map((r) => <RoleChip key={r} id={r} />)
        ) : (
          <span className="text-[11px] text-muted-foreground">composed</span>
        )}
      </span>
    </li>
  );
}
