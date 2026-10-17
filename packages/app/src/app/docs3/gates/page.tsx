import type { Metadata } from "next";
import Link from "@/app/docs3/_components/link";
import { GATES } from "../_data/gates";
import { STAGE_BY_ID, STAGES } from "../_data/stages";
import { REPO_LINKS } from "../_data/skills";
import { Callout, IllustrativeBadge, PageIntro, RoleChip, TermLink } from "../_components/bits";

export const metadata: Metadata = {
  title: "The 7 gates",
  robots: { index: false, follow: false },
};

export default function GatesPage() {
  return (
    <main className="flex flex-col gap-10">
      <PageIntro eyebrow="⚑ Approval gates" title="Seven red lights, and who turns them green">
        <p>
          A <TermLink id="gate">gate</TermLink> is a point where a named person must say yes before work moves on.
          Agents prepare the evidence; they never pass a gate on their own. For each gate below: who decides, what
          they check, and one example that passes next to one that doesn&apos;t.
        </p>
      </PageIntro>

      {/* Where the gates sit on the road */}
      <div className="overflow-x-auto rounded-2xl border bg-card p-4">
        <ol className="flex min-w-[720px] items-start justify-between gap-1">
          {STAGES.map((s) => (
            <li key={s.id} className="flex w-full flex-col items-center gap-1 text-center">
              <span
                className={`flex size-9 items-center justify-center rounded-full border-2 text-base ${s.gates.length ? "border-red-500 bg-red-500/10" : "border-border"}`}
              >
                <span aria-hidden>{s.emoji}</span>
              </span>
              <span className="text-[11px] leading-tight">{s.name}</span>
              {s.gates.map((g) => (
                <a
                  key={g}
                  href={`#${g}`}
                  className="rounded bg-red-500/15 px-1 font-mono text-[10px] font-semibold text-red-700 hover:underline dark:text-red-300"
                >
                  ⚑ {g}
                </a>
              ))}
            </li>
          ))}
        </ol>
      </div>

      <Callout tone="warn" title="The one rule people forget">
        A PR labelled <code>needs-qa</code> cannot merge until it also has <code>qa-approved</code>, even when every
        automated check is green. And <code>qa-failed</code>, <code>blocked</code> and <code>do-not-merge</code> stop
        everything, whatever else says yes.
      </Callout>

      <ol className="flex flex-col gap-8">
        {GATES.map((g) => {
          const stage = STAGE_BY_ID[g.stage];
          return (
            <li key={g.id} id={g.id} className="scroll-mt-20 flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-red-500 px-2.5 py-1 font-mono text-sm font-bold text-white">⚑ {g.id}</span>
                <h2 className="text-xl font-semibold">{g.name}</h2>
                <Link href={`/docs3/story/${stage.id}`} className="text-sm text-muted-foreground hover:underline">
                  at {stage.emoji} {stage.name}
                </Link>
              </div>
              <p className="text-lg">“{g.question}”</p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-foreground">Decided by:</span>
                <RoleChip role={g.decider} />
                {g.id === "G5" && <RoleChip role="product-owner" />}
                {g.id === "G5" && <span className="text-xs text-muted-foreground">(whoever owns the decision)</span>}
              </div>
              <div>
                <p className="mb-1.5 text-sm font-medium">What they check</p>
                <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                  {g.checks.map((c) => (
                    <li key={c} className="flex gap-2">
                      <span aria-hidden>☐</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2">
                <IllustrativeBadge />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4">
                  <p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
                    ✅ Passes
                  </p>
                  <p className="font-medium">{g.passes.title}</p>
                  <p className="text-sm text-muted-foreground">{g.passes.detail}</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl border border-red-500/40 bg-red-500/5 p-4">
                  <p className="text-xs font-semibold tracking-wide text-red-700 uppercase dark:text-red-300">
                    ❌ Doesn&apos;t pass
                  </p>
                  <p className="font-medium">{g.fails.title}</p>
                  <p className="text-sm text-muted-foreground">{g.fails.detail}</p>
                </div>
              </div>
              <p className="text-sm">
                <span className="font-medium">If it doesn&apos;t pass: </span>
                <span className="text-muted-foreground">{g.ifFails}</span>
              </p>
            </li>
          );
        })}
      </ol>

      <Callout tone="note" title="Gates that are not on the chart, but are in SDLC.md">
        The repo adds hard rules around the gates: the validation gate (no PR on failing checks), the risk-high
        evidence table (e.g. money needs failure, retry and idempotency tests), and the QA head pin. Read them in{" "}
        <a href={REPO_LINKS.sdlc} target="_blank" rel="noreferrer" className="underline">
          SDLC.md
        </a>
        .
      </Callout>
    </main>
  );
}
