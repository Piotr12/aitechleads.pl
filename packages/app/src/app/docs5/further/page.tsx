import { Frame } from "../_components/frame";
import { Ext } from "../_components/marks";
import { UPSTREAM } from "../_data/links";
import { meta } from "../_data/meta";
import { skillUrl } from "../_data/skills";

export const metadata = meta("Further reading");

const LINKS: { group: string; items: { label: string; href: string; why: string }[] }[] = [
  {
    group: "Start with these two",
    items: [
      { label: "README.md", href: UPSTREAM.readme, why: "The pipeline diagram, the full skill catalogue, workflows by role." },
      { label: "SDLC.md", href: UPSTREAM.sdlc, why: "The process itself: stages, Definition of Ready, labels, the QA gate, claims." },
    ],
  },
  {
    group: "Your role, in the repo's words",
    items: [
      { label: "Product Manager / Analyst", href: UPSTREAM.roles.productManager, why: "The Product Owner's seat." },
      { label: "Designer", href: UPSTREAM.roles.designer, why: "Specs with mockups, design review of PRs." },
      { label: "Developer", href: UPSTREAM.roles.developer, why: "From a brief, a spec or an issue to a reviewed PR." },
      { label: "QA", href: UPSTREAM.roles.qa, why: "One booted app, browser QA, integration tests, the QA gate." },
      { label: "Release Manager", href: UPSTREAM.roles.releaseManager, why: "The Maintainer's merge hat: sweeps, merges, changelog." },
    ],
  },
  {
    group: "Deeper",
    items: [
      { label: "Skill cards", href: UPSTREAM.skillCards, why: "One page per skill, with its parameters and companions." },
      { label: "om-qa-buddy SKILL.md", href: skillUrl("om-qa-buddy"), why: "The one skill with no docs card yet." },
      { label: "CODE_REVIEW.md", href: UPSTREAM.codeReview, why: "The rules every review applies." },
      { label: "DECISIONS.md", href: UPSTREAM.decisions, why: "Why the skills are built the way they are." },
      { label: "The repository", href: UPSTREAM.repo, why: "Everything else, including the skills' source." },
    ],
  },
];

const DIFFS = [
  {
    topic: "A Design stop",
    chart: "Ten columns; design lives in “Discovery & Design” and as design support during Implement.",
    repo: "SDLC.md has a separate per-ticket Design stage between Claim and Implement (om-ux-shape).",
    here: "Shown as a dashed eleventh stop marked “repo”.",
  },
  {
    topic: "The Architect",
    chart: "An Architect / Tech Lead row, holding G4 (independent review).",
    repo: "No Architect role: the Reviewer is a person (often the tech lead) or om-auto-review-pr. Auth and money need a second person's review.",
    here: "Kept the seat, labelled as “the tech lead who reviews”.",
  },
  {
    topic: "Optional roles",
    chart: "Domain Expert and Designer drawn like everyone else.",
    repo: "Both are product-layer roles, switched on with om-setup-discovery-pipeline.",
    here: "Marked “optional” wherever they appear.",
  },
  {
    topic: "Role names",
    chart: "Product Owner, Developer, QA / Tester, Maintainer.",
    repo: "Product Manager / Analyst, Author, QA reviewer, Maintainer plus Release Manager.",
    here: "Chart names, with the repo's name on each seat page.",
  },
  {
    topic: "How many skills",
    chart: "41 skills.",
    repo: "42 in the skills folder (om-create-skill is not on the chart); the README still says forty-one.",
    here: "All 42, with om-create-skill in the “Tend the road” drawer.",
  },
  {
    topic: "om-qa-buddy",
    chart: "Listed under QA.",
    repo: "No docs card, only its SKILL.md.",
    here: "Linked to its SKILL.md.",
  },
  {
    topic: "Who runs om-auto-fix-pr",
    chart: "The Developer, at Review.",
    repo: "The README lists it under the Release Manager.",
    here: "Chart placement; either can run it.",
  },
  {
    topic: "The last stop",
    chart: "“Cleanup”.",
    repo: "“Post-merge housekeeping”.",
    here: "Chart name, with a note.",
  },
];

export default function FurtherPage() {
  return (
    <Frame
      href="/docs5/further"
      kicker="📚 Further"
      title="For the curious"
      lead={
        <p>
          You have the map. The territory lives upstream, in the{" "}
          <Ext href={UPSTREAM.repo}>open-mercato/skills</Ext> repository.
        </p>
      }
    >
      {LINKS.map((g) => (
        <section key={g.group} className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">{g.group}</h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {g.items.map((l) => (
              <li key={l.href} className="flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-4">
                <Ext href={l.href} className="font-medium break-words">
                  {l.label}
                </Ext>
                <span className="text-sm text-muted-foreground">{l.why}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section aria-labelledby="diffs" className="flex flex-col gap-3">
        <h2 id="diffs" className="text-xl font-semibold">
          Where the chart and the repo disagree
        </h2>
        <p className="text-sm text-muted-foreground">
          The repo is the source of truth; this guide follows it and marks every place it differs from the chart.
        </p>
        <ul className="flex flex-col gap-2">
          {DIFFS.map((d) => (
            <li key={d.topic} className="grid grid-cols-1 gap-2 rounded-xl border bg-card p-4 text-sm md:grid-cols-4 md:gap-4">
              <span className="font-semibold">{d.topic}</span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">Chart</span>
                {d.chart}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">Repo</span>
                {d.repo}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">This guide</span>
                {d.here}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-muted-foreground">
        That&apos;s the end of the road. As SDLC.md puts it, merge is where the document ends: delivering the change to
        users is a separate process the team owns, and somebody else&apos;s guide.
      </p>
    </Frame>
  );
}
