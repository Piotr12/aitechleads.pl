import { Check } from "lucide-react";
import { ChapterShell } from "../../_components/chapter";
import { cn } from "../../_components/cx";
import { Callout, Cmd, Ext, Figure, PersonTag, SkillChip, Story } from "../../_components/marks";
import { meta, UP } from "../../_data/links";

export const metadata = meta("Week 1: Turning the dial");

type Notch = { n: number; name: string; skills: string[]; example: string; you: string; ch?: number };

const DIAL: Notch[] = [
  {
    n: 1,
    name: "One step, you drive",
    skills: ["om-verify-in-repo", "om-root-cause", "om-fix", "om-open-pr"],
    example: "/om-root-cause 12",
    you: "Read each report and choose the next step yourself.",
  },
  {
    n: 2,
    name: "One chain, one command",
    skills: ["om-auto-fix-issue", "om-auto-create-pr"],
    example: "/om-auto-fix-issue 15",
    you: "Read the PR it leaves; review and QA still follow.",
  },
  {
    n: 3,
    name: "A long build that can pause",
    skills: ["om-auto-create-pr-loop"],
    example: "/om-auto-create-pr --loop (or automatic above 20 plan steps)",
    you: "Glance at the checkpoints; resume if it stops.",
    ch: 6,
  },
  {
    n: 4,
    name: "Finish one PR, whatever it needs",
    skills: ["om-pr-autopilot", "om-auto-fix-pr"],
    example: "/om-pr-autopilot 14 --dry-run",
    you: "Decide the merge. It stops at merge-ready.",
  },
  {
    n: 5,
    name: "Sweep the whole queue",
    skills: ["om-review-prs", "om-auto-manage-issues", "om-close-fixed-issues"],
    example: "/om-review-prs",
    you: "Read the session summary. Sweeps suit a routine: a day-start review, a daily tidy.",
  },
];

const AUTO_PROMISES = [
  "claims the issue or PR first, so other agents back off",
  "works in an isolated git worktree, never in your checkout",
  "runs the full validation gate from the config",
  "reviews its own diff before anyone else sees it",
  "when it must choose, makes the most reversible choice and writes down why, instead of asking",
  "finishes with a ready, fully labelled PR and a run-summary comment (screenshots too, when users will see the change)",
];

