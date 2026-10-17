/**
 * The running examples, carried through every stage.
 *
 * Everything here is ILLUSTRATIVE: "Ledgerly" is a made-up invoicing app, the issues, PRs, people,
 * SHAs and timestamps are invented. The shapes (sections, labels, markers like "QA head:") follow
 * the templates in the open-mercato/skills repo.
 */
import type { RoleId } from "./roles";
import type { SkillName } from "./skills";
import type { StageId } from "./stages";

export const EXAMPLE = {
  product: "Ledgerly",
  productBlurb: "a made-up invoicing app used by small companies, some of which manage several companies in one account",
  feature: {
    issue: 412,
    title: "Customers want to export invoices as CSV",
    short: "CSV export",
    emoji: "📄",
  },
  bug: {
    issue: 418,
    title: "Discount applied twice at checkout",
    short: "Double discount",
    emoji: "🐞",
  },
};

export type ArtefactKind = "issue" | "comment" | "pr" | "review" | "terminal" | "file" | "report" | "code";

export type Artefact = {
  kind: ArtefactKind;
  /** Where you would see it, e.g. "Issue #412 · comment". */
  where: string;
  /** Who posted it. Agents post through the account of whoever runs them. */
  author: string;
  agent: boolean;
  /** Optional heading line (issue / PR title, file name). */
  heading?: string;
  labels?: string[];
  body: string;
  /** "What to notice" note under the artefact. */
  notice?: string;
};

export type StoryBeat = {
  who: RoleId | "agent";
  text: string;
  command?: string;
  skill?: SkillName;
};

export type Track = {
  summary: string;
  beats: StoryBeat[];
  artefacts: Artefact[];
};

export type StoryStep = {
  stage: StageId;
  title: string;
  intro: string;
  feature?: Track;
  /** When a track does not apply, say why. */
  featureSkip?: string;
  bug?: Track;
  bugSkip?: string;
  wrong: { what: string; then: string }[];
  /** Glossary term ids worth knowing for this step. */
  terms: string[];
  takeaway: string;
  /** Where the chart and the skills repo differ, and what this guide follows. */
  repoNote?: string;
  /** Side box (e.g. one-off setup, an alternative path). */
  aside?: { title: string; text: string; artefact?: Artefact };
};

