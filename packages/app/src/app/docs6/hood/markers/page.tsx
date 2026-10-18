import { Frame } from "../../_components/frame";
import { Callout, H2, SkillChip, Source } from "../../_components/marks";
import { Md } from "../../_components/md";
import { meta } from "../../_data/nav";

export const metadata = meta("How a skill says “your turn”");

const LINES: { line: string; from: string[]; to: string[]; note: string }[] = [
  {
    line: "PR: #421 (link: https://github.com/acme/shop/pull/421)",
    from: ["om-open-pr", "om-auto-create-pr", "om-auto-write-spec", "om-auto-implement-spec", "om-auto-fix-issue"],
    to: ["om-auto-review-pr", "om-auto-qa-pr", "om-auto-fix-pr", "om-pr-autopilot"],
    note: "Every PR-producing skill ends with it. Skills that work on an existing PR take its number and emit it again.",
  },
  {
    line: "Issue: #412 (link: https://github.com/acme/shop/issues/412)",
    from: ["om-prepare-issue", "om-open-pr", "om-auto-fix-issue"],
    to: ["om-auto-fix-issue"],
    note: "Emitted whenever a run has a subject issue. `om-auto-fix-issue` in brief mode parses the one `om-prepare-issue` prints.",
  },
  {
    line: "Spec: .ai/specs/2026-10-20-bulk-archive-orders.md",
    from: ["om-auto-write-spec", "om-auto-implement-spec", "om-prepare-issue"],
    to: ["om-auto-implement-spec"],
    note: "A repo-relative path, where a skill defines it.",
  },
  {
    line: 'Next: om-prepare-issue "Bulk-archive orders — brief: .ai/specs/briefs/…"\nBrief: .ai/specs/briefs/2026-10-19-bulk-archive-orders.md',
    from: ["om-brainstorm"],
    to: [],
    note: "The routing decision: an exact command for you, or an orchestrator, to run. `Next: none` means stop here. `om-discover` and `om-backlog` end with a `Next:` line too.",
  },
];

const BATON: { skill: string; line: string }[] = [
  { skill: "om-brainstorm", line: 'Next: om-prepare-issue "Bulk-archive orders from the grid — brief: …"' },
  { skill: "om-prepare-issue", line: "Issue: #412 (link: …)" },
  { skill: "om-auto-write-spec", line: "PR: #418 (link: …) · Spec: .ai/specs/2026-10-20-bulk-archive-orders.md" },
  { skill: "om-auto-fix-issue", line: "calls om-auto-implement-spec 418 directly, inside the same run" },
  { skill: "om-auto-implement-spec", line: "PR: #421 (link: …)" },
  { skill: "om-auto-review-pr", line: "APPROVED · PR: #421 (link: …)" },
  { skill: "om-auto-qa-pr", line: "PR: #421 (link: …), plus the QA reviewer's QA head: 3f9c2e1" },
  { skill: "om-approve-merge-pr", line: "PR: #421 (link: …): merged; Closes #412 closes the issue" },
];

const BODY: { line: string; meaning: string }[] = [
  { line: "Closes #412", meaning: "on an implementing PR: merging closes the issue. Housekeeping acts on these authoritative links only, never on a bare `#412`" },
  { line: "Refs #418", meaning: "on a spec PR, and on the implementation PR pointing back at its spec PR: linked, but never closed by the merge" },
  { line: "Tracking plan: .ai/runs/…", meaning: "where the execution plan is: what `om-auto-continue-pr` reads to resume" },
  { line: "Status: in-progress | complete", meaning: "whether the plan is finished; an interrupted run leaves the PR a draft with this line still saying in-progress (not to be confused with the label)" },
  { line: "Source doc: .ai/specs/…", meaning: "the spec this PR implements; how a second run finds the existing implementation PR instead of opening another" },
  { line: "QA head: 3f9c2e1", meaning: "in the QA comment: the commit that was tested; a later push makes the approval stale" },
];

const TOKENS: [string, string][] = [
  ["NO_ACTION_NEEDED", "a triage gate's clean stop: already fixed, in flight, claimed, or not a bug"],
  ["NOT_READY", "the feature route's stop on a ticket that fails the Definition of Ready"],
  ["LOW_CONFIDENCE", "the root-cause brief is unsure: the chain goes on, the PR body warns the reviewer"],
  ["Status: blocked", "a chain step could not finish; the driver releases the lock and reports"],
  ["⚠ NEEDS HUMAN CONFIRMATION", "an autonomous guess too risky to take alone; keeps the PR a draft"],
];

