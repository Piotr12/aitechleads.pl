import type { Metadata } from "next";
import { QUIZ } from "../_data/quiz";
import { ROLES, type RoleId } from "../_data/roles";
import { PageIntro } from "../_components/bits";
import { Quiz } from "../_components/quiz";

export const metadata: Metadata = {
  title: "Self-check: who approves this?",
  robots: { index: false, follow: false },
};

const ROLE_NAMES = Object.fromEntries(ROLES.map((r) => [r.id, { title: r.title, person: r.person }])) as Record<
  RoleId,
  { title: string; person: string }
>;

export default function QuizPage() {
  return (
    <main className="flex flex-col gap-8">
      <PageIntro eyebrow="✅ Self-check" title="Who approves this?">
        <p>
          {QUIZ.length} short scenarios from the running examples. Pick an answer to see the explanation. Nothing is
          saved or sent anywhere; it is just for you.
        </p>
      </PageIntro>
      <Quiz questions={QUIZ} roles={ROLE_NAMES} />
    </main>
  );
}
