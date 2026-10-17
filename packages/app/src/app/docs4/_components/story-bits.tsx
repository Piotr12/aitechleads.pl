/** The pieces of a chapter page: who is on stage, what they left behind, and the ledger. */
import { FileText, GitPullRequest, ListChecks, MessageSquare, ScrollText, SquareTerminal } from "lucide-react";
import Link from "@/app/docs4/_components/link";
import { ROLES, href, roleById } from "../_data";
import type { AgentTurn, Artefact, ArtefactKind, CastMember } from "../_data/story";
import { AgentBadge, Avatar, cx, Dot, MODE_LABEL, PresenceMark, SkillChip } from "./ui";

/** All seven roles in a row; the ones on stage are lit, the rest wait in the wings. */
export function CastLine({ cast }: { cast: CastMember[] }) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-2" aria-label="The cast, on stage and off">
      {ROLES.map((r) => {
        const member = cast.find((m) => m.role === r.id);
        return (
          <li key={r.id} className="flex w-12 flex-col items-center gap-1 text-center">
            <span className="relative">
              <Avatar role={r.id} dim={!member} />
              {member && (
                <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-background">
                  <PresenceMark as={member.as} />
                </span>
              )}
            </span>
            <span className={cx("text-[11px] leading-tight", member ? "font-medium" : "text-muted-foreground/60")}>
              {r.person}
            </span>
          </li>
        );
      })}
      <li className="flex w-12 flex-col items-center gap-1 text-center">
        <AgentBadge />
        <span className="text-[11px] leading-tight font-medium">agents</span>
      </li>
    </ul>
  );
}

export function CastList({ cast, agents }: { cast: CastMember[]; agents: AgentTurn[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <section className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-4">
        <h3 className="text-sm font-semibold">People on stage</h3>
        <ul className="flex flex-col gap-3">
          {cast.map((m) => {
            const r = roleById(m.role);
            return (
              <li key={m.role} className="flex min-w-0 gap-3">
                <Avatar role={m.role} size="sm" />
                <div className="flex min-w-0 flex-col">
                  <p className="flex flex-wrap items-center gap-1.5 text-sm">
                    <Link href={href.role(m.role)} className="font-medium hover:underline">
                      {r.person}
                    </Link>
                    <span className="text-muted-foreground">{r.name}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <PresenceMark as={m.as} />
                      {m.as}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">{m.note}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="flex min-w-0 flex-col gap-2 rounded-xl border border-dashed p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          Agents on stage <Dot kind="agent" />
        </h3>
        <ul className="flex flex-col gap-3">
          {agents.map((a) => (
            <li key={a.skill} className="flex min-w-0 flex-col items-start gap-1">
              <SkillChip id={a.skill} />
              <p className="text-sm text-muted-foreground">{a.did}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const KIND_ICON: Record<ArtefactKind, typeof FileText> = {
  terminal: SquareTerminal,
  comment: MessageSquare,
  review: GitPullRequest,
  file: FileText,
  plan: ListChecks,
  report: ScrollText,
};

function labelTone(label: string): string {
  if (["risk-high", "changes-requested", "qa-failed", "blocked", "do-not-merge"].includes(label))
    return "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300";
  if (["qa-approved", "merge-queue"].includes(label))
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  if (["needs-qa", "in-progress", "review", "qa"].includes(label))
    return "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300";
  return "bg-muted text-muted-foreground";
}

export function LabelChip({ label }: { label: string }) {
  return <span className={cx("rounded-full border px-2 py-0.5 font-mono text-[11px]", labelTone(label))}>{label}</span>;
}

export function ArtefactCard({ artefact }: { artefact: Artefact }) {
  const Icon = KIND_ICON[artefact.kind];
  return (
    <figure className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card">
      <figcaption className="flex flex-col gap-1.5 border-b bg-muted/40 px-4 py-2.5">
        <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
          <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="min-w-0 break-words">{artefact.title}</span>
        </span>
        <span className="text-xs text-muted-foreground">{artefact.meta}</span>
        {artefact.labels && (
          <span className="flex flex-wrap gap-1">
            {artefact.labels.map((l) => (
              <LabelChip key={l} label={l} />
            ))}
          </span>
        )}
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed whitespace-pre">{artefact.body}</pre>
    </figure>
  );
}

/** Two columns: what people decided, what agents did. */
export function Ledger({ decided, delegated }: { decided: string[]; delegated: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-2 rounded-xl border-l-4 border-red-600/70 bg-card p-4 dark:border-red-500/70">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Dot kind="decides" /> Decided by people
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
          {decided.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
      <div className="flex min-w-0 flex-col gap-2 rounded-xl border-l-4 border-foreground/30 bg-card p-4">
        <p className="flex items-center gap-2 text-sm font-semibold" title={MODE_LABEL.agent}>
          <Dot kind="agent" /> Done by agents
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
          {delegated.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
