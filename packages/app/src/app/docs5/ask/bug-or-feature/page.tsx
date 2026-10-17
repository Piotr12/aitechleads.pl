import { Frame } from "../../_components/frame";
import { Down, Step } from "../../_components/flow";
import { Ext, GateFlag, SkillChip } from "../../_components/marks";
import { UPSTREAM } from "../../_data/links";
import { meta } from "../../_data/meta";

export const metadata = meta("Bug or feature: which way does it go?");

export default function BugOrFeature() {
  return (
    <Frame
      href="/docs5/ask/bug-or-feature"
      kicker="❓ Question 4 of 6"
      title="Bug or feature: which way does it go?"
      lead={
        <p>
          You hand <code className="font-mono text-foreground">om-auto-fix-issue</code> an issue number. It reads the
          issue, decides what kind it is, and takes one of two tracks. Both tracks end in the same review.
        </p>
      }
    >
      <div className="flex flex-col">
        <Step tone="start" title={<code className="font-mono">/om-auto-fix-issue 123</code>}>
          Before it changes anything it claims the issue (assignee, in-progress label, a comment), so a second agent backs off.
        </Step>
        <Down />
        <Step tone="decision" title="Is it a bug, or a feature request?" />

        <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex min-w-0 flex-col">
            <p className="mb-2 text-sm font-semibold">🐛 Bug track</p>
            <Step title={<SkillChip name="om-verify-in-repo" />}>
              Is it real, and still broken on main? If not, the chain stops cleanly with nothing to do.
            </Step>
            <Down />
            <Step title={<SkillChip name="om-root-cause" />}>Finds the cause and the smallest place to change. Read-only.</Step>
            <Down />
            <Step title={<SkillChip name="om-fix" />}>Makes the change, adds a regression test, runs the checks.</Step>
            <Down />
            <Step title={<SkillChip name="om-open-pr" />}>Opens a labelled PR.</Step>
          </div>

          <div className="flex min-w-0 flex-col">
            <p className="mb-2 text-sm font-semibold">✨ Feature track</p>
            <Step tone="gate" title={<span className="flex flex-wrap items-center gap-2">Is the ticket Ready? <GateFlag id="G3" /></span>}>
              If it lacks who, what result, or what is out of scope, it stops and names the gaps on the issue, instead
              of guessing.
            </Step>
            <Down />
            <Step tone="decision" title="Is there a spec already?">
              A spec is the written design of the feature, before code.
            </Step>
            <Down label="no spec" />
            <Step title={<SkillChip name="om-auto-write-spec" />}>
              Writes one, with mockups and an assumptions comment people can correct.
            </Step>
            <Down label="spec ready (or there was one already)" />
            <Step title={<SkillChip name="om-auto-implement-spec" />}>Builds it on the same PR, with screenshots.</Step>
          </div>
        </div>

        <Down label="both tracks meet here" />
        <Step title={<SkillChip name="om-auto-review-pr" />}>
          Review, fixes, review again until approved. Then QA and merge, the same for everyone.
        </Step>
      </div>

      <section aria-labelledby="other" className="flex flex-col gap-2 rounded-xl border bg-card p-4">
        <h2 id="other" className="font-semibold">
          No issue at all?
        </h2>
        <p className="text-sm leading-7 text-muted-foreground">
          Hand a one-sentence task to <SkillChip name="om-auto-create-pr" />: it plans, builds, checks and opens the PR
          itself, and joins the same review. A vague idea goes to <SkillChip name="om-brainstorm" /> first.
        </p>
      </section>

      <p className="text-xs text-muted-foreground">
        Source: <Ext href={UPSTREAM.readme}>README, “The pipeline”</Ext> and{" "}
        <Ext href={UPSTREAM.sdlcSection.ready}>SDLC.md, Definition of Ready</Ext>
      </p>
    </Frame>
  );
}
