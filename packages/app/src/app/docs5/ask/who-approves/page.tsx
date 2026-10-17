import { Frame } from "../../_components/frame";
import { GateFlag, RepoNote, RoleAvatar, StopChip } from "../../_components/marks";
import { GATES } from "../../_data/gates";
import { meta } from "../../_data/meta";

export const metadata = meta("Who says yes to what?");

export default function WhoApproves() {
  return (
    <Frame
      href="/docs5/ask/who-approves"
      kicker="❓ Question 1 of 6"
      title="Who says yes to what?"
      lead={<p>Read each row as a sentence: “at this stop, this person answers this question”.</p>}
    >
      <ol className="flex flex-col gap-2">
        {GATES.map((g) => (
          <li
            key={g.id}
            className="grid grid-cols-1 items-center gap-3 rounded-xl border bg-card p-4 sm:grid-cols-[9rem_minmax(0,1fr)_14rem]"
          >
            <span className="flex flex-wrap items-center gap-2">
              <GateFlag id={g.id} />
              <StopChip stage={g.stage} />
            </span>
            <span className="text-base font-medium">“{g.question}”</span>
            <span className="flex min-w-0 items-center gap-2 text-sm">
              <span className="flex -space-x-1">
                {g.holders.map((h) => (
                  <RoleAvatar key={h} role={h} size="sm" />
                ))}
              </span>
              <span className="min-w-0 font-semibold break-words">{g.holderLabel}</span>
            </span>
          </li>
        ))}
      </ol>

      <section aria-labelledby="also" className="flex flex-col gap-2">
        <h2 id="also" className="text-xl font-semibold">
          And three people who can bend the rules, on the record
        </h2>
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">The Maintainer</strong> may waive one Definition of Ready item, writing
            the reason on the ticket, and approves exceptions to the QA process.
          </li>
          <li>
            <strong className="text-foreground">Any engineer</strong> may sign off QA on lower-risk work (risk-low or
            risk-medium) when no tester is free, with evidence and the qa-self-verified label. Never on risk-high.
          </li>
          <li>
            <strong className="text-foreground">The Architect / Tech Lead</strong> settles triage disputes: is it
            risk-high, is it blocked?
          </li>
        </ul>
      </section>

      <RepoNote>
        The chart names an Architect for G4; the repo&apos;s SDLC.md has a Reviewer, who may be a person or the
        om-auto-review-pr skill. Changes to auth or money always need a second person&apos;s review, whoever wrote them.
      </RepoNote>
    </Frame>
  );
}
