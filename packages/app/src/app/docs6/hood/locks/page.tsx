import { Lock, LockOpen, Timer } from "lucide-react";
import { Frame } from "../../_components/frame";
import { cn } from "../../_components/cx";
import { AGENT, Callout, H2, InternalLink, LabelChip, Source } from "../../_components/marks";
import { Md } from "../../_components/md";
import { meta } from "../../_data/nav";

export const metadata = meta("Who is holding it right now");

const COMMENTS: { name: string; when: string; text: string }[] = [
  { name: "Claim", when: "before any work, by the skill taking the item", text: "🤖 Claiming this PR — starting `om-auto-review-pr` run. Started: 2026-10-21T14:02:11Z." },
  { name: "Hand-off", when: "inside a chain: the finishing skill keeps the lock in place", text: "🤖 `om-open-pr` completed: PR opened. Lock handed off to `om-auto-review-pr` — chain continues on this PR." },
  { name: "Take-over", when: "the next skill in the chain, before it does anything else", text: "🤖 `om-auto-review-pr` taking over the chain lock — review. Started: 2026-10-21T14:02:11Z." },
  { name: "Release", when: "when the run that opened the lock is done, on success or failure", text: "🤖 `om-auto-review-pr` completed: APPROVED. Lock released." },
];

const TIMELINE: { t: string; what: string; lock: "held" | "free" | "ci"; labels?: { add?: string[]; remove?: string[] } }[] = [
  { t: "14:02", what: "`om-auto-review-pr` claims PR #421: assigns itself, adds the label, posts the claim comment.", lock: "held", labels: { add: ["in-progress"] } },
  { t: "14:19", what: "Review submitted, labels moved, rationale comment updated. Work done, so the lock goes, and a CI follow-up is still owed.", lock: "ci", labels: { add: ["ci-monitoring", "merge-queue"], remove: ["in-progress", "review"] } },
  { t: "14:31", what: "CI finishes green. The CI-result comment is posted; nothing more is owed.", lock: "free", labels: { remove: ["ci-monitoring"] } },
];

export default function LocksPage() {
  return (
    <Frame
      href="/docs6/hood/locks"
      title="Who is holding it right now"
      idea="Before touching an issue or PR, a skill claims it with three visible signals; anyone who sees a claim backs off, and inside a chain the claim is passed on, never dropped."
      lead={<p>Several agents (and people) can work the same repository at once. The claim is how they avoid stepping on each other, and how you can see at a glance whether something is being worked on.</p>}
    >
      <section className="flex flex-col gap-3">
        <H2>A claim is three signals at once</H2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {[
            ["Assignee", "the automation account (or person) doing the work"],
            ["in-progress", "the label: actively working, right now"],
            ["🤖 claim comment", "which skill, and when it started"],
          ].map(([k, v]) => (
            <div key={k} className={cn("flex min-w-0 flex-col gap-1 rounded-xl border p-3 text-sm", AGENT)}>
              <span className="flex items-center gap-1.5 font-semibold">
                <Lock className="size-4" aria-hidden />
                {k === "in-progress" ? <LabelChip name="in-progress" /> : k}
              </span>
              <span>{v}</span>
            </div>
          ))}
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Any one of these, pointing at somebody else, means “in progress”: the skill stops and reports the owner, or
          asks you. An open PR that already references an issue counts too. Merge tooling skips a PR carrying{" "}
          <code className="font-mono">in-progress</code>.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <H2>The four comments you will see</H2>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {COMMENTS.map((c) => (
            <li key={c.name} className="flex min-w-0 flex-col gap-1.5 rounded-xl border bg-card p-3">
              <p className="text-sm">
                <span className="font-semibold">{c.name}</span> <span className="text-muted-foreground">· {c.when}</span>
              </p>
              <p className="rounded-md border bg-muted/40 px-2 py-1.5 text-[13px] break-words">
                <Md text={c.text} />
              </p>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Exact templates, with illustrative names and times filled in. A run that fails after claiming still releases
          the lock from a finally-block, with a comment saying why (for <code className="font-mono">om-auto-fix-issue</code>:
          “aborted: … Lock released.”), so even a crash leaves no orphaned claim.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <H2>One review on PR #421, as the tracker shows it</H2>
        <ol className="flex flex-col gap-2">
          {TIMELINE.map((e) => (
            <li key={e.t} className="grid grid-cols-1 gap-2 rounded-xl border bg-card p-3 text-sm md:grid-cols-[3.5rem_1fr_13rem] md:items-start md:gap-3">
              <span className="font-mono text-xs text-muted-foreground">{e.t}</span>
              <div className="flex min-w-0 flex-col gap-1.5">
                <span>
                  <Md text={e.what} />
                </span>
                <span className="flex flex-wrap gap-1">
                  {e.labels?.add?.map((l) => (
                    <span key={l} className="inline-flex items-center gap-0.5 text-xs">
                      + <LabelChip name={l} />
                    </span>
                  ))}
                  {e.labels?.remove?.map((l) => (
                    <span key={l} className="inline-flex items-center gap-0.5 text-xs">
                      − <LabelChip name={l} struck />
                    </span>
                  ))}
                </span>
              </div>
              <span className="md:justify-self-end">
                {e.lock === "held" ? (
                  <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", AGENT)}>
                    <Lock className="size-3.5" aria-hidden /> claimed: others back off
                  </span>
                ) : e.lock === "ci" ? (
                  <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
                    <Timer className="size-3.5" aria-hidden /> free, CI result owed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
                    <LockOpen className="size-3.5" aria-hidden /> free
                  </span>
                )}
              </span>
            </li>
          ))}
        </ol>
        <p className="text-xs text-muted-foreground">Illustrative timeline. The CI wait is capped by <code className="font-mono">ci.maxWaitMinutes</code> (default 40); on timeout the skill posts its local validation results instead, says no further follow-up will come, and drops <code className="font-mono">ci-monitoring</code>.</p>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Callout title="ci-monitoring is not a claim">
          <p>It only says a CI-result comment is still owed. Anyone, person or agent, may pick the PR up.</p>
        </Callout>
        <Callout title="Taking over">
          <p>
            <code className="font-mono">--force</code> bypasses a conflict but never silently: it posts an override comment
            naming the previous owner. A stale claim is taken over with a note saying so.
          </p>
        </Callout>
        <Callout title="Inside a chain">
          <p>
            The lock moves (hand-off, then take-over) and is released once, by the skill driving the chain. See it travel
            on the <InternalLink href="/docs6/onramps/bug">bug on-ramp</InternalLink>.
          </p>
        </Callout>
      </section>

      <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        Checked against: <Source path="skills/om-auto-create-pr/references/claim-pr.md" /> <Source path="SDLC.md">SDLC.md, “The claim protocol”</Source>
      </p>
    </Frame>
  );
}
