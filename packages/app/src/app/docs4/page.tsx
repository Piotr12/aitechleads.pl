import type { Metadata } from "next";
import { BookOpen, Layers, Telescope, Users } from "lucide-react";
import Link from "@/app/docs4/_components/link";
import { CHAPTERS, ROBOTS, ROLES, href, stageById } from "./_data";
import { PRODUCT } from "./_data/story";
import { AgentBadge, Avatar, PageHeader, PrevNext, Prose, SectionNav, SectionTitle } from "./_components/ui";
import { StageRail } from "./_components/stage-rail";

export const metadata: Metadata = {
  title: { absolute: "One appointment, ten stages · a story-led guide to the AI SDLC" },
  robots: ROBOTS,
};

const PARTS = [
  {
    n: 1,
    title: "The story",
    href: href.story,
    icon: BookOpen,
    text: "One team, one feature, from a call log to a merged PR and a tidy tracker. A prologue and ten chapters, each placed on the rail.",
  },
  {
    n: 2,
    title: "The 30,000-foot view",
    href: href.overview,
    icon: Telescope,
    text: "The whole system on one picture: two layers, ten stages, seven gates, and the rule that blocked work cannot merge.",
  },
  {
    n: 3,
    title: "Perspectives",
    href: href.perspectives,
    icon: Users,
    text: "The same journey from each of the seven chairs: what each person decides, supervises and delegates, and where their gates are.",
  },
  {
    n: 4,
    title: "Details",
    href: href.details,
    icon: Layers,
    text: "The reference: one page per role and per stage, the seven gates in full, and an index of every skill with links upstream.",
  },
];

export default function Docs4Home() {
  const opening = CHAPTERS[1];
  return (
    <>
      <SectionNav part="home" />

      <PageHeader
        eyebrow="A story-led guide to the open-mercato AI SDLC skills"
        title="One appointment, ten stages"
        lead="How a team of seven builds one feature when agents do the delegated work and people keep the decisions. Told first as a story, then from altitude, then from each chair, then in detail."
      />

      <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:p-8">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">The story opens</p>
        <div className="flex max-w-prose flex-col gap-4 font-serif text-lg leading-8">
          <Prose text={opening.text[0]} />
          <Prose text={opening.text[1]} className="text-muted-foreground" />
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href={href.chapter(CHAPTERS[0].slug)}
            className="rounded-full bg-foreground px-4 py-2 font-medium text-background hover:opacity-90"
          >
            Start with the prologue →
          </Link>
          <Link href={href.chapter(opening.slug)} className="rounded-full border px-4 py-2 hover:bg-muted">
            Go straight to chapter 1
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>Four parts, from close up to far away</SectionTitle>
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PARTS.map((p) => (
            <li key={p.n} className="min-w-0">
              <Link
                href={p.href}
                className="group flex h-full flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <span className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">Part {p.n}</span>
                  <p.icon className="size-5 text-muted-foreground group-hover:text-foreground" aria-hidden />
                </span>
                <span className="font-semibold">{p.title}</span>
                <span className="text-sm text-muted-foreground">{p.text}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>The cast</SectionTitle>
        <p className="max-w-3xl text-muted-foreground">
          {PRODUCT.name} is {PRODUCT.blurb}. Seven people build it; each plays one of the roles on the RACI chart.
        </p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r) => (
            <li key={r.id} className="min-w-0">
              <Link
                href={href.role(r.id)}
                className="flex h-full min-w-0 gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <Avatar role={r.id} />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="font-medium">
                    {r.person} <span className="text-sm font-normal text-muted-foreground">· {r.name}</span>
                  </span>
                  <span className="text-sm text-muted-foreground">{r.character}</span>
                  {r.optional && <span className="text-xs text-muted-foreground italic">An optional role.</span>}
                </span>
              </Link>
            </li>
          ))}
          <li className="min-w-0">
            <Link
              href={href.skills}
              className="flex h-full min-w-0 gap-3 rounded-xl border border-dashed p-4 transition-colors hover:bg-muted/50"
            >
              <AgentBadge />
              <span className="flex min-w-0 flex-col gap-1">
                <span className="font-medium">The agents</span>
                <span className="text-sm text-muted-foreground">
                  They have no names, only skill names, which is more honest. Each does one delegated job and says
                  so in a comment that starts with 🤖.
                </span>
              </span>
            </Link>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>Contents of the story</SectionTitle>
        <StageRail caption="Each numbered stop is a chapter, under the stage where it happens. Red tags are approval gates." />
        <ol className="flex flex-col divide-y rounded-xl border bg-card">
          {CHAPTERS.map((c) => (
            <li key={c.slug}>
              <Link
                href={href.chapter(c.slug)}
                className="flex min-w-0 items-baseline gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <span className="w-6 shrink-0 text-right font-mono text-sm text-muted-foreground">{c.number}</span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
                  <span className="font-medium">{c.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {c.stages.map((s) => stageById(s).name).join(" + ")}
                    {c.gates.length > 0 && ` · gate ${c.gates.join(", ")}`}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <p className="max-w-3xl text-sm text-muted-foreground">
        {PRODUCT.name}, its clinics, its people and every number in the story are invented. The process, the skills,
        the labels and the gates are real: they come from the{" "}
        <a href="https://github.com/open-mercato/skills" target="_blank" rel="noreferrer" className="underline">
          open-mercato/skills
        </a>{" "}
        repository and the AI SDLC RACI chart. Where the two disagree, this guide follows the repository and says so
        on the page.
      </p>

      <PrevNext next={{ href: href.chapter(CHAPTERS[0].slug), label: CHAPTERS[0].title, hint: "Prologue" }} />
    </>
  );
}
