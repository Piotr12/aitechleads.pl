import Link from "./_components/link";
import { Frame } from "./_components/frame";
import { ColourKey, H2, Source } from "./_components/marks";
import { Md } from "./_components/md";
import { Trip } from "./_components/trip";
import { meta, PARTS } from "./_data/nav";

export const metadata = meta(
  "Follow the parcel",
  "How the open-mercato AI SDLC skills pass one piece of work from hand to hand, from idea to merged and tidied.",
);

export default function Docs6Home() {
  return (
    <Frame
      href="/docs6"
      kicker="📦 A guide to the open-mercato skills, told by following the work"
      title="Follow the parcel"
      idea="These skills carry one piece of work from an idea to a merged, tidied change. Agents do the carrying; people decide at a few named points."
      lead={
        <p>
          There are 42 skills, a dozen labels and several kinds of people involved, which is a lot to meet at once. So
          this guide does not start with the parts. It follows one invented piece of work,{" "}
          <em>“Bulk-archive orders from the grid”</em>, through nine hand-offs, like a parcel through the post, and at
          every stop it asks the same four questions: what is the work called now, who holds it, what does it carry
          with it, and who has to say yes before it moves on.
        </p>
      }
    >
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <H2>The whole trip, on one page</H2>
          <ColourKey />
        </div>
        <div className="rounded-xl border bg-card p-4 sm:p-6">
          <Trip />
        </div>
        <p className="text-sm text-muted-foreground">
          Each stop is a page; click any of them, or go through in order with <strong>Next</strong> at the bottom.
          Amber stops are held by a person, blue ones by an agent, the grey one by both together. The rose badges mark the places where a person must
          decide before the work can move on.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          ["The work changes form", "Hunch, brief file, issue, spec PR, implementation PR, merged commit, changelog line. Each skill takes one form and leaves the next."],
          ["Every hand-off leaves a trail", "Files in the repo, labels on the PR, comments with a 🤖, and a last line such as `PR: #421 (link: …)` that the next skill reads."],
          ["People hold the gates", "Agents propose, build, review and gather evidence. People confirm the routing, the scope, the guesses, the QA verdict and the merge."],
        ].map(([t, d]) => (
          <div key={t} className="flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-4">
            <p className="font-semibold">{t}</p>
            <p className="text-sm text-muted-foreground">
              <Md text={d} />
            </p>
          </div>
        ))}
      </section>

      <p className="text-sm">
        In a hurry? Every decision point and every hard limit on agents is on one page:{" "}
        <Link href="/docs6/people/red-lines" className="font-medium underline">
          Where people decide, what agents never do
        </Link>
        . Your own stops, by role:{" "}
        <Link href="/docs6/people" className="font-medium underline">
          Six people along the road
        </Link>
        .
      </p>

      <section className="flex flex-col gap-3">
        <H2>What is in this guide</H2>
        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PARTS.map((p, i) => (
            <li key={p.id}>
              <Link href={p.href} className="flex h-full min-w-0 gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-muted/50">
                <span className="text-xl" aria-hidden>
                  {p.emoji}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-medium">
                    {i + 1}. {p.name}
                  </span>
                  <span className="text-sm text-muted-foreground">{p.blurb}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <p className="text-xs text-muted-foreground">
        Everything here is checked against{" "}
        <a className="underline" href="https://github.com/open-mercato/skills" target="_blank" rel="noreferrer">
          open-mercato/skills
        </a>{" "}
        (commit 7c662b0). Issue numbers, file names and comments in the examples are invented, shaped like what the
        skills produce, and marked <em>Illustrative</em>. Start with <Source path="README.md" /> and{" "}
        <Source path="SDLC.md" /> if you prefer the originals.
      </p>
    </Frame>
  );
}
