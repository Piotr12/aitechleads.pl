import { ArrowDown } from "lucide-react";
import { STATIONS } from "../_data/stations";
import Link from "../_components/link";
import { Frame } from "../_components/frame";
import { cn } from "../_components/cx";
import { Cmd, H2, LabelRow, Source } from "../_components/marks";
import { Md } from "../_components/md";
import { meta } from "../_data/nav";

export const metadata = meta("Seven ways onto one road");

const RAMPS: { emoji: string; have: string; cmd: string; then: string; joins: string; at: number; href: string }[] = [
  { emoji: "💡", have: "A raw idea or a question", cmd: '/om-brainstorm "should we build bulk-archive?"', then: "One routing decision: an issue, a spec, a direct PR, or nothing at all.", joins: "stop 1", at: 1, href: "/docs6/journey/idea" },
  { emoji: "🧭", have: "A product, or a client's idea", cmd: '/om-discover --mode client "Benefits portal"', then: "A product brief, then `om-backlog` files epics and stories: many issues at once.", joins: "stop 2, many times", at: 2, href: "/docs6/onramps/product" },
  { emoji: "🎫", have: "A feature issue", cmd: "/om-auto-fix-issue 412", then: "The feature route: find or write the spec, then build it on its own PR.", joins: "stop 4", at: 4, href: "/docs6/journey/pickup" },
  { emoji: "🐛", have: "A bug report: an issue, or just a pasted description", cmd: "/om-auto-fix-issue 509", then: "The bug chain: verify, root cause, minimal fix with a regression test. A pasted description is filed as an issue first.", joins: "stop 4, other branch", at: 4, href: "/docs6/onramps/bug" },
  { emoji: "✍️", have: "A free-form task, no issue at all", cmd: '/om-auto-create-pr "add rate limiting to the login endpoint"', then: "Straight to a plan, a branch and a PR. No issue, no spec.", joins: "stop 5", at: 5, href: "/docs6/journey/build" },
  { emoji: "📐", have: "A spec that already exists", cmd: "/om-auto-implement-spec 2026-07-18-csv-export", then: "Found by path, name, issue or spec-PR number; built on its own PR.", joins: "stop 5", at: 5, href: "/docs6/journey/build" },
  { emoji: "🧩", have: "A PR that stalled, or one somebody opened by hand", cmd: "/om-pr-autopilot 421", then: "Diagnose what is left, then run the matching skills. A PR with no plan gets one reconstructed.", joins: "stop 5 or 6", at: 5, href: "/docs6/onramps/stalled" },
];

/** Nine dots: the road. Stops before the entrance are skipped (faint), the entrance is marked, the rest is travelled. */
function MiniRoad({ at }: { at: number }) {
  return (
    <span className="flex items-center gap-1" aria-label={`joins the road at stop ${at} of 9`}>
      {STATIONS.map((s) => (
        <span
          key={s.id}
          title={`${s.n}. ${s.title}`}
          className={cn(
            "rounded-full",
            s.n < at && "size-2.5 border border-dashed border-foreground/30",
            s.n === at && "size-4 bg-foreground ring-2 ring-foreground/25",
            s.n > at && "size-2.5 bg-foreground/50",
          )}
        />
      ))}
    </span>
  );
}

export default function OnrampsPage() {
  return (
    <Frame
      href="/docs6/onramps"
      title="Seven ways onto one road"
      idea="Work can enter as an idea, a product, an issue, a bug, a task, a spec or a half-finished PR, but every entrance ends at the same place: a ready, fully labelled PR in review."
      lead={<p>Our parcel took the long way round, from a hunch. Most work joins the road further along. Find what you are holding on the left; the nine dots on the right are the stops of the journey, and the big one is where your work joins it.</p>}
    >
      <section className="flex flex-col gap-4">
        <ol className="flex flex-col gap-2">
          {RAMPS.map((r) => (
            <li key={r.have}>
              <Link
                href={r.href}
                className="grid grid-cols-1 gap-2 rounded-xl border bg-card p-3 transition-colors hover:bg-muted/50 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_9.5rem] md:items-center md:gap-4"
              >
                <span className="flex min-w-0 items-start gap-2">
                  <span className="text-xl" aria-hidden>
                    {r.emoji}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="font-medium">{r.have}</span>
                    <span className="text-sm text-muted-foreground">
                      <Md text={r.then} />
                    </span>
                  </span>
                </span>
                <Cmd>{r.cmd}</Cmd>
                <span className="flex flex-col gap-1 md:items-end">
                  <MiniRoad at={r.at} />
                  <span className="text-xs font-medium">joins at {r.joins}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <div className="flex justify-center text-muted-foreground" aria-hidden>
          <ArrowDown className="size-6" />
        </div>

        <div className={cn("flex flex-col gap-3 rounded-xl border-2 border-foreground bg-card p-4 sm:p-5")}>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Where every entrance ends</p>
          <p className="text-lg font-semibold">A ready, fully labelled PR in review</p>
          <LabelRow labels={["review", "feature", "needs-qa", "priority-medium", "risk-medium"]} />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Ready means not a draft. Fully labelled means one pipeline label, a category, a QA signal, one priority and
            one risk. It also carries a run-summary comment, and screenshots from the working app when people will see
            the change. From here, everything follows the same stops:{" "}
            <Link className="font-medium text-foreground underline" href="/docs6/journey/review">review</Link>,{" "}
            <Link className="font-medium text-foreground underline" href="/docs6/journey/qa">QA</Link>,{" "}
            <Link className="font-medium text-foreground underline" href="/docs6/journey/merge">merge</Link> and{" "}
            <Link className="font-medium text-foreground underline" href="/docs6/journey/after">tidy-up</Link>.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <H2>Why they can converge</H2>
        <p className="max-w-3xl text-sm leading-relaxed">
          Each autonomous skill accepts what the previous one produced (an issue number, a spec path, a PR number) and
          checks for work already started before starting its own. So an issue that already has a PR gets that PR
          continued, a spec that already has an implementation PR gets it resumed, and nothing is built twice.
        </p>
        <p className="text-xs text-muted-foreground">
          Source: <Source path="SDLC.md">SDLC.md, “The automation contract”</Source>
        </p>
      </section>
    </Frame>
  );
}
