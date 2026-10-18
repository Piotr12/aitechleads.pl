import { RefreshCw } from "lucide-react";
import { ChapterShell } from "../../_components/chapter";
import { cn } from "../../_components/cx";
import { Artefact, Callout, Cmd, Ext, Figure, PersonTag, SkillChip, Story } from "../../_components/marks";
import { meta, UP } from "../../_data/links";

export const metadata = meta("Day 30: The process changes itself");

const CLASSES: { name: string; count: number; tone: string; means: string }[] = [
  { name: "Clean single pass", count: 14, tone: "bg-emerald-600", means: "merged with no second review, resume or QA round" },
  { name: "Hard recovery", count: 5, tone: "bg-amber-500", means: "a second pass, and the record says why" },
  { name: "Loop checkpoints", count: 1, tone: "bg-sky-600", means: "loop-mode runs, checkpointing by design; not rework" },
  { name: "Cause not recorded", count: 3, tone: "bg-rose-600", means: "a second pass nobody explained" },
];

const WHERE: { want: string; change: string; how: React.ReactNode }[] = [
  {
    want: "A new check in the gate (say, end-to-end tests)",
    change: ".ai/agentic.config.json + SDLC.md",
    how: <>Add it to <Cmd>validation.commands</Cmd> and the Validation gate section in the same PR.</>,
  },
  {
    want: "A new toolchain or label taxonomy",
    change: "re-run setup",
    how: <><Cmd>/om-setup-agent-pipeline</Cmd> again; it shows the current config and keeps what you do not change.</>,
  },
  {
    want: "An extra rule for one skill",
    change: ".ai/skills/<skill-name>/SKILL.md",
    how: <>A repo-local skill of the same name wins; it can import the installed one and add rules, never relax safety.</>,
  },
  {
    want: "A house review rule",
    change: "CODE_REVIEW.md",
    how: <>Applied by <Cmd>om-code-review</Cmd> on every review.</>,
  },
  {
    want: "Different tracker behaviour (say, the merge strategy)",
    change: ".ai/trackers/github.md",
    how: <>Every tracker command lives here; every skill picks the edit up on its next run.</>,
  },
];