export default function AutonomyDial() {
  return (
    <ChapterShell
      slug="autonomy-dial"
      know={[
        <>
          <Cmd>om-auto-*</Cmd> means autonomous: no questions, a claim, an isolated worktree, the validation gate, a
          self-review, and a written-down default wherever it had to choose.
        </>,
        <>
          <Cmd>om-auto-fix-issue</Cmd> takes an issue to a PR (bug chain or feature route);{" "}
          <Cmd>om-auto-create-pr</Cmd> takes a free-form brief to a PR.
        </>,
        <>
          The autonomous skills are built from the same building blocks you ran by hand; nothing new happens, it just
          happens without you between the steps.
        </>,
        <>Turn the dial per task, not per team: watch while you learn, hand over what you trust, sweep what is routine.</>,
        <>Even the top notch stops short of the merge and of QA sign-off. Those stay with people (chapters 8 and 9).</>,
      ]}
    >
      <Story>
        <p>
          Friday of week one. Issue #15 is another small bug, and <PersonTag id="developer" /> does not fancy typing
          four commands again. He types one: <Cmd>/om-auto-fix-issue 15</Cmd>. It reads the issue, decides it is a bug
          (labels first, then wording), and runs the same relay as chapter 2 on its own: verify, root cause, fix, open
          PR. Then it carries on: <Cmd>om-auto-review-pr --autofix</Cmd> on its own PR, and a browser check with
          screenshots because the fix touches a screen. One claim is held throughout, handed from the issue to the PR,
          never dropped.
        </p>
        <p>
          The same afternoon Kasia asks for a small thing with no ticket at all. Bartek writes it as a brief:{" "}
          <Cmd>/om-auto-create-pr &quot;add a delivered webhook for the co-op&apos;s accounting system&quot;</Cmd>. That
          skill drafts an execution plan, commits it first, opens a draft PR so anyone can watch, works phase by phase,
          runs the gate, reviews itself, and flips the PR to ready when done.
        </p>
      </Story>

      <Figure
        title="The autonomy dial"
        caption="Five ways to run the same kind of work, from most hands-on to most hands-off. Higher notches compose the lower ones; the “You” line is what stays with you."
      >
        <ol className="flex flex-col gap-2">
          {DIAL.map((d) => (
            <li
              key={d.n}
              className={cn(
                "grid min-w-0 grid-cols-1 gap-x-4 gap-y-2 rounded-xl border bg-card p-3 md:grid-cols-[15rem_1fr_16rem] md:items-start",
                d.n === 2 && "border-2 border-foreground",
              )}
            >
              <div className="flex min-w-0 flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background tabular-nums">
                    {d.n}
                  </span>
                  <span className="font-semibold leading-6">{d.name}</span>
                </div>
                <div className="flex items-center gap-2" aria-hidden>
                  <div className="h-1.5 flex-1 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-foreground/70" style={{ width: `${d.n * 20}%` }} />
                  </div>
                  <span className="w-20 text-[11px] text-muted-foreground">{d.n === 2 ? "this week" : ""}</span>
                </div>
              </div>
              <div className="flex min-w-0 flex-col gap-1.5">
                <ul className="flex flex-wrap gap-1">
                  {d.skills.map((s) => (
                    <li key={s} className="min-w-0 max-w-full">
                      <SkillChip name={s} />
                    </li>
                  ))}
                </ul>
                <p className="text-xs break-words text-muted-foreground">
                  e.g. <span className="font-mono">{d.example}</span>
                  {d.ch && <> (chapter {d.ch})</>}
                </p>
              </div>
              <p className="border-t pt-2 text-sm leading-6 md:border-t-0 md:border-l md:pt-0 md:pl-4">
                <span className="font-semibold">You: </span>
                {d.you}
              </p>
            </li>
          ))}
        </ol>
      </Figure>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold tracking-tight">What &ldquo;autonomous&rdquo; promises</h2>
          <p className="text-sm text-muted-foreground">
            Every <Cmd>om-auto-*</Cmd> skill, per the <Ext href={UP.readme}>README</Ext>:
          </p>
          <ul className="flex flex-col gap-2">
            {AUTO_PROMISES.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm leading-6">
                <Check className="mt-1 size-4 shrink-0 text-emerald-600" aria-hidden />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold tracking-tight">How om-auto-fix-issue picks a road</h2>
          <ol className="flex flex-col gap-2 text-sm leading-6">
            <li className="rounded-xl border bg-card p-3">
              <span className="font-semibold">Bug</span> (a <Cmd>bug</Cmd> label, or words like &ldquo;fails&rdquo;,
              &ldquo;crash&rdquo;, steps to reproduce): verify → root cause → fix → open PR → review with autofix → UI
              check when a screen changed.
            </li>
            <li className="rounded-xl border bg-card p-3">
              <span className="font-semibold">Feature</span> (a <Cmd>feature</Cmd> label, or &ldquo;add…&rdquo;,
              &ldquo;support…&rdquo;): find the spec, or write one with <Cmd>om-auto-write-spec</Cmd>, then build it
              with <Cmd>om-auto-implement-spec</Cmd>. Chapters 5 and 6.
            </li>
            <li className="rounded-xl border bg-card p-3">
              <span className="font-semibold">Both at once?</span> It stops and asks you to split the issue. Unsure? It
              takes the bug road, whose first step stops cleanly if there is no bug.
            </li>
          </ol>
        </div>
      </section>

      <Story>
        <p>
          On Monday <PersonTag id="reviewer" /> starts the day with a sweep: <SkillChip name="om-review-prs" /> runs
          the full <Cmd>om-auto-review-pr</Cmd> on every unreviewed open PR, newest first, skipping drafts, his own
          PRs, blocked ones and anything another agent has claimed. And when nobody remembers what PR #14 still needs,{" "}
          <SkillChip name="om-pr-autopilot" /> with <Cmd>--dry-run</Cmd> diagnoses its real state (unfinished plan,
          missing review, red CI, conflicts, missing labels or QA evidence) and prints the chain of skills it would run,
          changing nothing.
        </p>
      </Story>

      <Callout title="When does an autonomous skill stop and ask?">

        It asks only in the gated cases: another actor already holds the claim (unless you pass <Cmd>--force</Cmd>,
        which posts an override comment), an assumption is marked <Cmd>⚠ NEEDS HUMAN CONFIRMATION</Cmd>, or, for{" "}
        <Cmd>om-auto-fix-issue</Cmd>, an issue mixes a bug and a feature. It stops cleanly, with its reason, when
        there is nothing to do (<Cmd>NO_ACTION_NEEDED</Cmd>) or a feature ticket is not ready (<Cmd>NOT_READY</Cmd>).
        Everything else it decides, documents, and leaves for you to correct.
      </Callout>
    </ChapterShell>
  );
}
