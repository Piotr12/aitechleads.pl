import type { ReactNode } from "react";
import { BookOpen, Bot, Hand, Megaphone, Package, Tag, User } from "lucide-react";
import { cn } from "./cx";
import { Md } from "./md";
import { AGENT, Cmd, DECIDE, LabelRow, PERSON, SkillChip } from "./marks";
import type { Station } from "../_data/stations";

function Row({ icon, title, children, className }: { icon: ReactNode; title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2 p-4", className)}>
      <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {icon}
        {title}
      </p>
      <div className="min-w-0 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-4 marker:text-muted-foreground">
      {items.map((t) => (
        <li key={t} className="break-words">
          <Md text={t} />
        </li>
      ))}
    </ul>
  );
}

/**
 * The hand-off slip: the same seven questions on every stop of the journey. Who starts it, what runs, what it
 * reads, what it leaves behind, which labels the work now carries, how it says "your turn", and who decides.
 */
export function Slip({ s }: { s: Station }) {
  const starter = /^(Called|Inside)/.test(s.run.who) ? "agent" : "person";
  return (
    <section aria-label="Hand-off slip" className="overflow-hidden rounded-xl border-2 border-foreground/70 bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-foreground/70 bg-muted/40 px-4 py-2">
        <p className="text-sm font-semibold">
          🧾 Hand-off slip · stop {s.n}
        </p>
        <p className="text-xs text-muted-foreground">
          {s.arrives} → <strong className="text-foreground">{s.leaves}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
        <Row
          icon={starter === "agent" ? <Bot className="size-3.5" aria-hidden /> : <User className="size-3.5" aria-hidden />}
          title={`1 · Started by: ${s.run.who}`}
          className={starter === "agent" ? AGENT : PERSON}
        >
          <div className="flex flex-col gap-2">
            <Cmd>{s.run.cmd}</Cmd>
            {s.inside.length > 0 && (
              <p className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                runs inside, untyped:
                {s.inside.map((n) => (
                  <SkillChip key={n} name={n} />
                ))}
              </p>
            )}
          </div>
        </Row>
        <Row icon={<Tag className="size-3.5" aria-hidden />} title="2 · Labels it carries now">
          {s.labels.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-muted-foreground">on {s.labelsOn}</p>
              <LabelRow labels={s.labels} />
            </div>
          ) : (
            <p className="text-muted-foreground first-letter:uppercase">{s.labelsOn}.</p>
          )}
        </Row>
      </div>

      <div className="grid grid-cols-1 divide-y border-t md:grid-cols-2 md:divide-x md:divide-y-0">
        <Row icon={<BookOpen className="size-3.5" aria-hidden />} title="3 · Reads">
          <List items={s.reads} />
        </Row>
        <Row icon={<Package className="size-3.5" aria-hidden />} title="4 · Leaves behind">
          <List items={s.leavesBehind} />
        </Row>
      </div>

      <div className="border-t">
        <Row icon={<Megaphone className="size-3.5" aria-hidden />} title="5 · Says “your turn” with">
          {s.markers.length > 0 ? (
            <pre className="overflow-x-auto rounded-lg border bg-muted/50 px-3 py-2 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]">
              {s.markers.join("\n")}
            </pre>
          ) : (
            <p className="text-muted-foreground">
              {s.id === "pickup"
                ? "No marker of its own: it calls the next skill directly, passing the spec reference verbatim."
                : "No marker: the next pieces of work are new issues, each starting its own trip."}
            </p>
          )}
        </Row>
      </div>

      <div className={cn("border-t-2 border-foreground/70", s.decide ? DECIDE : "bg-muted/30")}>
        <Row icon={<Hand className="size-3.5" aria-hidden />} title={s.decide ? `6 · A person decides: ${s.decide.who}` : "6 · Nobody decides here"}>
          <p className="max-w-3xl">
            <Md text={s.decide ? s.decide.what : (s.noDecide ?? "")} />
          </p>
        </Row>
      </div>
    </section>
  );
}
