import { ArrowDown } from "lucide-react";
import { ChapterShell } from "../../_components/chapter";
import { Artefact, Callout, Cmd, DecisionMark, Ext, Figure, LabelChip, PersonTag, SkillChip, Story } from "../../_components/marks";
import { StateMachine } from "../../_components/state-machine";
import { meta, UP } from "../../_data/links";

export const metadata = meta("Week 3: QA finds its rhythm");

const STATES = ["default", "empty", "loading", "error", "no permission", "long content", "narrow viewport"];

const TOOLS: { skill: string; job: string }[] = [
  { skill: "om-prepare-test-env", job: "Boot the app once; every other QA skill reuses it." },
  { skill: "om-auto-qa-pr", job: "Walk the change in a browser; post screenshots and a pass/fail report. Labels untouched by default." },
  { skill: "om-qa-buddy", job: "A guided manual session: plan, clickable runbook, one file per bug. Never touches the tracker." },
  { skill: "om-integration-tests", job: "Turn a flow worth keeping into E2E tests, with the repo's own runner." },
  { skill: "om-ux-review-pr", job: "Judge the design against .uxproof/: findings by user impact. Advisory; never holds the merge." },
];

export default function Qa() {
  return (
    <ChapterShell
      slug="qa"
      know={[
        <>
          With the QA gate on, a <LabelChip name="needs-qa" /> PR cannot merge without <LabelChip name="qa-approved" />,
          however green everything else is. <LabelChip name="skip-qa" /> is the explicit opt-out for changes no user
          sees.
        </>,
        <>
          Agents request QA and gather evidence; a QA reviewer grants it. The only exception, self-QA, is limited to{" "}
          <LabelChip name="risk-low" /> and <LabelChip name="risk-medium" />, needs written evidence, and adds{" "}
          <LabelChip name="qa-self-verified" /> so it can be audited.
        </>,
        <>
          <LabelChip name="qa-approved" /> is pinned to a commit by a <Cmd>QA head: &lt;sha&gt;</Cmd> line; any later
          push makes it stale until someone re-tests or reconfirms the scope.
        </>,
        <>QA of a screen checks the whole state matrix: a missing empty or error state fails QA.</>,
        <>
          <Cmd>om-auto-qa-pr</Cmd> captures evidence, <Cmd>om-ux-review-pr</Cmd> judges design (advisory),{" "}
          <Cmd>om-qa-buddy</Cmd> guides a person, <Cmd>om-integration-tests</Cmd> keeps a flow tested for good.
        </>,
      ]}
    >
      <Story>
        <p>
          Week three. PR #14, the ETA fix, has sat in <LabelChip name="merge-queue" /> since Wednesday with{" "}
          <LabelChip name="needs-qa" />, and that is correct: approval is routing, not proof. <PersonTag id="qa" />{" "}
          starts her session the way the QA guide suggests, by booting the app once with{" "}
          <SkillChip name="om-prepare-test-env" />; every QA skill after that reuses the same instance.
        </p>
        <p>
          <Cmd>/om-auto-qa-pr 14</Cmd> walks the changed screen in a real browser and posts screenshots and a pass/fail
          report on the PR. It changes no labels: evidence is not a verdict. Zofia moves the PR to{" "}
          <LabelChip name="qa" /> (the label that says &ldquo;a tester is on it, do not merge&rdquo;), runs{" "}
          <Cmd>/om-qa-buddy 14</Cmd> for a clickable runbook, and works through the cases herself, including the states
          a happy-path demo never shows.
        </p>
      </Story>

      <Figure
        title="The state matrix every screen is tested against"
        caption={
          <>
            From the QA gate in <Ext href={UP.sdlcAt.qaGate}>SDLC.md</Ext>. Conformance to the design contract in{" "}
            <Cmd>.uxproof/</Cmd>, when the repo has one, is part of the pass too.
          </>
        }
      >
        <ul className="flex flex-wrap gap-2">
          {STATES.map((s) => (
            <li key={s} className="rounded-lg border bg-card px-3 py-1.5 text-sm">
              {s}
            </li>
          ))}
        </ul>
      </Figure>

      <Figure
        title="The QA gate, as a path"
        caption="The only two routes to a mergeable needs-qa PR. On a risk-high PR only the left one is open, unless a maintainer states an exception on the PR."
      >
        <div className="flex flex-col items-stretch gap-2">
          <div className="rounded-xl border bg-card p-3 text-sm leading-6">
            <span className="font-semibold">Does a user see this change?</span> No (docs, dependencies, CI, tests only):{" "}
            <LabelChip name="skip-qa" />, and the gate does not apply. Yes: <LabelChip name="needs-qa" />. Agents set it;
            only the two routes below satisfy it.
          </div>
          <ArrowDown className="mx-auto size-5 text-muted-foreground" aria-hidden />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="flex flex-col gap-2 rounded-xl border-2 border-emerald-600/50 bg-card p-3 text-sm leading-6">
              <p className="flex items-center gap-1.5 font-semibold">
                <DecisionMark /> A QA reviewer tests it
              </p>
              <p>
                Sets <LabelChip name="qa" /> while testing. Pass: back to <LabelChip name="merge-queue" /> with{" "}
                <LabelChip name="qa-approved" /> and a comment carrying <Cmd>QA head: &lt;sha&gt;</Cmd>. Fail:{" "}
                <LabelChip name="qa-failed" />, a hard block.
              </p>
              <p className="text-xs text-muted-foreground">Always allowed. Required on risk-high.</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl border bg-card p-3 text-sm leading-6">
              <p className="flex items-center gap-1.5 font-semibold">
                <DecisionMark /> Self-QA, the audited exception
              </p>
              <p>
                When no QA reviewer has capacity in time: any engineer, or <Cmd>om-auto-qa-pr --self-qa-signoff</Cmd> on
                a fully green run with screenshots, attaches the evidence and applies <LabelChip name="qa-approved" /> +{" "}
                <LabelChip name="qa-self-verified" />.
              </p>
              <p className="text-xs text-muted-foreground">
                Only <span className="font-mono">risk-low</span> or <span className="font-mono">risk-medium</span>. On a
                risk-high PR the skill posts the evidence and withholds the sign-off.
              </p>
            </div>
          </div>
          <ArrowDown className="mx-auto size-5 text-muted-foreground" aria-hidden />
          <div className="rounded-xl border bg-card p-3 text-sm leading-6">
            <span className="font-semibold">Pushed again after QA?</span> The label stays but goes stale: the merge
            tools see the head no longer matches <Cmd>QA head:</Cmd>, report &ldquo;QA evidence older than head&rdquo;,
            and ask before merging. The way back: re-test, or a QA reviewer states the new commits do not touch the
            tested scope, with a fresh <Cmd>QA head:</Cmd> line.
          </div>
        </div>
      </Figure>

      <Artefact title="Zofia's sign-off" where="comment on PR #14">
        {`✅ QA passed on staging (Chrome 129, demo co-op data).
Scenario: departures at 23:58, 00:00 and 00:07 local time; ETA
shows today's date in all three. Negative: departure with no
timezone set shows the depot's zone, with a warning. States:
default, empty day, loading, error, narrow viewport checked.

QA head: 3f9c2e1`}
      </Artefact>

      <Figure
        title="The label state machine, second half"
        caption="Only a QA reviewer moves a PR into qa. Automated skills ask for QA with needs-qa; they never set qa."
      >
        <StateMachine focus="qa" />
      </Figure>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">The QA toolbox</h2>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {TOOLS.map((t) => (
            <li key={t.skill} className="flex min-w-0 flex-col gap-1.5 rounded-xl border bg-card p-3">
              <SkillChip name={t.skill} />
              <p className="text-sm leading-6 text-muted-foreground">{t.job}</p>
            </li>
          ))}
        </ul>
      </section>

      <Callout title="Designers in QA week">
        <PersonTag id="designer" /> runs <Cmd>/om-ux-review-pr 14</Cmd> on the same PR. It walks the screens as a
        user would, and each finding carries evidence, a pattern (ideally an existing screen that already gets it
        right), a trade-off and a &ldquo;done when&rdquo;. It informs the review; it does not hold the merge.
      </Callout>
    </ChapterShell>
  );
}