export const STORY: StoryStep[] = [
  // ─────────────────────────────────────────────────────────────── 1
  {
    stage: "discovery",
    title: "Working out what to build",
    intro:
      "Before anyone writes a ticket, the product people find out what the problem really is, who has it, which rules apply and how the screens should behave. Agents help by asking questions, playing the skeptic and drafting documents, but people answer and approve.",
    feature: {
      summary:
        "Support keeps hearing “can I get my invoices into Excel?”. Priya (Product Owner) wants to know if that is a real problem worth solving, and what exactly to build.",
      beats: [
        {
          who: "product-owner",
          text: "Starts a discovery session. The agent first reads what already exists (5 interview notes, 23 support tickets), then asks two or three questions per round.",
          command: '/om-discover --mode existing "Invoice exports"',
          skill: "om-discover",
        },
        {
          who: "domain-expert",
          text: "Diego joins a round and states a rule: exported amounts stay in the invoice's own currency. The agent records it as rule R07, owner Diego.",
        },
        {
          who: "agent",
          text: "A fresh “skeptic” subagent re-reads the draft brief independently and flags one claim with no source behind it.",
        },
        {
          who: "product-owner",
          text: "Optionally tests the flow on a synthetic panel. Its findings are tagged [SYNTHETIC]: ideas to check with real users, never evidence.",
          command: '/om-synthetic-users .ai/specs/product-brief.md --flow "month-end export"',
          skill: "om-synthetic-users",
        },
        {
          who: "designer",
          text: "Iga shapes the flow and its states (empty, loading, error, no permission), then gets a clickable prototype to try with Priya.",
          command: '/om-ux-shape "Export the invoice list as CSV"',
          skill: "om-ux-shape",
        },
        {
          who: "architect",
          text: "Ada is consulted on feasibility and cost: streaming CSV from the existing list query, no new library. Cheap.",
        },
        {
          who: "product-owner",
          text: "Approves the brief (gate G1), asks for the backlog as a dry run, reviews the tree and says yes (gate G2). Only now are issues filed.",
          command: "/om-backlog .ai/specs/product-brief.md --dry-run",
          skill: "om-backlog",
        },
      ],
      artefacts: [
        {
          kind: "terminal",
          where: "Priya's terminal · om-discover, round 1",
          author: "om-discover",
          agent: true,
          body: `🤖 Round 1 of 3. I read 5 interview notes and 23 support tickets in .ai/specs/research/.

1. Think of the last time a customer asked for an export. What were they
   trying to do with the file afterwards?
2. Who in the customer's company does that work: the owner, an in-house
   accountant, or an outside bookkeeper?
3. Is there any rule about how amounts must appear (currency, sign of credit
   notes) that an export must not break?

> Priya: Month-end. Their accountant copies every invoice into a spreadsheet
> to reconcile against the bank. Takes them an afternoon. Ask Diego about Q3.`,
          notice: "The agent asks about real past events (“the last time…”), not “would you use an export?”. Stories beat opinions.",
        },
        {
          kind: "file",
          where: "Repository file",
          author: "om-discover (approved by Priya)",
          agent: true,
          heading: ".ai/specs/product-brief.md (excerpt)",
          body: `## Problems, with evidence
- Accountants re-type invoices into spreadsheets at month-end to reconcile
  with bank statements; one reports "an afternoon a month". [interview] i-03
- 14 of 23 support tickets since June ask for an export. [data] support-export.csv
- Customers would also pay for automatic monthly e-mails. [assumption] → A02

## Non-goals
| id  | non-goal                                   | owner | status |
|-----|--------------------------------------------|-------|--------|
| N02 | No scheduled / e-mailed exports this release | Priya | active |

## Business rules
| id  | rule                                              | owner | status |
|-----|---------------------------------------------------|-------|--------|
| R07 | Exported amounts stay in the invoice currency     | Diego | active |

## Decisions
| id  | decision                     | owner | status | review by  |
|-----|------------------------------|-------|--------|------------|
| D04 | CSV first; XLSX is "Later"   | Priya | active | 2027-03-31 |`,
          notice:
            "Every claim has a tag: [interview], [data], [assumption]. Every rule and decision has an id and an owner. These ids come back later: in the spec, the PR and the review.",
        },
        {
          kind: "report",
          where: "om-synthetic-users · walkthrough report",
          author: "om-synthetic-users",
          agent: true,
          body: `[SYNTHETIC] Persona "Ola, outside bookkeeper for 6 companies" (repeated in 2 of 2 runs):
  Barrier: exports one company at a time, then has to merge 6 files.
  Real-user check that would settle it: ask 3 bookkeepers in i-series
  interviews how many client companies they reconcile per month.`,
          notice: "Tagged [SYNTHETIC] and paired with the real check that would confirm it. It is a question to ask, not a fact.",
        },
        {
          kind: "terminal",
          where: "Priya's terminal · om-backlog --dry-run",
          author: "om-backlog",
          agent: true,
          body: `Proposed tree (nothing filed yet):

E3  Invoice export                                   (epic)
├── S3.1  Export the filtered invoice list as CSV     (story, 4 acceptance criteria)
│   ├── T3.1.1  CSV columns and encoding per D04, R07
│   └── T3.1.2  Export button + empty/loading/error states
└── S3.2  Credit notes appear as negative rows        (story, 2 acceptance criteria)

Adopts existing issue #377 "Excel export?" as S3.1 (same intent).
File these 5 issues? [yes / edit / no]`,
          notice: "Shows the whole tree first and adopts an old duplicate instead of filing a new one. Priya's “yes” is gate G2.",
        },
      ],
    },
    bugSkip:
      "The double-discount bug skips this stage: a broken checkout needs no market research. Its story starts at Intake, when support files it.",
    wrong: [
      {
        what: "The brief's main problem is only an [assumption] (nobody actually asked a customer).",
        then: "om-backlog refuses to plan delivery on it and offers a research backlog instead: go and find out first.",
      },
      {
        what: "Someone quotes a synthetic persona in a meeting as “users say…”.",
        then: "Wrong use. [SYNTHETIC] findings are hypotheses with a real-user check attached; they never count as evidence.",
      },
      {
        what: "A decision is written down but nobody is named as its owner.",
        then: "It stays a “proposal”. Only a decision with a human owner is binding later in review.",
      },
    ],
    terms: ["product-brief", "non-goal", "business-rule", "decision-id", "synthetic", "backlog", "prototype", "gate"],
    takeaway: "Humans own the answers and the approvals (G1 brief, G2 backlog); agents ask, challenge and draft.",
    repoNote:
      "SDLC.md also lists a per-ticket “Design” stage between Claim and Implement (om-ux-shape settles a user-facing ticket's states before code). The chart folds that work into Discovery & Design plus “design support” during Implement. This guide follows the chart's columns and points this out where it matters.",
    aside: {
      title: "Before any of this: Max sets up the factory (once)",
      text: "The Maintainer ran om-setup-agent-pipeline once, which inspected the repo, asked a few questions and wrote .ai/agentic.config.json plus SDLC.md (the team's process doc). Then om-setup-discovery-pipeline switched on the product layer: product roles, the Discovery stage and the Definition of Ready. Every other skill reads that config.",
      artefact: {
        kind: "file",
        where: "Repository file",
        author: "om-setup-agent-pipeline",
        agent: true,
        heading: ".ai/agentic.config.json (excerpt)",
        body: `{
  "baseBranch": "main",
  "tracker": "github",
  "validation": { "commands": ["npm run typecheck", "npm test", "npm run build"] },
  "qaGate": true,
  "discovery": { "enabled": true, "roles": { "domainExpert": true, "designer": true } }
}`,
        notice: "The checks every change must pass (“validation gate”) are just the commands listed here.",
      },
    },
  },

  // ─────────────────────────────────────────────────────────────── 2
  {
    stage: "intake",
    title: "Turning it into a ticket",
    intro:
      "Work enters the delivery line as a GitHub issue. Agents make the issue well-formed (no duplicates, the right labels, clear sections); a human checks it is ready to start: the Definition of Ready.",
    feature: {
      summary: "om-backlog files story S3.1 through om-prepare-issue. It becomes issue #412.",
      beats: [
        {
          who: "agent",
          text: "Searches for duplicates (2–3 differently worded searches), links the brief, fills the sections and applies the SDLC labels: one category, one priority, one risk.",
          skill: "om-prepare-issue",
        },
        {
          who: "domain-expert",
          text: "Diego confirms the ticket breaks no rule of his. The agent already checked it against the non-goals in product-brief.md.",
        },
        {
          who: "product-owner",
          text: "Priya checks the Definition of Ready: who has the problem, the expected result and how it is checked, what is out, no blocking question open. Ready (gate G3).",
        },
      ],
      artefacts: [
        {
          kind: "issue",
          where: "GitHub · issue #412",
          author: "priya",
          agent: true,
          heading: "S3.1 Export the filtered invoice list as CSV",
          labels: ["feature", "priority-medium", "risk-medium"],
          body: `Epic: #409

## 🎯 Change
Accountants at our customers re-type invoices into spreadsheets at month-end
to reconcile with the bank (brief: Problems). They need the invoice list, as
currently filtered, as a CSV file they can open in any spreadsheet tool.

## 📋 Scope
Invoice list page only. Out of scope: XLSX (D04), scheduled or e-mailed
exports (N02), currency conversion (R07).

## ✅ Done when
- The "Export CSV" button downloads exactly the rows the current filter shows.
- Amounts are in the invoice currency (R07); credit notes are negative rows.
- A user without the "view invoices" permission sees no button.

## 📝 Spec
Not yet. Design authority: .ai/specs/product-brief.md. A spec is owed
before implementation.

## ⚠️ Open questions
- Q1 Column order: follow the on-screen table? (non-blocking)

Pick up with: om-auto-fix-issue 412`,
          notice: "Who (accountants), what result (a CSV of the filtered list), how checked (Done when), what is out (XLSX, scheduled). That is the ticket-level Definition of Ready.",
        },
        {
          kind: "comment",
          where: "Issue #412 · comment",
          author: "priya",
          agent: true,
          body: `🤖 \`om-prepare-issue\` — 🏷️ label rationale
✨ feature: a new capability; nothing exports invoices today.
🟡 priority-medium: a net-new feature, no outage or regression involved.
🟠 risk-medium: an ordinary single-area change that ships with tests.`,
          notice: "One label per line, each with a reason. Watch the risk label: at Triage, Ada will change it.",
        },
        {
          kind: "comment",
          where: "Issue #415 (a different, laconic issue) · comment",
          author: "max",
          agent: true,
          body: `🤖 \`om-auto-manage-issues\` — not ready

@tomek 📋 this issue does not yet meet the Definition of Ready in \`SDLC.md\`. Missing:

- who has the problem (a user or a role)
- the expected outcome and how it will be checked
- what is out of scope

⛔ \`om-auto-fix-issue\` will not implement a feature until these are on the ticket.
Add them here, or write "ready as is" to waive.`,
          notice: "Issue #415 just said “export pls”. The agent does not invent the answers: it names what a human must add.",
        },
      ],
    },
    bug: {
      summary:
        "Tomek from support files #418: a customer says the cart shows a discount twice. One line and a screenshot.",
      beats: [
        {
          who: "agent",
          text: "Max's nightly om-auto-manage-issues run finds the laconic issue, reads the screenshot, posts its understanding as a comment and adds the missing labels.",
          command: "/om-auto-manage-issues",
          skill: "om-auto-manage-issues",
        },
        {
          who: "product-owner",
          text: "For a bug, “ready” means reproducible. Only the ticket-level items apply; the real reproducibility check is Triage.",
        },
      ],
      artefacts: [
        {
          kind: "issue",
          where: "GitHub · issue #418",
          author: "tomek",
          agent: false,
          heading: "Discount shows twice in cart",
          body: `Customer (Acme Sp. z o.o.) used code AUTUMN10 and the cart shows -10% twice.
Screenshot attached. They are angry.

📸 cart-autumn10.png`,
          notice: "Realistic first reports are short. That is fine: the agent clarifies, a human does not have to rewrite it.",
        },
        {
          kind: "comment",
          where: "Issue #418 · comment",
          author: "max",
          agent: true,
          body: `🤖 \`om-auto-manage-issues\` — my understanding

The screenshot shows the cart summary with two "AUTUMN10 −10%" lines and a
total of 81.00 PLN for a 100.00 PLN cart (expected 90.00 PLN).
If the 81.00 is also what was charged, this is a pricing bug, not only a
display bug. Not verified in code yet.

🏷️ label rationale
🐛 bug: existing behaviour is wrong (reported total does not match the coupon).
🟡 priority-medium: an ordinary bug fix, no outage reported.
🟠 risk-medium: reads as a cart-summary display issue; re-assess if the
   charged amount is affected.`,
          notice: "The agent separates what it saw (the screenshot) from what it has not verified (the code). Remember that last line.",
        },
      ],
    },
    wrong: [
      {
        what: "Someone files “Export invoices to spreadsheet” although #377 already asks for it.",
        then: "om-prepare-issue's duplicate search finds #377 and adds the new detail there instead of filing a copy.",
      },
      {
        what: "A feature ticket has no “who” and no “done when”.",
        then: "Not-ready comment; om-auto-fix-issue stops with NOT_READY instead of guessing. Nothing is claimed, so no lock is left behind.",
      },
      {
        what: "A one-line typo ticket lacks an “out of scope” section.",
        then: "The Maintainer may waive it: “ready as is: typo fix”, written on the ticket so the waiver is visible.",
      },
    ],
    terms: ["issue", "label", "dor", "priority-risk", "dedupe"],
    takeaway: "Agents make tickets tidy; a human decides they are ready (G3). Gaps are named on the ticket, never filled with guesses.",
  },

  // ─────────────────────────────────────────────────────────────── 3
  {
    stage: "triage",
    title: "Is it real, and is anyone on it?",
    intro:
      "Triage is a quick, read-only check before anyone spends effort: is the problem real, still unfixed on main, and not already being handled? If there is nothing to do, the chain stops cleanly. Nothing is claimed yet, so a stop leaves no mess.",
    bug: {
      summary: "Sam starts the agent on #418. It sees the bug label and takes the bug route, whose first step is triage.",
      beats: [
        {
          who: "developer",
          text: "Hands the issue number to the single entry point.",
          command: "/om-auto-fix-issue 418",
          skill: "om-auto-fix-issue",
        },
        {
          who: "agent",
          text: "Runs om-verify-in-repo, read-only: is the issue open, unclaimed, not fixed by a merged PR or commit, not covered by an open PR, and actually a bug?",
          skill: "om-verify-in-repo",
        },
        {
          who: "architect",
          text: "Ada reads the result: the charged total is wrong, so it is money. She changes risk-medium to risk-high and says why (she settles risk disputes).",
        },
        {
          who: "maintainer",
          text: "Max is consulted and agrees. Priya is informed of the outcome.",
        },
      ],
      artefacts: [
        {
          kind: "terminal",
          where: "Sam's terminal · om-verify-in-repo output",
          author: "om-verify-in-repo",
          agent: true,
          body: `Real and still unfixed on main (a1b2c3d). applyDiscount() runs in
cart.recalculate() (src/cart/recalculate.ts:41) and again in
checkout.submit() (src/checkout/submit.ts:88), so the charged total is
wrong, not only the summary. No open or merged PR references #418; no
claim on the issue. Root cause likely in src/checkout/submit.ts.`,
          notice: "Cites evidence (file:line, commit). This paragraph is the “proceed” shape; the chain continues to the claim.",
        },
        {
          kind: "terminal",
          where: "For comparison · triage of a different issue (#402)",
          author: "om-verify-in-repo",
          agent: true,
          body: `NO_ACTION_NEEDED
#402 "Logo blurry on PDF invoices" was fixed by PR #397 (merged 2026-10-09,
commit 77e0d1f): src/pdf/header.ts now embeds the SVG logo. The issue was
left open because the PR said "related to #402" instead of "fixes #402".`,
          notice: "The literal token NO_ACTION_NEEDED stops the whole chain. No branch, no claim, no wasted run.",
        },
        {
          kind: "comment",
          where: "Issue #418 · comment",
          author: "ada",
          agent: false,
          body: `Bumping to risk-high. Triage shows the charged total is wrong, so this is
money, and SDLC.md lists money under risk-high. That means: tests for the
failure, retry and idempotency paths, a second person's review (me), and
no self-QA. — Ada`,
          notice: "A human decision with its reason, written where everyone will see it. The label is now risk-high.",
        },
      ],
    },
    feature: {
      summary: "Sam also starts #412. The agent sees the feature label and takes the feature route, which has its own triage gate.",
      beats: [
        {
          who: "agent",
          text: "Feature triage: not already built, not in flight in another PR, and the ticket passes the ticket-level Definition of Ready. Proceed.",
          command: "/om-auto-fix-issue 412",
          skill: "om-auto-fix-issue",
        },
        {
          who: "architect",
          text: "Ada adds one thing: an export reads data per company, which SDLC.md calls data scoping. So #412 becomes risk-high too, and needs an isolation test.",
        },
      ],
      artefacts: [],
    },
    wrong: [
      {
        what: "An open PR already says “Fixes #418”.",
        then: "Triage stops with NO_ACTION_NEEDED and links that PR. Duplicate work avoided.",
      },
      {
        what: "The behaviour is intentional (e.g. two different coupons stacking on purpose).",
        then: "NO_ACTION_NEEDED with the evidence (the test or doc that says so). Triage is biased toward stopping when it cannot defend “real”.",
      },
      {
        what: "The issue mixes a bug and a new feature.",
        then: "The agent stops and asks for the issue to be split rather than guessing which route to take.",
      },
    ],
    terms: ["triage", "main", "priority-risk", "risk-high", "no-action-needed"],
    takeaway: "Triage is read-only and stops early. People settle the judgement calls: is it risk-high, should it be blocked.",
  },

  // ─────────────────────────────────────────────────────────────── 4
  {
    stage: "claim",
    title: "Putting a name on it",
    intro:
      "Several agents (and people) may be working at once. Before changing anything, the author claims the ticket with three visible signals: assignee, the in-progress label and a 🤖 claim comment. Anyone who sees a claim backs off.",
    bug: {
      summary: "Triage said “proceed”, so the fix step (om-fix) claims #418 in Sam's name.",
      beats: [
        {
          who: "agent",
          text: "Assigns the issue to Sam (the account running the agent), adds in-progress, posts the claim comment.",
          skill: "om-fix",
        },
        {
          who: "developer",
          text: "Sam is accountable for the claim: he either works the ticket by hand or, as here, supervises the agent doing it.",
        },
        {
          who: "agent",
          text: "Five minutes later, Ola's scheduled agent also picks #418 from the queue, sees the claim, and backs off.",
        },
        {
          who: "maintainer",
          text: "Max sees the claim comments go by (informed). He may clear a stale claim if a run died.",
        },
      ],
      artefacts: [
        {
          kind: "comment",
          where: "Issue #418 · comment",
          author: "sam",
          agent: true,
          labels: ["bug", "priority-medium", "risk-high", "in-progress"],
          body: "🤖 Claiming this issue — starting `om-fix` run. Started: 2026-10-17T09:02:11Z.",
          notice: "Signal 1: assignee sam. Signal 2: the in-progress label. Signal 3: this comment. Any one of them makes other agents back off.",
        },
        {
          kind: "terminal",
          where: "Ola's terminal · a second agent arriving",
          author: "om-auto-fix-issue",
          agent: true,
          body: `Issue #418 is in progress (owner: sam, signal: in-progress label +
claim comment 3 minutes old). Override and continue? [y/N]`,
          notice: "It asks instead of colliding. With --force it would continue, but must post an override comment naming the previous owner.",
        },
        {
          kind: "comment",
          where: "A different issue · stale claim taken over",
          author: "ola",
          agent: true,
          body: "🤖 Previous claim by sam appears stale (26 h); taking over.",
          notice: "Claims expire when the claimant goes quiet for the stale window. Taking over is allowed, but always announced.",
        },
      ],
    },
    feature: {
      summary: "Same three signals on #412, posted by the feature route before it resolves the spec.",
      beats: [
        {
          who: "agent",
          text: "Claims #412. There is no spec yet, so the next step will be writing one.",
          skill: "om-auto-fix-issue",
        },
      ],
      artefacts: [],
    },
    wrong: [
      {
        what: "Two agents start the same ticket at the same time.",
        then: "The three-signal check makes the second one stop and report the owner. Without --force it never overwrites a live claim.",
      },
      {
        what: "An agent crashes mid-run and leaves in-progress behind.",
        then: "After the stale window with no activity, another run may take over with an announced takeover note, or the Maintainer clears it.",
      },
      {
        what: "The agent finished and is only waiting for CI to report.",
        then: "It swaps in-progress for ci-monitoring, which is not a claim: others may act on the item freely.",
      },
    ],
    terms: ["claim", "in-progress", "agent", "stale-lock"],
    takeaway: "A claim is three public signals. Polite agents check them first and back off.",
  },

  // ─────────────────────────────────────────────────────────────── 5
  {
    stage: "implement",
    title: "Making the change",
    intro:
      "Bugs get a root-cause analysis, then the smallest fix plus a regression test. Features get a spec first (approved by the Architect), then the build. Everything runs in an isolated worktree and must pass the validation gate before a PR is opened.",
    bug: {
      summary: "Two building blocks run in a row: om-root-cause (read-only) finds where to change, om-fix makes the change.",
      beats: [
        {
          who: "agent",
          text: "om-root-cause writes a short brief: summary, root cause with file:line, files to change, approach, risks.",
          skill: "om-root-cause",
        },
        {
          who: "agent",
          text: "om-fix makes the minimal change, adds a regression test that fails before the fix and passes after, then runs the validation gate.",
          skill: "om-fix",
        },
        {
          who: "developer",
          text: "Sam guides and checks: does the cause make sense, is the diff small, does the test really cover the bug?",
        },
      ],
      artefacts: [
        {
          kind: "report",
          where: "Chain hand-off · om-root-cause brief",
          author: "om-root-cause",
          agent: true,
          body: `Summary: AUTUMN10 is applied twice when the order is submitted.
Root cause: checkout.submit() calls applyDiscount() on a cart whose total
  cart.recalculate() already discounted (src/checkout/submit.ts:88,
  src/cart/recalculate.ts:41). Reproduced with a unit test.
Files to change: src/checkout/submit.ts, src/checkout/submit.test.ts
Approach: submit() uses the recalculated total; applyDiscount() stays the
  single place that applies coupons. Add a regression test.
Risks: money path. Retried submits must not re-apply the coupon.`,
          notice: "Short and specific. If it were unsure it would end with LOW_CONFIDENCE, and a human would look harder at the fix.",
        },
        {
          kind: "code",
          where: "src/checkout/submit.test.ts (added by om-fix)",
          author: "om-fix",
          agent: true,
          body: `it("applies a coupon once per order (#418)", async () => {
  const cart = await cartWith({ items: [item(100_00)], coupon: "AUTUMN10" });
  const order = await submit(cart);
  expect(order.totalCents).toBe(90_00); // was 81_00 before the fix
});`,
          notice: "A regression test: it proves the bug is gone and fails loudly if it ever comes back.",
        },
        {
          kind: "terminal",
          where: "Validation gate · run by om-fix",
          author: "om-fix",
          agent: true,
          body: `npm run typecheck   ✅ pass
npm test            ✅ pass  (412 tests, 1 new)
npm run build       ✅ pass
Status: complete`,
          notice: "The gate is just the commands from the config. Any non-zero exit blocks the PR.",
        },
      ],
    },
    feature: {
      summary: "#412 has no spec, so the feature route writes one first, on its own design-only PR.",
      beats: [
        {
          who: "agent",
          text: "om-auto-write-spec drafts the spec, answers its own open questions with documented defaults, attaches mockups and opens spec PR #430 (Refs #412).",
          command: "/om-auto-write-spec 412",
          skill: "om-auto-write-spec",
        },
        {
          who: "architect",
          text: "Ada reviews and approves the spec: data model, API, and the multi-company scoping. She asks for an isolation test.",
        },
        {
          who: "domain-expert",
          text: "Diego is consulted because the spec touches R07; he answers how credit notes appear.",
        },
        {
          who: "designer",
          text: "Iga answers design questions as the screens are built (button placement, the empty state).",
        },
        {
          who: "qa",
          text: "Quinn boots the app once; the screenshots and QA runs later reuse it.",
          command: "/om-prepare-test-env",
          skill: "om-prepare-test-env",
        },
        {
          who: "developer",
          text: "Sam starts the build from the approved spec. It runs in an isolated worktree, phase by phase, and checks the work against the spec.",
          command: "/om-auto-implement-spec 2026-10-17-invoice-csv-export",
          skill: "om-auto-implement-spec",
        },
      ],
      artefacts: [
        {
          kind: "file",
          where: "Spec PR #430",
          author: "sam",
          agent: true,
          heading: ".ai/specs/2026-10-17-invoice-csv-export.md (excerpt)",
          body: `# Export the filtered invoice list as CSV

## 📝 TLDR
Accountants get the invoice list, as filtered on screen, as a UTF-8 CSV.
One new endpoint, no new tables.

## 📝 API Contracts
GET /api/invoices/export.csv?<same filters as the list>
  → 200 text/csv, streamed; 403 without "invoices.view".
  Rows are always scoped to the caller's current company.

## 📝 Risks & Impact Review
- Data scoping (risk-high): a missing company filter would leak another
  company's invoices. Mitigation: reuse the list query's scope; add an
  isolation test (company A cannot export company B).
- Large exports: stream rows; never load all invoices into memory.

## 📝 Decisions in play
D04 (CSV first) honoured · R07 (invoice currency) honoured · N02 (no
scheduled exports) honoured.

## Resolved assumptions (autonomous defaults)
- Q1 Column order follows the on-screen table. ⚠ NEEDS HUMAN CONFIRMATION`,
          notice: "Decisions in play repeats the brief's ids so reviewers can check them. The agent's guesses are listed for a human to confirm, not hidden.",
        },
        {
          kind: "comment",
          where: "Spec PR #430 · reply to the assumptions comment",
          author: "priya",
          agent: false,
          body: `Q1: confirmed, follow the on-screen order. But put "Invoice number" first
even if the user hid that column; accountants match on it.`,
          notice: "Answering on the PR is how you override an autonomous default. On the next discovery refresh this becomes a recorded decision with Priya as owner.",
        },
      ],
    },
    wrong: [
      {
        what: "The root cause is unclear.",
        then: "om-root-cause ends with LOW_CONFIDENCE; the chain continues but the PR says so, and the human reviewer looks harder.",
      },
      {
        what: "A test fails in the validation gate.",
        then: "No PR is opened on red. The agent fixes it or stops with Status: blocked and releases its claim with an explanation.",
      },
      {
        what: "The agent wants to “tidy up” the whole pricing module while it's there.",
        then: "Out of scope. Minimal change now; the refactor becomes a follow-up issue.",
      },
    ],
    terms: ["spec", "adr", "root-cause", "regression-test", "worktree", "validation-gate", "autonomous-default"],
    takeaway: "Bugs: cause → smallest fix → regression test. Features: spec approved by the Architect → build. Nothing leaves this stage red.",
    repoNote:
      "The chart says the Architect writes or approves “the spec and ADRs”. The skills repo has no dedicated ADR skill: decisions live in the spec's “Decisions in play”, in product-brief.md's Decisions table, and in the repo's own DECISIONS.md. The guide explains ADR as a general term in the glossary.",
  },

  // ─────────────────────────────────────────────────────────────── 6
  {
    stage: "pull-request",
    title: "Packaging the change",
    intro:
      "A pull request (PR) is a proposal to merge a branch into main. Its description is the one explanation of the change, written for someone deciding whether it belongs in the codebase. The agent opens it with the full label set; the developer makes sure it reads right.",
    bug: {
      summary: "om-open-pr commits, pushes and opens PR #431 for the discount fix, then hands its lock straight to the reviewer agent.",
      beats: [
        {
          who: "agent",
          text: "Opens the PR with the standard body, applies the labels (pipeline + category + priority + risk + QA), posts a short run summary.",
          skill: "om-open-pr",
        },
        {
          who: "developer",
          text: "Sam reads the description first and sharpens one sentence about why the fix is safe for retried submits.",
        },
        {
          who: "architect",
          text: "Ada is consulted: the change touches payments, so she checks the PR names the money risks.",
        },
      ],
      artefacts: [
        {
          kind: "pr",
          where: "GitHub · PR #431",
          author: "sam",
          agent: true,
          heading: "fix(checkout): apply the discount once per order",
          labels: ["review", "bug", "priority-medium", "risk-high", "needs-qa"],
          body: `Closes #418

## 🎯 What changes
Customers using a coupon at checkout were charged the discount twice
(100.00 PLN with AUTUMN10 charged 81.00 instead of 90.00).
checkout.submit() re-applied the coupon to a total that
cart.recalculate() had already discounted. Now submit() uses the
recalculated total, and applyDiscount() is the only place coupons apply.

## 📋 Scope
Checkout submit only. The cart summary already showed the right lines
after recalculation; no display change.

## 🧪 Validation
typecheck ✅ · tests ✅ (2 new: single coupon, retried submit) · build ✅
UI QA: pending (needs-qa). risk-high: second review required.`,
          notice: "Closes #418 links the issue (it will auto-close on merge). The description explains the cause and the consequence, not the history of the work.",
        },
        {
          kind: "comment",
          where: "PR #431 · comment",
          author: "sam",
          agent: true,
          body: `## 🤖 \`om-open-pr\` — run summary
**Final status:** complete
Opened ready PR #431 with the coupon fix and two regression tests.
🧪 Validation gate green locally; CI running. QA approval still required (needs-qa).
Lock handed off to \`om-auto-review-pr\` — chain continues on this PR.`,
          notice: "The lock is handed over, never dropped: the PR is never “unclaimed” between skills.",
        },
      ],
    },
    feature: {
      summary: "om-auto-implement-spec finishes the build and opens PR #433, with screenshots of the working app.",
      beats: [
        {
          who: "agent",
          text: "Opens PR #433 with Closes #412, the spec path, and a “Decisions touched” section. Attaches screenshots from the running app.",
          skill: "om-auto-implement-spec",
        },
        {
          who: "developer",
          text: "If Sam had built part of it by hand, om-check-and-commit would run the gate, fix small drift and push when green.",
          command: "/om-check-and-commit",
          skill: "om-check-and-commit",
        },
      ],
      artefacts: [
        {
          kind: "pr",
          where: "GitHub · PR #433 (excerpt)",
          author: "sam",
          agent: true,
          heading: "feat(invoices): export the filtered invoice list as CSV",
          labels: ["review", "feature", "priority-medium", "risk-high", "needs-qa"],
          body: `Closes #412
Source doc: .ai/specs/2026-10-17-invoice-csv-export.md

## 📋 Decisions touched
- D04 CSV first: honoured (no XLSX).
- R07 invoice currency: honoured (amounts exported as stored).
- N02 no scheduled exports: honoured.`,
          notice: "Every PR lists the brief's decisions it relies on. A newcomer reads them here, not in a chat history.",
        },
      ],
    },
    wrong: [
      {
        what: "The PR description says “fixes stuff”.",
        then: "Reviewers cannot judge it. The template asks what changes for whom, why, the scope and what was validated.",
      },
      {
        what: "A second run tries to open another PR for the same issue.",
        then: "Skills look for an existing PR first and continue on it. No duplicates.",
      },
      {
        what: "Work is half-done.",
        then: "Only then is a PR a draft. A finished autonomous run always leaves a ready, fully labelled PR.",
      },
    ],
    terms: ["pr", "branch", "label", "needs-qa", "chain-markers"],
    takeaway: "One clear explanation, the full label set, and an unbroken lock from one skill to the next.",
  },

  // ─────────────────────────────────────────────────────────────── 7
  {
    stage: "review",
    title: "Second pair of eyes",
    intro:
      "A reviewer reads the change and either approves it or requests changes. An agent always reviews; risky work also needs an independent human (gate G4). If the PR changes a decision someone owns, that owner must agree (gate G5). The design pass is advisory.",
    bug: {
      summary: "The reviewer agent reviews #431, finds a missing test, and the developer's agent fixes it. Then Ada does the human review.",
      beats: [
        {
          who: "agent",
          text: "om-auto-review-pr reviews in its own worktree with the om-code-review checklist and runs the whole validation gate.",
          skill: "om-auto-review-pr",
        },
        {
          who: "developer",
          text: "Sam answers the review: agrees with the missing test, disagrees with a naming nit and explains why.",
        },
        {
          who: "agent",
          text: "om-auto-continue-pr adds the agreed test and asks for another review. Re-review: approved. Label moves to merge-queue (needs-qa stays).",
          command: "/om-auto-continue-pr 431",
          skill: "om-auto-continue-pr",
        },
        {
          who: "architect",
          text: "Ada reviews independently, as the policy requires for risk-high money changes, and approves (gate G4).",
        },
      ],
      artefacts: [
        {
          kind: "review",
          where: "PR #431 · review (changes requested)",
          author: "sam",
          agent: true,
          body: `# 🔍 Code Review: fix(checkout): apply the discount once per order

## Verdict
❌ request changes — risk-high money change lacks the idempotency evidence
SDLC.md requires; add the test below, then re-request review.

## 🎯 Summary
Customers are charged the coupon once instead of twice. Checkout only.

## Findings
### ⛔ Blocker
- \`src/checkout/submit.test.ts\` — money path without an idempotency
  test: a retried submit (network timeout, double click) is not covered.
  Add "submitting the same cart twice creates one order at 90.00".
### Nit
- \`src/checkout/submit.ts:86\` — \`total2\` could be \`discountedTotal\`.

## 🧪 Validation Gate
| Command           | Status | Evidence |
|-------------------|--------|----------|
| npm run typecheck | PASS   |          |
| npm test          | PASS   | 413 tests |
| npm run build     | PASS   |          |`,
          notice: "Verdict first, then findings ranked blocker → major → minor → nit, each with file:line and a concrete fix. Any blocker means “request changes”.",
        },
        {
          kind: "comment",
          where: "PR #431 · reply",
          author: "sam",
          agent: false,
          body: `Agree on the idempotency test, adding it now.
On the nit: I'd keep "total2" out; I'm removing that variable entirely in
the fix (submit() now reads cart.total), so the name goes away.`,
          notice: "Disagreeing is allowed. Explain why; do not silently ignore a finding.",
        },
        {
          kind: "comment",
          where: "PR #431 · review",
          author: "ada",
          agent: false,
          body: `Approved. Independent review for risk-high (money): read the diff and both
new tests, retried submit is covered. — Ada`,
          notice: "Gate G4: a second, independent person. The agent's approval alone is not enough for risk-high.",
        },
      ],
    },
    feature: {
      summary: "PR #433's first version had a surprise in it. Review caught it against the brief.",
      beats: [
        {
          who: "agent",
          text: "The review finds the export converts amounts to PLN. That contradicts rule R07 with no superseding entry: a blocker that quotes R07 and its owner.",
          skill: "om-code-review",
        },
        {
          who: "domain-expert",
          text: "Diego, owner of R07, declines to change the rule (gate G5). The conversion is removed.",
        },
        {
          who: "designer",
          text: "Iga runs the advisory design pass on the screens. Findings ranked by user impact; it informs the review, it does not hold the merge.",
          command: "/om-ux-review-pr 433",
          skill: "om-ux-review-pr",
        },
        {
          who: "maintainer",
          text: "Max's daily sweep reviews any PR that nobody has looked at yet.",
          command: "/om-review-prs",
          skill: "om-review-prs",
        },
      ],
      artefacts: [
        {
          kind: "review",
          where: "PR #433 · review finding",
          author: "sam",
          agent: true,
          body: `### ⛔ Blocker
- \`src/invoices/export.ts:52\` — amounts are converted to the company's
  home currency. product-brief.md R07 (owner: Diego, active): "Exported
  amounts stay in the invoice currency." No superseding entry in this PR.
  Fix: export the stored amount and currency, or add a superseding rule
  approved by Diego in this PR.`,
          notice: "The way out is never just “delete the code”: either respect the rule or change it explicitly with its owner's approval.",
        },
        {
          kind: "comment",
          where: "PR #433 · design review (advisory)",
          author: "iga",
          agent: true,
          body: `🔍 om-ux-review-pr — 1 high-impact finding
High: on export failure the toast says "Error 500". Users cannot tell what
to do. Pattern: the app's existing ErrorToast with a retry action.
Done when: the toast says "Export failed. Try again" and offers Retry.`,
          notice: "Ranked by user impact, with a done-when. Advisory: QA runs the objective state checks.",
        },
      ],
    },
    wrong: [
      {
        what: "CI is red when the review runs.",
        then: "The failing check is reported as a blocker together with the full code review, so the author gets everything in one cycle.",
      },
      {
        what: "The reviewer approves a needs-qa PR.",
        then: "That is code approval, not QA approval. The PR waits in merge-queue until QA signs off.",
      },
      {
        what: "Someone wants to change a decision (e.g. add XLSX).",
        then: "Fine, explicitly: a superseding entry (D09 replacing D04) approved by its owner, in the same PR.",
      },
    ],
    terms: ["review", "severity", "independent-review", "decision-change", "merge-queue", "changes-requested"],
    takeaway: "Agents review everything; humans review the risky parts (G4) and own their decisions (G5). Design review advises.",
  },

  // ─────────────────────────────────────────────────────────────── 8
  {
    stage: "qa",
    title: "Trying it like a user",
    intro:
      "QA exercises the change in the running app, in a real browser, and records evidence. A PR labelled needs-qa cannot merge without qa-approved, however green everything else is (gate G6). The Product Owner checks the value, not the code.",
    bug: {
      summary: "Quinn tests the discount fix. It is risk-high, so only a QA reviewer can approve it.",
      beats: [
        {
          who: "qa",
          text: "Moves #431 from merge-queue to qa: “a tester is on it”. Nobody merges under an active tester.",
        },
        {
          who: "agent",
          text: "om-auto-qa-pr derives a scenario from the diff, drives the browser, posts screenshots and a pass/fail table. Labels untouched.",
          command: "/om-auto-qa-pr 431",
          skill: "om-auto-qa-pr",
        },
        {
          who: "qa",
          text: "Quinn adds the nasty cases herself: double-click on Pay, browser back after paying, an expired coupon.",
        },
        {
          who: "qa",
          text: "Applies qa-approved with a comment that pins the tested commit (gate G6). Label returns to merge-queue.",
        },
      ],
      artefacts: [
        {
          kind: "report",
          where: "PR #431 · comment",
          author: "quinn",
          agent: true,
          body: `## 📸 UI QA evidence — PASS

**Verdict:** ✅ PASS — one AUTUMN10 line in the cart and at checkout; order charged 90.00 PLN.
**Verified:** fix/issue-418-double-discount @ 9f3c2ab; http://localhost:3000, role customer, browser agent-browser.

| # / Priority | Route and action                    | Expected        | Observed        | Result |
|--------------|-------------------------------------|-----------------|-----------------|--------|
| 1 / P1       | /cart, apply AUTUMN10 to 100.00 PLN | total 90.00     | total 90.00     | PASS 📸 |
| 2 / P1       | /checkout, Pay                      | charged 90.00   | charged 90.00   | PASS 📸 |
| 3 / P2       | /checkout, double-click Pay         | one order       | one order       | PASS 📸 |`,
          notice: "Expected vs observed, with a screenshot per step. Evidence only: this report alone does not grant approval.",
        },
        {
          kind: "comment",
          where: "PR #431 · comment",
          author: "quinn",
          agent: false,
          labels: ["merge-queue", "bug", "priority-medium", "risk-high", "needs-qa", "qa-approved"],
          body: `QA approved. Agent scenario above plus manual: back button after paying
(no re-charge), expired coupon (clear message, no discount).
QA head: 9f3c2ab`,
          notice: "“QA head: <sha>” pins the approval to the exact commit tested. A later push makes it stale.",
        },
      ],
    },
    feature: {
      summary: "The CSV export fails QA once, gets fixed, passes, and Priya checks it solves the brief's problem.",
      beats: [
        {
          who: "qa",
          text: "Tests the state matrix. A company with zero invoices gets a blank page instead of the agreed empty state: qa-failed, back to Sam.",
        },
        {
          who: "developer",
          text: "Sam's agent adds the empty state; Quinn re-tests at the new commit and approves.",
        },
        {
          who: "product-owner",
          text: "Priya opens the preview and screenshots: one question, does an accountant get what they need at month-end? Yes. She accepts the value, not the code.",
        },
        {
          who: "qa",
          text: "The export flow is worth keeping checked, so it becomes an end-to-end test.",
          command: "/om-integration-tests",
          skill: "om-integration-tests",
        },
        {
          who: "designer",
          text: "Iga is informed about the empty-state finding on the UI.",
        },
      ],
      artefacts: [
        {
          kind: "comment",
          where: "PR #433 · comment",
          author: "priya",
          agent: false,
          body: `Checked against the brief (Problems, i-03): the file opens in Sheets and
LibreOffice, invoice number first, credit notes negative. This is what
the accountants asked for. Value accepted from my side; QA owns the
approval. — Priya`,
          notice: "Consulted, not approving: Priya checks the problem is solved; the qa-approved label stays Quinn's.",
        },
      ],
    },
    wrong: [
      {
        what: "Sam pushes one more commit after Quinn approved.",
        then: "qa-approved stays but is stale: merge tools report “QA evidence older than head” until QA re-tests or confirms the new commit is out of the tested scope.",
      },
      {
        what: "Quinn is on holiday and the discount fix is waiting.",
        then: "No self-QA on risk-high. It waits for a QA reviewer, or a maintainer's explicit exception written on the PR.",
      },
      {
        what: "The agent's QA run could not reach the payment page.",
        then: "That is a PARTIAL run with “not exercised” listed. It is never signed off.",
      },
    ],
    terms: ["qa", "needs-qa", "qa-approved", "qa-head", "self-qa", "state-matrix", "e2e"],
    takeaway: "Evidence first, then a human approval pinned to a commit (G6). Lower-risk work may use the documented self-check; risk-high never.",
    aside: {
      title: "Side example: the self-QA exception",
      text: "Follow-up #440 (CSV column headers are English-only) is risk-low. Quinn is away, so an engineer runs the QA skill with sign-off allowed. It applies both qa-approved and qa-self-verified, so the exception is visible and auditable.",
      artefact: {
        kind: "comment",
        where: "PR #441 · comment",
        author: "sam",
        agent: true,
        labels: ["merge-queue", "bug", "priority-low", "risk-low", "needs-qa", "qa-approved", "qa-self-verified"],
        body: `📸 om-auto-qa-pr: PASS (self-QA sign-off, risk-low)
Scenario: export with UI language PL → headers "Numer faktury, Data, …"
Environment: local test env, company "Demo Sp. z o.o.", 12 invoices
Negative cases: language EN (headers stay English), 0 invoices (empty state)
QA head: 4b81e0c`,
        notice: "Command used: /om-auto-qa-pr 441 --self-qa-signoff. Only on a fully green run with screenshots, never on risk-high.",
      },
    },
  },

  // ─────────────────────────────────────────────────────────────── 9
  {
    stage: "merge",
    title: "Into main",
    intro:
      "Merging is the last gate (G7). A read-only report shows what can merge; then one skill re-checks every gate on the current commit and squash-merges. The Maintainer signs, and has the last word when gates conflict.",
    bug: {
      summary: "Max asks what is ready, and merges #431.",
      beats: [
        {
          who: "agent",
          text: "om-merge-buddy reads labels, reviews, CI and mergeability for every open PR. It changes nothing.",
          command: "/om-merge-buddy",
          skill: "om-merge-buddy",
        },
        {
          who: "maintainer",
          text: "Max picks #431. The merge skill re-checks every gate, approves and squash-merges it (gate G7).",
          command: "/om-approve-merge-pr 431",
          skill: "om-approve-merge-pr",
        },
        {
          who: "architect",
          text: "Ada would be consulted if gates conflicted (they don't here).",
        },
      ],
      artefacts: [
        {
          kind: "report",
          where: "Max's terminal · om-merge-buddy",
          author: "om-merge-buddy",
          agent: true,
          body: `🚀 \`om-merge-buddy\` — 1 ready, 1 almost ready, 1 blocked.

| PR and change                          | State        | Next action and reason                              |
|----------------------------------------|--------------|-----------------------------------------------------|
| #431 apply the discount once per order | Ready        | All required gates pass; ready for a merge decision. |
| #433 export invoices as CSV            | Almost ready | QA evidence older than head (tested 7c2d9e1, head 0a4f3b8). |
| #429 new VAT rates for 2027            | Blocked      | do-not-merge set by a maintainer (waiting on the law). |`,
          notice: "One row per PR, every remaining blocker named once. A report, not a merge.",
        },
        {
          kind: "terminal",
          where: "Max's terminal · om-approve-merge-pr",
          author: "om-approve-merge-pr",
          agent: true,
          body: `🚀 \`om-approve-merge-pr\` — merged: fix(checkout): apply the discount once per order.
Approved and squash-merged into main as 3e9a6c2; QA head 9f3c2ab matches the PR head.
PR: #431 (link: https://github.com/ledgerly/ledgerly/pull/431)
Issue: #418 (link: https://github.com/ledgerly/ledgerly/issues/418)`,
          notice: "Squash-merge: the PR's commits become one commit on main. The last two lines are “chain markers” other skills read.",
        },
      ],
    },
    feature: {
      summary: "#433 waits: one commit was pushed after QA tested it.",
      beats: [
        {
          who: "agent",
          text: "If Max tried to merge it now, the skill would ask for confirmation instead of merging, because the QA evidence is older than the head.",
        },
        {
          who: "qa",
          text: "Quinn confirms on the PR that the new commit (a typo in a comment) is outside the tested scope, with a fresh QA head line. Then it merges.",
        },
      ],
      artefacts: [
        {
          kind: "terminal",
          where: "For comparison · a refused merge",
          author: "om-approve-merge-pr",
          agent: true,
          body: `🚀 \`om-approve-merge-pr\` — refused: feat(reports): monthly revenue chart.
The PR carries needs-qa but not qa-approved. A QA reviewer must test it and
apply qa-approved; this skill never applies it.`,
          notice: "Green CI does not override the QA gate. The refusal names the gate and how to clear it.",
        },
      ],
    },
    wrong: [
      {
        what: "A PR carries do-not-merge or blocked.",
        then: "Hard stop, whatever else is green. Only a human (the Maintainer) lifts it.",
      },
      {
        what: "An agent is still working on the PR (in-progress).",
        then: "Merge tools skip it until the claim is released.",
      },
      {
        what: "CI is red or the branch conflicts with main.",
        then: "Refused, with the fix named: om-auto-fix-pr 433 --ci-only for CI, om-auto-fix-pr 433 for conflicts or findings.",
      },
    ],
    terms: ["merge", "squash-merge", "main", "blocked", "ci", "chain-markers"],
    takeaway: "Report, re-check, squash-merge. The Maintainer signs (G7). Shipping to users is a separate release process.",
  },

  // ─────────────────────────────────────────────────────────────── 10
  {
    stage: "cleanup",
    title: "Tidying up",
    intro:
      "After merging, the tracker is reconciled: fixed issues are closed, leftovers from review and QA become follow-up issues, and the changelog gets its lines. Deployment, monitoring and rollback belong to the team's release process, not to this pipeline.",
    bug: {
      summary: "#418 is closed automatically because PR #431 said “Closes #418” and merged.",
      beats: [
        {
          who: "agent",
          text: "om-close-fixed-issues closes issues that merged PRs explicitly fix, with a comment saying why.",
          command: "/om-close-fixed-issues",
          skill: "om-close-fixed-issues",
        },
        {
          who: "maintainer",
          text: "Max reads the new follow-ups, gives each a priority, and guards anything labelled do-not-close.",
        },
        {
          who: "agent",
          text: "On Friday, the changelog entry is drafted for everything merged since the last release, crediting the real authors.",
          command: "/om-auto-update-changelog",
          skill: "om-auto-update-changelog",
        },
      ],
      artefacts: [
        {
          kind: "comment",
          where: "Issue #418 · comment",
          author: "max",
          agent: true,
          body: `🤖 \`om-close-fixed-issues\` — issue closed

✅ Closed because #431 explicitly fixes this issue and merged into \`main\`
at 2026-10-17T12:04:55Z, commit \`3e9a6c2\`. Credit: @sam.

If this closure is wrong, reopen and add \`do-not-close\` to prevent another automatic closure.`,
          notice: "It explains why, credits the author, and tells you how to stop it next time.",
        },
        {
          kind: "file",
          where: "CHANGELOG.md (draft PR)",
          author: "om-auto-update-changelog",
          agent: true,
          heading: "CHANGELOG.md (excerpt)",
          body: `# 2.8.0 (2026-10-23)

## Highlights
<!-- TODO: Highlights — left blank for the human author to fill in. -->

## ✨ Features
- ✨ Export the filtered invoice list as CSV. (#433) *(@sam)*

## 🐛 Fixes
- 🐛 Apply the checkout discount once per order (fixes #418). (#431) *(@sam)*`,
          notice: "Drafted as its own docs PR. The Highlights are left for a human to write.",
        },
      ],
    },
    feature: {
      summary: "QA noticed something outside #433's scope. It becomes a tracked follow-up instead of being forgotten in a comment.",
      beats: [
        {
          who: "qa",
          text: "Quinn turns her QA note into a follow-up issue, assigned to the right person.",
          command: "/om-followup-issue-from-pr 433",
          skill: "om-followup-issue-from-pr",
        },
        {
          who: "maintainer",
          text: "Max sets it to priority-low (cosmetic). Sam and Priya are informed.",
        },
      ],
      artefacts: [
        {
          kind: "issue",
          where: "GitHub · issue #440",
          author: "quinn",
          agent: true,
          heading: "CSV export: column headers are English-only",
          labels: ["bug", "priority-low", "risk-low"],
          body: `## Follow-up from #433

> QA note (Quinn): with the UI in Polish, the CSV headers are still
> "Invoice number, Date, …". Out of scope for #433.

Polish-speaking accountants get English headers in an otherwise Polish
app. Smallest change: use the UI translations for the header row.

- [ ] Headers follow the user's UI language
- [ ] Existing English exports unchanged

Related: #433`,
          notice: "Small, linked to its source, with an acceptance checklist. Nothing from review or QA gets lost in a closed PR.",
        },
      ],
    },
    wrong: [
      {
        what: "The PR said “Naprawia #418” (Polish for “fixes”).",
        then: "Not a recognised closing keyword, so nothing is closed and the report says so. Add it to closeKeywords in the config if your team writes that.",
      },
      {
        what: "An issue was closed automatically but is not really fixed.",
        then: "Reopen it and add do-not-close; housekeeping skills only ever read that label.",
      },
      {
        what: "The same kind of second pass keeps costing hours.",
        then: "om-pipeline-retro ranks the causes from finished runs; the Maintainer tunes the process.",
      },
    ],
    terms: ["follow-up", "changelog", "do-not-close", "release-process"],
    takeaway: "Close what is fixed, file what is left, write it down. Then the release process takes over.",
  },
];

export const STORY_BY_STAGE = Object.fromEntries(STORY.map((s) => [s.stage, s])) as Record<StageId, StoryStep>;
