import { Frame } from "../../_components/frame";
import { Down, LoopBack, Step } from "../../_components/flow";
import { Ext, Label, RoleChip, SkillChip } from "../../_components/marks";
import { UPSTREAM } from "../../_data/links";
import { meta } from "../../_data/meta";

export const metadata = meta("I opened a PR. Now what?");

export default function AfterThePr() {
  return (
    <Frame
      href="/docs5/ask/after-the-pr"
      kicker="❓ Question 3 of 6"
      title="I opened a PR. Now what?"
      lead={
        <p>
          A PR wears exactly one “where am I” label at a time. Follow the labels and you know where it is, what it is
          waiting for, and whose move it is.
        </p>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col">
          <Step tone="start" title={<Label>review</Label>}>
            The PR is open, ready and waiting for a reviewer. <RoleChip role="architect" /> or{" "}
            <SkillChip name="om-auto-review-pr" /> reads it.
          </Step>
          <Down label="the reviewer asks for changes" />
          <Step title={<Label tone="wait">changes-requested</Label>}>
            Your move: <RoleChip role="developer" /> answers the comments, or <SkillChip name="om-auto-continue-pr" />{" "}
            makes the agreed fixes.
          </Step>
          <LoopBack>after the fixes it goes back to review, as many rounds as it takes</LoopBack>
          <Down label="the reviewer approves" />
          <Step title={<Label>merge-queue</Label>}>
            Approved, waiting to merge. If it also carries <Label tone="wait">needs-qa</Label>, it waits here for a
            tester, however green the checks are.
          </Step>
          <Down label="a tester picks it up (only a person sets this label)" />
          <Step tone="gate" title={<Label>qa</Label>}>
            <RoleChip role="qa" /> is testing it right now. Nobody merges under an active tester.
          </Step>
          <Down label="pass" />
          <Step tone="gate" title={<span className="flex flex-wrap gap-1"><Label>merge-queue</Label> + <Label tone="good">qa-approved</Label></span>}>
            The QA gate is open. The approval is pinned to the commit that was tested; a later push makes it stale.
          </Step>
          <LoopBack>
            fail: <Label tone="bad">qa-failed</Label> sends it back to the developer
          </LoopBack>
          <Down label="the maintainer signs" />
          <Step tone="end" title="Merged into main">
            <RoleChip role="maintainer" /> runs <SkillChip name="om-approve-merge-pr" />, which re-checks every gate
            and squash-merges.
          </Step>
        </div>

        <aside className="flex min-w-0 flex-col gap-3 self-start">
          <div className="flex flex-col gap-2 rounded-xl border border-destructive/50 bg-destructive/5 p-4 text-sm">
            <p className="font-semibold">Emergency brakes</p>
            <p className="leading-7 text-muted-foreground">
              <Label tone="bad">blocked</Label> and <Label tone="bad">do-not-merge</Label> stop the PR wherever it
              is. Only people set and clear them.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border bg-card p-4 text-sm">
            <p className="font-semibold">The other labels are extras</p>
            <p className="text-muted-foreground">
              Besides the one “where” label, a PR carries any number of extras: the kind of change (bug, feature…), a
              priority (how urgent), a risk (how dangerous to ship), and QA signals like{" "}
              <Label tone="wait">needs-qa</Label> or <Label>skip-qa</Label>.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border bg-card p-4 text-sm">
            <p className="font-semibold">Stuck somewhere?</p>
            <p className="text-muted-foreground">
              <SkillChip name="om-pr-autopilot" /> works out which of these boxes a PR is really in and runs the skills
              that move it on. It never merges unless you pass <code className="font-mono">--allow-merge</code>.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Source: <Ext href={UPSTREAM.sdlcSection.labels}>SDLC.md, label state machine</Ext>
          </p>
        </aside>
      </div>
    </Frame>
  );
}
