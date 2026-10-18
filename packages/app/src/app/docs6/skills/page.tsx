import { Bot, MessagesSquare } from "lucide-react";
import Link from "../_components/link";
import { Frame } from "../_components/frame";
import { cn } from "../_components/cx";
import { AGENT, H2, SkillChip, Source } from "../_components/marks";
import { Md } from "../_components/md";
import { meta } from "../_data/nav";
import { PLACE_NAMES, SKILLS, type Place } from "../_data/skills";

export const metadata = meta("Every skill, by where it touches the work");

const ORDER: { place: Place; href: string }[] = [
  { place: "setup", href: "/docs6/hood/rulebook" },
  { place: "product", href: "/docs6/onramps/product" },
  { place: "idea", href: "/docs6/journey/idea" },
  { place: "issue", href: "/docs6/journey/issue" },
  { place: "spec", href: "/docs6/journey/spec" },
  { place: "pickup", href: "/docs6/journey/pickup" },
  { place: "build", href: "/docs6/journey/build" },
  { place: "review", href: "/docs6/journey/review" },
  { place: "qa", href: "/docs6/journey/qa" },
  { place: "merge", href: "/docs6/journey/merge" },
  { place: "after", href: "/docs6/journey/after" },
];

export default function SkillsPage() {
  const auto = SKILLS.filter((s) => s.kind === "auto").length;
  return (
    <Frame
      href="/docs6/skills"
      title="Every skill, by where it touches the work"
      idea={`All ${SKILLS.length} skills, sorted by the point on the road where they pick the work up. You will type perhaps a dozen of them; the rest are called for you.`}
      lead={
        <p>
          {auto} are autonomous (<code className="font-mono">om-auto-*</code>, plus <code className="font-mono">om-pr-autopilot</code>
          ); the rest are interactive. “Called by other skills” marks the building blocks you rarely type yourself. Every
          name links to its <code className="font-mono">SKILL.md</code>.
        </p>
      }
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className={cn("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5", AGENT)}>
          <Bot className="size-3" aria-hidden /> autonomous
        </span>
        <span className="inline-flex items-center gap-1 rounded-md border bg-card px-1.5 py-0.5">
          <MessagesSquare className="size-3" aria-hidden /> interactive
        </span>
      </div>

      {ORDER.map(({ place, href }) => {
        const list = SKILLS.filter((s) => s.place === place);
        return (
          <section key={place} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <H2>
                {PLACE_NAMES[place]} <span className="text-sm font-normal text-muted-foreground">· {list.length}</span>
              </H2>
              <Link href={href} className="text-xs underline">
                see it on the road
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {list.map((s) => (
                <li key={s.name} className="flex min-w-0 flex-col gap-1.5 rounded-lg border bg-card p-3 text-sm">
                  <span className="flex flex-wrap items-center gap-2">
                    <SkillChip name={s.name} />
                    {s.inner && <span className="text-[11px] text-muted-foreground">called by other skills</span>}
                  </span>
                  <span className="text-muted-foreground">
                    <Md text={s.one} />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="text-xs text-muted-foreground">
        The README still says “forty-one”: the 42nd, <code className="font-mono">om-qa-buddy</code>, is in{" "}
        <code className="font-mono">skills/</code> but has no card in <code className="font-mono">docs/skills/</code> yet.
        Source: <Source path="skills">skills/</Source> <Source path="docs/skills/README.md" />
      </p>
    </Frame>
  );
}