export default function Retro() {
  const total = CLASSES.reduce((n, c) => n + c.count, 0);
  return (
    <ChapterShell
      slug="retro"
      know={[
        <>
          <Cmd>om-pipeline-retro</Cmd> is read-only and deterministic: a script classifies finished runs into four
          outcomes and ranks causes by the wall-clock hours they cost.
        </>,
        <>
          Its most useful number is &ldquo;cause not recorded&rdquo;: it measures how well the runs explain
          themselves.
        </>,
        <>
          Change the process in the files that define it: config and <Cmd>SDLC.md</Cmd> together, a repo-local skill
          override for one skill, <Cmd>CODE_REVIEW.md</Cmd> for review rules, the tracker descriptor for tracker
          behaviour.
        </>,
        <>
          Local rules win over installed skills but can never relax their safety rules (no skipped tests, no{" "}
          <Cmd>--no-verify</Cmd>, no force-push).
        </>,
        <>
          Upgrading refreshes the skills, not the files they installed in your repo: <Cmd>npx skills update -p</Cmd>,
          then <Cmd>/om-apply-upgrade-notes</Cmd>.
        </>,
      ]}
    >
      <Story>
        <p>
          Day 30, and the whole team in one room. <PersonTag id="maintainer" /> runs{" "}
          <SkillChip name="om-pipeline-retro" />, which reads the PRs the pipeline finished in the last 30 days (merged
          and closed-unmerged), rebuilds each run from the agents&apos; marker comments, and asks one question: how
          often did a change reach merge in a single pass, and what stopped it the rest of the time?
        </p>
      </Story>

      <Figure
        title="Twenty-three finished runs, four outcomes"
        caption="The classes come from the retro's own classifier script, never from judgement. The numbers are the story's, not a benchmark."
      >
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 sm:p-4">
          <div className="flex h-6 w-full overflow-hidden rounded-full" role="img" aria-label="14 clean, 5 hard recovery, 1 loop checkpoints, 3 cause not recorded">
            {CLASSES.map((c) => (
              <div key={c.name} className={c.tone} style={{ width: `${(c.count / total) * 100}%` }} />
            ))}
          </div>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {CLASSES.map((c) => (
              <li key={c.name} className="flex min-w-0 items-start gap-2 text-sm">
                <span className={cn("mt-1 size-3 shrink-0 rounded-sm", c.tone)} aria-hidden />
                <span className="min-w-0">
                  <span className="font-semibold tabular-nums">{c.count}</span> {c.name}
                  <span className="block text-xs text-muted-foreground">{c.means}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Figure>

      <Artefact title="The top of the ranking" where="retro report">
        {`Largest recorded delay: review found missing tests on date/time
code (3 PRs, ~19 h beyond the median clean run).
3 second passes have no recorded cause.

File the top cause as an issue with om-prepare-issue?
(Nothing is filed until you say so.)`}
      </Artefact>

      <Story>
        <p>
          The retro stops there: filing is the team&apos;s call. They say yes, and{" "}
          <Cmd>om-prepare-issue</Cmd> files it. The fix is a process change, so it goes where the process lives.{" "}
          <PersonTag id="reviewer" /> adds a rule to <Cmd>CODE_REVIEW.md</Cmd> (&ldquo;date and time code needs a test
          at a zone boundary&rdquo;), and <PersonTag id="developer" /> writes a repo-local override so the review skill
          also runs the end-to-end suite on PRs that touch the dispatcher screens.
        </p>
      </Story>

      <Artefact title="A repo-local override that extends, not replaces" where=".ai/skills/om-auto-review-pr/SKILL.md">
        {`Follow the installed \`om-auto-review-pr\` skill, plus:

- Also run \`pnpm test:e2e\` before approving PRs that touch \`apps/dispatcher\`.`}
      </Artefact>

      <Figure title="Where to change what" caption={<>From the README&apos;s <Ext href={UP.readmeAt.makeItYours}>Make it yours</Ext> and SDLC.md&apos;s <Ext href={UP.sdlcAt.amending}>Amending this process</Ext>.</>}>
        <ul className="flex flex-col gap-2">
          {WHERE.map((w) => (
            <li key={w.change} className="grid grid-cols-1 gap-1 rounded-xl border bg-card p-3 md:grid-cols-[1fr_15rem_1.4fr] md:items-baseline md:gap-3">
              <span className="text-sm font-medium">{w.want}</span>
              <span className="min-w-0 font-mono text-[12.5px] break-words">{w.change}</span>
              <span className="text-sm leading-6 text-muted-foreground">{w.how}</span>
            </li>
          ))}
        </ul>
      </Figure>

      <Story>
        <p>
          The same afternoon a new version of the skills is out. Ola updates the installed skills with{" "}
          <Cmd>npx skills update -p</Cmd> (or <Cmd>-g</Cmd> for a global install). That refreshes the instructions, not
          the files earlier runs installed in the repo, so she runs <SkillChip name="om-apply-upgrade-notes" /> with{" "}
          <Cmd>--dry-run</Cmd> first: it compares the tracker and browser descriptors with the newly shipped ones,
          adds what is missing, keeps the team&apos;s local edits, and asks about any section where the two disagree. An
          existing <Cmd>SDLC.md</Cmd> is never regenerated; <Ext href={UP.upgradeNotes}>UPGRADE_NOTES.md</Ext> says
          what to copy across by hand.
        </p>
      </Story>

      <Figure title="The loop that closes the month" caption="The process is a set of committed files; the pipeline's own record is what tells you which of them to change.">
        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Work runs", "skills leave marker comments on every PR"],
            ["Retro reads them", "om-pipeline-retro ranks what rework cost"],
            ["The team decides", "file it, then change config, SDLC.md, an override or CODE_REVIEW.md"],
            ["Next month's runs", "obey the new rules from their very first step"],
          ].map(([t, d], i) => (
            <li key={t} className="flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-3">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex size-6 items-center justify-center rounded-full bg-foreground text-xs text-background tabular-nums">
                  {i + 1}
                </span>
                {t}
                {i === 3 && <RefreshCw className="size-3.5 text-muted-foreground" aria-hidden />}
              </span>
              <span className="text-sm leading-6 text-muted-foreground">{d}</span>
            </li>
          ))}
        </ol>
      </Figure>

      <Callout title="Writing a new skill?">
        <SkillChip name="om-create-skill" /> is for contributors to the skills collection itself: it authors a new
        skill, or splits an oversized one into references, and refuses to hand back anything that fails the
        collection&apos;s lint gate. For changing how <em>your</em> repo uses a skill, the override above is enough.
      </Callout>
    </ChapterShell>
  );
}
