"use client";

import { useState } from "react";
import { cn } from "./cx";
import { RoleChip, SkillChip, StopChip } from "./marks";
import { PICKER } from "../_data/picker";
import { SKILL_BY_NAME } from "../_data/skills";

/** "I have… → run this." Pick what is in front of you; the panel shows the one skill to start with. */
export function SkillPicker() {
  const [id, setId] = useState("issue");
  const pick = PICKER.find((p) => p.id === id) ?? PICKER[0];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <fieldset className="flex min-w-0 flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold">I have…</legend>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
          {PICKER.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={p.id === id}
              onClick={() => setId(p.id)}
              className={cn(
                "flex min-w-0 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                p.id === id ? "border-foreground bg-foreground text-background" : "bg-card hover:bg-muted",
              )}
            >
              <span aria-hidden>{p.emoji}</span>
              <span className="min-w-0 break-words">{p.have}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <section
        aria-live="polite"
        className="flex min-w-0 flex-col gap-4 self-start rounded-xl border-2 border-foreground/80 bg-card p-5 lg:sticky lg:top-32"
      >
        <p className="text-sm text-muted-foreground">
          <span aria-hidden>{pick.emoji}</span> With {pick.have}, start with
        </p>
        <div className="flex flex-col gap-2">
          <SkillChip name={pick.run} className="self-start px-2 py-1 text-base" />
          <p className="text-sm text-muted-foreground">{SKILL_BY_NAME[pick.run]?.line}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">You type</p>
          <code className="block rounded-md bg-muted px-3 py-2 font-mono text-xs break-words whitespace-pre-wrap">
            {pick.call}
          </code>
        </div>
        {pick.inside.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Runs inside, by itself</p>
            <ul className="flex flex-wrap gap-1.5">
              {pick.inside.map((x) =>
                SKILL_BY_NAME[x] ? (
                  <li key={x}>
                    <SkillChip name={x} />
                  </li>
                ) : (
                  <li key={x} className="rounded-md border border-dashed px-1.5 py-0.5 text-xs text-muted-foreground">
                    {x}
                  </li>
                ),
              )}
            </ul>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">You get</p>
          <p className="text-sm">{pick.get}</p>
        </div>
        {pick.alt && <p className="text-sm text-muted-foreground">💡 {pick.alt}</p>}
        <div className="flex flex-wrap items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
          Usually run by
          {pick.who.map((r) => (
            <RoleChip key={r} role={r} />
          ))}
          at
          <StopChip stage={pick.stage} />
        </div>
      </section>
    </div>
  );
}
