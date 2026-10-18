import { Frame } from "../_components/frame";
import Link from "../_components/link";
import { Cmd, LabelChip, SectionTitle } from "../_components/marks";
import { StateMachine } from "../_components/state-machine";
import { GROUPS, LABELS } from "../_data/labels";
import { meta } from "../_data/links";
import { CHAPTERS, chapterHref } from "../_data/story";

export const metadata = meta("Labels, files and words");

const FILES: { path: string; by: string; readBy: string; ch: number }[] = [
  { path: ".ai/agentic.config.json", by: "om-setup-agent-pipeline", readBy: "every skill, first", ch: 1 },
  { path: ".ai/trackers/<tracker>.md", by: "om-setup-agent-pipeline", readBy: "every tracker operation (yours to edit)", ch: 1 },
  { path: ".ai/browsers/<provider>.md", by: "om-setup-agent-pipeline", readBy: "every browser-driving skill", ch: 1 },
  { path: "SDLC.md", by: "om-setup-agent-pipeline (if missing)", readBy: "people; skills read its Definition of Ready", ch: 1 },
  { path: "CODE_REVIEW.md", by: "om-setup-agent-pipeline (if missing)", readBy: "om-code-review", ch: 1 },
  { path: "BACKWARD_COMPATIBILITY.md", by: "om-setup-agent-pipeline (if missing)", readBy: "reviews (violations are blockers) and builds", ch: 1 },
  { path: "AGENTS.md", by: "you, or a starter from setup", readBy: "every skill, before working", ch: 1 },
  { path: ".uxproof/", by: "om-ux-setup", readBy: "om-ux-shape, om-ux-review-pr, QA", ch: 1 },
  { path: ".ai/qa/test-env.json", by: "om-prepare-test-env", readBy: "every browser-driving skill (gitignored)", ch: 1 },
  { path: ".ai/specs/product-brief.md", by: "om-discover", readBy: "brainstorm, spec writing, issues, backlog, reviews", ch: 5 },
  { path: ".ai/specs/briefs/<date>-<slug>.md", by: "om-brainstorm (one file, after you confirm)", readBy: "the skill its Next: line names", ch: 5 },
  { path: ".ai/specs/<date>-<slug>.md", by: "om-spec-writing / om-auto-write-spec", readBy: "om-auto-implement-spec and the build engines", ch: 5 },
  { path: ".ai/runs/<date>-<slug>.md", by: "om-auto-create-pr", readBy: "om-auto-continue-pr (its Progress checklist)", ch: 6 },
  { path: ".ai/runs/<date>-<slug>/PLAN.md, HANDOFF.md, NOTIFY.md", by: "om-auto-create-pr-loop", readBy: "om-auto-continue-pr-loop (its Tasks table)", ch: 6 },
  { path: ".ai/skills/<skill-name>/SKILL.md", by: "you", readBy: "the installed skill of that name, which follows it", ch: 11 },
];

const CONFIG: { key: string; means: string }[] = [
  { key: "baseBranch", means: "The branch PRs target; \"auto\" resolves the repo's default branch at run time." },
  { key: "tracker", means: "github, gitlab, linear, jira or your own; selects the tracker descriptor." },
  { key: "browser.provider", means: "agent-browser (fresh-setup default) or playwright; selects the browser descriptor." },
  { key: "validation.commands", means: "The validation gate, in order. Any non-zero exit fails it." },
  { key: "labels", means: "enabled, plus the five groups below. false turns every label operation off." },
  { key: "qaGate", means: "true: needs-qa cannot merge without qa-approved. false: needs-qa is advisory." },
  { key: "ci.maxWaitMinutes", means: "The longest any skill waits for CI after reporting (default 40; 0 = never wait)." },
  { key: "engine.loopStepThreshold", means: "Plan steps above which a build moves to the loop engine (default 20)." },
  { key: "paths.*", means: "Where runs, analysis, specs, data-model views, prototypes, scripts and QA artefacts go." },
  { key: "reviewChecklist", means: "Optional extra review checklist file." },
  { key: "closeKeywords", means: "Extra closing keywords for non-English PR bodies, e.g. zamyka, naprawia." },
  { key: "discovery", means: "Written by om-setup-discovery-pipeline: the product layer on, and its roles." },
];

