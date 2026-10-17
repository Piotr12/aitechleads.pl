import { Ban } from "lucide-react";
import { Frame } from "../../_components/frame";
import { Ext, Label, SkillChip } from "../../_components/marks";
import { UPSTREAM } from "../../_data/links";
import { meta } from "../../_data/meta";

export const metadata = meta("What do agents never do?");

const NEVER = [
  {
    title: "Grant QA approval on their own say-so",
    text: (
      <>
        Automated skills ask for QA with <Label tone="wait">needs-qa</Label>; a person grants{" "}
        <Label tone="good">qa-approved</Label>. The one exception is the documented self-QA sign-off on risk-low or
        risk-medium work, with evidence and <Label>qa-self-verified</Label>, and never on risk-high.
      </>
    ),
  },
  {
    title: "Merge without the merge step",
    text: (
      <>
        <SkillChip name="om-auto-fix-pr" /> and <SkillChip name="om-pr-autopilot" /> prepare a PR and hand it over;
        only <SkillChip name="om-approve-merge-pr" /> merges, after re-checking every gate.
      </>
    ),
  },
  {
    title: "Clear an emergency brake",
    text: (
      <>
        <Label tone="bad">blocked</Label> and <Label tone="bad">do-not-merge</Label> are set and cleared by people only.
      </>
    ),
  },
  {
    title: "Quietly change a decision someone owns",
    text: "A PR that breaks a recorded business rule, non-goal or decision is a blocker in review, until the owner approves a superseding entry.",
  },
  {
    title: "Fake a green build",
    text: "CI fixes come with real fixes and tests. Weakening a test or switching off a check to get green is out.",
  },
  {
    title: "Collide with each other",
    text: "Before touching an issue or PR an agent claims it (assignee, in-progress label, comment). Any agent that finds a claim backs off.",
  },
  {
    title: "Count invented users as evidence",
    text: (
      <>
        <SkillChip name="om-synthetic-users" /> output is tagged [SYNTHETIC]: a hypothesis to check with real users,
        never proof.
      </>
    ),
  },
];

export default function AgentsNever() {
  return (
    <Frame
      href="/docs5/ask/agents-never"
      kicker="❓ Question 6 of 6"
      title="What do agents never do?"
      lead={<p>The guard rails, so you know which moments are always yours.</p>}
    >
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {NEVER.map((n) => (
          <li key={n.title} className="flex min-w-0 gap-3 rounded-xl border bg-card p-4">
            <Ban className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
            <div className="flex min-w-0 flex-col gap-1">
              <p className="font-semibold">{n.title}</p>
              <div className="text-sm leading-7 text-muted-foreground">{n.text}</div>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        Sources: <Ext href={UPSTREAM.sdlcSection.automation}>SDLC.md, the automation contract</Ext>,{" "}
        <Ext href={UPSTREAM.sdlcSection.claim}>the claim protocol</Ext>,{" "}
        <Ext href={UPSTREAM.sdlcSection.decisions}>protected decisions</Ext>, and the{" "}
        <Ext href={UPSTREAM.roles.releaseManager}>release manager guide</Ext>.
      </p>
    </Frame>
  );
}
