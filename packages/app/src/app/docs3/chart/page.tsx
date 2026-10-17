import type { Metadata } from "next";
import { Callout, Legend, PageIntro, TermLink } from "../_components/bits";
import { RaciMatrix } from "../_components/raci-views";

export const metadata: Metadata = {
  title: "The chart, decoded",
  robots: { index: false, follow: false },
};

const HOW_TO_READ = [
  {
    q: "Read a column",
    a: "Pick a stage (say, QA) and read down: Quinn is A,R with a red dot (she tests and decides), Priya is C (does it solve the problem?), Sam and Iga are I (they are told).",
  },
  {
    q: "Read a row",
    a: "Pick a role (say, Developer) and read across: nothing until Claim, then A,R with dark dots (supervising the agent) until Review, then only I.",
  },
  {
    q: "Spot the red",
    a: "Red-tinted cells hold an approval gate. A red dot means a human decides there; nobody else can say yes for them.",
  },
];

export default function ChartPage() {
  return (
    <main className="flex flex-col gap-10">
      <PageIntro eyebrow="📊 The chart" title="The whole RACI chart, decoded">
        <p>
          The original “AI SDLC RACI: who, with which skill, at which stage” as one table. Seven roles down, ten
          stages across. Each cell says how that role is involved, using <TermLink id="raci">RACI</TermLink> letters
          and the chart&apos;s dots.
        </p>
      </PageIntro>

      <Legend />

      <ul className="grid gap-3 md:grid-cols-3">
        {HOW_TO_READ.map((h) => (
          <li key={h.q} className="rounded-xl border bg-card p-4 text-sm">
            <p className="font-semibold">{h.q}</p>
            <p className="text-muted-foreground">{h.a}</p>
          </li>
        ))}
      </ul>

      <RaciMatrix />
      <p className="-mt-6 text-sm text-muted-foreground">
        Scroll sideways on a small screen. Click a stage for its story page, a role for its day in the life.
      </p>

      <Callout tone="note" title="Notes from the chart">
        Human approval gates: product brief, backlog and changes to owned decisions. QA owns test approval;
        lower-risk work may use the agreed self-check process. Blocked work cannot merge. Deployment and operations
        follow the team&apos;s release process.
      </Callout>

      <Callout tone="info" title="Where the chart and the skills repo differ">
        <ul className="ml-4 list-disc space-y-1">
          <li>
            SDLC.md has a separate per-ticket <strong>Design</strong> stage between Claim and Implement; the chart
            puts that work in Discovery &amp; Design and “design support” during Implement.
          </li>
          <li>
            SDLC.md names roles Author, Reviewer, Designer, QA reviewer and Maintainer (plus the product roles).
            There is no separate Architect role: a team puts its tech lead or architect under Reviewer. Domain
            Expert and Designer are optional product roles.
          </li>
          <li>
            The chart mentions <strong>ADRs</strong>; the repo records decisions in specs, in product-brief.md and in
            DECISIONS.md rather than with an ADR skill.
          </li>
          <li>
            <code>om-qa-buddy</code> is on the chart and in the repo&apos;s skills folder, but has no card in the
            repo&apos;s skill catalogue; links here point to its SKILL.md.
          </li>
        </ul>
      </Callout>
    </main>
  );
}
