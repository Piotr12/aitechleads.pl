import { ArrowDown, ArrowRight, Lock, LockOpen } from "lucide-react";
import { ChapterShell } from "../../_components/chapter";
import { cn } from "../../_components/cx";
import { Artefact, Callout, Cmd, Figure, LabelChip, PersonTag, SkillChip, Story } from "../../_components/marks";
import { meta } from "../../_data/links";

export const metadata = meta("Day 1: The first bug, by hand");

type Leg = {
  skill: string;
  cmd: string;
  job: string;
  touches: string;
  handsOn: string;
  claim: "none" | "takes" | "releases";
};

const RELAY: Leg[] = [
  {
    skill: "om-verify-in-repo",
    cmd: "/om-verify-in-repo 12",
    job: "Is this a real, still-unfixed bug? Not closed, not claimed, not already covered by a PR?",
    touches: "Reads only. Claims nothing.",
    handsOn: "A one-paragraph go-ahead, or NO_ACTION_NEEDED with its evidence (and the chain stops).",
    claim: "none",
  },
  {
    skill: "om-root-cause",
    cmd: "/om-root-cause 12",
    job: "Where exactly is it, and what is the smallest change that fixes it?",
    touches: "Reads only.",
    handsOn: "A brief: Summary, Root cause, Files to change, Approach, Risks. Ends with LOW_CONFIDENCE when unsure.",
    claim: "none",
  },
  {
    skill: "om-fix",
    cmd: "/om-fix 12",
    job: "Make the minimal change, add regression tests, run the validation gate.",
    touches: "Claims the issue first. Edits code. Does not commit or push.",
    handsOn: "Status: ready (or blocked) plus a files-changed and tests summary.",
    claim: "takes",
  },
  {
    skill: "om-open-pr",
    cmd: "/om-open-pr 12",
    job: "Commit, push, open a ready PR with the full label set, give the issue back.",
    touches: "The only step that pushes and labels. Releases the claim.",
    handsOn: "PR: #14 (link: …), the line the next skill reads.",
    claim: "releases",
  },
];

export default function FirstTicket() {
  return (
    <ChapterShell
      slug="first-ticket"
      know={[
        <>
          A bug fix is four building blocks in a row: <strong>verify</strong> (is it real?), <strong>root cause</strong>{" "}
          (where?), <strong>fix</strong> (change + tests), <strong>open PR</strong> (ship).
        </>,
        <>
          Skills pass each other plain text: a brief, a status line, and the <Cmd>PR: #14 (link: …)</Cmd> line that
          the next skill reads. You can read every hand-off yourself.
        </>,
        <>
          The read-only steps claim nothing; the claim starts where code changes, so a chain that stops early leaves
          no stray lock behind.
        </>,
        <>
          <Cmd>om-fix</Cmd> never commits; <Cmd>om-open-pr</Cmd> is the one place that pushes, labels and opens the PR.
        </>,
        <>
          These skills are <em>interactive</em>: each acts once, reports, and leaves the next move to you.
        </>,
      ]}
    >
      <Story>
        <p>
          Tuesday. A dispatcher reports issue <strong>#12</strong>: &ldquo;Deliveries that leave after midnight show
          yesterday&apos;s date as their ETA.&rdquo; <PersonTag id="developer" /> could hand the whole thing to one
          command (that is chapter 4), but on day one he wants to see the machinery. So he runs the four building
          blocks the bigger skills are made of, one at a time, and reads what each one says before starting the next.
        </p>
      </Story>

      <Figure
        title="The relay: four skills, four hand-offs"
        caption="Each skill does one job and hands the next a written note. The padlock shows who holds the claim on issue #12 at each moment."
      >
        <ol className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {RELAY.map((leg, i) => (
            <li key={leg.skill} className="contents">
              <div
                className={cn(
                  "flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-3",
                  leg.claim !== "none" && "border-amber-500/70",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">Leg {i + 1}</span>
                  <ClaimBadge claim={leg.claim} />
                </div>
                <SkillChip name={leg.skill} />
                <p className="text-sm leading-6">{leg.job}</p>
                <p className="text-xs leading-5 text-muted-foreground">{leg.touches}</p>
                <div className="mt-auto rounded-lg bg-muted/60 p-2 text-xs leading-5">
                  <span className="font-semibold">Hands on: </span>
                  {leg.handsOn}
                </div>
              </div>
              {i < RELAY.length - 1 && (
                <div className="flex items-center justify-center text-muted-foreground" aria-hidden>
                  <ArrowDown className="size-5 lg:hidden" />
                  <ArrowRight className="hidden size-5 lg:block" />
                </div>
              )}
            </li>
          ))}
        </ol>
      </Figure>

      <Story>
        <p>
          The hand-offs are not magic. When the bigger skills run this chain for you, they pass each step&apos;s output
          to the next verbatim, inside a marked block, exactly as Bartek did by pasting:
        </p>
      </Story>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Artefact title="What om-fix receives" where="in the agent session">
          {`— PREVIOUS STEP (om-root-cause) said —
Summary: ETA is computed in UTC, displayed in local time.
Root cause: formatEta() drops the timezone offset for
  departures between 00:00 and the offset.
Files to change: src/eta/format.ts, src/eta/format.test.ts
Approach: keep the departure's zone through formatting.
Risks: other callers of formatEta() (two found).`}
        </Artefact>
        <Artefact title="What om-fix posts before touching code" where="comment on issue #12">
          {`🤖 Claiming this issue — starting \`om-fix\` run. Started: 2026-10-06T09:41:12Z`}
          {"\n\n"}
          <span className="font-sans text-muted-foreground">
            … plus Bartek&apos;s account as assignee and the <LabelChip name="in-progress" /> label: the three claim
            signals. Chapter 7 shows why they exist.
          </span>
        </Artefact>
      </div>

      <Story>
        <p>
          The last leg, <SkillChip name="om-open-pr" />, commits, pushes the branch, and opens PR <strong>#14</strong>{" "}
          as <em>ready</em>, not draft, with a full set of labels and a comment explaining each one. It hands issue #12
          back, removes the claim, and ends its report with two lines meant for the next skill rather than for Bartek:
        </p>
      </Story>

      <Artefact title="The end of every PR-producing skill's report" where="agent output">
        {`PR: #14 (link: https://github.com/swallow-express/app/pull/14)
Issue: #12 (link: https://github.com/swallow-express/app/issues/12)`}
      </Artefact>

      <Callout title="Fixing it yourself instead?">
        On a branch you edited by hand, <SkillChip name="om-check-and-commit" /> runs the same validation gate, fixes
        obvious drift, and commits and pushes once it is green, but only if you asked it to publish in the same request.
        It never skips hooks and never force-pushes.
      </Callout>
    </ChapterShell>
  );
}

function ClaimBadge({ claim }: { claim: Leg["claim"] }) {
  if (claim === "none")
    return <span className="text-[11px] text-muted-foreground">no claim</span>;
  const Icon = claim === "takes" ? Lock : LockOpen;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-900 dark:text-amber-200">
      <Icon className="size-3" aria-hidden />
      {claim === "takes" ? "claims #12" : "releases #12"}
    </span>
  );
}
