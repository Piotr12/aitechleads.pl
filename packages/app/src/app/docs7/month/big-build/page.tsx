import { CornerDownRight, Zap } from "lucide-react";
import { ChapterShell } from "../../_components/chapter";
import { cn } from "../../_components/cx";
import { Artefact, Callout, Cmd, Figure, LabelChip, PersonTag, SkillChip, Story } from "../../_components/marks";
import { meta } from "../../_data/links";

export const metadata = meta("Week 2: The plan is the save point");

const ROWS: { phase: number; step: string; title: string; exec: string; status: "done" | "todo"; commit: string; mark?: "crash" | "resume" }[] = [
  { phase: 1, step: "1.1", title: "Add bulk_reschedule table + migration", exec: "inline", status: "done", commit: "8c1d2e4" },
  { phase: 1, step: "1.2", title: "Repository methods with tests", exec: "dispatch", status: "done", commit: "2b7f90a" },
  { phase: 2, step: "2.1", title: "POST /deliveries/reschedule (validation)", exec: "dispatch", status: "done", commit: "41ce3d7" },
  { phase: 2, step: "2.2", title: "Customer notifications, one per delivery", exec: "dispatch:cheap", status: "done", commit: "9e05a1b" },
  { phase: 3, step: "3.1", title: "Dispatcher screen: select a day", exec: "group:A", status: "done", commit: "c3a8f62", mark: "crash" },
  { phase: 3, step: "3.2", title: "Dispatcher screen: confirm dialog", exec: "group:A", status: "todo", commit: "—", mark: "resume" },
  { phase: 3, step: "3.3", title: "Empty, error and no-permission states", exec: "group:A", status: "todo", commit: "—" },
];

