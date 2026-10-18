import { Frame } from "../../_components/frame";
import { cn } from "../../_components/cx";
import { Callout, Cmd, DECIDE, H2, SkillChip, Source } from "../../_components/marks";
import { Md } from "../../_components/md";
import { meta } from "../../_data/nav";

export const metadata = meta("A PR that stalled halfway");

const ROWS: { state: string; skills: string[]; note: string; stop?: boolean }[] = [
  { state: "A hard block: `do-not-merge`, `blocked`, or `qa-failed`", skills: [], note: "Stops and reports, unless you explicitly said to work through it.", stop: true },
  { state: "A plan exists with unchecked steps", skills: ["om-auto-continue-pr"], note: "Finishes the implementation first (`om-auto-continue-pr-loop` for a run folder). Reviewing unfinished code wastes a cycle." },
  { state: "Conflicts, or behind the base branch", skills: ["om-auto-fix-pr"], note: "Merges the base in first, so review and CI judge the diff that will actually merge." },
  { state: "No review yet, changes requested, or open conversations", skills: ["om-auto-fix-pr"], note: "Review, autofix, CI and UI checks in one loop. On someone else's PR: review and hand back only." },
  { state: "Only CI is red", skills: ["om-auto-fix-pr"], note: "With `--ci-only`: fix real failures with tests. Never by weakening a test or disabling a check." },
  { state: "Users will see it, and there is no QA evidence", skills: ["om-auto-qa-pr"], note: "Screenshots and a pass/fail report." },
  { state: "Nits left unfixed on purpose", skills: ["om-followup-issue-from-pr"], note: "Each becomes a tracked follow-up issue, not a blocker." },
  { state: "Approvable, green, QA satisfied", skills: ["om-approve-merge-pr"], note: "Default: stop at merge-ready and report. Only with `--allow-merge` does it go on to merge." },
  { state: "Merge-ready but the QA gate is unmet", skills: [], note: "Stops and asks for QA sign-off. Never applies the approval itself without real self-QA evidence.", stop: true },
];

export default function StalledPage() {
  return (
    <Frame
      href="/docs6/onramps/stalled"
      title="A PR that stalled halfway"
      idea="A half-finished PR does not need its history explained: one skill reads its real state from the tracker and runs the right skills in the right order."
      lead={
        <p>
          A crashed run, a colleague’s PR you inherited, one opened by hand outside the pipeline. You could pick the
          right skill yourself; <code className="font-mono">om-pr-autopilot</code> does the diagnosis for you. Use{" "}
          <code className="font-mono">--dry-run</code> first to see the plan without changing anything.
        </p>
      }
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Cmd who="Look first (changes nothing)">/om-pr-autopilot 421 --dry-run</Cmd>
        <Cmd who="Then drive it">/om-pr-autopilot 421</Cmd>
      </div>

      <section className="flex flex-col gap-3">
        <H2>What it finds, and what it runs</H2>
        <p className="text-sm text-muted-foreground">
          It reads ten signals (plan progress, diff, review decision, conversations, CI, mergeability, labels, QA
          evidence, claim, identity), matches them against this table top to bottom, runs every matching row in order,
          and re-reads the cheap signals between steps.
        </p>
        <ol className="flex flex-col gap-2">
          {ROWS.map((r, i) => (
            <li
              key={r.state}
              className={cn(
                "grid grid-cols-1 gap-2 rounded-xl border p-3 text-sm md:grid-cols-[1.2fr_auto_1.4fr] md:items-center md:gap-4",
                r.stop ? DECIDE : "bg-card",
              )}
            >
              <span className="flex min-w-0 gap-2">
                <span className="font-semibold text-muted-foreground tabular-nums">{i + 1}</span>
                <span className="min-w-0">
                  <Md text={r.state} />
                </span>
              </span>
              <span className="flex flex-wrap gap-1">
                {r.skills.length > 0 ? r.skills.map((s) => <SkillChip key={s} name={s} />) : <span className="text-xs font-semibold">stop</span>}
              </span>
              <span className="min-w-0 text-muted-foreground">
                <Md text={r.note} />
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Callout title="A PR with no plan gets adopted">
          <p>
            <code className="font-mono">om-auto-continue-pr</code> on a PR that never had an execution plan reconstructs
            the goal from its description, comments, review feedback, linked issues and diff, lands that as a real plan,
            and carries on. With a person in the loop it stops after writing the plan, for you to confirm.
          </p>
        </Callout>
        <Callout title="Dispatch only">
          <p>
            The autopilot fixes nothing itself: every review, fix, CI repair, screenshot and merge is done by the skill it
            dispatches. It holds one outer claim on the PR for the whole run, and the skills it calls re-enter that claim.
          </p>
        </Callout>
      </section>

      <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        Checked against: <Source path="skills/om-pr-autopilot/SKILL.md" /> <Source path="skills/om-pr-autopilot/references/state-matrix.md" />{" "}
        <Source path="skills/om-auto-continue-pr/SKILL.md" /> <Source path="skills/om-auto-fix-pr/SKILL.md" />
      </p>
    </Frame>
  );
}
