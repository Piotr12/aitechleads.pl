import { ChapterShell } from "../../_components/chapter";
import { Artefact, Callout, Cmd, Ext, Figure, PersonTag, SkillChip, Story } from "../../_components/marks";
import { meta, UP } from "../../_data/links";

export const metadata = meta("Day 0: One command sets the table");

const QUESTIONS: { ask: string; becomes: string; effect: string }[] = [
  {
    ask: "Are these the right validation commands?",
    becomes: "validation.commands",
    effect:
      "The gate every build and every review runs, in order. Any non-zero exit blocks the PR. Setup proposes them from package.json, a Makefile or the language, preferring what CI already runs.",
  },
  {
    ask: "Which tracker? GitHub, GitLab, Linear, Jira or your own",
    becomes: "tracker + .ai/trackers/<tracker>.md",
    effect:
      "No skill calls gh directly: every issue, PR and label command lives in this one committed file, which you may edit.",
  },
  {
    ask: "Which browser provider? agent-browser (default) or Playwright",
    becomes: "browser.provider + .ai/browsers/<provider>.md",
    effect: "How the QA and test skills drive a real browser.",
  },
  {
    ask: "Labels: the full set, a subset, or none?",
    becomes: "labels",
    effect: "Missing labels are created for you. Existing ones are never deleted, renamed or recoloured.",
  },
  {
    ask: "QA gate on or off?",
    becomes: "qaGate",
    effect: "When on, a PR labelled needs-qa cannot merge until it also carries qa-approved. Chapter 8.",
  },
  {
    ask: "Where do specs live?",
    becomes: "paths.specs",
    effect: "Default .ai/specs. Briefs, specs and the product brief go here.",
  },
  {
    ask: "A repo-local review checklist?",
    becomes: "reviewChecklist",
    effect: "Read by the review skill on top of its own checklist (a root CODE_REVIEW.md is read anyway).",
  },
  {
    ask: "Which project docs should I write? (only missing ones)",
    becomes: "SDLC.md, AGENTS.md, CODE_REVIEW.md, BACKWARD_COMPATIBILITY.md",
    effect: "Derived from your repo, shown to you before writing. A file you already have is never touched.",
  },
];

const TREE: { path: string; depth: number; note: string; readBy: string }[] = [
  { path: ".ai/", depth: 0, note: "", readBy: "" },
  { path: "agentic.config.json", depth: 1, note: "the settings", readBy: "every skill, first thing" },
  { path: "trackers/github.md", depth: 1, note: "how to talk to the tracker", readBy: "every issue, PR and label operation" },
  { path: "browsers/agent-browser.md", depth: 1, note: "how to drive a browser", readBy: "QA and test skills" },
  { path: "runs/  analysis/  specs/  scripts/  qa/", depth: 1, note: "empty folders, for later", readBy: "plans, reports, specs, test env" },
  { path: "SDLC.md", depth: 0, note: "the process, for humans", readBy: "the team (and skills, for its Definition of Ready)" },
  { path: "CODE_REVIEW.md", depth: 0, note: "your review rules", readBy: "om-code-review" },
  { path: "BACKWARD_COMPATIBILITY.md", depth: 0, note: "surfaces you must not break", readBy: "reviews and builds" },
  { path: "AGENTS.md", depth: 0, note: "starter, only if you had none", readBy: "every skill, before working" },
];

