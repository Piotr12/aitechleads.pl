import { Frame } from "../_components/frame";
import Link from "../_components/link";
import { Avatar, Cmd, DecisionMark, SectionTitle } from "../_components/marks";
import { cn } from "../_components/cx";
import { FLOW_BY_ID } from "../_data/flows";
import { meta } from "../_data/links";
import { LANES } from "../_data/skills";
import { PEOPLE } from "../_data/story";

export const metadata = meta("Who runs what");

export default function People() {
  return (
    <Frame
      href="/docs7/people"
      kicker="Reference"
      title="Who runs what"
      lead="Six people, one pipeline. Each person enters it at a few lanes only; this page shows which, and links to each person's flow."
    >
      <section className="flex flex-col gap-3">
        <SectionTitle>Where each person acts</SectionTitle>
        <p className="max-w-prose text-sm text-muted-foreground">
          A coloured mark means the person runs something in that lane (the number counts the moments); a diamond
          means they also hold a decision there.
        </p>
        <ul className="flex flex-col gap-2 md:hidden">
          {PEOPLE.map((p) => {
            const flow = FLOW_BY_ID[p.id];
            return (
              <li key={p.id} className="flex flex-col gap-2 rounded-xl border bg-card p-3">
                <Link href={`/docs7/people/${p.id}`} className="flex items-center gap-2 font-medium hover:underline">
                  <Avatar id={p.id} size="sm" />
                  {p.role}
                </Link>
                <ul className="flex flex-wrap gap-1">
                  {LANES.map((l, i) => {
                    const steps = flow.steps.filter((s) => s.lane === l.id);
                    if (steps.length === 0) return null;
                    return (
                      <li
                        key={l.id}
                        className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium text-white", p.tone)}
                      >
                        <span className="opacity-70 tabular-nums">{i + 1}</span> {l.name} · {steps.length}
                        {steps.some((s) => s.decide) && <DecisionMark className="size-3 fill-white text-white" />}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
        <div className="hidden overflow-x-auto rounded-xl border bg-card md:block">
          <table className="w-full min-w-[42rem] text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
                <th className="px-3 py-2 text-left font-medium">Person</th>
                {LANES.map((l, i) => (
                  <th key={l.id} className="px-2 py-2 text-center font-medium">
                    <span className="tabular-nums opacity-60">{i + 1}</span> {l.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PEOPLE.map((p) => {
                const flow = FLOW_BY_ID[p.id];
                return (
                  <tr key={p.id} className="border-b last:border-0">
                    <th className="px-3 py-2 text-left font-normal">
                      <Link href={`/docs7/people/${p.id}`} className="flex items-center gap-2 hover:underline">
                        <Avatar id={p.id} size="sm" />
                        <span className="font-medium whitespace-nowrap">{p.role}</span>
                      </Link>
                    </th>
                    {LANES.map((l) => {
                      const steps = flow.steps.filter((s) => s.lane === l.id);
                      const decides = steps.some((s) => s.decide);
                      return (
                        <td key={l.id} className="px-2 py-2 text-center">
                          {steps.length > 0 ? (
                            <span
                              className={cn(
                                "inline-flex h-7 min-w-9 items-center justify-center gap-1 rounded-md px-1.5 text-xs font-semibold text-white tabular-nums",
                                p.tone,
                              )}
                              title={steps.map((s) => s.run).join("\n")}
                            >
                              {steps.length}
                              {decides && <DecisionMark className="size-3 fill-white text-white" />}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40">·</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">Numbers count the moments in that person&apos;s flow, per lane.</p>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>Pick your flow</SectionTitle>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {PEOPLE.map((p) => {
            const flow = FLOW_BY_ID[p.id];
            return (
              <li key={p.id}>
                <Link
                  href={`/docs7/people/${p.id}`}
                  className="flex h-full min-w-0 flex-col gap-2 rounded-xl border bg-card p-4 hover:bg-muted/40"
                >
                  <span className="flex items-center gap-3">
                    <Avatar id={p.id} />
                    <span className="flex flex-col">
                      <span className="font-semibold">{p.role}</span>
                      <span className="text-xs text-muted-foreground">
                        {p.name} in the story · {p.repoRole} in the repo
                      </span>
                    </span>
                  </span>
                  <span className="text-sm leading-6">{flow.oneLine}</span>
                  <span className="text-xs text-muted-foreground">
                    Reaches most often for <Cmd>{flow.usual}</Cmd>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-xl border bg-muted/30 p-4 text-sm leading-6">
        <p className="font-semibold">Who is &ldquo;the reviewer&rdquo;, &ldquo;the maintainer&rdquo;?</p>
        <p className="text-muted-foreground">
          The roles are SDLC.md&apos;s: Author, Reviewer, Designer, QA reviewer, Maintainer (plus a release manager when
          the team names one, and a product owner once the product layer is on). One person may hold several; an agent
          may act as Author or Reviewer. QA reviewers are always referred to by role, never by name, because
          assignments change.
        </p>
      </section>
    </Frame>
  );
}
