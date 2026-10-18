import { Check, X } from "lucide-react";
import { cn } from "./cx";
import { Box, Branch, Branches, Down, FlowKey } from "./flow";
import { Md } from "./md";
import { DECIDE, H2, InternalLink, LabelChip, PERSON, Specimen } from "./marks";
import type { StationId } from "../_data/stations";

/** The one station-specific picture each journey page carries, next to its hand-off slip. */
export function StationExtra({ id }: { id: StationId }) {
  switch (id) {
    case "idea":
      return <Exits />;
    case "issue":
      return <ReadyTiers />;
    case "spec":
      return <TwoPrs />;
    case "pickup":
      return <Fork />;
    case "build":
      return <Plan />;
    case "review":
      return <ReviewLoop />;
    case "qa":
      return <Gate />;
    case "merge":
      return <WhoMerges />;
    case "after":
      return <LooseEnds />;
  }
}

function Exits() {
  const rows = [
    ["1", "The question is answered, or nothing is worth building", "Next: none"],
    ["2", "Worth capturing, not now", 'Next: om-prepare-issue "<goal> — brief: <path>"'],
    ["3", "A feature, and the blocking unknowns are resolved", 'Next: om-auto-write-spec "<goal> — brief: <path>"'],
    ["4", "A feature you want to co-design", 'Next: om-spec-writing "<goal> — brief: <path>"'],
    ["5", "A small, well-understood change", 'Next: om-auto-create-pr "<task> — brief: <path>"'],
    ["6", "Already tracked", "Next: om-auto-fix-issue <issueId>"],
  ];
  return (
    <section className="flex flex-col gap-3">
      <H2>Six exits from the conversation</H2>
      <p className="text-sm text-muted-foreground">
        Every brainstorm ends on exactly one of these. Our work takes exit 2: worth an issue now, built later.
      </p>
      <ol className="flex flex-col gap-2">
        {rows.map(([n, what, next]) => (
          <li
            key={n}
            className={cn(
              "grid grid-cols-1 gap-1 rounded-lg border p-3 text-sm sm:grid-cols-[2rem_1fr_1.4fr] sm:items-center sm:gap-3",
              n === "2" ? "border-2 border-foreground bg-card" : "bg-card/50",
            )}
          >
            <span className="font-semibold tabular-nums">{n}</span>
            <span className="min-w-0">
              {what}
              {n === "2" && <span className="ml-2 rounded-full bg-foreground px-2 py-0.5 text-[11px] text-background">our work</span>}
            </span>
            <code className="min-w-0 font-mono text-xs [overflow-wrap:anywhere] text-muted-foreground">{next}</code>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ReadyTiers() {
  return (
    <section className="flex flex-col gap-3">
      <H2>When is an issue “ready”? Two tiers</H2>
      <p className="text-sm text-muted-foreground">
        From the Definition of Ready in <code className="font-mono">SDLC.md</code>. A spec can supply the second tier,
        never the first.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className={cn("flex min-w-0 flex-col gap-2 rounded-xl border p-4", PERSON)}>
          <p className="font-semibold">Ticket level: only a person can supply</p>
          <ul className="flex list-disc flex-col gap-1 pl-4 text-sm">
            <li>the problem, and who has it</li>
            <li>the expected outcome, and how it will be checked</li>
            <li>what is out of scope</li>
            <li>open questions, each blocking or not; none blocking left open</li>
            <li>any autonomous assumption confirmed by a person</li>
          </ul>
          <p className="text-xs">Missing? The feature route stops with <code className="font-mono">NOT_READY</code>.</p>
        </div>
        <div className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-4">
          <p className="font-semibold">Spec level: a spec supplies, or gets written</p>
          <ul className="flex list-disc flex-col gap-1 pl-4 text-sm">
            <li>acceptance criteria and business rules</li>
            <li>the happy path and the main unhappy paths</li>
            <li>impact on data and permissions</li>
            <li>dependencies</li>
            <li>a link to mockups, when the change is user-facing</li>
          </ul>
          <p className="text-xs text-muted-foreground">
            Missing? Not a stop: <code className="font-mono">om-auto-write-spec</code> authors it.
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        For a bug, ready means reproducible: <code className="font-mono">om-verify-in-repo</code> is that gate. A
        maintainer may waive an item by saying so on the ticket.
      </p>
    </section>
  );
}

function TwoPrs() {
  const rows: [string, string, string][] = [
    ["Holds", "the spec and its mockups only", "the code and its tests"],
    ["Branch", "`spec/bulk-archive-orders`", "`feat/bulk-archive-orders`"],
    ["Links the issue with", "`Refs #412`: merging must not close it", "`Closes #412`: merging closes it"],
    ["Links the other PR", "gets a 🔁 comment pointing at #421", "`Refs #418` and `Source doc:`"],
    ["QA", "`skip-qa`: a document", "`needs-qa`: people will see it"],
    ["Review", "five design lenses", "the code checklist"],
  ];
  return (
    <section className="flex flex-col gap-3">
      <H2>Two PRs, two jobs</H2>
      <p className="text-sm text-muted-foreground">
        The spec never grows into an implementation. The code that builds it arrives later, on a PR of its own.
      </p>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="bg-muted/50 text-left text-xs">
            <tr>
              <th className="p-2 font-medium" />
              <th className="p-2 font-semibold">📐 Spec PR #418</th>
              <th className="p-2 font-semibold">🛠️ Implementation PR #421 (stop 5)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([k, a, b]) => (
              <tr key={k} className="border-t align-top">
                <th className="p-2 text-left text-xs font-medium text-muted-foreground">{k}</th>
                <td className="p-2">
                  <Md text={a} />
                </td>
                <td className="p-2">
                  <Md text={b} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Fork() {
  return (
    <section className="flex flex-col gap-3">
      <H2>The fork, drawn</H2>
      <FlowKey />
      <div className="flex flex-col rounded-xl border bg-card/50 p-3 sm:p-4">
        <Box tone="person" title="A developer runs `/om-auto-fix-issue 412`" />
        <Down />
        <Box tone="agent" title="Claim check: is anyone else on it?">
          Another actor holds it: stop and ask. `--force` overrides, with a comment.
        </Box>
        <Down />
        <Box tone="agent" title="Classify: bug or feature?">
          Label first, then the wording. When unsure: bug (its gate stops cleanly). Both at once: a person splits it.
        </Box>
        <Down />
        <Branches>
          <Branch label="Bug">
            <Box tone="agent" title="`om-verify-in-repo`: real, and still unfixed?" />
            <Down label="yes" />
            <Box tone="agent" title="`om-root-cause` → `om-fix` → `om-open-pr`" />
            <Down />
            <Box tone="plain" title="A bug-fix PR in review">
              <InternalLink href="/docs6/onramps/bug">The bug on-ramp</InternalLink>
            </Box>
            <div className="mt-2">
              <Box tone="stop" title="`NO_ACTION_NEEDED`: already fixed, in flight, or not a bug" />
            </div>
          </Branch>
          <Branch label="Feature (our work)">
            <Box tone="agent" title="Readiness gate: ticket-level Definition of Ready" />
            <div className="my-2">
              <Box tone="stop" title="`NOT_READY`: a comment names the gaps" />
            </div>
            <Down label="ready" />
            <Box tone="agent" title="Find the spec">
              Linked from the issue, in `.ai/specs/`, or on an open spec PR.
            </Box>
            <Down />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Box tone="agent" here title="Found (#418): `om-auto-implement-spec`" />
              <Box tone="agent" title="None: `om-auto-write-spec`, then `om-auto-implement-spec`" />
            </div>
          </Branch>
        </Branches>
      </div>
    </section>
  );
}

function Plan() {
  return (
    <section className="flex flex-col gap-3">
      <H2>The plan is the resume button</H2>
      <p className="text-sm text-muted-foreground">
        The first commit on the branch. Each step is ticked with its commit SHA as it lands; the first unticked line is
        where any later run (<code className="font-mono">om-auto-continue-pr</code>) picks up.
      </p>
      <Specimen kind=".ai/runs/2026-10-21-bulk-archive-orders.md" title="the end of the plan, mid-run">{`## Progress

> Convention: \`- [ ]\` pending, \`- [x]\` done. Append \` — <commit sha>\` when a step lands. Do not rename step titles.

### Phase 1: Archive many orders in one call

- [x] 1.1 Add bulk archive to the orders service — 8a41c07
- [x] 1.2 Expose it on the orders API — 1d9e5b2

### Phase 2: Select and archive from the grid

- [ ] 2.1 Row selection in the orders grid
- [ ] 2.2 Archive action with confirmation`}</Specimen>
    </section>
  );
}

function ReviewLoop() {
  return (
    <section className="flex flex-col gap-3">
      <H2>The loop, in labels</H2>
      <div className="flex flex-col items-start gap-3 rounded-xl border bg-card/50 p-4 text-sm sm:flex-row sm:items-center sm:flex-wrap">
        <LabelChip name="review" />
        <span className="flex flex-col text-xs text-muted-foreground">
          <span>→ request changes →</span>
          <span>← fixed, re-review ←</span>
        </span>
        <LabelChip name="changes-requested" />
        <span className="text-xs text-muted-foreground sm:mx-2">… and when it is clean:</span>
        <span className="flex items-center gap-2">
          <LabelChip name="review" />
          <span className="text-xs text-muted-foreground">→ approve →</span>
          <LabelChip name="merge-queue" />
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        A PR carries at most one of these at a time. The whole machine, with QA and the hard blocks, is on{" "}
        <InternalLink href="/docs6/hood/labels">Labels are the PR&apos;s state machine</InternalLink>.
      </p>
    </section>
  );
}

function Gate() {
  const rows: { labels: string[]; ok: boolean; why: string }[] = [
    { labels: ["merge-queue", "needs-qa"], ok: false, why: "approved in review, but QA has not signed off" },
    { labels: ["qa", "needs-qa"], ok: false, why: "a tester is on it right now: never merge under an active tester" },
    { labels: ["merge-queue", "needs-qa", "qa-approved"], ok: true, why: "the gate is satisfied (if the `QA head:` matches the PR's head)" },
    { labels: ["merge-queue", "skip-qa"], ok: true, why: "no QA needed: docs, dependencies, CI or tests only" },
    { labels: ["qa-failed", "needs-qa"], ok: false, why: "a hard block: back to the author" },
  ];
  return (
    <section className="flex flex-col gap-3">
      <H2>The gate, as a truth table</H2>
      <ul className="flex flex-col gap-2">
        {rows.map((r) => (
          <li key={r.labels.join()} className="flex min-w-0 flex-wrap items-center gap-2 rounded-lg border bg-card p-3 text-sm">
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                r.ok ? "bg-foreground text-background" : DECIDE,
              )}
            >
              {r.ok ? <Check className="size-3.5" aria-hidden /> : <X className="size-3.5" aria-hidden />}
              {r.ok ? "may merge" : "cannot merge"}
            </span>
            <span className="flex flex-wrap gap-1">
              {r.labels.map((l) => (
                <LabelChip key={l} name={l} />
              ))}
            </span>
            <span className="min-w-40 flex-1 text-muted-foreground">
              <Md text={r.why} />
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        Plus the rest of the merge gates: an approving review, genuinely green required checks, no conflict, and no{" "}
        <code className="font-mono">blocked</code> or <code className="font-mono">do-not-merge</code>.
      </p>
    </section>
  );
}

function WhoMerges() {
  const rows: [string, string][] = [
    ["om-auto-fix-pr", "drives a PR to merge-ready, then hands it over. Never merges."],
    ["om-pr-autopilot", "stops at merge-ready, unless you pass `--allow-merge`."],
    ["om-merge-buddy", "only reports what could merge."],
    ["om-auto-review-pr", "approves; approval moves the PR to `merge-queue`, not into the base branch."],
    ["om-approve-merge-pr", "the one skill that merges, and only when a person asks it to, naming the PR."],
  ];
  return (
    <section className="flex flex-col gap-3">
      <H2>Who may merge</H2>
      <ul className="flex flex-col gap-2">
        {rows.map(([name, what]) => (
          <li
            key={name}
            className={cn(
              "flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 rounded-lg border p-3 text-sm",
              name === "om-approve-merge-pr" ? cn("border-2", PERSON) : "bg-card",
            )}
          >
            <code className="font-mono text-xs font-semibold [overflow-wrap:anywhere]">{name}</code>
            <span className="min-w-40 flex-1">
              <Md text={what} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function LooseEnds() {
  const ends: { from: string; skill: string; to: string; href?: string }[] = [
    { from: "an issue the PR fixed, still open", skill: "om-close-fixed-issues", to: "closed, with a linked comment" },
    { from: "a reviewer's non-blocking nit", skill: "om-followup-issue-from-pr", to: "a new issue: back to stop 2", href: "/docs6/journey/issue" },
    { from: "everything merged since the last release", skill: "om-auto-update-changelog", to: "a docs PR that goes through build, review and merge like any other", href: "/docs6/journey/build" },
    { from: "the month's finished runs", skill: "om-pipeline-retro", to: "the costliest cause, offered to `om-prepare-issue`: back to stop 2", href: "/docs6/journey/issue" },
  ];
  return (
    <section className="flex flex-col gap-3">
      <H2>Four loose ends, four ways back onto the road</H2>
      <ul className="flex flex-col gap-2">
        {ends.map((e) => (
          <li key={e.skill} className="grid grid-cols-1 gap-2 rounded-lg border bg-card p-3 text-sm md:grid-cols-[minmax(0,1fr)_17rem_minmax(0,1fr)] md:items-center">
            <span className="min-w-0">{e.from}</span>
            <code className="justify-self-start rounded-md border px-1.5 py-0.5 font-mono text-xs [overflow-wrap:anywhere] md:justify-self-center">
              → {e.skill} →
            </code>
            <span className="min-w-0 font-medium">
              {e.href ? (
                <InternalLink href={e.href}>
                  <Md text={e.to} />
                </InternalLink>
              ) : (
                <Md text={e.to} />
              )}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">
        More on how the pipeline improves itself: <InternalLink href="/docs6/hood/loops">The road repairs itself</InternalLink>.
      </p>
    </section>
  );
}
