import { Frame } from "../_components/frame";
import { cn } from "../_components/cx";
import { AGENT, H2, InternalLink, LabelChip, PERSON } from "../_components/marks";
import { Md } from "../_components/md";
import { meta } from "../_data/nav";

export const metadata = meta("Five kinds of moving parts");

function Pin({ n }: { n: number }) {
  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background" aria-label={`part ${n}`}>
      {n}
    </span>
  );
}

const PARTS: { n: number; name: string; what: string; count: string; more: string; href: string }[] = [
  {
    n: 1,
    name: "Skills",
    what: "Instruction sets an agent follows, one folder each: `skills/<name>/SKILL.md`. They carry the work.",
    count: "42",
    more: "`om-auto-*` skills run unattended from start to finish; the rest act once, may ask you something, and hand back. A few exist mainly for other skills to call.",
    href: "/docs6/skills",
  },
  {
    n: 2,
    name: "Artefacts",
    what: "The forms the work takes, and the trail it leaves: brief file, issue, spec, plan, PR body, comments, screenshots, changelog line.",
    count: "a dozen kinds",
    more: "The skills' claim, label and summary comments carry a 🤖 and the skill's name, so you can tell who wrote what.",
    href: "/docs6/hood/markers",
  },
  {
    n: 3,
    name: "Labels",
    what: "The work's state, readable by people and skills alike. On a PR, exactly one pipeline label says where it is.",
    count: "5 groups",
    more: "Pipeline (one at a time), category, meta signals such as `needs-qa`, one priority, one risk.",
    href: "/docs6/hood/labels",
  },
  {
    n: 4,
    name: "The rulebook",
    what: "`.ai/agentic.config.json` for the skills and `SDLC.md` for the people: two descriptions of the same process.",
    count: "2 files (+ a few)",
    more: "Nearly every skill reads the config before doing anything. Change the process there, not inside the skills.",
    href: "/docs6/hood/rulebook",
  },
  {
    n: 5,
    name: "People",
    what: "Product person, designer, developer, reviewer, QA reviewer, maintainer. They start runs and make the calls.",
    count: "6 kinds",
    more: "Agents never merge on their own and never grant QA approval, except one narrow, documented exception.",
    href: "/docs6/people",
  },
];

export default function KitPage() {
  return (
    <Frame
      href="/docs6/kit"
      title="Five kinds of moving parts"
      idea="Skills carry the work, artefacts and labels travel with it, the rulebook tells every skill how to behave, and people decide."
      lead={<p>Before following the work, meet what moves it. Here is one pull request from later in the trip, with everything that is attached to it, numbered by kind.</p>}
    >
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr]">
        <figure className="flex min-w-0 flex-col self-start overflow-hidden rounded-xl border-2 border-dashed border-foreground/25 bg-card">
          <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-foreground/25 bg-muted/40 px-3 py-2 text-xs">
            <span className="font-medium">PR #421 on the tracker, stop 7 of the trip</span>
            <span className="rounded-full border px-2 py-0.5 font-medium tracking-wide text-muted-foreground uppercase">Illustrative</span>
          </figcaption>
          <div className="flex flex-col gap-3 p-3 text-sm sm:p-4">
            <p className="flex items-start gap-2 font-semibold break-words">
              <Pin n={2} /> feat(orders): bulk-archive orders from the grid (#412)
            </p>
            <div className="flex items-start gap-2">
              <Pin n={3} />
              <span className="flex flex-wrap gap-1">
                {["merge-queue", "feature", "needs-qa", "qa-approved", "priority-medium", "risk-medium"].map((l) => (
                  <LabelChip key={l} name={l} />
                ))}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Pin n={4} />
              <span className="text-xs text-muted-foreground">
                base: <code className="font-mono">main</code>, from <code className="font-mono">baseBranch: &quot;auto&quot;</code> in the
                config · gate: <code className="font-mono">validation.commands</code> ✅
              </span>
            </div>
            <pre className="flex flex-col overflow-x-auto rounded-lg border bg-muted/40 p-2 font-mono text-[12px] leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]">
              <span className="flex items-start gap-2"><Pin n={2} /><span>{"Closes #412\nRefs #418\nTracking plan: .ai/runs/2026-10-21-bulk-archive-orders.md\nStatus: complete"}</span></span>
            </pre>
            <ul className="flex flex-col gap-2 text-xs">
              {[
                { n: 1, who: "agent", text: "🤖 `om-auto-review-pr` taking over the chain lock — review." },
                { n: 1, who: "agent", text: "🤖 `om-auto-review-pr` — 🏷️ label rationale (one line per label)" },
                { n: 1, who: "agent", text: "## 🤖 `om-auto-create-pr` — run summary" },
                { n: 1, who: "agent", text: "📸 screenshots + pass/fail report from `om-auto-qa-pr`" },
                { n: 5, who: "person", text: "QA reviewer: ✅ QA passed on staging. … QA head: 3f9c2e1" },
              ].map((c) => (
                <li key={c.text} className={cn("flex items-start gap-2 rounded-md border px-2 py-1.5", c.who === "person" ? PERSON : AGENT)}>
                  <Pin n={c.n} />
                  <span className="min-w-0 break-words">
                    <Md text={c.text} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </figure>

        <ol className="flex min-w-0 flex-col gap-3">
          {PARTS.map((p) => (
            <li key={p.n} className="flex min-w-0 gap-3 rounded-xl border bg-card p-3">
              <Pin n={p.n} />
              <div className="flex min-w-0 flex-col gap-1 text-sm">
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.count}</span>
                </p>
                <p>
                  <Md text={p.what} />
                </p>
                <p className="text-muted-foreground">
                  <Md text={p.more} />
                </p>
                <p className="text-xs">
                  <InternalLink href={p.href}>More on {p.name.toLowerCase()}</InternalLink>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <H2>One rule of thumb</H2>
        <p className="max-w-3xl text-sm leading-relaxed">
          If you want to know where some work stands, read its labels and its newest 🤖 comment. If you want to know{" "}
          <em>why</em> a skill behaved as it did, read the rulebook. If you want to know <em>who may change that</em>,
          it is the maintainer.
        </p>
      </section>
    </Frame>
  );
}
