import { ArrowDown, ArrowRight, Bot, MessagesSquare } from "lucide-react";
import { Frame } from "../../_components/frame";
import { cn } from "../../_components/cx";
import { AGENT, Callout, DECIDE, H2, InternalLink, PERSON, Source } from "../../_components/marks";
import { Md } from "../../_components/md";
import { meta } from "../../_data/nav";

export const metadata = meta("How to read a hand-off");

const BEATS = [
  { t: "Read the rulebook", d: "Step 0 of nearly every skill: load `.ai/agentic.config.json` and the tracker descriptor, check for a repo-local override." },
  { t: "Check the claim", d: "Is someone already working on this? Then back off, or ask. Otherwise claim it." },
  { t: "Do the job", d: "Code changes happen in an isolated worktree on a fresh branch, never in your checkout." },
  { t: "Leave a trail", d: "Files committed, labels set (each with a reason), 🤖 comments posted." },
  { t: "Say “your turn”", d: "End the report with exact lines like `PR: #421 (link: …)` that the next skill parses." },
];

const SLIP = [
  ["1 · Started by", "who starts this hand-off, and the exact command (or which skill calls it). Skills listed as “runs inside” are called for you."],
  ["2 · Labels it carries now", "the label set on the issue or PR after this stop: dark chips are pipeline state, dashed ones are signals."],
  ["3 · Reads", "what the skill looks at before acting: files, the tracker, the rulebook."],
  ["4 · Leaves behind", "everything it changes or creates: the trail the next holder finds."],
  ["5 · Says “your turn” with", "the exact lines it ends on, which a person can read and the next skill can parse."],
  ["6 · A person decides", "the call no agent may make at this stop, and who makes it. Or, in grey, why nobody needs to."],
];

