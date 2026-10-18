import { ArrowRight } from "lucide-react";
import { ChapterShell } from "../../_components/chapter";
import { cn } from "../../_components/cx";
import { Callout, Cmd, DecisionMark, Figure, LabelChip, PersonTag, SkillChip, Story } from "../../_components/marks";
import { meta } from "../../_data/links";

export const metadata = meta("Week 3, Friday: Merging is its own step");

type Card = { pr: string; title: string; why: React.ReactNode; then: React.ReactNode };

const BUCKETS: { name: string; tone: string; cards: Card[] }[] = [
  {
    name: "Ready to merge",
    tone: "border-emerald-600/50",
    cards: [
      {
        pr: "#14",
        title: "fix(eta): keep the departure timezone",
        why: <>approved, green, <LabelChip name="qa-approved" /> for the current head</>,
        then: <><SkillChip name="om-approve-merge-pr" /> <Cmd>14</Cmd></>,
      },
      {
        pr: "#16",
        title: "docs: dispatcher FAQ",
        why: <>approved, green, <LabelChip name="skip-qa" /></>,
        then: <><SkillChip name="om-approve-merge-pr" /> <Cmd>16</Cmd></>,
      },
    ],
  },
  {
    name: "Almost ready",
    tone: "border-amber-500/60",
    cards: [
      {
        pr: "#30",
        title: "chore: bump the date library",
        why: <>only CI still pending (at the merge, pending genuinely blocks)</>,
        then: <>wait, or ask <Cmd>om-approve-merge-pr</Cmd> to merge once checks pass</>,
      },
      {
        pr: "#36",
        title: "fix: depot names in the header",
        why: <>QA evidence older than head (tested <Cmd>a41f0c2</Cmd>, head <Cmd>d07b9e5</Cmd>)</>,
        then: <>Zofia re-tests, or confirms the new commit is out of scope</>,
      },
    ],
  },
  {
    name: "Blocked",
    tone: "border-rose-600/50",
    cards: [
      {
        pr: "#29",
        title: "fix: depot list sorting",
        why: <>merge conflict with the base branch</>,
        then: <><SkillChip name="om-auto-fix-pr" /> <Cmd>29</Cmd>, then back here</>,
      },
      {
        pr: "#33",
        title: "feat: charge per delivery",
        why: <><LabelChip name="blocked" /> (set by Kasia)</>,
        then: <>a person clears it; no skill will</>,
      },
      {
        pr: "#35",
        title: "feat: driver photos",
        why: <><LabelChip name="needs-qa" /> without <LabelChip name="qa-approved" /></>,
        then: <>QA first (chapter 8)</>,
      },
    ],
  },
];

export default function MergeDay() {
  return (
    <ChapterShell
      slug="merge-day"
      know={[
        <>
          <Cmd>om-merge-buddy</Cmd> only reads: it sorts open PRs into ready, almost ready and blocked, and names each
          blocker.
        </>,
        <>
          <Cmd>om-approve-merge-pr</Cmd> re-checks every gate itself, then approves and squash-merges. It refuses on{" "}
          <LabelChip name="qa-failed" />, <LabelChip name="do-not-merge" />, <LabelChip name="blocked" />, an active{" "}
          <LabelChip name="qa" />, or <LabelChip name="needs-qa" /> without <LabelChip name="qa-approved" />.
        </>,
        <>
          Fixable blockers route to <Cmd>om-auto-fix-pr</Cmd> (or its <Cmd>--ci-only</Cmd> mode); human blocks and the
          QA gate never route to automation.
        </>,
        <>
          Agents prepare merges but do not perform them: <Cmd>om-auto-fix-pr</Cmd> never merges, and{" "}
          <Cmd>om-pr-autopilot</Cmd> only with <Cmd>--allow-merge</Cmd>.
        </>,
        <>Merging is the one place pending CI genuinely blocks; everywhere else, reports go out without waiting.</>,
      ]}
    >
      <Story>
        <p>
          Friday afternoon is merge time. <PersonTag id="maintainer" /> does not open six PRs and squint at their
          checks. She runs <SkillChip name="om-merge-buddy" />, which looks at every open PR&apos;s labels, reviews, CI
          and mergeability, touches nothing, and answers one question: what can merge right now?
        </p>
      </Story>

      <Figure
        title="Merge buddy's answer"
        caption="Three buckets, every blocker named once. Drafts and PRs an agent is still working on are left out. The last line of each card is what Ola does next."
      >
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {BUCKETS.map((b) => (
            <section key={b.name} className={cn("flex min-w-0 flex-col gap-2 rounded-xl border-2 bg-muted/20 p-3", b.tone)}>
              <h3 className="font-semibold">{b.name}</h3>
              <ul className="flex flex-col gap-2">
                {b.cards.map((c) => (
                  <li key={c.pr} className="flex min-w-0 flex-col gap-1.5 rounded-lg border bg-card p-2.5 text-sm">
                    <p className="font-medium break-words">
                      <span className="text-muted-foreground">{c.pr}</span> {c.title}
                    </p>
                    <p className="text-xs leading-5 text-muted-foreground">{c.why}</p>
                    <p className="border-t pt-1.5 text-xs leading-6">
                      <ArrowRight className="mr-1 inline size-3.5 align-[-2px]" aria-hidden />
                      <span className="font-medium">Then: </span>
                      {c.then}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Figure>

      <Story>
        <p>
          For #14 she runs <SkillChip name="om-approve-merge-pr" /> <Cmd>14</Cmd>. It does not trust the buddy&apos;s
          report: it fetches the PR again, checks every label block, checks that the <Cmd>QA head:</Cmd> line matches
          the current head, submits an approving review and squash-merges. Asked to merge #35, it would refuse and
          explain the three ways to satisfy the QA gate: a QA reviewer, the self-QA exception (not on risk-high), or{" "}
          <LabelChip name="skip-qa" /> if the change truly has no user-facing part.
        </p>
        <p>
          #29 has a conflict, which is fixable, so the merge skill offers <SkillChip name="om-auto-fix-pr" />: base
          merged in first, then the review&apos;s autofix, then CI, then UI QA, up to three rounds, and back to the
          merge skill when green. For PR #37, which nobody quite remembers, she reaches for{" "}
          <SkillChip name="om-pr-autopilot" /> <Cmd>37</Cmd>: it works out what is actually missing and runs the matching
          skills in order, stopping at merge-ready.
        </p>
      </Story>

      <section className="flex flex-col gap-3 rounded-xl border-2 border-rose-600/30 bg-rose-600/5 p-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <DecisionMark /> The merge is a person&apos;s act
        </h2>
        <p className="text-sm leading-6">
          <Cmd>om-approve-merge-pr</Cmd> is interactive: someone asks for that PR to be merged. The autonomous drivers
          stop at merge-ready and hand over; <Cmd>om-pr-autopilot</Cmd> ends in a merge only when you pass{" "}
          <Cmd>--allow-merge</Cmd> and the QA gate is satisfied. Branch protection is never bypassed unless someone
          explicitly asks for an admin override.
        </p>
      </section>

      <Callout title="Red CI at the merge?">
        Failing required checks route to <Cmd>om-auto-fix-pr &lt;PR&gt; --ci-only</Cmd>, which only stabilises CI;
        conflicts, unresolved review feedback or several problems at once go to the full <Cmd>om-auto-fix-pr</Cmd>{" "}
        loop. A local validation run is never accepted in place of required checks.
      </Callout>
    </ChapterShell>
  );
}
