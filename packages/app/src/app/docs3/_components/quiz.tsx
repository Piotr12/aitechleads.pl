"use client";

import { useState } from "react";
import { Button } from "@atl/ui/components/button";
import type { QuizQuestion } from "../_data/quiz";
import type { RoleId } from "../_data/roles";
import { cn } from "./cx";

type Option = RoleId | "agent";
type RoleNames = Record<RoleId, { title: string; person: string }>;

export function Quiz({ questions, roles }: { questions: QuizQuestion[]; roles: RoleNames }) {
  const [picked, setPicked] = useState<Record<string, Option>>({});
  const answered = Object.keys(picked).length;
  const score = questions.filter((q) => picked[q.id] === q.answer).length;

  const label = (o: Option) =>
    o === "agent" ? "Nobody: the agent / the process handles it" : `${roles[o].title} (${roles[o].person})`;

  return (
    <div className="flex flex-col gap-6">
      <div
        className="sticky top-2 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card/95 px-4 py-3 text-sm shadow-xs backdrop-blur"
        aria-live="polite"
      >
        <span>
          Answered <strong>{answered}</strong> of {questions.length}
          {answered > 0 && (
            <>
              {" "}
              · correct <strong>{score}</strong>
            </>
          )}
        </span>
        {answered > 0 && (
          <Button variant="outline" size="sm" onClick={() => setPicked({})}>
            Start again
          </Button>
        )}
      </div>

      <ol className="flex flex-col gap-4">
        {questions.map((q, i) => {
          const choice = picked[q.id];
          const done = choice !== undefined;
          const right = choice === q.answer;
          return (
            <li key={q.id} className="flex flex-col gap-3 rounded-xl border bg-card p-4">
              <p className="font-medium">
                <span className="mr-2 font-mono text-xs text-muted-foreground">{i + 1}.</span>
                {q.scenario}
              </p>
              <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label={`Answers for question ${i + 1}`}>
                {q.options.map((o) => {
                  const isChoice = choice === o;
                  const isAnswer = q.answer === o;
                  return (
                    <button
                      key={o}
                      type="button"
                      disabled={done}
                      onClick={() => setPicked((p) => ({ ...p, [q.id]: o }))}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                        !done && "hover:bg-muted",
                        done && isAnswer && "border-emerald-500 bg-emerald-500/10",
                        done && isChoice && !isAnswer && "border-red-500 bg-red-500/10",
                        done && !isChoice && !isAnswer && "opacity-60",
                      )}
                    >
                      {done && isAnswer && <span aria-hidden>✅ </span>}
                      {done && isChoice && !isAnswer && <span aria-hidden>❌ </span>}
                      {label(o)}
                    </button>
                  );
                })}
              </div>
              {done && (
                <p
                  className={cn(
                    "rounded-lg p-3 text-sm",
                    right ? "bg-emerald-500/10 text-emerald-900 dark:text-emerald-200" : "bg-amber-500/10 text-amber-900 dark:text-amber-200",
                  )}
                >
                  <strong>{right ? "Right. " : "Not quite. "}</strong>
                  {q.explanation}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {answered === questions.length && (
        <p className="rounded-xl border bg-card p-4 text-center">
          {score === questions.length
            ? "Full marks. You may now explain RACI at parties (results not guaranteed)."
            : score >= questions.length - 3
              ? `${score} of ${questions.length}. Very nearly a knight of the merge queue.`
              : `${score} of ${questions.length}. 'Tis but a scratch: re-read the gates page and try again.`}
        </p>
      )}
    </div>
  );
}
