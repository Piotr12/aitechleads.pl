import { ArrowRight } from "lucide-react";
import { Frame } from "./_components/frame";
import { LaneMap } from "./_components/lane-map";
import Link from "./_components/link";
import { Avatar, Cmd, Ext, SectionTitle } from "./_components/marks";
import { meta, UP } from "./_data/links";
import { SKILLS } from "./_data/skills";
import { CHAPTERS, chapterHref, PEOPLE } from "./_data/story";

export const metadata = meta("Before the month");

const PARTS_OF_THE_MACHINE = [
  {
    name: "Skills",
    what: "42 instruction files your coding agent (Claude Code, Codex, Cursor…) runs as slash commands. Those named om-auto-… run to the end on their own; the rest act once and talk to you.",
    ch: 4,
  },
  {
    name: "Artefacts",
    what: "What the skills leave behind: a config file, a process document, plans, specs, PRs, and the comments they post on issues and PRs.",
    ch: 1,
  },
  {
    name: "Labels",
    what: "GitHub labels that say where each PR stands and what may happen to it next. The skills read and move them.",
    ch: 3,
  },
  {
    name: "Config",
    what: "One committed file, .ai/agentic.config.json, that every skill reads first: your branch, your checks, your labels, your QA rule.",
    ch: 1,
  },
  {
    name: "People",
    what: "Six roles who decide what agents may not: what is ready, what passed QA, what merges, how the process changes.",
    ch: 7,
  },
];

export default function Docs7Home() {
  return (
    <Frame
      href="/docs7"
      kicker="A guide in eleven chapters"
      title="The first month"
      lead={
        <>
          How a small team learns to work with the{" "}
          <Ext href={UP.repo}>open-mercato AI SDLC skills</Ext>: not all {SKILLS.length} at once, but a few at a time,
          as the need for each one turns up.
        </>
      }
    >
      <section className="rounded-xl border-2 border-foreground/80 bg-card p-4 sm:p-5">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">In one sentence</p>
        <p className="mt-2 text-lg leading-8 text-balance">
          The skills run a team&apos;s whole GitHub workflow, from idea to merged and tidied pull request, with agents
          doing the work and a few labels, locks and gates keeping the decisions that matter with people.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>Five moving parts</SectionTitle>
        <p className="max-w-prose text-muted-foreground">
          That is the whole machine. You will meet each part in the chapter named on its card, in the order a team
          actually bumps into them.
        </p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PARTS_OF_THE_MACHINE.map((p) => (
            <li key={p.name} className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-3">
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm leading-6 break-words text-muted-foreground">{p.what}</p>
              <Link
                href={chapterHref(CHAPTERS[p.ch - 1])}
                className="mt-auto text-xs font-medium underline underline-offset-2"
              >
                Chapter {p.ch}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>Meet the team</SectionTitle>
        <p className="max-w-prose text-muted-foreground">
          Six people build <strong className="text-foreground">Swallow Express</strong>, a delivery tracker for a
          co-operative that imports coconuts. (Whether the swallows are African or European is a matter for a later
          spec.) The team and its tickets are invented; every skill, flag, label and file they use is real and
          sourced from the repository.
        </p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PEOPLE.map((p) => (
            <li key={p.id}>
              <Link
                href={`/docs7/people/${p.id}`}
                className="flex min-w-0 items-center gap-3 rounded-xl border bg-card p-3 hover:bg-muted/50"
              >
                <Avatar id={p.id} />
                <span className="flex min-w-0 flex-col">
                  <span className="font-medium">
                    {p.name} <span className="font-normal text-muted-foreground">· {p.role}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">In the repo&apos;s words: {p.repoRole}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>The month, chapter by chapter</SectionTitle>
        <p className="max-w-prose text-muted-foreground">
          Each chapter carries one idea, shows it in one picture, and ends with <em>What you now know</em> and the map
          below, a little fuller than before. Read them in order: each one leans on the last.
        </p>
        <ol className="flex flex-col gap-2">
          {CHAPTERS.map((c) => (
            <li key={c.slug}>
              <Link
                href={chapterHref(c)}
                className="group grid grid-cols-[2.5rem_1fr] items-start gap-x-3 gap-y-1 rounded-xl border bg-card p-3 hover:bg-muted/50 sm:grid-cols-[2.5rem_9rem_1fr]"
              >
                <span className="row-span-2 flex size-9 items-center justify-center rounded-full bg-muted text-sm font-semibold tabular-nums sm:row-span-1">
                  {c.n}
                </span>
                <span className="text-xs font-medium text-muted-foreground sm:pt-2">{c.when}</span>
                <span className="col-start-2 flex min-w-0 flex-col sm:col-start-3">
                  <span className="font-medium group-hover:underline">{c.title}</span>
                  <span className="text-sm text-muted-foreground">{c.idea}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <LaneMap upTo={0} />
        <p className="max-w-prose text-sm text-muted-foreground">
          The map is empty on purpose. It has eight lanes, the places work passes through; the skills and the
          decisions only people make will appear in them chapter by chapter, until the{" "}
          <Link href="/docs7/picture" className="underline underline-offset-2">
            whole picture
          </Link>{" "}
          after chapter 11.
        </p>
      </section>

      <section className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-4">
        <SectionTitle>In a hurry?</SectionTitle>
        <ul className="flex flex-col gap-2 text-sm">
          <li>
            <Link href="/docs7/people" className="inline-flex items-center gap-1 font-medium underline underline-offset-2">
              Find your role&apos;s flow <ArrowRight className="size-3.5" aria-hidden />
            </Link>{" "}
            <span className="text-muted-foreground">what you run, when, and what you decide.</span>
          </li>
          <li>
            <Link href="/docs7/picture" className="inline-flex items-center gap-1 font-medium underline underline-offset-2">
              The whole picture <ArrowRight className="size-3.5" aria-hidden />
            </Link>{" "}
            <span className="text-muted-foreground">one piece of work end to end, on one page.</span>
          </li>
          <li>
            <span className="font-medium">Try it:</span>{" "}
            <Cmd>npx skills add open-mercato/skills --skill &apos;*&apos;</Cmd>, then{" "}
            <Cmd>/om-setup-agent-pipeline</Cmd>.{" "}
            <Link href={chapterHref(CHAPTERS[0])} className="underline underline-offset-2">
              Chapter 1
            </Link>{" "}
            <span className="text-muted-foreground">explains what that does.</span>
          </li>
        </ul>
      </section>
    </Frame>
  );
}
