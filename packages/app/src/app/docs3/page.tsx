import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@atl/ui/components/button";
import { ROLES } from "./_data/roles";
import { EXAMPLE } from "./_data/story";
import { QUIZ } from "./_data/quiz";
import { REPO_LINKS } from "./_data/skills";
import { Callout, IllustrativeBadge, Legend, PageIntro, RoleAvatar, SectionTitle, TermLink } from "./_components/bits";
import { RouteMap } from "./_components/route-map";
import { StageRail } from "./_components/stage-rail";

export const metadata: Metadata = {
  title: "Welcome",
  robots: { index: false, follow: false },
};

const BIG_IDEAS = [
  {
    emoji: "🤝",
    title: "Agents do the work, people decide",
    text: "Coding agents write code, tickets, specs, reviews and test reports. People own the decisions and the approvals. Every artefact says who made it.",
  },
  {
    emoji: "🛤️",
    title: "Every change takes the same road",
    text: "A big feature and a tiny bug fix enter differently, but both go through the same review, the same QA check and the same merge.",
  },
  {
    emoji: "⚑",
    title: "Gates are red lights",
    text: "At seven points a named human must say yes. Blocked work cannot merge, no matter how green the automated checks are.",
  },
];

export default function Docs3Home() {
  return (
    <main className="flex flex-col gap-12">
      <PageIntro eyebrow="👋 Start here" title="From an idea to merged code: who does what, and when">
        <p>
          This guide explains a software process in which{" "}
          <TermLink id="agent">AI coding agents</TermLink> do most of the typing and people make the calls. It is
          written for people who are new to it: junior developers, testers, new product owners. Every term is
          explained, and every step comes with examples of what you would actually see.
        </p>
      </PageIntro>

      <section className="flex flex-col gap-4">
        <SectionTitle>The big picture, in plain words</SectionTitle>
        <div className="flex max-w-3xl flex-col gap-3 text-muted-foreground">
          <p>
            A team installs a set of <TermLink id="skill">skills</TermLink>: ready-made instructions an agent follows,
            each for one job (file a ticket, fix a bug, review a pull request, test it in a browser…). There are about
            forty of them, all named <code className="rounded bg-muted px-1 font-mono text-sm">om-something</code>.
            That is a lot, which is why this guide exists.
          </p>
          <p>
            The work moves through <strong className="text-foreground">ten stages</strong>, from Discovery to Cleanup.
            Seven people-roles take part, each at different stages and with a different level of responsibility.
            A chart describes this with <TermLink id="raci">RACI</TermLink> letters: who does the work, who owns the
            outcome, who is asked, who is told.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-3">
          {BIG_IDEAS.map((idea) => (
            <li key={idea.title} className="flex flex-col gap-2 rounded-xl border bg-card p-4">
              <span aria-hidden className="text-2xl">
                {idea.emoji}
              </span>
              <p className="font-semibold">{idea.title}</p>
              <p className="text-sm text-muted-foreground">{idea.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>The road: ten stages</SectionTitle>
        <p className="max-w-3xl text-muted-foreground">
          Click any stop to see the running example at that stage. The red flags are{" "}
          <Link href="/docs3/gates" className="text-foreground underline underline-offset-4">
            approval gates
          </Link>
          . The first stage belongs to the optional <TermLink id="product-layer">product layer</TermLink>; the rest
          is the delivery line.
        </p>
        <StageRail />
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>Meet the cast</SectionTitle>
        <p className="max-w-3xl text-muted-foreground">
          Seven roles, each played in our examples by an invented person so the story is easier to follow. One
          person can wear several hats in a small team.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r) => (
            <li key={r.id}>
              <Link
                href={`/docs3/roles/${r.id}`}
                className={`flex h-full flex-col gap-2 rounded-xl border border-l-4 bg-card p-4 transition-colors hover:bg-muted/40 ${r.colors.border}`}
              >
                <span className="flex items-center gap-3">
                  <RoleAvatar role={r.id} />
                  <span className="flex flex-col">
                    <span className="font-semibold leading-tight">{r.title}</span>
                    <span className="text-xs text-muted-foreground">
                      played by {r.person} {r.emoji}
                    </span>
                  </span>
                </span>
                <span className="text-sm text-muted-foreground">{r.oneLiner}</span>
              </Link>
            </li>
          ))}
          <li className="flex h-full flex-col gap-2 rounded-xl border border-dashed bg-card p-4">
            <span className="flex items-center gap-3">
              <RoleAvatar role="agent" />
              <span className="flex flex-col">
                <span className="font-semibold leading-tight">The agents</span>
                <span className="text-xs text-muted-foreground">not a role, a helper</span>
              </span>
            </span>
            <span className="text-sm text-muted-foreground">
              Do delegated work for whoever started them, through that person&apos;s account. Never approve their own
              work at a gate.
            </span>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <SectionTitle>Two examples, followed all the way</SectionTitle>
          <IllustrativeBadge />
        </div>
        <p className="max-w-3xl text-muted-foreground">
          {EXAMPLE.product} is {EXAMPLE.productBlurb}. We follow one feature and one bug from start to finish. The
          people, issue numbers and texts are made up, but shaped exactly like what the skills produce.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/docs3/story/discovery"
            className="flex flex-col gap-2 rounded-xl border border-l-4 border-l-violet-500 bg-card p-5 hover:bg-muted/40"
          >
            <span className="text-2xl" aria-hidden>
              {EXAMPLE.feature.emoji}
            </span>
            <span className="font-semibold">
              Feature #{EXAMPLE.feature.issue}: “{EXAMPLE.feature.title}”
            </span>
            <span className="text-sm text-muted-foreground">
              Starts in Discovery: is this worth building? Goes through a spec, a design pass, a failed QA run and a
              decision someone tried to change on the quiet.
            </span>
            <span className="text-sm font-medium">Follow it from stage 1 →</span>
          </Link>
          <Link
            href="/docs3/story/intake"
            className="flex flex-col gap-2 rounded-xl border border-l-4 border-l-red-500 bg-card p-5 hover:bg-muted/40"
          >
            <span className="text-2xl" aria-hidden>
              {EXAMPLE.bug.emoji}
            </span>
            <span className="font-semibold">
              Bug #{EXAMPLE.bug.issue}: “{EXAMPLE.bug.title}”
            </span>
            <span className="text-sm text-muted-foreground">
              Starts at Intake with a one-line report from support. Turns out to be about money, which makes it
              risk-high and changes who must approve it.
            </span>
            <span className="text-sm font-medium">Follow it from stage 2 →</span>
          </Link>
        </div>
        <RouteMap />
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>How to read this guide</SectionTitle>
        <ol className="grid gap-3 text-sm sm:grid-cols-2">
          <li className="rounded-xl border bg-card p-4">
            <p className="font-semibold">1. Walk the story</p>
            <p className="text-muted-foreground">
              Ten pages, one per stage. Each shows who is involved, which skills run, example artefacts and what could
              go wrong. Use the arrows at the bottom.
            </p>
          </li>
          <li className="rounded-xl border bg-card p-4">
            <p className="font-semibold">2. Find your own role</p>
            <p className="text-muted-foreground">
              “A day in the life” pages show one role&apos;s flow across the stages, with the decisions they make.
            </p>
          </li>
          <li className="rounded-xl border bg-card p-4">
            <p className="font-semibold">3. Words with dotted underlines</p>
            <p className="text-muted-foreground">
              Link to the <Link href="/docs3/glossary" className="underline underline-offset-2">glossary</Link>. Hover
              for a quick definition.
            </p>
          </li>
          <li className="rounded-xl border bg-card p-4">
            <p className="font-semibold">4. Check yourself</p>
            <p className="text-muted-foreground">
              The <Link href="/docs3/quiz" className="underline underline-offset-2">self-check</Link> asks “who
              approves this?” in {QUIZ.length} short scenarios.
            </p>
          </li>
        </ol>
        <p className="text-sm font-medium">The chart&apos;s symbols, used throughout:</p>
        <Legend />
        <Callout tone="note" title="Where this comes from">
          The roles and stages follow the “AI SDLC RACI” chart; the details (labels, gates, comment formats) follow
          the{" "}
          <a href={REPO_LINKS.readme} target="_blank" rel="noreferrer" className="underline">
            open-mercato/skills README
          </a>{" "}
          and its{" "}
          <a href={REPO_LINKS.sdlc} target="_blank" rel="noreferrer" className="underline">
            SDLC.md
          </a>
          . Where the two differ, the repo wins and the page says so.
        </Callout>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/docs3/story/discovery">Start the story →</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/docs3/roles">Find my role</Link>
        </Button>
      </div>
    </main>
  );
}
