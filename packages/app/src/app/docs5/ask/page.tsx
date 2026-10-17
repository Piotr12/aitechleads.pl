import Link from "../_components/link";
import { Frame } from "../_components/frame";
import { meta } from "../_data/meta";
import { QUESTIONS } from "../_data/nav";

export const metadata = meta("Questions");

const TEASERS: Record<(typeof QUESTIONS)[number]["slug"], string> = {
  "who-approves": "Seven yes-or-no moments, and the one person behind each.",
  "which-skill": "Tell it what you have in front of you; it answers with one skill name.",
  "after-the-pr": "The labels a PR wears on its way to main, and who moves it along.",
  "bug-or-feature": "One skill takes any issue and sends it down one of two tracks.",
  "risky-work": "Auth, money, data: what a risk-high label switches on.",
  "agents-never": "The handful of things no skill will do for you, by design.",
};

export default function AskPage() {
  return (
    <Frame
      href="/docs5/ask"
      kicker="❓ Questions"
      title="Six questions people actually ask"
      lead={<p>Each answer fits on one small page, with a picture.</p>}
    >
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {QUESTIONS.map((q) => (
          <li key={q.slug}>
            <Link
              href={`/docs5/ask/${q.slug}`}
              className="flex h-full min-w-0 flex-col gap-2 rounded-xl border bg-card p-5 transition-colors hover:bg-muted/50"
            >
              <span aria-hidden className="text-2xl">
                {q.emoji}
              </span>
              <span className="text-lg font-semibold">{q.title}</span>
              <span className="text-sm text-muted-foreground">{TEASERS[q.slug]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Frame>
  );
}
