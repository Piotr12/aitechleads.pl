import type { ReactNode } from "react";
import Link from "./_components/link";
import { Frame } from "./_components/frame";
import { MarkDot } from "./_components/marks";
import { Road } from "./_components/road";
import { meta } from "./_data/meta";
import { TRACKS } from "./_data/nav";

export const metadata = meta("Start here");

const THREE = [
  {
    n: 1,
    emoji: "🛣️",
    title: "One road",
    text: "Every piece of work, from a big feature to a one-line fix, travels the same road: ten stops from an idea to code merged into main.",
    href: "/docs5/zoom/road",
  },
  {
    n: 2,
    emoji: "🤖",
    title: "Agents type, people decide",
    text: "AI coding agents write the tickets, specs, code, reviews and test reports. People own the decisions and the approvals.",
    href: "/docs5/zoom/hands",
  },
  {
    n: 3,
    emoji: "🚦",
    title: "Seven red lights",
    text: "At seven points a named person must say yes. Until they do, the work does not move on, however green the checks are.",
    href: "/docs5/zoom/gates",
  },
];

export default function Docs5Start() {
  const ways = TRACKS.filter((t) => t.id === "zoom" || t.id === "seats" || t.id === "ask");
  return (
    <Frame
      href="/docs5"
      kicker="👋 Start here"
      title="Forty-two skills, seven people, one road. Don't panic."
      lead={
        <p>
          The <Ext href="https://github.com/open-mercato/skills">open-mercato skills</Ext> run a whole software process
          with AI agents. Seen all at once it looks like the wiring diagram of a small cathedral. It is much simpler
          than it looks: you need exactly three ideas to start.
        </p>
      }
    >
      <section aria-labelledby="three" className="flex flex-col gap-4">
        <h2 id="three" className="text-xl font-semibold">
          The three things to know
        </h2>
        <ol className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {THREE.map((t) => (
            <li key={t.n} className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-5">
              <span className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                  {t.n}
                </span>
                <span aria-hidden className="text-2xl">
                  {t.emoji}
                </span>
              </span>
              <p className="text-lg font-semibold">{t.title}</p>
              <p className="text-sm text-muted-foreground">{t.text}</p>
              <Link href={t.href} className="mt-auto text-sm font-medium underline underline-offset-4">
                Show me →
              </Link>
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted-foreground">
          That is the whole idea. Everything else (the 42 skills, the labels, the arrows) is detail hung on those three
          pegs.
        </p>
      </section>

      <section aria-labelledby="picture" className="flex flex-col gap-3">
        <h2 id="picture" className="text-xl font-semibold">
          The picture we will keep coming back to
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Four legs, ten stops (plus one the repo adds), and red flags where a person decides. You don&apos;t need to
          read it yet: the <strong className="text-foreground">Zoom in</strong> track builds it up one layer at a time.
        </p>
        <Road stops gates compact />
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MarkDot mark="decides" /> red = a person decides
          </span>
          <span>Click any stop to see who is there.</span>
        </p>
      </section>

      <section aria-labelledby="ways" className="flex flex-col gap-4">
        <h2 id="ways" className="text-xl font-semibold">
          Pick a way in
        </h2>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {ways.map((t, i) => (
            <li key={t.id}>
              <Link
                href={t.href}
                className={
                  i === 0
                    ? "flex h-full flex-col gap-2 rounded-xl border-2 border-foreground bg-foreground p-5 text-background transition-opacity hover:opacity-90"
                    : "flex h-full flex-col gap-2 rounded-xl border-2 bg-card p-5 transition-colors hover:bg-muted/50"
                }
              >
                <span aria-hidden className="text-2xl">
                  {t.emoji}
                </span>
                <span className="text-lg font-semibold">{t.name}</span>
                <span className={i === 0 ? "text-sm opacity-80" : "text-sm text-muted-foreground"}>{t.blurb}</span>
                <span className="mt-auto text-sm font-medium">
                  {i === 0 ? "Recommended if you are new →" : "Go →"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Not sure? Read{" "}
          <Link href="/docs5/guide" className="underline underline-offset-4">
            how this guide works
          </Link>{" "}
          (one short page), or just press <strong className="text-foreground">Next</strong> at the bottom of each page
          and let the guide walk you through.
        </p>
      </section>
    </Frame>
  );
}

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-foreground underline underline-offset-4">
      {children}
    </a>
  );
}
