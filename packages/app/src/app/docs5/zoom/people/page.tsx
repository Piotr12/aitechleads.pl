import Link from "../../_components/link";
import { MarkLegend, Remember, RepoNote, RoleAvatar } from "../../_components/marks";
import { PresenceTable } from "../../_components/road";
import { H2, Prose, ZoomFrame } from "../../_components/zoom";
import { meta } from "../../_data/meta";
import { isActive, ROLES } from "../../_data/roles";
import { STAGES } from "../../_data/stages";

export const metadata = meta("Zoom 4: Seven people");

export default function ZoomPeople() {
  return (
    <ZoomFrame slug="people" title="Seven people, each at a few stops">
      <section aria-labelledby="strips" className="flex flex-col gap-3">
        <H2 id="strips">Who stands where</H2>
        <p className="text-sm text-muted-foreground">
          Each row is one person; each little square is one of the {STAGES.length} stops, in road order (the numbers
          are the stops, “+” is the repo&apos;s Design stop). An empty square means “not my stop”.
        </p>
        <PresenceTable />
        <MarkLegend marks={["decides", "supervises", "agent", "plain"]} />
      </section>

      <section aria-labelledby="owns" className="flex flex-col gap-3">
        <H2 id="owns">What each of them owns</H2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((r) => {
            const active = r.moments.filter(isActive).length;
            return (
              <li key={r.id}>
                <Link
                  href={`/docs5/seats/${r.id}`}
                  className="flex h-full min-w-0 flex-col gap-2 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <span className="flex items-center gap-3">
                    <RoleAvatar role={r.id} />
                    <span className="flex min-w-0 flex-col">
                      <span className="font-semibold break-words">{r.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {active} stops where they act{r.optional ? " · optional" : ""}
                      </span>
                    </span>
                  </span>
                  <span className="text-sm">
                    Owns <strong>{r.owns}</strong>.
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <Prose>
        <p>
          Nobody stands at every stop. The Product Owner is busy at the start and checks the value at the end; the
          Developer lives in the middle; the Maintainer looks after the road itself and signs the merge. In a small team
          one person wears several of these hats. That is fine, as long as you know which hat you have on.
        </p>
      </Prose>

      <RepoNote>
        The repo has <strong>no Architect role</strong>: its Reviewer can be a person (usually the tech lead) or the
        om-auto-review-pr skill. The <strong>Domain Expert</strong> and the <strong>Designer</strong> are optional,
        switched on with the product layer. Where the repo uses other names (Author, QA reviewer, Release Manager), the
        seat pages say so.
      </RepoNote>

      <Remember>Seven people, and most act at only three to six stops. You only need to learn your own.</Remember>
    </ZoomFrame>
  );
}
