import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "@/app/docs3/_components/link";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@atl/ui/components/tabs";
import { cellsForStage } from "../../_data/raci";
import { ROLE_BY_ID } from "../../_data/roles";
import type { SkillName } from "../../_data/skills";
import { STAGE_BY_ID, stageNeighbours, type StageId } from "../../_data/stages";
import { EXAMPLE, STORY, STORY_BY_STAGE, type Track } from "../../_data/story";
import { TERM_BY_ID } from "../../_data/glossary";
import { ArtefactCard } from "../../_components/artefact";
import {
  Callout,
  IllustrativeBadge,
  Legend,
  RoleAvatar,
  SectionTitle,
  SkillCard,
  SkillChip,
  TermLink,
} from "../../_components/bits";
import { PrevNext } from "../../_components/prev-next";
import { StageCast } from "../../_components/raci-views";
import { StageStrip } from "../../_components/stage-rail";

export const metadata: Metadata = {
  title: "The story, step by step",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return STORY.map((s) => ({ step: s.stage }));
}

export default function StoryStepPage({ params }: PageProps<"/docs3/story/[step]">) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Turning the page…</p>}>
      <StoryStep params={params} />
    </Suspense>
  );
}

async function StoryStep({ params }: Pick<PageProps<"/docs3/story/[step]">, "params">) {
  const { step } = await params;
  if (!(step in STORY_BY_STAGE)) notFound();
  const id = step as StageId;
  const stage = STAGE_BY_ID[id];
  const story = STORY_BY_STAGE[id];
  const { prev, next } = stageNeighbours(id);

  const skills = [...new Set(cellsForStage(id).flatMap((c) => c.skills))] as SkillName[];
  const defaultTab = story.feature ? "feature" : "bug";

  return (
    <main className="flex flex-col gap-10">
      <StageStrip current={id} />

      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          Stage {stage.n} of 10 · {stage.emoji} {stage.name}
          {stage.layer === "product" ? " · product layer" : ""}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{story.title}</h1>
        <p className="text-lg font-medium">“{stage.question}”</p>
        <p className="max-w-3xl text-muted-foreground">{story.intro}</p>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-lg border bg-card p-3">
            <dt className="text-xs font-medium text-muted-foreground">In one sentence</dt>
            <dd>{stage.plain}</dd>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <dt className="text-xs font-medium text-muted-foreground">This stage is done when</dt>
            <dd>{stage.doneWhen}</dd>
          </div>
        </dl>
        {stage.gates.length > 0 && (
          <Callout tone="warn" title={`Approval gate${stage.gates.length > 1 ? "s" : ""} here: ${stage.gates.join(", ")}`}>
            A named person must say yes before work moves on.{" "}
            <Link href={`/docs3/gates#${stage.gates[0]}`}>See the gate with pass / fail examples →</Link>
          </Callout>
        )}
      </header>

      <section className="flex flex-col gap-4">
        <SectionTitle>Who&apos;s involved</SectionTitle>
        <Legend compact />
        <StageCast stage={id} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <SectionTitle>What actually happens</SectionTitle>
          <IllustrativeBadge />
        </div>
        <Tabs defaultValue={defaultTab} className="gap-4">
          <TabsList className="w-full sm:w-fit">
            <TabsTrigger value="feature">
              {EXAMPLE.feature.emoji} Feature #{EXAMPLE.feature.issue}
            </TabsTrigger>
            <TabsTrigger value="bug">
              {EXAMPLE.bug.emoji} Bug #{EXAMPLE.bug.issue}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="feature">
            {story.feature ? <TrackView track={story.feature} /> : <SkipNote text={story.featureSkip} />}
          </TabsContent>
          <TabsContent value="bug">
            {story.bug ? <TrackView track={story.bug} /> : <SkipNote text={story.bugSkip} />}
          </TabsContent>
        </Tabs>
      </section>

      {story.aside && (
        <section className="flex flex-col gap-4 rounded-2xl border border-dashed p-4 sm:p-6">
          <h2 className="text-lg font-semibold">{story.aside.title}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground">{story.aside.text}</p>
          {story.aside.artefact && <ArtefactCard artefact={story.aside.artefact} />}
        </section>
      )}

      <section className="flex flex-col gap-4">
        <SectionTitle>What could go wrong (and what happens then)</SectionTitle>
        <ul className="grid gap-3 md:grid-cols-3">
          {story.wrong.map((w) => (
            <li key={w.what} className="flex flex-col gap-2 rounded-xl border bg-card p-4 text-sm">
              <p className="flex gap-2 font-medium">
                <span aria-hidden>💥</span>
                {w.what}
              </p>
              <p className="flex gap-2 text-muted-foreground">
                <span aria-hidden>↳</span>
                {w.then}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {skills.length > 0 && (
        <section className="flex flex-col gap-4">
          <SectionTitle>Skills used at this stage</SectionTitle>
          <ul className="grid gap-2 sm:grid-cols-2">
            {skills.map((s) => (
              <SkillCard key={s} name={s} />
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <SectionTitle>Words worth knowing here</SectionTitle>
        <ul className="flex flex-wrap gap-2 text-sm">
          {story.terms
            .filter((t) => t in TERM_BY_ID)
            .map((t) => (
              <li key={t} className="rounded-full border bg-card px-3 py-1">
                <TermLink id={t} />
              </li>
            ))}
        </ul>
      </section>

      {story.repoNote && (
        <Callout tone="note" title="The chart and the skills repo, side by side">
          {story.repoNote}
        </Callout>
      )}

      <Callout tone="tip" title="Remember">
        {story.takeaway}
      </Callout>

      <PrevNext
        prev={
          prev
            ? { href: `/docs3/story/${prev.id}`, label: `${prev.emoji} ${prev.name}`, hint: `Stage ${prev.n}` }
            : { href: "/docs3", label: "Welcome", hint: "Back to the start" }
        }
        next={
          next
            ? { href: `/docs3/story/${next.id}`, label: `${next.emoji} ${next.name}`, hint: `Stage ${next.n}` }
            : { href: "/docs3/roles", label: "Now meet each role up close", hint: "The story is over" }
        }
      />
    </main>
  );
}

function SkipNote({ text }: { text?: string }) {
  return (
    <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
      {text ?? "This example has nothing special at this stage."}
    </p>
  );
}

function TrackView({ track }: { track: Track }) {
  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-3xl text-base">{track.summary}</p>
      <ol className="relative flex flex-col gap-4 border-l-2 border-border pl-6">
        {track.beats.map((beat, i) => (
          <li key={i} className="relative">
            <span className="absolute top-0 -left-[43px]">
              <RoleAvatar role={beat.who} />
            </span>
            <p className="text-xs font-medium text-muted-foreground">
              {beat.who === "agent"
                ? "Agent"
                : `${ROLE_BY_ID[beat.who].person} · ${ROLE_BY_ID[beat.who].title}`}
            </p>
            <p className="text-sm">{beat.text}</p>
            {(beat.command || beat.skill) && (
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                {beat.command && (
                  <code className="rounded-md bg-zinc-950 px-2 py-1 font-mono text-xs text-zinc-100 dark:bg-black">
                    {beat.command}
                  </code>
                )}
                {beat.skill && <SkillChip name={beat.skill} />}
              </div>
            )}
          </li>
        ))}
      </ol>
      {track.artefacts.length > 0 && (
        <div className="flex flex-col gap-6">
          <h3 className="font-semibold">What you would see</h3>
          {track.artefacts.map((a, i) => (
            <ArtefactCard key={i} artefact={a} />
          ))}
        </div>
      )}
    </div>
  );
}