export default function DayZero() {
  return (
    <ChapterShell
      slug="day-0"
      know={[
        <>
          Install once (<Cmd>npx skills add open-mercato/skills --skill &apos;*&apos;</Cmd>), then run{" "}
          <Cmd>/om-setup-agent-pipeline</Cmd> once per repository.
        </>,
        <>
          <Cmd>.ai/agentic.config.json</Cmd> is the one file every skill reads: base branch, validation gate, tracker,
          labels, QA gate, paths. It is committed: team configuration, not personal taste.
        </>,
        <>
          <Cmd>SDLC.md</Cmd> is the human half of the same process. Change the two together.
        </>,
        <>Setup only writes what is missing, and shows you each document first.</>,
        <>
          Three optional layers: product (<Cmd>om-setup-discovery-pipeline</Cmd>), design contract (
          <Cmd>om-ux-setup</Cmd>) and a shared test environment (<Cmd>om-prepare-test-env</Cmd>).
        </>,
      ]}
    >
      <Story>
        <p>
          Monday, nine o&apos;clock. <PersonTag id="maintainer" /> has a repository, a GitHub project and a team that
          has heard &ldquo;the agents will do it&rdquo; once too often. She installs the skills into the repo:{" "}
          <Cmd>npx skills add open-mercato/skills --skill &apos;*&apos;</Cmd>. They are small until someone invokes
          one, so the README recommends installing all of them: they call each other.
        </p>
        <p>
          Then the one skill that must come first: <SkillChip name="om-setup-agent-pipeline" />. It looks around
          (default branch, scripts, CI workflows, existing labels) and then asks a handful of questions. Each answer
          becomes a line of configuration that some other skill will obey for the rest of the month.
        </p>
      </Story>

      <Figure
        title="What setup asks, and what each answer becomes"
        caption={
          <>
            From the setup skill&apos;s{" "}
            <Ext href={UP.setupQuestions}>interview questions</Ext>. <Cmd>--defaults</Cmd> skips them all and writes
            what it detected.
          </>
        }
      >
        <ol className="flex flex-col gap-2">
          {QUESTIONS.map((q, i) => (
            <li key={q.becomes} className="grid grid-cols-1 gap-2 rounded-xl border bg-card p-3 md:grid-cols-[1fr_15rem_1.4fr] md:gap-4">
              <p className="min-w-0 font-medium">
                <span className="mr-2 text-muted-foreground tabular-nums">{i + 1}</span>
                {q.ask}
              </p>
              <p className="min-w-0">
                <Cmd className="text-[12px]">{q.becomes}</Cmd>
              </p>
              <p className="min-w-0 text-sm leading-6 text-muted-foreground">{q.effect}</p>
            </li>
          ))}
        </ol>
      </Figure>

      <Figure
        title="What Day 0 leaves in the repository"
        caption="Everything setup writes is a plain file that people can read as easily as agents; setup shows the result and offers to commit it all in one commit."
      >
        <div className="rounded-xl border bg-card">
          <ul className="divide-y font-mono text-[13px]">
            {TREE.map((t) => (
              <li key={t.path} className="grid grid-cols-1 gap-x-3 gap-y-0.5 px-3 py-2 sm:grid-cols-[minmax(14rem,1.1fr)_1fr]">
                <span className={t.depth ? "pl-4 break-words sm:pl-6" : "font-semibold break-words"}>
                  {t.depth ? "└ " : ""}
                  {t.path}
                </span>
                <span className={`font-sans text-xs leading-5 text-muted-foreground ${t.depth ? "pl-8 sm:pl-0" : ""}`}>
                  {t.note && <span className="text-foreground">{t.note}</span>}
                  {t.readBy && <> · read by {t.readBy}</>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Figure>

      <Story>
        <p>
          At ten the team reads <Cmd>SDLC.md</Cmd> together, because that file is the agreement. It names the roles
          (Author, Reviewer, Designer, QA reviewer, Maintainer), the stages a ticket passes through, the label rules,
          the QA gate and the claim protocol. The skills enforce it; humans read it here. If the team wants a different
          rule, it changes this file and the config together, never one without the other.
        </p>
        <p>
          Three people then switch on the optional layers they will need later. <PersonTag id="product" /> runs{" "}
          <SkillChip name="om-setup-discovery-pipeline" />: two questions (is there a domain expert who is not the
          product owner? is there a designer?), and SDLC.md gains a product owner role, a Discovery stage and a{" "}
          <em>Definition of Ready</em>. <PersonTag id="designer" /> runs <SkillChip name="om-ux-setup" />, which
          extracts the repo&apos;s own design system into <Cmd>.uxproof/</Cmd>. <PersonTag id="qa" /> runs{" "}
          <SkillChip name="om-prepare-test-env" />, which works out how the app boots, saves launch scripts in{" "}
          <Cmd>.ai/scripts</Cmd> and writes <Cmd>.ai/qa/test-env.json</Cmd> for every browser-driving skill to reuse.
        </p>
      </Story>

      <Artefact title="The part of .ai/agentic.config.json the month will lean on" where="committed to the repo">
        {`{
  "baseBranch": "auto",
  "tracker": "github",
  "browser": { "provider": "agent-browser" },
  "validation": { "commands": ["pnpm typecheck", "pnpm test", "pnpm build"] },
  "labels": { "enabled": true, "pipeline": ["review", "changes-requested", …] },
  "qaGate": true,
  "ci": { "maxWaitMinutes": 40 },
  "engine": { "loopStepThreshold": 20 },
  "paths": { "runs": ".ai/runs", "specs": ".ai/specs", "qa": ".ai/qa" }
}`}
      </Artefact>

      <Callout title="Forgot to run setup?">
        Any skill started in a repo without the config runs setup first: interactively when you are there to answer,
        with <Cmd>--defaults</Cmd> when it runs unattended. Setup also checks that every skill an installed skill
        relies on is installed too, and prints the exact <Cmd>npx skills add</Cmd> command when one is missing.
      </Callout>
    </ChapterShell>
  );
}
