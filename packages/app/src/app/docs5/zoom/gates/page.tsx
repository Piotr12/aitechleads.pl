import { Flag } from "lucide-react";
import { Label, Remember, RepoNote, RoleAvatar, StopChip } from "../../_components/marks";
import { Road } from "../../_components/road";
import { H2, Prose, ZoomFrame } from "../../_components/zoom";
import { GATES } from "../../_data/gates";
import { meta } from "../../_data/meta";

export const metadata = meta("Zoom 5: Seven red lights");

export default function ZoomGates() {
  return (
    <ZoomFrame slug="gates" title="Seven red lights on the road">
      <Road stops gates />
      <Prose>
        <p>
          A <strong className="text-foreground">gate</strong> is a stop where the work waits for a named person to say
          yes. The little faces on each flag show who that is. Three gates sit at the start (is this worth doing, and
          clear enough to build?), four near the end (is it safe, does it work, may it merge?).
        </p>
      </Prose>

      <section aria-labelledby="list" className="flex flex-col gap-3">
        <H2 id="list">The seven, and the question each one answers</H2>
        <ol className="flex flex-col gap-3">
          {GATES.map((g) => (
            <li
              key={g.id}
              id={g.id}
              className="flex min-w-0 scroll-mt-40 flex-col gap-3 rounded-xl border border-l-4 border-l-destructive bg-card p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-sm font-semibold text-destructive">
                  <Flag className="size-3.5" aria-hidden />
                  {g.id}
                </span>
                <span className="font-semibold">{g.name}</span>
                <StopChip stage={g.stage} />
              </div>
              <p className="text-lg font-medium">“{g.question}”</p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="flex -space-x-1">
                  {g.holders.map((h) => (
                    <RoleAvatar key={h} role={h} size="sm" />
                  ))}
                </span>
                <span>
                  Says yes: <strong>{g.holderLabel}</strong>
                  {g.holders.length > 1 && <span className="text-muted-foreground"> (PO or Domain Expert)</span>}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{g.detail}</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">In the repo: </span>
                {g.repo}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="hard" className="flex flex-col gap-3 rounded-xl border-2 border-destructive/60 p-4">
        <H2 id="hard">The one hard rule</H2>
        <p className="text-sm leading-7">
          A PR carrying <Label tone="wait">needs-qa</Label> never merges until it also carries{" "}
          <Label tone="good">qa-approved</Label>, even when every automated check is green.{" "}
          <Label tone="bad">qa-failed</Label>, <Label tone="bad">blocked</Label> and{" "}
          <Label tone="bad">do-not-merge</Label> stop it wherever it is.
        </p>
        <p className="text-sm text-muted-foreground">
          Labels are the coloured tags on a GitHub PR. In this process they are how everyone, people and agents alike,
          sees where a PR is and what it is waiting for.
        </p>
      </section>

      <RepoNote>
        The chart puts G4 with an Architect; the repo has a Reviewer instead (a person or om-auto-review-pr), and
        insists on a second person&apos;s review for auth and money. G1 and G2 belong to the optional product layer
        (Discovery), and om-setup-discovery-pipeline is also what switches on the readiness checks behind G3.
      </RepoNote>

      <Remember>
        Seven gates, each with a named person. needs-qa without qa-approved never merges, however green the checks.
      </Remember>
    </ZoomFrame>
  );
}