export default function HandoffPage() {
  return (
    <Frame
      href="/docs6/kit/handoff"
      title="How to read a hand-off"
      idea="Every hand-off is the same small ritual: read the rulebook, check the claim, do the job, leave a trail, and say “your turn” in a line the next one can read."
      lead={<p>Learn the ritual once, and the nine stops of the journey become variations on a theme. This page also explains the “hand-off slip” you will meet on every stop.</p>}
    >
      <section className="flex flex-col gap-3">
        <H2>The ritual, in five beats</H2>
        <ol className="grid grid-cols-1 gap-2 md:grid-cols-5">
          {BEATS.map((b, i) => (
            <li key={b.t} className={cn("relative flex min-w-0 flex-col gap-1 rounded-xl border p-3 text-sm", AGENT)}>
              <span className="text-xs font-semibold tabular-nums opacity-70">{i + 1}</span>
              <span className="font-semibold">{b.t}</span>
              <span className="text-xs leading-relaxed">
                <Md text={b.d} />
              </span>
            </li>
          ))}
        </ol>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className={cn("flex min-w-0 items-start gap-2 rounded-xl border p-3 text-sm", DECIDE)}>
            <ArrowDown className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              <strong>Then either a person decides</strong> (confirm, correct, approve, merge) and starts the next skill…
            </span>
          </div>
          <div className={cn("flex min-w-0 items-start gap-2 rounded-xl border p-3 text-sm", AGENT)}>
            <ArrowDown className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              <strong>…or the next skill is called directly</strong>, inside the same run, and picks up from those lines.
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <H2>One seam, up close</H2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          The end of stop 2, and the start of stop 4 a few days later. The same line serves both readers: a person copies the number, a skill parses it.
        </p>
        <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr]">
          <figure className="flex min-w-0 flex-col overflow-hidden rounded-xl border-2 border-dashed border-foreground/25 bg-card">
            <figcaption className="border-b border-dashed border-foreground/25 bg-muted/40 px-3 py-2 text-xs font-medium">
              End of <code className="font-mono">om-prepare-issue</code>&apos;s report · illustrative
            </figcaption>
            <pre className="overflow-x-auto p-3 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]">{`Filed issue #412 with inline guidance; no covering spec yet.
Pick it up later with om-auto-fix-issue 412.

`}<mark className="rounded bg-sky-200 px-0.5 text-sky-950 dark:bg-sky-800 dark:text-sky-50">{`Issue: #412 (link: https://github.com/acme/shop/issues/412)`}</mark></pre>
          </figure>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground lg:flex-col">
            <ArrowDown className="size-5 lg:hidden" aria-hidden />
            <ArrowRight className="hidden size-5 lg:block" aria-hidden />
            <span className="text-center">exact shape,
              <br className="hidden lg:block" /> never reworded
            </span>
          </div>
          <figure className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card">
            <figcaption className="border-b bg-muted/40 px-3 py-2 text-xs font-medium">
              Start of <code className="font-mono">om-auto-fix-issue 412</code> (from its SKILL.md)
            </figcaption>
            <ol className="flex list-decimal flex-col gap-1.5 p-3 pl-8 text-sm">
              <li value={0}>Load the config and the tracker descriptor; read the Definition of Ready from <code className="font-mono">SDLC.md</code>.</li>
              <li>Resolve issue #412; check whether anyone else holds it (assignee, <code className="font-mono">in-progress</code>, a recent 🤖 claim comment, an open PR).</li>
              <li>Classify it: bug or feature. Then route…</li>
            </ol>
          </figure>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <H2>Two kinds of skill, told apart by name</H2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className={cn("flex min-w-0 flex-col gap-2 rounded-xl border p-4 text-sm", AGENT)}>
            <p className="flex items-center gap-2 font-semibold">
              <Bot className="size-4" aria-hidden /> <code className="font-mono">om-auto-*</code>: autonomous
            </p>
            <p>
              Hand it a brief, an issue or a PR and walk away. It claims the work, uses an isolated worktree, runs the
              validation gate, reviews itself, and when a decision is needed makes the most reversible call and writes
              it down instead of asking. Safe on a schedule or in CI.
            </p>
          </div>
          <div className={cn("flex min-w-0 flex-col gap-2 rounded-xl border p-4 text-sm", PERSON)}>
            <p className="flex items-center gap-2 font-semibold">
              <MessagesSquare className="size-4" aria-hidden /> everything else: interactive
            </p>
            <p>
              Acts once, may ask you questions, reports, and hands control back. Some (<code className="font-mono">om-brainstorm</code>,{" "}
              <code className="font-mono">om-discover</code>, <code className="font-mono">om-backlog</code>) refuse to run
              without a person, and no autonomous skill may drive them.
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          One more: <code className="font-mono">om-pr-autopilot</code> also runs autonomously by default. Source:{" "}
          <Source path="README.md">README, “Naming convention”</Source>
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <H2>The hand-off slip on every stop</H2>
        <p className="text-sm text-muted-foreground">Each journey page has one. Its six rows always mean the same thing:</p>
        <dl className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {SLIP.map(([k, v]) => (
            <div key={k} className={cn("flex min-w-0 flex-col gap-0.5 rounded-lg border p-3 text-sm", k.startsWith("6") ? DECIDE : "bg-card")}>
              <dt className="text-xs font-semibold tracking-wide uppercase">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Callout title="Three promises that make chaining safe">
        <ul className="flex list-disc flex-col gap-1 pl-4">
          <li>
            <strong>Never a duplicate.</strong> Before opening a PR, every skill looks for one a previous skill already
            opened, and continues on it.
          </li>
          <li>
            <strong>Never unclaimed.</strong> Inside a chain the claim is handed from skill to skill, never dropped and
            re-taken. <InternalLink href="/docs6/hood/locks">How locks work</InternalLink>
          </li>
          <li>
            <strong>Never waiting on CI to report.</strong> Labels, reviews and comments land the moment the work is
            done; CI results follow as a comment. Merging still waits for genuinely green checks.
          </li>
        </ul>
      </Callout>
    </Frame>
  );
}
