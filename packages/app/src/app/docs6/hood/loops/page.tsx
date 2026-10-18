import { Frame } from "../../_components/frame";
import { cn } from "../../_components/cx";
import { Cmd, H2, PERSON, SkillChip, Source } from "../../_components/marks";
import { Md } from "../../_components/md";
import { meta } from "../../_data/nav";
import { STATIONS } from "../../_data/stations";

export const metadata = meta("The road repairs itself");

function LoopMap() {
  const x = (i: number) => 45 + i * 85;
  const y = 190;
  return (
    <svg viewBox="0 0 770 300" role="img" aria-labelledby="loops-title" className="h-auto w-full min-w-[680px]">
      <title id="loops-title">Feedback loops over the nine stops</title>
      <defs>
        <marker id="loop-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-foreground/70" />
        </marker>
        <marker id="loop-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-amber-500" />
        </marker>
      </defs>

      <line x1={x(0)} y1={y} x2={x(8)} y2={y} strokeWidth={3} className="stroke-foreground/25" />
      {STATIONS.map((s, i) => (
        <g key={s.id}>
          <circle cx={x(i)} cy={y} r={17} className="fill-card stroke-foreground/50" strokeWidth={1.5} />
          <text x={x(i)} y={y + 5} textAnchor="middle" className="text-[14px]">
            {s.emoji}
          </text>
          <text x={x(i)} y={y + 34} textAnchor="middle" className="fill-muted-foreground text-[10.5px]">
            {s.n}. {s.short}
          </text>
        </g>
      ))}

      {/* After the merge -> back to Issue */}
      <path d={`M${x(8)} ${y - 19} C ${x(8)} 10, ${x(1)} 10, ${x(1)} ${y - 21}`} fill="none" strokeWidth={2} className="stroke-foreground/70" markerEnd="url(#loop-arrow)" />
      <text x={(x(1) + x(8)) / 2} y={44} textAnchor="middle" className="fill-foreground text-[11.5px] font-medium">
        retro causes and review nits become new issues
      </text>

      {/* Spec assumptions -> decisions -> enforced in review */}
      <path d={`M${x(2)} ${y - 19} C ${x(2)} 95, ${x(5)} 95, ${x(5)} ${y - 21}`} fill="none" strokeWidth={2} strokeDasharray="5 4" className="stroke-amber-500" markerEnd="url(#loop-arrow-amber)" />
      <text x={(x(2) + x(5)) / 2} y={138} textAnchor="middle" className="fill-foreground text-[11px]">
        confirmed spec assumptions
      </text>
      <text x={(x(2) + x(5)) / 2} y={152} textAnchor="middle" className="fill-foreground text-[11px]">
        become decisions reviews enforce
      </text>

      {/* Rulebook under the road */}
      <rect x={x(0) - 25} y={250} width={x(8) - x(0) + 50} height={34} rx={8} className="fill-sky-50 stroke-sky-400 dark:fill-sky-950" strokeWidth={1.5} />
      <text x={(x(0) + x(8)) / 2} y={272} textAnchor="middle" className="fill-foreground text-[11.5px]">
        the rulebook (config, SDLC.md, overrides) is read at every stop, and changed by the maintainer
      </text>
    </svg>
  );
}

const LOOPS: { feeds: string; skill: string; lands: string; who: string }[] = [
  {
    feeds: "Runs that needed a second pass, and the hours it cost",
    skill: "om-pipeline-retro",
    lands: "A ranking of causes by wall-clock hours, and an offer to file the top one through `om-prepare-issue`. You decide whether to file it.",
    who: "Maintainer",
  },
  {
    feeds: "Non-blocking review findings: nits, low-severity, out of scope",
    skill: "om-followup-issue-from-pr",
    lands: "A follow-up issue assigned to the @-mentioned person or the PR author, instead of a bigger PR. `om-auto-fix-pr` files these for you.",
    who: "Anyone",
  },
  {
    feeds: "Assumptions a person confirmed on a spec PR",
    skill: "om-discover",
    lands: "On the next `om-discover --refresh`, recorded as decisions with the confirmer as owner, so the reason survives the people who decided it.",
    who: "Product person",
  },
  {
    feeds: "A rule one skill should always follow here, or a new kind of job",
    skill: "om-create-skill",
    lands: "For one skill: a repo-local skill of the same name at `.ai/skills/<skill-name>/SKILL.md`, extending or replacing the installed one. For a new kind of job: `om-create-skill` writes a new skill in the house style.",
    who: "Maintainer",
  },
  {
    feeds: "A newer version of the skills",
    skill: "om-apply-upgrade-notes",
    lands: "After `npx skills update -p`: the upgrade notes applied, descriptors re-synced, your local edits kept.",
    who: "Maintainer",
  },
];

export default function LoopsPage() {
  return (
    <Frame
      href="/docs6/hood/loops"
      title="The road repairs itself"
      idea="The end of one trip feeds the start of the next: what went wrong becomes an issue, what was decided becomes a rule, and the rulebook changes in files that every later run reads."
      lead={<p>Nothing here happens silently. Every loop either files an issue that a person sees, or changes a committed file that a person approved.</p>}
    >
      <section className="flex flex-col gap-3">
        <div className="overflow-x-auto rounded-xl border bg-card p-3">
          <LoopMap />
        </div>
        <p className="text-xs text-muted-foreground sm:hidden">Scroll the map sideways; the same loops are listed below.</p>
      </section>

      <section className="flex flex-col gap-3">
        <H2>Five loops, and who closes them</H2>
        <ul className="flex flex-col gap-2">
          {LOOPS.map((l) => (
            <li key={l.skill} className="grid grid-cols-1 gap-2 rounded-xl border bg-card p-3 text-sm md:grid-cols-[minmax(0,1fr)_14rem_minmax(0,1.4fr)] md:items-start md:gap-4">
              <span className="min-w-0 font-medium">{l.feeds}</span>
              <span className="flex flex-col items-start gap-1">
                <SkillChip name={l.skill} />
                <span className={cn("rounded-full border px-2 py-0.5 text-[11px]", PERSON)}>{l.who}</span>
              </span>
              <span className="min-w-0 text-muted-foreground">
                <Md text={l.lands} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <H2>Changing the process itself</H2>
        <p className="max-w-3xl text-sm leading-relaxed">
          Edit <code className="font-mono">SDLC.md</code> and <code className="font-mono">.ai/agentic.config.json</code>{" "}
          together, and re-run setup when the toolchain or labels change. Decisions in the product brief carry a
          review-by date: past it, a review flags the entry as due for a look rather than enforcing it blindly. Which
          decisions block more than they protect is, says SDLC.md, a question for the retro.
        </p>
        <Cmd who="After the skills update">{"npx skills update -p\n/om-apply-upgrade-notes"}</Cmd>
      </section>

      <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        Checked against: <Source path="skills/om-pipeline-retro/SKILL.md" /> <Source path="SDLC.md">SDLC.md, “Product decisions” and “Amending this process”</Source>{" "}
        <Source path="README.md">README, “Update an existing installation”</Source>
      </p>
    </Frame>
  );
}
