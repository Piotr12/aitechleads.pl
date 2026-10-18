import { ArrowDown } from "lucide-react";
import { ChapterShell } from "../../_components/chapter";
import { cn } from "../../_components/cx";
import {
  Artefact,
  Callout,
  Cmd,
  DecisionMark,
  Ext,
  Figure,
  LabelChip,
  PersonTag,
  SkillChip,
  Story,
} from "../../_components/marks";
import { meta, UP } from "../../_data/links";

export const metadata = meta("Week 2: Big work starts as a conversation");

const RAMPS: { n: number; when: string; next: string; skill?: string; taken?: boolean }[] = [
  { n: 1, when: "Question answered, or nothing worth building", next: "Next: none (the answer is the report)" },
  { n: 2, when: "Worth keeping, not now", next: "a parked, labelled issue", skill: "om-prepare-issue" },
  { n: 3, when: "A feature, blocking unknowns resolved", next: "a spec written unattended, on its own PR", skill: "om-auto-write-spec", taken: true },
  { n: 4, when: "A feature you want to co-design", next: "a spec written with you, question by question", skill: "om-spec-writing" },
  { n: 5, when: "A small, well-understood change", next: "straight to a PR", skill: "om-auto-create-pr" },
  { n: 6, when: "Already tracked (found in the tracker)", next: "the existing issue, built", skill: "om-auto-fix-issue" },
];

