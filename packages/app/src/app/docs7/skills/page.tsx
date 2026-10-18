import { Frame } from "../_components/frame";
import Link from "../_components/link";
import { MapLegend } from "../_components/lane-map";
import { Avatar, Ext, KindIcon, SectionTitle } from "../_components/marks";
import { cn } from "../_components/cx";
import { FLOWS } from "../_data/flows";
import { PERSON, type PersonId } from "../_data/story";
import { meta, skillUrl, UP } from "../_data/links";
import { LANES, SKILLS } from "../_data/skills";
import { CHAPTERS, chapterHref } from "../_data/story";

export const metadata = meta("All 42 skills by purpose");

/** Who runs the skill directly, from the people's flows; building blocks are mostly run by other skills. */
const ALSO: Record<string, PersonId[]> = {
  "om-synthetic-users": ["product", "designer"],
  "om-mockup-prototype": ["product", "designer"],
  "om-backlog": ["product"],
  "om-spec-writing": ["product"],
  "om-auto-create-pr-loop": ["developer"],
  "om-auto-continue-pr-loop": ["developer"],
  "om-apply-upgrade-notes": ["maintainer"],
  "om-pr-autopilot": ["maintainer"],
  "om-code-review": ["reviewer"],
};

function WhoRuns({ name, block }: { name: string; block?: boolean }) {
  const ids = new Set<PersonId>([
    ...FLOWS.filter((f) => f.steps.some((st) => st.skill === name)).map((f) => f.id),
    ...(ALSO[name] ?? []),
  ]);
  const who = [...ids].map((id) => PERSON[id]);
  if (who.length === 0)
    return (
      <p className="text-xs text-muted-foreground">
        {block
          ? "Usually run for you by the bigger skills."
          : "For contributors to the skills collection itself."}
      </p>
    );
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
      Run by
      {who.map((p) => (
        <Link key={p.id} href={`/docs7/people/${p.id}`} className="inline-flex items-center gap-1 hover:underline">
          <Avatar id={p.id} size="sm" />
          {p.role}
        </Link>
      ))}
    </p>
  );
}

export default function Skills() {
  const autos = SKILLS.filter((s) => s.kind === "auto").length;
  return (
    <Frame
      href="/docs7/skills"
      kicker="Reference"
      title={`All ${SKILLS.length} skills by purpose`}
      lead={`Grouped by the lane of the map they serve. ${autos} are autonomous, ${SKILLS.length - autos} interactive. Each links to the chapter where the team meets it and to its card upstream.`}
    >
      <nav aria-label="Lanes" className="flex flex-wrap gap-1.5">
        {LANES.map((l, i) => (
          <a key={l.id} href={`#lane-${l.id}`} className="rounded-full border px-3 py-1 text-xs hover:bg-muted">
            <span className="tabular-nums opacity-60">{i + 1}</span> {l.name} ({SKILLS.filter((s) => s.lane === l.id).length})
          </a>
        ))}
      </nav>

      <MapLegend fresh={false} />

      {LANES.map((l, i) => {
        const list = SKILLS.filter((s) => s.lane === l.id);
        return (
          <section key={l.id} id={`lane-${l.id}`} className="flex scroll-mt-28 flex-col gap-3">
            <SectionTitle>
              <span className="text-muted-foreground tabular-nums">{i + 1}</span> {l.name}{" "}
              <span className="text-base font-normal text-muted-foreground">· {l.question}</span>
            </SectionTitle>
            <ul className="flex flex-col gap-2">
              {list.map((s) => {
                const c = CHAPTERS[s.ch - 1];
                return (
                  <li
                    key={s.name}
                    id={s.name}
                    className="grid scroll-mt-28 grid-cols-1 gap-2 rounded-xl border bg-card p-3 target:ring-2 target:ring-amber-500 md:grid-cols-[17rem_1fr_9rem]"
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <span
                        className={cn(
                          "inline-flex max-w-full items-center gap-1 self-start rounded-md border px-1.5 py-0.5 font-mono text-[12.5px] break-all",
                          s.kind === "auto"
                            ? "border-foreground bg-foreground text-background"
                            : "border-foreground/40",
                        )}
                      >
                        <KindIcon kind={s.kind} />
                        {s.name}
                      </span>
                      <span className="flex flex-wrap gap-1 text-[11px] text-muted-foreground">
                        <span>{s.kind === "auto" ? "autonomous" : "interactive"}</span>
                        {s.block && <span>· building block</span>}
                        {s.sweep && <span>· sweeps many items</span>}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-col gap-1">
                      <p className="text-sm leading-6">{s.does}</p>
                      <WhoRuns name={s.name} block={s.block} />
                    </div>
                    <div className="flex flex-row flex-wrap gap-x-3 gap-y-1 text-xs md:flex-col">
                      <Link href={chapterHref(c)} className="underline underline-offset-2">
                        Met in chapter {c.n}
                      </Link>
                      <Ext href={skillUrl(s.name)}>{s.name === "om-qa-buddy" ? "SKILL.md" : "card"}</Ext>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <section className="rounded-xl border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
        <p>
          <span className="font-semibold text-foreground">How these were counted.</span> The list is the{" "}
          <Ext href={`${UP.repo}/tree/main/skills`}>skills/</Ext> folder: 42 skills. The README still says
          &ldquo;forty-one&rdquo;; the newest, <span className="font-mono">om-qa-buddy</span>, has no card yet, so its
          link goes to its SKILL.md. One rule for &ldquo;autonomous&rdquo;: what each skill&apos;s card says. That is every{" "}
          <span className="font-mono">om-auto-*</span> skill plus <span className="font-mono">om-pr-autopilot</span>.
          The README&apos;s table also lists <span className="font-mono">om-review-prs</span> and{" "}
          <span className="font-mono">om-close-fixed-issues</span> as autonomous; their cards say interactive.
        </p>
      </section>
    </Frame>
  );
}
