import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { FlowArrow, FlowBranches, FlowColumn, FlowLegend, FlowStep } from "../_components/flow";
import { DocsShell, ExternalLink, PageHeader, Pager, Section } from "../_components/shell";
import { href, upstream } from "../_data";

export const metadata: Metadata = {
  title: "Flows & entry paths · AI SDLC skills guide",
  robots: { index: false, follow: false },
};

function Panel({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border bg-card p-4 sm:p-6">{children}</div>;
}

export default function FlowsPage() {
  return (
    <DocsShell active="flows" crumbs={[{ label: "Guide", href: href.home }, { label: "Flows & entry paths" }]}>
      <PageHeader
        title="Flows and entry paths"
        lead="Work enters the pipeline in one of three ways: a task brief, a spec, or a tracker issue. Before that, the optional product layer shapes what to build. All paths converge on the same review loop, QA gate and merge."
      />

      <FlowLegend />

      <nav aria-label="On this page" className="flex flex-wrap gap-2 text-sm">
        {[
          ["#discovery", "1. Product discovery"],
          ["#brainstorm", "2. From an idea"],
          ["#brief", "3. From a task brief"],
          ["#issue", "4. From an issue"],
          ["#spec", "5. From a spec"],
          ["#tail", "6. Review to cleanup"],
          ["#contract", "7. How skills chain"],
        ].map(([anchor, label]) => (
          <a key={anchor} href={anchor} className="rounded-full border px-3 py-1 hover:bg-muted">
            {label}
          </a>
        ))}
      </nav>

      <Section
        id="discovery"
        title="1. Product discovery (product layer)"
        description="Establishes product context before any idea is weighed. Owned by the Product Owner, with the Domain Expert and Designer. Synthetic outputs are hypotheses, never evidence."
      >
        <Panel>
          <FlowColumn>
            <FlowStep kind="artifact" title="Research material" note="interviews, data, documents" />
            <FlowArrow />
            <FlowStep skill="om-discover" note="question rounds, skeptic check" />
            <FlowArrow />
            <FlowStep kind="artifact" title="product-brief.md" note="tagged evidence, rules, non-goals, owned decisions" gate="G1" />
            <FlowArrow label="optional" loop />
            <FlowStep skill="om-synthetic-users" optional note="first persona panel on a key flow" />
            <FlowArrow label="optional" loop />
            <FlowStep skill="om-mockup-prototype" optional note="neutral clickable prototype" />
            <FlowArrow />
            <FlowStep skill="om-discover" title="om-discover --refresh" note="findings enter the brief after confirmation" />
            <FlowArrow label="brief ready" />
            <FlowStep skill="om-backlog" title="om-backlog --dry-run, then om-backlog" note="shows the whole tree, waits for a yes" gate="G2" />
            <FlowArrow />
            <FlowStep kind="artifact" title="Epics, stories, tasks in the tracker" note="each filed through om-prepare-issue" />
          </FlowColumn>
        </Panel>
      </Section>

      <Section
        id="brainstorm"
        title="2. From an idea or question"
        description="om-brainstorm runs the conversation before any artifact exists and ends in exactly one routing decision, confirmed by the user."
      >
        <Panel>
          <FlowColumn>
            <FlowStep skill="om-brainstorm" note="alternatives incl. building nothing; challenger subagent" />
            <FlowArrow label="Next: line + handoff brief" />
            <FlowStep kind="decision" title="Routing decision" />
            <FlowBranches
              branches={[
                {
                  label: "park it",
                  children: <FlowStep skill="om-prepare-issue" note="one labeled issue" />,
                },
                {
                  label: "feature",
                  children: (
                    <FlowColumn className="gap-2">
                      <FlowStep skill="om-auto-write-spec" note="full-auto path" />
                      <FlowStep skill="om-spec-writing" note="co-design interactively" />
                    </FlowColumn>
                  ),
                },
                {
                  label: "small change / existing issue",
                  children: (
                    <FlowColumn className="gap-2">
                      <FlowStep skill="om-auto-create-pr" note="straight to a PR" />
                      <FlowStep skill="om-auto-fix-issue" note="tracker already has it" />
                    </FlowColumn>
                  ),
                },
              ]}
            />
            <p className="mt-3 text-center text-xs text-muted-foreground">
              A fourth exit is &ldquo;nothing&rdquo;: the answer is the report.
            </p>
          </FlowColumn>
        </Panel>
      </Section>

      <Section
        id="brief"
        title="3. From a task brief"
        description="A free-form brief, no ticket. The Developer starts the run and checks the result."
      >
        <Panel>
          <FlowColumn>
            <FlowStep kind="artifact" title="Task brief" note='e.g. "add rate limiting to the login endpoint"' />
            <FlowArrow />
            <FlowStep skill="om-auto-create-pr" note="plan, isolated worktree, phased commits, validation gate, self-review" />
            <FlowArrow label="plan > step threshold (default 20)" loop />
            <FlowStep skill="om-auto-create-pr-loop" optional note="run folder, one commit per step, checkpoints" />
            <FlowArrow />
            <FlowStep kind="artifact" title="Ready, labeled PR" note="continues in the review loop (section 6)" />
          </FlowColumn>
        </Panel>
      </Section>

      <Section
        id="issue"
        title="4. From a tracker issue"
        description="om-auto-fix-issue is the single issue-to-PR entry point. It classifies first, then routes."
      >
        <Panel>
          <FlowColumn>
            <FlowStep skill="om-auto-fix-issue" note="claims the issue; stops cleanly if solved or claimed" />
            <FlowArrow />
            <FlowStep kind="decision" title="Bug or feature request?" />
            <FlowBranches
              branches={[
                {
                  label: "bug: the autofix chain",
                  children: (
                    <FlowColumn>
                      <FlowStep skill="om-verify-in-repo" note="real? unfixed? unclaimed? (triage)" />
                      <FlowArrow label="go (else NO_ACTION_NEEDED)" />
                      <FlowStep skill="om-root-cause" note="read-only, minimal change surface" />
                      <FlowArrow />
                      <FlowStep skill="om-fix" note="minimal change + regression tests + gate" />
                      <FlowArrow />
                      <FlowStep skill="om-open-pr" note="commit, push, labeled PR, releases claim" />
                    </FlowColumn>
                  ),
                },
                {
                  label: "feature request",
                  children: (
                    <FlowColumn>
                      <FlowStep kind="gate" title="Definition of Ready" note="stops with a not-ready comment if the ticket-level tier fails" gate="G3" />
                      <FlowArrow />
                      <FlowStep kind="decision" title="Spec exists?" />
                      <FlowArrow label="no spec" />
                      <FlowStep skill="om-auto-write-spec" note="spec PR + mockups + assumptions comment" />
                      <FlowArrow />
                      <FlowStep skill="om-auto-implement-spec" note="implements on the same PR" />
                    </FlowColumn>
                  ),
                },
              ]}
            />
            <FlowArrow />
            <FlowStep kind="artifact" title="Ready, labeled PR" note="continues in the review loop (section 6)" />
          </FlowColumn>
        </Panel>
      </Section>

      <Section
        id="spec"
        title="5. From a spec"
        description="Author a spec first and review the plan before code, or build a spec that already exists."
      >
        <Panel>
          <FlowBranches
            branches={[
              {
                label: "write a spec",
                children: (
                  <FlowColumn>
                    <FlowStep skill="om-auto-write-spec" note="brief or FR issue → spec on a ready PR" />
                    <FlowArrow label="spec reviewed (specification review)" />
                    <FlowStep skill="om-auto-implement-spec" />
                  </FlowColumn>
                ),
              },
              {
                label: "build an existing spec",
                children: (
                  <FlowColumn>
                    <FlowStep skill="om-auto-implement-spec" note="by path, name, issue or spec-PR number" />
                    <FlowArrow />
                    <FlowStep skill="om-auto-create-pr" note="or om-auto-continue-pr when a PR exists" />
                  </FlowColumn>
                ),
              },
            ]}
          />
        </Panel>
      </Section>

      <Section
        id="tail"
        title="6. Review, QA, merge, cleanup"
        description="Every path ends here. The red markers are human approval gates."
      >
        <Panel>
          <FlowColumn>
            <FlowStep kind="artifact" title="Ready PR with full labels" note="pipeline label: review" />
            <FlowArrow />
            <FlowStep skill="om-auto-review-pr" note="om-code-review checklist; sensitive changes reviewed independently" gate="G4" />
            <FlowBranches
              branches={[
                {
                  label: "changes requested",
                  children: (
                    <FlowColumn>
                      <FlowStep skill="om-auto-continue-pr" note="or om-auto-fix-pr; Developer answers comments" />
                      <FlowArrow label="re-review" loop />
                      <FlowStep kind="artifact" title="back to review" />
                    </FlowColumn>
                  ),
                },
                {
                  label: "user-facing: design pass",
                  children: <FlowStep skill="om-ux-review-pr" note="advisory; does not hold the merge" />,
                },
                {
                  label: "touches a decision",
                  children: <FlowStep kind="human" title="Decision owner approves superseding entry" gate="G5" />,
                },
              ]}
            />
            <FlowArrow label="approved → merge-queue" />
            <FlowStep kind="decision" title="QA gate: needs-qa or skip-qa?" />
            <FlowBranches
              branches={[
                {
                  label: "needs-qa",
                  children: (
                    <FlowColumn>
                      <FlowStep skill="om-auto-qa-pr" note="screenshots + pass/fail report, evidence only" />
                      <FlowArrow />
                      <FlowStep kind="human" title="QA reviewer approves" note="qa-approved, pinned to the head commit" gate="G6" />
                    </FlowColumn>
                  ),
                },
                {
                  label: "skip-qa",
                  children: <FlowStep kind="artifact" title="Docs, deps, CI or test-only change" note="no manual QA" />,
                },
              ]}
            />
            <FlowArrow />
            <FlowStep skill="om-merge-buddy" note="read-only: ready / almost / blocked" />
            <FlowArrow />
            <FlowStep skill="om-approve-merge-pr" note="re-checks every gate, squash-merges" gate="G7" />
            <FlowArrow />
            <FlowBranches
              branches={[
                { label: "tracker", children: <FlowStep skill="om-close-fixed-issues" /> },
                { label: "leftovers", children: <FlowStep skill="om-followup-issue-from-pr" /> },
                { label: "release", children: <FlowStep skill="om-auto-update-changelog" /> },
              ]}
            />
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Deployment, monitoring and rollback follow the team&apos;s release process.
            </p>
          </FlowColumn>
        </Panel>
        <p className="text-sm text-muted-foreground">
          To finish one PR from whatever state it is in, <Link href={href.skill("om-pr-autopilot")} className="font-mono text-xs underline">om-pr-autopilot</Link> diagnoses it and dispatches the matching skills above; it never merges without <code className="font-mono text-xs">--allow-merge</code>.
        </p>
      </Section>

      <Section id="contract" title="7. How skills chain together" description="Conventions every skill follows, from SDLC.md.">
        <dl className="grid gap-3 text-sm md:grid-cols-2">
          {[
            [
              "Reference lines",
              "Every PR-producing skill ends with PR: #<number> (link: <url>); the next skill consumes it. Skills detect an existing PR for the same work and continue on it instead of opening a duplicate.",
            ],
            [
              "Claim protocol",
              "Before mutating an issue or PR, an agent assigns itself, adds in-progress and posts a claim comment. Agents that find a claim back off. The claim is released on success and failure alike.",
            ],
            [
              "Reporting decoupled from CI",
              "Labels, reviews and comments are posted as soon as the work is done; the CI outcome follows as a comment (ci-monitoring), bounded by ci.maxWaitMinutes (default 40). Merging still waits for green checks.",
            ],
            [
              "Ready, fully labeled PRs",
              "A completed autonomous run leaves a non-draft PR with one pipeline label, a category, QA meta, one priority and one risk, plus a run-summary comment and screenshots for user-facing changes.",
            ],
            [
              "Validation gate",
              "The commands in .ai/agentic.config.json run before review sign-off; any non-zero exit blocks the PR.",
            ],
            [
              "Repo-local overrides",
              "A skill at .ai/skills/<name>/SKILL.md takes precedence over the installed one, but cannot relax its safety rules.",
            ],
          ].map(([term, def]) => (
            <div key={term} className="rounded-xl border bg-card p-4">
              <dt className="font-medium">{term}</dt>
              <dd className="mt-1 text-muted-foreground">{def}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-muted-foreground">
          Sources: <ExternalLink href={upstream("README.md#-the-pipeline")}>README.md, The pipeline</ExternalLink> and{" "}
          <ExternalLink href={upstream("SDLC.md")}>SDLC.md</ExternalLink>.
        </p>
      </Section>

      <Pager prev={{ label: "Overview", href: href.home }} next={{ label: "Stages", href: href.stages }} />
    </DocsShell>
  );
}
