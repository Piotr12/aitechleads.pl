import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/app/docs4/_components/link";
import { CHAPTERS, ROBOTS, chapterNeighbours, gateById, getChapter, href, stageById } from "../../_data";
import { StageRail } from "../../_components/stage-rail";
import { ArtefactCard, CastLine, CastList, Ledger } from "../../_components/story-bits";
import { Callout, GateFlag, Legend, PageHeader, PrevNext, Prose, SectionNav, SectionTitle } from "../../_components/ui";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ chapter: c.slug }));
}

const label = (n: number) => (n === 0 ? "Prologue" : `Chapter ${n}`);

export async function generateMetadata({ params }: PageProps<"/docs4/story/[chapter]">): Promise<Metadata> {
  const chapter = getChapter((await params).chapter);
  return {
    title: chapter ? `${label(chapter.number)}: ${chapter.title}` : "Chapter not found",
    robots: ROBOTS,
  };
}

export default async function ChapterPage({ params }: PageProps<"/docs4/story/[chapter]">) {
  const chapter = getChapter((await params).chapter);
  if (!chapter) notFound();
  const { prev, next } = chapterNeighbours(chapter.slug);
  const last = CHAPTERS.length - 1;

  return (
    <>
      <SectionNav part="story" />
      <StageRail active={chapter.stages} chapter={chapter.number} />

      <PageHeader
        eyebrow={
          <>
            {label(chapter.number)}
            {chapter.number > 0 && ` of ${last}`} · {chapter.when}
          </>
        }
        title={chapter.title}
        lead={chapter.logline}
      >
        {chapter.gates.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {chapter.gates.map((g) => {
              const gate = gateById(g);
              return (
                <li key={g}>
                  <Link
                    href={href.gate(g)}
                    className="inline-flex items-center gap-2 rounded-full border border-red-600/40 bg-red-600/5 px-3 py-1 text-sm hover:bg-red-600/10 dark:border-red-500/40"
                  >
                    <GateFlag id={g} plain />
                    {gate.name}
                    <span className="text-muted-foreground">· {gate.ownerLabel}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </PageHeader>

      <section className="flex flex-col gap-3" aria-label="Who is on stage">
        <CastLine cast={chapter.cast} />
      </section>

      <article className="flex max-w-prose flex-col gap-5 font-serif text-[1.05rem] leading-8">
        {chapter.text.map((t, i) => (
          <Prose key={i} text={t} />
        ))}
      </article>

      {chapter.artefacts.length > 0 && (
        <section className="flex flex-col gap-4">
          <SectionTitle>What it left behind</SectionTitle>
          <div className="grid grid-cols-1 gap-4">
            {chapter.artefacts.map((a) => (
              <ArtefactCard key={a.title} artefact={a} />
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <SectionTitle>Who held the pen</SectionTitle>
        <Ledger decided={chapter.decided} delegated={chapter.delegated} />
        <CastList cast={chapter.cast} agents={chapter.agents} />
        <Legend />
      </section>

      {chapter.repoNote && <Callout title="The chart and the repository">{chapter.repoNote}</Callout>}

      <p className="text-sm text-muted-foreground">
        In the reference:{" "}
        {chapter.stages.map((s, i) => (
          <span key={s}>
            {i > 0 && ", "}
            <Link href={href.stage(s)} className="underline underline-offset-2 hover:text-foreground">
              the {stageById(s).name} stage
            </Link>
          </span>
        ))}
        {chapter.gates.length > 0 && (
          <>
            {" "}and{" "}
            <Link href={href.gates} className="underline underline-offset-2 hover:text-foreground">
              the gates
            </Link>
          </>
        )}
        .
      </p>

      <PrevNext
        prev={
          prev
            ? { href: href.chapter(prev.slug), label: prev.title, hint: label(prev.number) }
            : { href: href.story, label: "All chapters", hint: "The story" }
        }
        next={
          next
            ? { href: href.chapter(next.slug), label: next.title, hint: label(next.number) }
            : { href: href.overview, label: "The 30,000-foot view", hint: "Part 2" }
        }
      />
    </>
  );
}
