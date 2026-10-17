import type { Metadata } from "next";
import { GLOSSARY, type Term } from "../_data/glossary";
import { PageIntro } from "../_components/bits";

export const metadata: Metadata = {
  title: "Glossary",
  robots: { index: false, follow: false },
};

const GROUPS: Term["group"][] = ["Basics", "Process", "Tickets & labels", "Code & PRs", "Quality", "Product"];

export default function GlossaryPage() {
  return (
    <main className="flex flex-col gap-10">
      <PageIntro eyebrow="📖 Glossary" title="Every word, with an example">
        <p>
          {GLOSSARY.length} terms you will meet in this process, each with a plain explanation and an example from
          the running story. No question is too basic: that is what this page is for.
        </p>
      </PageIntro>

      <nav aria-label="Glossary groups" className="flex flex-wrap gap-2">
        {GROUPS.map((g) => (
          <a
            key={g}
            href={`#group-${g.toLowerCase().replace(/[^a-z]+/g, "-")}`}
            className="rounded-full border bg-card px-3 py-1 text-sm hover:bg-muted"
          >
            {g}
          </a>
        ))}
      </nav>

      {GROUPS.map((group) => (
        <section key={group} className="flex flex-col gap-4">
          <h2
            id={`group-${group.toLowerCase().replace(/[^a-z]+/g, "-")}`}
            className="scroll-mt-20 text-xl font-semibold tracking-tight"
          >
            {group}
          </h2>
          <dl className="grid gap-3 md:grid-cols-2">
            {GLOSSARY.filter((t) => t.group === group).map((t) => (
              <div key={t.id} id={t.id} className="scroll-mt-20 flex min-w-0 flex-col gap-2 break-words rounded-xl border bg-card p-4 target:ring-2 target:ring-foreground/40">
                <dt className="font-semibold">{t.term}</dt>
                <dd className="text-sm text-muted-foreground">{t.meaning}</dd>
                <dd className="rounded-lg bg-muted/50 p-2 text-sm">
                  <span className="mr-1 text-xs font-semibold text-muted-foreground uppercase">e.g.</span>
                  {t.example}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </main>
  );
}
