import { Frame } from "../../_components/frame";
import { Box, Down, FlowKey } from "../../_components/flow";
import { Callout, Cmd, H2, InternalLink, Source, Specimen } from "../../_components/marks";
import { meta } from "../../_data/nav";

export const metadata = meta("Before the first idea: a product brief");

export default function ProductPage() {
  return (
    <Frame
      href="/docs6/onramps/product"
      title="Before the first idea: a product brief"
      idea="When there is a whole product to shape, the work starts as evidence: a product brief built from real material, which later becomes many issues at once, and a contract the reviews enforce."
      lead={
        <p>
          This road is optional and interactive from end to end: every skill on it needs a person in the room, and none
          of them may be driven by an autonomous skill. It ends where the main journey’s stop 2 begins: issues.
        </p>
      }
    >
      <section className="flex flex-col gap-3">
        <H2>The product road</H2>
        <FlowKey />
        <div className="flex flex-col rounded-xl border bg-card/50 p-3 sm:p-4">
          <Box tone="person" title="Once, optional: `/om-setup-discovery-pipeline`">
            Switches the product layer on in `SDLC.md`: product roles, a Discovery stage, the Definition of Ready and
            protected product decisions. Without it, the backlog’s readiness check is skipped.
          </Box>
          <Down />
          <Box tone="agent" title='`/om-discover --mode client "Benefits portal for SMB clients"`'>
            A guided conversation over your research folder, interviews and data. Writes `.ai/specs/product-brief.md`, or a
            collection plan naming what to gather first.
          </Box>
          <Box tone="decide" title="Hard gate: nothing invented" className="mt-2">
            No made-up research, quotes or numbers. A missing fact stays unknown. A decision nobody confirmed stays a
            proposal. You confirm before the brief is written.
          </Box>
          <Down label="optional, when a key flow is worth testing" />
          <Box tone="agent" title='`/om-synthetic-users .ai/specs/product-brief.md --flow "first claim"`'>
            Personas built from the brief’s evidence walk the flow. Output: hypotheses tagged `[SYNTHETIC]`, each with the
            real-user check that would settle it. Never evidence.
          </Box>
          <Down label="optional, after that first panel" />
          <Box tone="agent" title='`/om-mockup-prototype .ai/specs/product-brief.md --flow "first claim"`'>
            A neutral, clickable low-fi prototype under `.ai/prototypes/discovery/`, checked in a browser.
          </Box>
          <Down />
          <Box tone="agent" title="`/om-discover --refresh`">Folds what was learned back into the brief, keeping every id and superseded decision.</Box>
          <Down />
          <Box tone="agent" title="`/om-backlog .ai/specs/product-brief.md --dry-run`">
            Drafts the tree (epics, stories with Given/When/Then acceptance criteria, tasks) and writes nothing.
          </Box>
          <Box tone="decide" title="You see the whole tree and say yes" className="mt-2">
            Then it files every issue through `om-prepare-issue`, epics first. A brief whose problem rests only on
            assumptions is refused, with an offer to file the research tasks instead.
          </Box>
          <Down />
          <Box tone="goal" title="Many issues, each ready for stop 4">
            Ids in the titles (`E01-S02 — …`), and a map in `.ai/specs/backlog.md`. The report suggests the first story to
            pick up.
          </Box>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Specimen kind="End of the om-discover report" title="machine-read lines">{`Product brief: .ai/specs/product-brief.md
Coverage: 23 claims — 15 sourced (interview 6, data 4, document 3, product 2, benchmark 0), 3 synthetic, 5 assumed
Collection plan: 2 entries waiting for material
Next: om-backlog .ai/specs/product-brief.md --dry-run`}</Specimen>
        <Specimen kind="product-brief.md, Decisions table" title="one row">{`| id  | Decision                           | Owner           | Status | Review by  |
|-----|------------------------------------|-----------------|--------|------------|
| D03 | Archiving an order is reversible   | Head of Support | active | 2027-03-01 |`}</Specimen>
      </section>

      <Callout title="The brief keeps working after the backlog">
        <p>
          Its Non-goals, Business rules and Decisions carry stable ids such as <code className="font-mono">N01</code>,{" "}
          <code className="font-mono">R03</code>, <code className="font-mono">D07</code>. A PR that builds a non-goal, or
          contradicts a rule or decision, without a superseding entry approved by its owner, is a <strong>blocker</strong>{" "}
          in review. Every PR body carries a “Decisions touched” section, so a newcomer reads the decisions in play at the
          PR, not in a chat history. More in <InternalLink href="/docs6/hood/loops">The road repairs itself</InternalLink>.
        </p>
      </Callout>

      <Cmd who="Then, per story">/om-auto-fix-issue &lt;first story number&gt;</Cmd>

      <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        Checked against: <Source path="skills/om-discover/SKILL.md" /> <Source path="skills/om-backlog/SKILL.md" />{" "}
        <Source path="skills/om-synthetic-users/SKILL.md" /> <Source path="skills/om-mockup-prototype/SKILL.md" />{" "}
        <Source path="SDLC.md" />
      </p>
    </Frame>
  );
}