export default function MarkersPage() {
  return (
    <Frame
      href="/docs6/hood/markers"
      title="How a skill says “your turn”"
      idea="Skills hand work on with a few exact lines, the same for people and machines, in a fixed shape that is never reworded, translated or decorated."
      lead={<p>No shared memory, no database: what one skill knows, the next one learns from the end of a report, the body of a PR, or a comment. Here are the lines to look for.</p>}
    >
      <section className="flex flex-col gap-3">
        <H2>The baton, along our journey</H2>
        <p className="text-sm text-muted-foreground">What each stop of the journey handed to the next. Left: who finished; right: the line the next one picked up.</p>
        <ol className="flex flex-col">
          {BATON.map((b, i) => (
            <li key={b.skill} className="relative grid grid-cols-1 gap-1 border-l-4 border-sky-400 py-2 pl-4 text-sm md:grid-cols-[15rem_1fr] md:items-center md:gap-4 dark:border-sky-600">
              <span className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground tabular-nums">{i + 1}</span>
                <SkillChip name={b.skill} />
              </span>
              <code className="min-w-0 rounded-md border bg-muted/50 px-2 py-1 font-mono text-xs [overflow-wrap:anywhere]">{b.line}</code>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <H2>The last lines of a report</H2>
        <ul className="flex flex-col gap-3">
          {LINES.map((l) => (
            <li key={l.line} className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-3">
              <pre className="overflow-x-auto rounded-lg border bg-muted/50 px-3 py-2 font-mono text-[12.5px] whitespace-pre-wrap [overflow-wrap:anywhere]">{l.line}</pre>
              <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
                <p className="flex flex-wrap items-center gap-1">
                  <span className="text-muted-foreground">printed by</span>
                  {l.from.map((s) => (
                    <SkillChip key={s} name={s} />
                  ))}
                </p>
                <p className="flex flex-wrap items-center gap-1">
                  <span className="text-muted-foreground">read by</span>
                  {l.to.length > 0 ? l.to.map((s) => <SkillChip key={s} name={s} />) : <span>you, or whatever runs your skills</span>}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                <Md text={l.note} />
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <H2>Lines in a PR body or comment</H2>
        <dl className="divide-y overflow-hidden rounded-xl border">
          {BODY.map((b) => (
            <div key={b.line} className="grid grid-cols-1 gap-1 p-3 text-sm sm:grid-cols-[15rem_1fr] sm:gap-4">
              <dt>
                <code className="font-mono text-xs font-semibold [overflow-wrap:anywhere]">{b.line}</code>
              </dt>
              <dd className="min-w-0 text-muted-foreground">
                <Md text={b.meaning} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-3">
        <H2>Inside a chain: whole outputs, word for word</H2>
        <p className="max-w-3xl text-sm leading-relaxed">
          In the bug chain each step’s full output goes to the next one in a fixed block, unmodified, so nothing is lost
          in a summary. <code className="font-mono">om-open-pr</code> expects exactly this shape:
        </p>
        <pre className="overflow-x-auto rounded-lg border bg-muted/50 px-3 py-2 font-mono text-[12.5px] whitespace-pre-wrap">{`— PREVIOUS STEP (om-fix) said —
<the om-fix summary, verbatim>`}</pre>
      </section>

      <section className="flex flex-col gap-3">
        <H2>Words that mean “stop” or “look harder”</H2>
        <dl className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {TOKENS.map(([t, m]) => (
            <div key={t} className="flex min-w-0 flex-col gap-1 rounded-lg border border-dashed border-foreground/30 bg-muted/30 p-3 text-sm">
              <dt>
                <code className="font-mono text-xs font-semibold">{t}</code>
              </dt>
              <dd className="text-muted-foreground">{m}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Callout title="Emojis decorate, text decides">
        <p>
          Reports use a fixed emoji glossary (🎯 goal, 📋 plan, 🔍 review, ⛔ blocked…), but parsers key only on the text
          markers. That is why the label part of a line such as <code className="font-mono">PR:</code> must never be renamed,
          translated or decorated.
        </p>
      </Callout>

      <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        Checked against: <Source path="skills/om-auto-create-pr/references/rules.md">shared rules, “Marker contract”</Source>{" "}
        <Source path="skills/om-brainstorm/SKILL.md" /> <Source path="skills/om-open-pr/SKILL.md" />{" "}
        <Source path="skills/om-auto-create-pr/references/pr-body-template.md" />
      </p>
    </Frame>
  );
}