export default function Shaping() {
  return (
    <ChapterShell
      slug="shaping"
      know={[
        <>
          <Cmd>om-brainstorm</Cmd> is interactive only. It writes at most one brief, ends with a machine-readable{" "}
          <Cmd>Next:</Cmd> line, and never runs the next skill itself: you, or an orchestrator, do.
        </>,
        <>
          A spec lives on its own PR, labelled <LabelChip name="documentation" /> + <LabelChip name="skip-qa" />. When
          an issue drives it, the PR says <Cmd>Refs #issue</Cmd>, never <Cmd>Closes</Cmd>. Reviewing it triggers a
          specification review, not a code review.
        </>,
        <>
          Unattended specs never block on open questions: they post their defaults for you to correct. Anything marked{" "}
          <Cmd>⚠ NEEDS HUMAN CONFIRMATION</Cmd> keeps the spec PR a draft.
        </>,
        <>
          The Definition of Ready has two tiers. Only people can supply the ticket-level answers; agents name the gaps
          on the ticket and never fill them in.
        </>,
        <>
          Discovery skills tag synthetic findings <Cmd>[SYNTHETIC]</Cmd>: hypotheses to test with real users, never
          evidence.
        </>,
      ]}
    >
      <Story>
        <p>
          Week two brings the first big idea. Storms ground the swallows twice a month, and the dispatchers want to
          reschedule a whole day&apos;s deliveries at once. <PersonTag id="product" /> is not sure it is worth
          building, and is very sure it is not a one-line ticket. So the work starts as a conversation:
        </p>
        <p className="font-mono text-sm break-words">
          /om-brainstorm &quot;should dispatchers reschedule deliveries in bulk?&quot;
        </p>
        <p>
          <SkillChip name="om-brainstorm" /> asks one question at a time, puts at least two alternatives on the table
          plus &ldquo;build nothing&rdquo;, checks the tracker (read-only) for anything that already covers it, and
          sends a fresh-context challenger subagent to attack its own conclusion before Kasia sees it. Then it stops
          and asks her to confirm where the idea goes. It edits nothing in the repo on the way.
        </p>
      </Story>

      <Figure
        title="One conversation, six exits"
        caption={
          <>
            Every brainstorm ends on exactly one ramp, which Kasia confirms. Ramps 2 to 5 also write a handoff brief to{" "}
            <Cmd>.ai/specs/briefs/</Cmd>. Kasia took ramp 3.
          </>
        }
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-full max-w-md flex-col items-center gap-1 rounded-xl border-2 border-foreground bg-card p-3 text-center">
            <SkillChip name="om-brainstorm" />
            <p className="text-sm text-muted-foreground">questions · alternatives · tracker check · challenger</p>
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <DecisionMark /> Kasia confirms the route
            </p>
          </div>
          <ArrowDown className="size-5 text-muted-foreground" aria-hidden />
          <ol className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {RAMPS.map((r) => (
              <li
                key={r.n}
                className={cn(
                  "flex min-w-0 flex-col gap-1.5 rounded-xl border bg-card p-3",
                  r.taken && "border-2 border-amber-500",
                )}
              >
                <span className="text-xs font-semibold text-muted-foreground">
                  Ramp {r.n}
                  {r.taken && " · taken"}
                </span>
                <p className="text-sm font-medium leading-6">{r.when}</p>
                {r.skill && <SkillChip name={r.skill} />}
                <p className="text-xs text-muted-foreground">{r.next}</p>
              </li>
            ))}
          </ol>
        </div>
      </Figure>

      <Artefact title="The last lines of the brainstorm report" where="agent output">
        {`Next: om-auto-write-spec "Bulk reschedule for storm days — brief: .ai/specs/briefs/2026-10-12-bulk-reschedule.md"
Brief: .ai/specs/briefs/2026-10-12-bulk-reschedule.md`}
      </Artefact>

      <Story>
        <p>
          Kasia runs the <Cmd>Next:</Cmd> line. <SkillChip name="om-auto-write-spec" /> calls{" "}
          <SkillChip name="om-spec-writing" /> in its autonomous mode, so open questions do not stop it: the brief&apos;s
          resolved unknowns answer what they can, and the rest become documented defaults. The spec lands on its own
          branch and its own PR, labelled <LabelChip name="review" /> <LabelChip name="documentation" />{" "}
          <LabelChip name="skip-qa" />. (Had an issue driven the run, the PR would say <Cmd>Refs #issue</Cmd>, never{" "}
          <Cmd>Closes</Cmd>, so that merging a spec cannot close the feature request.) Because the feature has screens, it also attaches screenshots of today&apos;s app and static
          mockups of the proposed one.
        </p>
        <p>
          One default is risky (what happens to deliveries already in the air?), so the skill marks it{" "}
          <Cmd>⚠ NEEDS HUMAN CONFIRMATION</Cmd> and keeps the PR a draft. Kasia answers on the assumptions comment.{" "}
          <PersonTag id="designer" /> had already used <SkillChip name="om-ux-shape" /> to settle the screen&apos;s
          states (empty, loading, error, no permission) before anything was drawn. Tomek runs{" "}
          <Cmd>om-auto-review-pr</Cmd> on the spec PR and gets a <em>specification</em> review: what can go wrong,
          backward compatibility, what is missing, what could be better, and whether it is the simplest solution.
        </p>
      </Story>

      <Artefact title="The assumptions comment" where="comment on the spec PR">
        {`🤖 \`om-auto-write-spec\` — Open Questions answered with autonomous defaults

Applied these defaults in the spec; correct any answer before merge.

| #  | Question             | Applied default     | Why                    | Confirm?                   |
|----|----------------------|---------------------|------------------------|----------------------------|
| Q1 | Max per bulk action  | 200                 | one depot's day        | reversible                 |
| Q2 | Notify customers?    | one message each    | brief says "tell them" | reversible                 |
| Q3 | Deliveries in flight | leave unchanged     | safest for the swallow | ⚠ NEEDS HUMAN CONFIRMATION |

The PR remains draft until these assumptions are confirmed.`}
      </Artefact>

      <Figure
        title="Ready means: answers only people can give"
        caption={
          <>
            The two tiers of the Definition of Ready, from <Ext href={UP.sdlcAt.ready}>SDLC.md</Ext>. The product layer
            (<Cmd>om-setup-discovery-pipeline</Cmd>) puts it there.
          </>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl border-2 border-rose-600/40 bg-card p-3">
            <p className="flex items-center gap-1.5 font-semibold">
              <DecisionMark /> Ticket level: only a person
            </p>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-6">
              <li>the problem, and who has it</li>
              <li>the expected outcome, and how it will be checked</li>
              <li>what is out of scope</li>
              <li>open questions marked blocking or not; none blocking left open</li>
              <li>any autonomous assumption confirmed by a human</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border bg-card p-3">
            <p className="font-semibold">Spec level: a spec may supply</p>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-6">
              <li>acceptance criteria and business rules</li>
              <li>happy path and main unhappy paths</li>
              <li>impact on data and permissions; dependencies</li>
              <li>a link to mockups when users will see it</li>
            </ul>
            <p className="text-xs text-muted-foreground">Missing? Not a stop: om-auto-write-spec writes them.</p>
          </div>
        </div>
      </Figure>

      <Story>
        <p>
          Who checks it? <SkillChip name="om-auto-manage-issues" /> sweeps existing issues: adds missing labels,
          clarifies one-line issues (keeping the reporter&apos;s words), and posts a not-ready comment naming what is
          missing. <SkillChip name="om-auto-fix-issue" />&apos;s feature road stops with <Cmd>NOT_READY</Cmd> rather
          than guess. And when Kasia wants to park an idea without building it, <SkillChip name="om-prepare-issue" />{" "}
          files one deduplicated, labelled issue with a linked spec or step-by-step guidance.
        </p>
      </Story>

      <Callout title="Before the conversation: discovery (optional)">
        <p>
          A team starting a product, not a feature, goes one step earlier. <SkillChip name="om-discover" /> writes{" "}
          <Cmd>product-brief.md</Cmd> from real material, every claim tagged by its evidence and every decision owned by
          a person. <SkillChip name="om-synthetic-users" /> walks a flow with persona panels (hypotheses only),{" "}
          <SkillChip name="om-mockup-prototype" /> makes it clickable, and <SkillChip name="om-backlog" /> turns the
          brief into epics and stories after you approve the tree. The brief&apos;s non-goals, rules and decisions then
          bind every later review.
        </p>
      </Callout>
    </ChapterShell>
  );
}
