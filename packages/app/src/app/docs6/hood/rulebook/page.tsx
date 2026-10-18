import { Frame } from "../../_components/frame";
import { cn } from "../../_components/cx";
import { AGENT, Callout, H2, PERSON, Source } from "../../_components/marks";
import { Md } from "../../_components/md";
import { meta } from "../../_data/nav";

export const metadata = meta("The rulebook every skill reads first");

const FILES: { path: string; for: "skills" | "people" | "both"; writer: string; reader: string }[] = [
  { path: ".ai/agentic.config.json", for: "skills", writer: "`om-setup-agent-pipeline`, once; committed", reader: "nearly every skill, at step 0" },
  { path: "SDLC.md", for: "people", writer: "`om-setup-agent-pipeline`, only when missing; then the maintainer", reader: "people; and skills, for the Definition of Ready and the priority and risk rules" },
  { path: "AGENTS.md / CLAUDE.md", for: "both", writer: "you (setup offers a starter with a task-routing table)", reader: "every skill, before working: your conventions apply from the first run" },
  { path: ".ai/trackers/<tracker>.md", for: "skills", writer: "setup installs it; you may edit it", reader: "every tracker operation (get-issue, create-pr, merge-pr, …): no skill calls the tracker CLI directly" },
  { path: ".ai/browsers/<provider>.md", for: "skills", writer: "setup installs it", reader: "QA and test skills, to drive a real browser" },
  { path: "CODE_REVIEW.md", for: "both", writer: "setup, when missing", reader: "`om-code-review`, on every review" },
  { path: "BACKWARD_COMPATIBILITY.md", for: "both", writer: "setup, when missing", reader: "reviews (violations are blockers) and implementers (warnings)" },
  { path: ".ai/skills/<skill-name>/SKILL.md", for: "skills", writer: "you, optionally", reader: "the installed skill of the same name, which then follows it. It may add rules, never relax safety ones" },
];

const KEYS: [string, string][] = [
  ["baseBranch", "the branch PRs target; `\"auto\"` resolves the repo's default branch at run time"],
  ["tracker", "which descriptor to use: `github`, `gitlab`, `linear`, `jira`, or your own"],
  ["validation.commands", "the gate, in order: typecheck, lint, tests, build… Any non-zero exit fails it"],
  ["labels", "the taxonomy; `enabled: false` makes every skill skip label work and say so"],
  ["qaGate", "`true`: a `needs-qa` PR cannot merge without `qa-approved`. `false`: advisory only"],
  ["ci.maxWaitMinutes", "the most any skill waits for CI before reporting and moving on (default 40)"],
  ["engine.loopStepThreshold", "plans with more steps than this (default 20) go to the loop engine"],
  ["paths.*", "where runs, specs, analysis, scripts and QA artefacts live (`.ai/runs`, `.ai/specs`, …)"],
  ["closeKeywords", "extra close words for non-English PR bodies, e.g. Polish `zamyka`"],
];

export default function RulebookPage() {
  return (
    <Frame
      href="/docs6/hood/rulebook"
      title="The rulebook every skill reads first"
      idea="The process lives in two committed files, one for skills and one for people, and every skill reads the rulebook before it touches the work, so you change behaviour by editing files, not skills."
      lead={
        <p>
          Nothing is hard-coded in the skills: not the base branch, not the test commands, not the labels. A skill run
          in a repo without the config runs the setup skill first (interactively, or with{" "}
          <code className="font-mono">--defaults</code> when nobody is there), then carries on.
        </p>
      }
    >
      <section className="flex flex-col gap-3">
        <H2>The files, who writes them, who reads them</H2>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className={cn("rounded-full border px-2 py-0.5", AGENT)}>mainly for skills</span>
          <span className={cn("rounded-full border px-2 py-0.5", PERSON)}>mainly for people</span>
          <span className="rounded-full border bg-card px-2 py-0.5">for both</span>
        </div>
        <ul className="flex flex-col gap-2">
          {FILES.map((f) => (
            <li
              key={f.path}
              className={cn(
                "grid grid-cols-1 gap-1 rounded-xl border p-3 text-sm md:grid-cols-[minmax(0,1.1fr)_1fr_1.3fr] md:gap-4",
                f.for === "skills" ? AGENT : f.for === "people" ? PERSON : "bg-card",
              )}
            >
              <code className="min-w-0 font-mono text-xs font-semibold [overflow-wrap:anywhere]">{f.path}</code>
              <span className="min-w-0">
                <span className="text-xs opacity-70">written by </span>
                <Md text={f.writer} />
              </span>
              <span className="min-w-0">
                <span className="text-xs opacity-70">read by </span>
                <Md text={f.reader} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <H2>Inside the config: the knobs that change the journey</H2>
        <div className="overflow-hidden rounded-xl border">
          <dl className="divide-y">
            {KEYS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 gap-1 p-3 text-sm sm:grid-cols-[13rem_1fr] sm:gap-4">
                <dt>
                  <code className="font-mono text-xs font-semibold">{k}</code>
                </dt>
                <dd className="min-w-0 text-muted-foreground">
                  <Md text={v} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="text-xs text-muted-foreground">
          Full schema: <Source path="skills/om-setup-agent-pipeline/SKILL.md">om-setup-agent-pipeline, “Config schema”</Source>
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Callout title="Changing the process">
          <p>
            <code className="font-mono">SDLC.md</code> and the config describe the same process: change them together, and
            re-run <code className="font-mono">om-setup-agent-pipeline</code> when the toolchain or the labels change. Both
            belong to the maintainer.
          </p>
        </Callout>
        <Callout title="Changing one skill">
          <p>
            Drop a skill of the same name at <code className="font-mono">.ai/skills/&lt;skill-name&gt;/SKILL.md</code>. It
            can extend the installed one (“follow it, plus…”) or replace it, but it can never relax the safety rules: no
            skipping tests, no <code className="font-mono">--no-verify</code>, no force-pushes.
          </p>
        </Callout>
      </section>

      <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        Checked against: <Source path="README.md" /> <Source path="SDLC.md" /> <Source path="DECISIONS.md" />
      </p>
    </Frame>
  );
}