const TERMS: { term: string; means: React.ReactNode; ch: number }[] = [
  { term: "Skill", means: "A SKILL.md your coding agent runs as a slash command, e.g. /om-auto-fix-issue 15.", ch: 1 },
  { term: "Autonomous / interactive", means: <>Autonomous (<Cmd>om-auto-*</Cmd>) runs to the end without questions; interactive acts once, may ask, and hands back.</>, ch: 4 },
  { term: "Building block", means: "A small skill mainly meant to be composed by others: verify, root cause, fix, open PR, code review, test env.", ch: 2 },
  { term: "Chain marker", means: <>The last lines of a report, <Cmd>PR: #14 (link: …)</Cmd>, <Cmd>Issue:</Cmd>, <Cmd>Spec:</Cmd>, which the next skill parses.</>, ch: 2 },
  { term: "Claim", means: <>Assignee + <LabelChip name="in-progress" /> + a 🤖 claim comment. Any of them makes other agents back off.</>, ch: 7 },
  { term: "Validation gate", means: "The commands in validation.commands, run before a PR opens and during review.", ch: 1 },
  { term: "Worktree", means: "A separate git checkout the autonomous skills work in, so your own checkout is never touched.", ch: 3 },
  { term: "Autofix", means: <>The review skill fixing its own findings. Automatic on the automation&apos;s own PRs; on anyone else&apos;s only with <Cmd>--autofix</Cmd>.</>, ch: 3 },
  { term: "Spec PR", means: "A design-only PR holding a spec; reviewed with the specification lenses; implementation ships on a separate PR.", ch: 5 },
  { term: "Definition of Ready", means: "Two tiers: ticket-level answers only people give, spec-level answers a spec can supply.", ch: 5 },
  { term: "⚠ NEEDS HUMAN CONFIRMATION", means: "An autonomous assumption too risky to take alone; it keeps its PR a draft.", ch: 5 },
  { term: "Execution plan / run folder", means: "The plan an autonomous build commits first; the save point a resume reads.", ch: 6 },
  { term: "Adoption", means: "om-auto-continue-pr writing a plan for a PR that never had one, then finishing it.", ch: 6 },
  { term: "QA head", means: <>The <Cmd>QA head: &lt;sha&gt;</Cmd> line pinning <LabelChip name="qa-approved" /> to the commit that was tested.</>, ch: 8 },
  { term: "Self-QA exception", means: "An engineer (or om-auto-qa-pr --self-qa-signoff) signing off with evidence, below risk-high only, marked qa-self-verified.", ch: 8 },
  { term: "Sweep", means: "A skill that works over many items: om-review-prs, om-auto-manage-issues, om-close-fixed-issues, om-merge-buddy.", ch: 4 },
  { term: "Dispatcher", means: "om-pr-autopilot: diagnoses a PR and runs other skills; does no work itself.", ch: 4 },
  { term: "Repo-local override", means: "A same-named skill in .ai/skills/ that the installed one follows; may add rules, never relax safety.", ch: 11 },
];

export default function Glossary() {
  return (
    <Frame
      href="/docs7/glossary"
      kicker="Reference"
      title="Labels, files and words"
      lead="Everything the guide names, in one place: the label taxonomy, the files the skills write and read, the config keys, and the words that need a definition."
    >
      <section id="labels" className="flex scroll-mt-28 flex-col gap-4">
        <SectionTitle>Labels</SectionTitle>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {GROUPS.map((g) => (
            <div key={g.id} className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-3">
              <p className="font-semibold">{g.name}</p>
              <p className="-mt-1 text-xs text-muted-foreground">{g.rule}</p>
              <ul className="flex flex-col gap-1.5">
                {LABELS.filter((l) => l.group === g.id).map((l) => (
                  <li key={l.name} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm leading-6">
                    <LabelChip name={l.name} />
                    <span className="min-w-40 flex-1 text-muted-foreground">{l.means}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <StateMachine />
      </section>

      <section id="files" className="flex scroll-mt-28 flex-col gap-3">
        <SectionTitle>Files</SectionTitle>
        <ul className="flex flex-col gap-2">
          {FILES.map((f) => (
            <li key={f.path} className="grid grid-cols-1 gap-1 rounded-xl border bg-card p-3 md:grid-cols-[1.3fr_1fr_1fr_5rem] md:gap-3">
              <span className="min-w-0 font-mono text-[12.5px] font-semibold break-words">{f.path}</span>
              <span className="text-sm text-muted-foreground">
                <span className="text-xs font-medium text-foreground md:hidden">Written by </span>
                {f.by}
              </span>
              <span className="text-sm text-muted-foreground">
                <span className="text-xs font-medium text-foreground md:hidden">Read by </span>
                {f.readBy}
              </span>
              <Link href={chapterHref(CHAPTERS[f.ch - 1])} className="text-xs underline underline-offset-2">
                chapter {f.ch}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="config" className="flex scroll-mt-28 flex-col gap-3">
        <SectionTitle>Config keys</SectionTitle>
        <p className="text-sm text-muted-foreground">
          In <Cmd>.ai/agentic.config.json</Cmd>, written by <Cmd>om-setup-agent-pipeline</Cmd>.
        </p>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-2 rounded-xl border bg-card p-3 md:grid-cols-[14rem_1fr]">
          {CONFIG.map((c) => (
            <div key={c.key} className="contents">
              <dt className="font-mono text-[12.5px] font-semibold break-words md:pt-0.5">{c.key}</dt>
              <dd className="mb-2 text-sm leading-6 text-muted-foreground md:mb-0">{c.means}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="terms" className="flex scroll-mt-28 flex-col gap-3">
        <SectionTitle>Words</SectionTitle>
        <dl className="flex flex-col gap-2">
          {TERMS.map((t) => (
            <div key={t.term} className="grid grid-cols-1 gap-1 rounded-xl border bg-card p-3 md:grid-cols-[14rem_1fr_5rem] md:gap-3">
              <dt className="font-semibold">{t.term}</dt>
              <dd className="text-sm leading-6 text-muted-foreground">{t.means}</dd>
              <dd>
                <Link href={chapterHref(CHAPTERS[t.ch - 1])} className="text-xs underline underline-offset-2">
                  chapter {t.ch}
                </Link>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </Frame>
  );
}
