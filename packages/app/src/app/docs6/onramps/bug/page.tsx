import { Lock, LockOpen } from "lucide-react";
import { Frame } from "../../_components/frame";
import { cn } from "../../_components/cx";
import { AGENT, Callout, Cmd, H2, PERSON, SkillChip, Source, Specimen } from "../../_components/marks";
import { Md } from "../../_components/md";
import { meta } from "../../_data/nav";

export const metadata = meta("A bug report takes the short road");

type Lk = "none" | "issue" | "pr" | "released";

const STEPS: { skill: string; args?: string; does: string; lock: Lk; stop?: string }[] = [
  { skill: "om-auto-fix-issue", does: "Checks nobody else holds #509, classifies it as a bug. Claims nothing yet.", lock: "none" },
  { skill: "om-verify-in-repo", does: "Read-only gate: is the issue open, unclaimed, not already fixed on the base branch or in an open PR, and really a bug?", lock: "none", stop: "`NO_ACTION_NEEDED` stops the whole run, citing the evidence. Nothing was claimed, so nothing is left behind." },
  { skill: "(worktree)", does: "A temporary worktree off the base branch, on `fix/issue-509-discount-total`. Your checkout stays untouched.", lock: "none" },
  { skill: "om-root-cause", does: "Read-only: finds the bug and the smallest change surface. Its brief (Summary, Root cause, Files to change, Approach, Risks) is passed on word for word.", lock: "none", stop: "Ends with `LOW_CONFIDENCE`? The chain continues, but the flag goes into the PR body so a reviewer looks harder." },
  { skill: "om-fix", does: "**Claims the issue** (assignee, `in-progress`, 🤖 comment), makes the minimal change, adds a regression test, runs the validation gate. Does not commit.", lock: "issue", stop: "`Status: blocked`: the failure path releases the lock with an explanation." },
  { skill: "om-open-pr", args: "--handoff om-auto-review-pr", does: "Commits, pushes, opens a ready PR with the full label set, **moves the lock onto the PR**, then releases the issue.", lock: "pr" },
  { skill: "om-auto-review-pr", args: "--autofix", does: "Re-enters the inherited lock with a take-over comment, reviews, fixes its findings, re-reviews. Keeps the lock.", lock: "pr" },
  { skill: "om-auto-qa-pr", does: "Only when the fix touches something users see: screenshots and a pass/fail report. Keeps `needs-qa`; never adds `qa-approved`.", lock: "pr" },
  { skill: "om-auto-fix-issue", does: "Releases the PR lock exactly once (or swaps it for `ci-monitoring` if a CI result is still owed) and reports.", lock: "released" },
];

function LockPill({ lock }: { lock: Lk }) {
  if (lock === "none") return <span className="text-xs text-muted-foreground">no lock yet</span>;
  if (lock === "released")
    return (
      <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
        <LockOpen className="size-3.5" aria-hidden /> released
      </span>
    );
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", AGENT)}>
      <Lock className="size-3.5" aria-hidden /> on the {lock === "issue" ? "issue #509" : "PR"}
    </span>
  );
}

export default function BugPage() {
  return (
    <Frame
      href="/docs6/onramps/bug"
      title="A bug report takes the short road"
      idea="A bug skips the brief and the spec: one command runs a chain of small skills, each passing its output to the next word for word, while one lock travels with the work."
      lead={<p>An illustrative issue #509: “Fix: order total is wrong with three or more discounts”. A developer, or a scheduled run, hands it over.</p>}
    >
      <Cmd who="Developer">/om-auto-fix-issue 509</Cmd>

      <section className="flex flex-col gap-3">
        <H2>The chain, and where the lock is at each step</H2>
        <p className="text-sm text-muted-foreground">
          The thick left edge is the lock: pale blue while it sits on the issue, dark blue once it has moved to the PR,
          grey when nobody holds it.
        </p>
        <ol className="flex flex-col gap-2">
          {STEPS.map((s, i) => (
            <li
              key={i}
              className={cn(
                "grid grid-cols-1 gap-2 rounded-xl border border-l-8 bg-card p-3 text-sm md:grid-cols-[2rem_1fr_9rem] md:items-start md:gap-3",
                s.lock === "issue" && "border-l-sky-300 dark:border-l-sky-700",
                s.lock === "pr" && "border-l-sky-600 dark:border-l-sky-400",
                (s.lock === "none" || s.lock === "released") && "border-l-muted",
              )}
            >
              <span className="font-semibold text-muted-foreground tabular-nums">{i + 1}</span>
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="flex flex-wrap items-center gap-1">
                  {s.skill.startsWith("(") ? <code className="font-mono text-xs">{s.skill}</code> : <SkillChip name={s.skill} />}
                  {s.args && <code className="font-mono text-xs text-muted-foreground">{s.args}</code>}
                </span>
                <span className="leading-relaxed">
                  <Md text={s.does} />
                </span>
                {s.stop && (
                  <span className="rounded-md border border-dashed border-foreground/30 bg-muted/40 px-2 py-1 text-xs">
                    <Md text={s.stop} />
                  </span>
                )}
              </div>
              <span className="md:justify-self-end">
                <LockPill lock={s.lock} />
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Specimen kind="Passed from om-root-cause to om-fix" title="the exact block the next step parses">{`— PREVIOUS STEP (om-root-cause) said —
Summary: totals drop the third discount.
Root cause: applyDiscounts() stops after two rules.
Files to change: src/pricing/discounts.ts
Approach: iterate all rules; add a regression test.
Risks: low; pricing tests cover the other paths.`}</Specimen>
        <Specimen kind="Comment on the new PR" title="the lock changes hands">{`🤖 \`om-open-pr\` completed: PR opened. Lock handed off to
\`om-auto-review-pr\` — chain continues on this PR.

🤖 \`om-auto-review-pr\` taking over the chain lock — review.
Started: 2026-10-22T09:41:07Z.`}</Specimen>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Callout title="Why hand the lock over instead of releasing it?">
          <p>
            If the issue were released and the PR claimed a moment later, another agent checking in between would see
            nobody working on it and start duplicate work. So the lock is moved, never dropped, and released once at the
            end, or by the failure path on any crash after the claim.
          </p>
        </Callout>
        <div className={cn("flex min-w-0 flex-col gap-2 rounded-xl border p-4 text-sm", PERSON)}>
          <p className="font-semibold">Where people come in</p>
          <p>
            Nobody decides inside the chain. The bug PR then travels the same road as everything else: review, QA when
            people will see it, and a person presses merge. An issue that mixes a bug and a new feature makes the skill
            stop and ask you to split it.
          </p>
        </div>
      </section>

      <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        Checked against: <Source path="skills/om-auto-fix-issue/SKILL.md" /> <Source path="skills/om-open-pr/SKILL.md" />{" "}
        <Source path="skills/om-auto-create-pr/references/claim-pr.md" />
      </p>
    </Frame>
  );
}
