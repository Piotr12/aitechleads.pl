import type { ReactNode } from "react";
import { Frame } from "./frame";
import { ChapterMap } from "./lane-map";
import { Cast, Know, SkillChip } from "./marks";
import { SKILLS } from "../_data/skills";
import { CHAPTERS, chapter, chapterHref } from "../_data/story";

/**
 * The shape every chapter shares: who is on stage and which skills it introduces, the chapter's own content,
 * then "What you now know" and the lane map, grown by this chapter's skills.
 */
export function ChapterShell({ slug, know, children }: { slug: string; know: ReactNode[]; children: ReactNode }) {
  const c = chapter(slug);
  const fresh = SKILLS.filter((s) => s.ch === c.n && !s.optional);

  return (
    <Frame
      href={chapterHref(c)}
      kicker={`Chapter ${c.n} of ${CHAPTERS.length} · ${c.when}`}
      title={c.title}
      lead={c.idea}
    >
      <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">On stage</span>
          <Cast ids={c.cast} />
        </div>
        {fresh.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              New skills ({fresh.length})
            </span>
            <ul className="flex flex-wrap gap-1">
              {fresh.map((s) => (
                <li key={s.name} className="min-w-0 max-w-full">
                  <SkillChip name={s.name} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {children}

      <Know items={know} />
      <ChapterMap upTo={c.n} />
    </Frame>
  );
}