export default function BigBuild() {
  return (
    <ChapterShell
      slug="big-build"
      know={[
        <>
          Every autonomous build commits its plan first and opens a draft PR at once, so even a crashed run leaves
          something to watch and resume.
        </>,
        <>
          Up to 20 steps (<Cmd>engine.loopStepThreshold</Cmd>) a run keeps a <strong>Progress</strong> checklist;
          above it, or with <Cmd>--loop</Cmd>, it becomes a loop run with a run folder: <Cmd>PLAN.md</Cmd>,{" "}
          <Cmd>HANDOFF.md</Cmd>, <Cmd>NOTIFY.md</Cmd>, checkpoints every ~5 steps.
        </>,
        <>
          <Cmd>om-auto-continue-pr</Cmd> resumes a plain run, <Cmd>om-auto-continue-pr-loop</Cmd> a loop run, each
          from the first step not yet done. A PR with no plan at all gets one reconstructed and is adopted.
        </>,
        <>
          The implementation ships on its own PR that references the spec PR; the spec PR stays design only.
        </>,
        <>A run that stops early leaves its PR a draft with Status: in-progress; a finished one flips it to ready.</>,
      ]}
    >
      <Story>
        <p>
          Kasia confirmed the risky assumption; the spec PR is approved. <PersonTag id="developer" /> runs{" "}
          <Cmd>/om-auto-implement-spec 2026-10-12-bulk-reschedule</Cmd>. <SkillChip name="om-auto-implement-spec" /> is
          deliberately thin: it finds the spec (by path, name, issue or spec-PR number, and stops with candidates if it
          cannot) and hands the build to the engine, <Cmd>om-auto-create-pr</Cmd>, which drafts a plan from the
          spec&apos;s implementation breakdown and counts its steps.
        </p>
        <p>
          Twenty-six. That is over the threshold of 20, so the engine hands the run to{" "}
          <SkillChip name="om-auto-create-pr-loop" /> before committing anything. The loop engine keeps a run folder,
          commits once per step, and at every checkpoint (about every five steps) runs integration tests and, for
          screens, takes screenshots.
        </p>
      </Story>

      <Figure
        title="Which engine runs the build"
        caption="Routing is mechanical: the step count of the drafted plan, or the --loop flag. Nothing else picks the loop."
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl border bg-card p-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">≤ 20 steps</p>
            <SkillChip name="om-auto-create-pr" />
            <p className="text-sm leading-6">
              One plan file, <Cmd>.ai/runs/&lt;date&gt;-&lt;slug&gt;.md</Cmd>, ending in a <strong>Progress</strong>{" "}
              checklist; commits per step or per phase.
            </p>
            <p className="text-sm">
              Resume with <SkillChip name="om-auto-continue-pr" />
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border-2 border-foreground bg-card p-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">&gt; 20 steps, or --loop · this run</p>
            <SkillChip name="om-auto-create-pr-loop" />
            <p className="text-sm leading-6">
              A run folder <Cmd>.ai/runs/&lt;date&gt;-&lt;slug&gt;/</Cmd> with <Cmd>PLAN.md</Cmd> (a Tasks table),{" "}
              <Cmd>HANDOFF.md</Cmd> and <Cmd>NOTIFY.md</Cmd>; one commit per step; checkpoints.
            </p>
            <p className="text-sm">
              Resume with <SkillChip name="om-auto-continue-pr-loop" />
            </p>
          </div>
        </div>
      </Figure>

      <Story>
        <p>
          On Wednesday evening, halfway through phase 3, the session dies (a laptop lid, as it happens). Nothing is
          lost that matters. The plan was the first commit; the PR has existed as a draft since then, carrying{" "}
          <Cmd>Status: in-progress</Cmd>; every finished step flipped its row to <Cmd>done</Cmd> with its commit.
          Thursday morning Bartek types <Cmd>/om-auto-continue-pr-loop 31</Cmd>, which claims the PR, reads{" "}
          <Cmd>HANDOFF.md</Cmd> for context and picks up at the first row that is not <Cmd>done</Cmd>.
        </p>
      </Story>

      <Figure
        title="PLAN.md on Thursday morning"
        caption="The top of PLAN.md. Status is only ever todo or done, so the resume point is never a matter of opinion."
      >
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                {["Phase", "Step", "Title", "Exec", "Status", "Commit", ""].map((h) => (
                  <th key={h} className="px-3 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono text-[12.5px]">
              {ROWS.map((r) => (
                <tr
                  key={r.step}
                  className={cn("border-b last:border-0", r.mark === "resume" && "bg-amber-500/10")}
                >
                  <td className="px-3 py-1.5">{r.phase}</td>
                  <td className="px-3 py-1.5">{r.step}</td>
                  <td className="px-3 py-1.5 font-sans">{r.title}</td>
                  <td className="px-3 py-1.5">{r.exec}</td>
                  <td className={cn("px-3 py-1.5", r.status === "done" ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground")}>
                    {r.status}
                  </td>
                  <td className="px-3 py-1.5">{r.commit}</td>
                  <td className="px-3 py-1.5 font-sans text-xs whitespace-nowrap">
                    {r.mark === "crash" && (
                      <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-400">
                        <Zap className="size-3.5" aria-hidden /> session died after this
                      </span>
                    )}
                    {r.mark === "resume" && (
                      <span className="inline-flex items-center gap-1 font-semibold">
                        <CornerDownRight className="size-3.5" aria-hidden /> resumes here
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Figure>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Artefact title="What the PR body carries meanwhile" where="body of PR #31">
          {`Tracking plan: .ai/runs/2026-10-14-bulk-reschedule/PLAN.md
Tracking run folder: .ai/runs/2026-10-14-bulk-reschedule/
Status: in-progress
Source doc: .ai/specs/2026-10-12-bulk-reschedule.md
Refs #29`}
        </Artefact>
        <div className="flex flex-col gap-2 rounded-xl border bg-card p-3 text-sm leading-6">
          <p className="font-semibold">Two PRs, on purpose</p>
          <p>
            <strong>#29</strong>, the spec PR: design only, <LabelChip name="documentation" />{" "}
            <LabelChip name="skip-qa" />.
          </p>
          <p>
            <strong>#31</strong>, the implementation PR: <Cmd>Refs #29</Cmd> plus a <Cmd>Source doc:</Cmd> line for
            the spec (and <Cmd>Closes #issue</Cmd> when an issue drives the run), with its own full label set: here{" "}
            <LabelChip name="needs-qa" /> and, because of the migration, <LabelChip name="risk-high" />.
          </p>
          <p className="text-muted-foreground">
            Implementation never lands on the spec PR&apos;s branch, and there is exactly one implementation PR per
            spec: a second run resumes it instead of opening another.
          </p>
        </div>
      </div>

      <Callout title="A PR that never had a plan">
        Someone opened PR #27 by hand and went on holiday. <SkillChip name="om-auto-continue-pr" /> can still finish
        it: with no plan to resume it <em>adopts</em> the PR, reconstructing the goal from the description, comments,
        review feedback, failing checks, linked issues and the code already there, committing that as a real plan,
        then executing it. <Cmd>--adopt ask</Cmd> stops for your confirmation first; it is the default whenever a person
        is in the loop.
      </Callout>
    </ChapterShell>
  );
}
