import { Check, MessageSquare, Minus, X } from "lucide-react";
import { ChapterShell } from "../../_components/chapter";
import { Artefact, Callout, Cmd, Figure, LabelChip, PersonTag, SkillChip, Story } from "../../_components/marks";
import { meta } from "../../_data/links";

export const metadata = meta("Week 4: Tidy up after yourself");

const MENTIONS: { text: string; where: string; result: "close" | "comment" | "skip" | "report"; why: string }[] = [
  { text: "Fixes #12", where: "PR #14, merged", result: "close", why: "a closing keyword right before #12, PR merged into the base branch" },
  { text: "Closes #20", where: "PR #22, closed without merging", result: "comment", why: "never close when the PR did not merge: an informational comment instead" },
  { text: "Fixes #8", where: "PR #25, merged", result: "skip", why: "#8 carries do-not-close, so it is skipped and the reason reported" },
  { text: "see #19", where: "PR #14, merged", result: "report", why: "a bare mention never closes anything; it is listed in the report's ⚠️ section" },
  { text: "Naprawia #18", where: "PR #26, merged", result: "close", why: "Polish for “fixes”: only because the config's closeKeywords lists naprawia" },
];

const ICON = {
  close: <Check className="size-4 text-emerald-600" aria-label="closed" />,
  comment: <MessageSquare className="size-4 text-sky-600" aria-label="commented" />,
  skip: <Minus className="size-4 text-muted-foreground" aria-label="skipped" />,
  report: <X className="size-4 text-amber-600" aria-label="not closed, reported" />,
};

const RESULT = { close: "closed", comment: "commented", skip: "skipped", report: "reported" };

export default function Housekeeping() {
  return (
    <ChapterShell
      slug="housekeeping"
      know={[
        <>A merge is not the end: the tracker has to say what actually shipped.</>,
        <>
          <Cmd>om-close-fixed-issues</Cmd> closes an issue only on a closing keyword (or the tracker&apos;s own closing
          reference) in a merged PR, never on a bare <Cmd>#N</Cmd>, and respects <LabelChip name="do-not-close" />,{" "}
          <LabelChip name="blocked" /> and claims. <Cmd>--dry-run</Cmd> shows its plan first.
        </>,
        <>Leftover asks become follow-up issues (assigned to the @-mention, else the PR author), not scope creep.</>,
        <>
          The changelog entry is drafted by an agent and shipped as a docs PR; the Highlights paragraph is left blank
          for a person.
        </>,
      ]}
    >
      <Story>
        <p>
          The first release is due. Before cutting it, <PersonTag id="maintainer" /> makes the tracker true again.
          Issues should be closed when, and only when, a merged PR really fixed them.{" "}
          <SkillChip name="om-close-fixed-issues" /> reads the PRs merged or closed since the last release, first with{" "}
          <Cmd>--dry-run</Cmd> so she can see what it intends, then for real.
        </p>
      </Story>

      <Figure
        title="Which mentions close an issue"
        caption="The rules are strict on purpose: a wrongly closed issue is worse than an open one. Built-in keywords are fix, close and resolve in their usual English forms."
      >
        <ul className="flex flex-col gap-2">
          {MENTIONS.map((m) => (
            <li key={m.text + m.where} className="grid grid-cols-1 gap-1 rounded-xl border bg-card p-3 sm:grid-cols-[9rem_12rem_7rem_1fr] sm:items-baseline sm:gap-3">
              <span className="font-mono text-sm font-semibold">{m.text}</span>
              <span className="text-xs text-muted-foreground">{m.where}</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                {ICON[m.result]}
                {RESULT[m.result]}
              </span>
              <span className="text-sm leading-6 text-muted-foreground">{m.why}</span>
            </li>
          ))}
        </ul>
      </Figure>

      <Artefact title="One line in the config fixes the Polish PRs" where=".ai/agentic.config.json">
        {`"closeKeywords": ["zamyka", "naprawia", "rozwiązuje"]`}
      </Artefact>

      <Story>
        <p>
          Two loose ends from review. Tomek had written on PR #14: &ldquo;@bartek, follow-up: move the timezone helper
          into the shared date module.&rdquo; Not a reason to hold the merge, but not to be lost either.{" "}
          <PersonTag id="reviewer" /> pastes the comment link into <SkillChip name="om-followup-issue-from-pr" />,
          which files an issue quoting the ask, linked back to the PR, assigned to the @-mentioned Bartek. (On PRs that{" "}
          <Cmd>om-auto-fix-pr</Cmd> drove, non-blocking nits are filed this way automatically.)
        </p>
        <p>
          Then the release notes. <SkillChip name="om-auto-update-changelog" /> drafts a <Cmd>CHANGELOG.md</Cmd> entry
          for everything merged since the last release, sorted into categories, crediting each contributor (checked
          against commit authorship, so a carried-forward PR credits its author rather than whoever merged it). It
          leaves the Highlights paragraph empty and hands the file to <Cmd>om-auto-create-pr</Cmd>, which ships it as a
          docs PR. Ola writes the Highlights herself: that sentence is the team&apos;s, not the agent&apos;s.
        </p>
      </Story>

      <Artefact title="The draft, as the docs PR proposes it" where="CHANGELOG.md">
        {`# 0.4.0 (2026-10-30)

## Highlights
<!-- TODO: Highlights — auto-update-changelog leaves this blank for the human author to fill in. -->

## ✨ Features
- ✨ Bulk reschedule for storm days. (#31) *(@bartek)*

## 🐛 Fixes
- 🐛 Keep the departure timezone when formatting ETAs (fixes #12). (#14) *(@bartek)*`}
      </Artefact>

      <Callout title="Spec PRs and closing">
        A spec PR links its issue with <Cmd>Refs</Cmd>, never a closing keyword, so this sweep will not close a
        feature request just because its design merged. The implementation PR carries the <Cmd>Closes</Cmd>.
      </Callout>
    </ChapterShell>
  );
}
