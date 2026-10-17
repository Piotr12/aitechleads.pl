import Link from "../_components/link";
import { Frame } from "../_components/frame";
import { MarkLegend, RepoNote, SkillChip } from "../_components/marks";
import { meta } from "../_data/meta";
import { TRACKS, ZOOM } from "../_data/nav";

export const metadata = meta("How this guide works");

const RULES = [
  {
    emoji: "🧅",
    title: "One new idea per page",
    text: "The Zoom track adds exactly one idea per page to the same picture. Nothing is used before it is introduced.",
  },
  {
    emoji: "👀",
    title: "Picture first, words second",
    text: "Each page leads with a diagram. The text under it is there for when the picture is not enough.",
  },
  {
    emoji: "📌",
    title: "One thing to remember",
    text: "Every zoom level ends with a single sentence in a box. If you skim, read those.",
  },
  {
    emoji: "🧭",
    title: "You always know where you are",
    text: "The bar at the top shows the six tracks, the numbered pages of the current one, and a thin line for how far through the whole guide you are.",
  },
];

export default function GuidePage() {
  return (
    <Frame
      href="/docs5/guide"
      title="How this guide works"
      lead={<p>Six tracks. Read the first two in order; dip into the rest when you need them.</p>}
    >
      <section aria-labelledby="tracks" className="flex flex-col gap-3">
        <h2 id="tracks" className="text-xl font-semibold">
          The six tracks
        </h2>
        <ol className="flex flex-col gap-2">
          {TRACKS.map((t, i) => (
            <li key={t.id}>
              <Link
                href={t.href}
                className="flex min-w-0 items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                  {i + 1}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-semibold">
                    <span aria-hidden>{t.emoji}</span> {t.name}
                  </span>
                  <span className="text-sm text-muted-foreground">{t.blurb}</span>
                  {t.id === "zoom" && (
                    <span className="mt-1 flex flex-wrap gap-1 text-xs text-muted-foreground">
                      {ZOOM.map((z, zi) => (
                        <span key={z.slug} className="rounded-full border px-2 py-0.5">
                          {zi + 1}. {z.title}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="rules" className="flex flex-col gap-3">
        <h2 id="rules" className="text-xl font-semibold">
          House rules of this guide
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {RULES.map((r) => (
            <li key={r.title} className="flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-4">
              <span className="font-semibold">
                <span aria-hidden>{r.emoji}</span> {r.title}
              </span>
              <span className="text-sm text-muted-foreground">{r.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="symbols" className="flex flex-col gap-3">
        <h2 id="symbols" className="text-xl font-semibold">
          The symbols (you will meet them one at a time)
        </h2>
        <MarkLegend />
        <p className="text-sm leading-7 text-muted-foreground">
          Skill names look like <SkillChip name="om-prepare-issue" /> and open their upstream page. A robot marks the
          ones that run on their own: <SkillChip name="om-auto-fix-issue" />
        </p>
      </section>

      <RepoNote title="Sources">
        The people and stops follow the “AI SDLC RACI” chart (who, with which skill, at which stage). The details
        follow the open-mercato/skills repo (README, SDLC.md, the role and skill pages). Where they disagree, this
        guide follows the repo and says so in a box like this one. The full list is on{" "}
        <Link href="/docs5/further" className="underline underline-offset-4">
          Further reading
        </Link>
        .
      </RepoNote>
    </Frame>
  );
}
