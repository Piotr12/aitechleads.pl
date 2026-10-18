import { ChapterShell } from "../../_components/chapter";
import { Artefact, Callout, Cmd, Ext, Figure, LabelChip, PersonTag, SkillChip, Story } from "../../_components/marks";
import { StateMachine } from "../../_components/state-machine";
import { meta, UP } from "../../_data/links";

export const metadata = meta("Day 2: Labels say where a PR stands");

const SET: { label: string; slot: string; why: string }[] = [
  { label: "review", slot: "Pipeline (exactly one)", why: "Where the PR stands. Every new ready PR starts here." },
  { label: "bug", slot: "Category", why: "What kind of change: bug, feature, refactor, security, dependencies, documentation." },
  { label: "needs-qa", slot: "QA signal", why: "A user will see this change, so a person must test it (skip-qa is the opposite)." },
  { label: "priority-medium", slot: "Priority (exactly one)", why: "How urgent. An ordinary bug fix." },
  { label: "risk-medium", slot: "Risk (exactly one)", why: "How dangerous to ship. One area, with tests." },
];

export default function FirstReview() {
  return (
    <ChapterShell
      slug="first-review"
      know={[
        <>
          A PR carries exactly one <strong>pipeline</strong> label: <LabelChip name="review" />,{" "}
          <LabelChip name="changes-requested" />, <LabelChip name="merge-queue" /> (and four more you meet later).
          Review is what moves it.
        </>,
        <>
          It also carries a category, a QA signal, exactly one priority (how urgent) and exactly one risk (how
          dangerous), each explained in one label-rationale comment.
        </>,
        <>
          The verdict is mechanical: any blocker, or any major without a written waiver, means changes requested; only
          minors and nits means approve.
        </>,
        <>
          <Cmd>om-auto-review-pr</Cmd> fixes its findings itself only on the automation&apos;s own PRs, or when you
          pass <Cmd>--autofix</Cmd>; anyone else&apos;s PR gets a review and a hand-back.
        </>,
        <>
          <LabelChip name="merge-queue" /> means approved, not &ldquo;may merge&rdquo;: a <LabelChip name="needs-qa" />{" "}
          PR still waits there for QA.
        </>,
      ]}
    >
      <Story>
        <p>
          Wednesday. PR #14 sits in the tracker with five labels. <PersonTag id="reviewer" /> asks what they mean, and
          the answer is the most useful thing a newcomer can learn in the first week: the labels are the PR&apos;s
          position on the board, and the skills move them by fixed rules.
        </p>
      </Story>

      <Figure
        title="One PR, five kinds of label"
        caption="The full set every PR-producing skill applies. Priority and risk are separate on purpose: a one-line outage fix can be priority-extreme and risk-low."
      >
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 sm:p-4">
          <p className="font-medium break-words">
            fix(eta): keep the departure timezone when formatting ETAs <span className="text-muted-foreground">#14</span>
          </p>
          <ul className="flex flex-col gap-2">
            {SET.map((s) => (
              <li key={s.label} className="grid grid-cols-1 gap-1 border-t pt-2 sm:grid-cols-[10rem_11rem_1fr] sm:items-baseline sm:gap-3">
                <span>
                  <LabelChip name={s.label} />
                </span>
                <span className="text-xs font-semibold text-muted-foreground uppercase">{s.slot}</span>
                <span className="text-sm text-muted-foreground">{s.why}</span>
              </li>
            ))}
          </ul>
        </div>
      </Figure>

      <Story>
        <p>
          Tomek runs <SkillChip name="om-auto-review-pr" /> <Cmd>14</Cmd>. It claims the PR, checks it out in an
          isolated worktree (his own checkout stays untouched) and runs <SkillChip name="om-code-review" />: the
          validation gate, the built-in checklist, the team&apos;s <Cmd>CODE_REVIEW.md</Cmd> and{" "}
          <Cmd>BACKWARD_COMPATIBILITY.md</Cmd>. Findings come ranked <em>blocker, major, minor, nit</em>.
        </p>
        <p>
          There is one major: no test for a departure at exactly midnight. One major is enough. The skill requests
          changes, swaps <LabelChip name="review" /> for <LabelChip name="changes-requested" />, assigns the PR back
          to Bartek with a hand-off comment, and does not touch his branch: the PR is not the automation&apos;s own,
          and Tomek did not pass <Cmd>--autofix</Cmd>. It posts all this while CI is still running, and says so in the
          review rather than waiting.
        </p>
        <p>
          Bartek adds the test and pushes. Tomek runs the same command again; it notices the new commits, re-checks the
          earlier findings, approves, and moves the PR to <LabelChip name="merge-queue" />. Because the PR carries{" "}
          <LabelChip name="needs-qa" />, it also leaves step-by-step manual QA instructions for whoever tests it.
        </p>
      </Story>

      <Figure
        title="The label state machine, first half"
        caption={
          <>
            Review moves a PR between three states. The faint half is QA, in chapter 8. From{" "}
            <Ext href={UP.sdlcAt.labels}>SDLC.md, Label state machine</Ext>.
          </>
        }
      >
        <StateMachine focus="review" />
      </Figure>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Artefact title="The one label-rationale comment" where="comment on PR #14">
          {`🤖 \`om-open-pr\` — 🏷️ label rationale

- 🔍 \`review\` — ready for code review.
- 🐛 \`bug\` — It corrects a wrong ETA date, existing behaviour.
- 🧪 \`needs-qa\` — Dispatchers see the ETA, so a person should test it.
- 🔹 \`priority-medium\` — An ordinary bug fix, no outage.
- 🟡 \`risk-medium\` — One module changes, with regression tests.`}
        </Artefact>
        <Artefact title="The verdict, in the review body" where="review on PR #14">
          {`🔍 Changes requested
Major: no test covers a departure at 00:00 local time.
CI: 2 checks still running; this review covers the code,
not a green run. A CI result comment will follow.`}
        </Artefact>
      </div>

      <Callout title="Who may review?">
        <p>
          SDLC.md lets the Reviewer be a person or <Cmd>om-auto-review-pr</Cmd>; the <Cmd>om-code-review</Cmd>{" "}
          checklist applies either way. A spec-only PR gets a different review altogether (chapter 5).
        </p>
      </Callout>
    </ChapterShell>
  );
}
