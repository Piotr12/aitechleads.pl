import type { Metadata } from "next";
import { OctagonX } from "lucide-react";
import Link from "@/app/docs4/_components/link";
import { CHAPTERS, GATES, HARD_BLOCKS, ROBOTS, href, roleById, type GateId, type RoleId } from "../_data";
import { SystemMap } from "../_components/system-map";
import { Avatar, Callout, Dot, GateFlag, Legend, PageHeader, PrevNext, SectionNav, SectionTitle } from "../_components/ui";

export const metadata: Metadata = {
  title: "The 30,000-foot view",
  robots: ROBOTS,
};

const PRINCIPLES = [
  {
    mark: "agent" as const,
    title: "Agents do delegated work",
    text: "Drafting, deduping, labelling, planning, typing, testing, reviewing against a checklist, collecting evidence, merging on request. Each run claims its work, works in its own worktree, and reports in a 🤖 comment.",
  },
  {
    mark: "decides" as const,
    title: "People own decisions and approvals",
    text: "Seven gates, each with a named owner. Where a person only supervises, the agent works alone and the person can take over at any point. Assumptions an agent makes are posted so that someone can overrule them.",
  },
  {
    mark: "stop" as const,
    title: "Blocked work cannot merge",
    text: "needs-qa without qa-approved, qa-failed, blocked, do-not-merge, a tester on the PR, a live claim, a red required check: any one of them stops the merge, however green everything else looks.",
  },
];

/** Where each gate closes in the story, and who signs it there. */
const GATE_IN_STORY: Record<GateId, { chapter: string; signer: RoleId }> = {
  G1: { chapter: "the-phones", signer: "product-owner" },
  G2: { chapter: "the-prototype", signer: "product-owner" },
  G3: { chapter: "the-ticket", signer: "product-owner" },
  G4: { chapter: "the-rule", signer: "architect" },
  G5: { chapter: "the-rule", signer: "domain-expert" },
  G6: { chapter: "no-then-yes", signer: "qa" },
  G7: { chapter: "wanda-signs", signer: "maintainer" },
};

const DIFFERENCES = [
  "Design: the chart folds it into the first column; SDLC.md adds a per-ticket Design stage (om-ux-shape) between Claim and Implement, skipped when a ticket has no UI. The story shapes the ticket's states in chapter 5, where SDLC.md puts it.",
  "Architect: the repo has no such role. A tech lead acts as SDLC.md's Reviewer, and SDLC.md asks for a second person's review on auth, money and other risk-high areas, which is the chart's G4.",
  "Domain Expert and Designer are optional: om-setup-discovery-pipeline asks one yes per product role, and without a domain expert the product owner holds those decisions.",
  "Maintainer: the chart's single role is SDLC.md's Maintainer plus the repo's Release Manager guide.",
  "Triage for features happens inside om-auto-fix-issue's feature route; om-verify-in-repo is the bug route's gate.",
  "om-qa-buddy appears on the chart but has no docs card in the repo; its links point at its SKILL.md.",
];

export default function OverviewPage() {
  return (
    <>
      <SectionNav part="overview" />
      <PageHeader
        eyebrow="Part 2"
        title="The 30,000-foot view"
        lead="Zoom out from Kinetik and the same shape is there for any piece of work: two layers, ten stages, seven gates, one rule at the end."
      />

      <section className="grid grid-cols-1 gap-3 md:grid-cols-3" aria-label="The principle">
        {PRINCIPLES.map((p, i) => (
          <div key={p.title} className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-4">
            <p className="flex items-center gap-2 font-semibold">
              {p.mark === "stop" ? (
                <OctagonX className="size-4 text-red-600 dark:text-red-400" aria-hidden />
              ) : (
                <Dot kind={p.mark} />
              )}
              <span className="font-mono text-xs text-muted-foreground">{i + 1}</span>
              {p.title}
            </p>
            <p className="text-sm text-muted-foreground">{p.text}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>The whole system, on one picture</SectionTitle>
        <SystemMap />
        <Legend />
        <p className="max-w-3xl text-sm text-muted-foreground">
          The product layer is optional and sits in front: it makes sure there is a problem, an owner for every rule,
          and a backlog someone said yes to. The delivery layer runs every ticket, from a brief, an issue or a spec,
          through the same review loop, the same QA gate and the same merge gate. The numbered circles are the
          story&apos;s chapters.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle aside={<Link href={href.gates} className="text-sm text-muted-foreground hover:text-foreground">All gates in full →</Link>}>
          Seven gates, seven signatures
        </SectionTitle>
        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {GATES.map((g) => {
            const story = GATE_IN_STORY[g.id];
            const chapter = CHAPTERS.find((c) => c.slug === story.chapter);
            const signer = roleById(story.signer);
            return (
              <li key={g.id} className="flex min-w-0 flex-col gap-2 rounded-xl border border-red-600/30 bg-card p-3 dark:border-red-500/30">
                <span className="flex items-center gap-2">
                  <GateFlag id={g.id} />
                  <span className="font-medium">{g.name}</span>
                </span>
                <span className="text-xs text-muted-foreground">{g.question}</span>
                <span className="mt-auto flex min-w-0 items-center gap-2 text-xs">
                  <Avatar role={story.signer} size="sm" />
                  <span className="min-w-0">
                    {signer.person} ({g.ownerLabel}) in{" "}
                    {chapter && (
                      <Link href={href.chapter(chapter.slug)} className="underline underline-offset-2">
                        chapter {chapter.number}
                      </Link>
                    )}
                  </span>
                </span>
              </li>
            );
          })}
          <li className="flex min-w-0 flex-col justify-center gap-1 rounded-xl border border-dashed p-3 text-xs text-muted-foreground">
            Exceptions exist, and every one is written down: a maintainer&apos;s waiver on the ticket, self-QA below
            risk-high with evidence, a QA exception with its reason.
          </li>
        </ol>
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle>What “blocked” means at Merge</SectionTitle>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {HARD_BLOCKS.map((b) => (
            <li key={b.label} className="flex min-w-0 gap-3 rounded-lg border bg-card p-3 text-sm">
              <OctagonX className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden />
              <span className="min-w-0">
                <code className="font-mono text-xs break-words">{b.label}</code>
                <span className="block text-muted-foreground">{b.meaning}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Callout title="Where the chart and the repository differ (this guide follows the repository)">
        <ul className="mt-1 flex list-disc flex-col gap-1 pl-5">
          {DIFFERENCES.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </Callout>

      <PrevNext
        prev={{ href: href.chapter(CHAPTERS[CHAPTERS.length - 1].slug), label: CHAPTERS[CHAPTERS.length - 1].title, hint: "The story's last chapter" }}
        next={{ href: href.perspectives, label: "Perspectives", hint: "Part 3" }}
      />
    </>
  );
}
