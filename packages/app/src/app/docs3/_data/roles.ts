/**
 * The seven actors of the chart. The people (Priya, Diego, …) are invented for the running
 * examples; the responsibilities come from the chart and the skills repo.
 */
import type { SkillName } from "./skills";
import type { StageId } from "./stages";

export type RoleId =
  | "product-owner"
  | "domain-expert"
  | "architect"
  | "designer"
  | "developer"
  | "qa"
  | "maintainer";

export type DayEntry = {
  time: string;
  stage: StageId;
  /** What they do, first person-ish, plain words. */
  what: string;
  /** The command they type, when there is one. */
  command?: string;
};

export type Decision = {
  situation: string;
  decision: string;
  why: string;
};

export type Role = {
  id: RoleId;
  title: string;
  person: string;
  initials: string;
  emoji: string;
  /** One sentence a newcomer understands. */
  oneLiner: string;
  /** What they own, from the chart's row label. */
  owns: string;
  /** Optional roles are switched on by om-setup-discovery-pipeline; nobody is forced to have one. */
  optionalNote?: string;
  /** Guide in the skills repo (docs/roles/*), when one exists. */
  repoGuide?: { label: string; href: string };
  colors: {
    /** Soft chip: background + text, readable in light and dark. */
    chip: string;
    /** Solid avatar. */
    solid: string;
    /** Left border accent on cards. */
    border: string;
  };
  day: DayEntry[];
  decisions: Decision[];
  never: string[];
  favouriteSkills: SkillName[];
};

const GUIDES = "https://github.com/open-mercato/skills/blob/main/docs/roles";

export const ROLES: Role[] = [
  {
    id: "product-owner",
    title: "Product Owner",
    person: "Priya",
    initials: "PO",
    emoji: "🧭",
    oneLiner: "Decides what is worth building and why. Talks to customers, approves the brief and the backlog.",
    owns: "The “why” and the value (product layer).",
    repoGuide: { label: "docs/roles/product-manager.md", href: `${GUIDES}/product-manager.md` },
    colors: {
      chip: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
      solid: "bg-amber-500 text-white",
      border: "border-l-amber-500",
    },
    day: [
      {
        time: "09:00",
        stage: "discovery",
        what: "Runs a discovery session about invoice exports. The agent asks two or three questions per round; Priya answers with real stories from customer calls.",
        command: '/om-discover --mode existing "Invoice exports"',
      },
      {
        time: "10:30",
        stage: "discovery",
        what: "Reads the draft product brief, spots one claim with no source behind it, asks for it to be marked [assumption], then approves the brief (gate G1).",
      },
      {
        time: "11:00",
        stage: "discovery",
        what: "Asks for the backlog as a dry run, reviews the tree of epics and stories, says yes (gate G2). Only then are issues filed.",
        command: "/om-backlog .ai/specs/product-brief.md --dry-run",
      },
      {
        time: "14:00",
        stage: "intake",
        what: "Checks issue #412 against the Definition of Ready: who has the problem, what result, what is out of scope (gate G3).",
      },
      {
        time: "16:30",
        stage: "qa",
        what: "Opens the PR preview for the CSV export and asks one question only: does this solve the accountant's problem from the brief?",
      },
    ],
    decisions: [
      {
        situation: "Customers asked for “Excel export”. The team could build XLSX or CSV.",
        decision: "CSV first, recorded as decision D04 with Priya as owner.",
        why: "Every spreadsheet tool opens CSV; XLSX adds a library and weeks. XLSX goes to “Later”.",
      },
      {
        situation: "A developer's PR quietly adds scheduled e-mail exports.",
        decision: "No. Non-goal N02 says “no scheduled exports in this release”.",
        why: "Changing a decision is allowed, but explicitly: a superseding entry she approves (gate G5), not a sneaky extra.",
      },
    ],
    never: [
      "Approves the code itself. In QA she accepts the value, not the implementation.",
      "Lets an agent's assumption stand in for a real user's answer: [SYNTHETIC] findings are ideas to check, never evidence.",
    ],
    favouriteSkills: ["om-discover", "om-brainstorm", "om-synthetic-users", "om-backlog", "om-prepare-issue", "om-auto-manage-issues"],
  },
  {
    id: "domain-expert",
    title: "Domain Expert",
    person: "Diego",
    initials: "DE",
    emoji: "📚",
    oneLiner: "Knows the business rules inside out (here: accounting and tax) and owns them.",
    owns: "Business rules, decisions, non-goals (product layer).",
    optionalNote:
      "Optional. A team declares a Domain Expert during om-setup-discovery-pipeline only if someone other than the Product Owner owns the rules; otherwise the Product Owner signs them.",
    colors: {
      chip: "bg-lime-500/15 text-lime-800 dark:text-lime-300",
      solid: "bg-lime-600 text-white",
      border: "border-l-lime-600",
    },
    day: [
      {
        time: "09:30",
        stage: "discovery",
        what: "Joins Priya's discovery round. States the rule that exported amounts stay in the invoice's own currency. The agent records it as R07, owner Diego.",
      },
      {
        time: "13:00",
        stage: "intake",
        what: "Reads issue #412 and confirms it breaks no domain rule. The agent has already checked it against the non-goals in product-brief.md.",
      },
      {
        time: "15:00",
        stage: "implement",
        what: "Is asked a question on the spec: should credit notes appear in the export as negative rows? Answers yes, with a sign convention.",
      },
      {
        time: "17:00",
        stage: "review",
        what: "Gets a review ping: a PR wants to convert all amounts to PLN. That contradicts R07, his rule. He declines (gate G5).",
      },
    ],
    decisions: [
      {
        situation: "The spec draft converts every amount to the company's home currency “for convenience”.",
        decision: "Rejected. R07 stays: amounts are exported in the invoice currency.",
        why: "Accountants reconcile against bank statements in that currency; a converted number would not match anything.",
      },
    ],
    never: [
      "Is asked about every ticket: only when the work touches a rule, non-goal or decision they own.",
      "Has their rule quietly overridden: a PR that contradicts R07 without a superseding entry is a blocker in review.",
    ],
    favouriteSkills: ["om-discover"],
  },
  {
    id: "architect",
    title: "Architect / Tech Lead",
    person: "Ada",
    initials: "AR",
    emoji: "📐",
    oneLiner: "Decides how things are built and how risky they are. Approves specs, reviews dangerous changes.",
    owns: "The “how” and the risk.",
    optionalNote:
      "SDLC.md has no separate Architect role: a team that names a tech lead or architect puts them under Reviewer, the person who signs off specs and gives the second review risk-high work needs.",
    colors: {
      chip: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
      solid: "bg-sky-600 text-white",
      border: "border-l-sky-600",
    },
    day: [
      {
        time: "09:15",
        stage: "triage",
        what: "Triage flagged bug #418 (discount applied twice) as risk-medium. Ada bumps it to risk-high: it touches money, and SDLC.md says money means risk-high.",
      },
      {
        time: "10:00",
        stage: "implement",
        what: "Reads the spec PR for the CSV export. Asks for one change: the export query must filter by company, with a test proving one company cannot export another's invoices.",
        command: "/om-spec-writing  (review mode, on the spec file)",
      },
      {
        time: "14:00",
        stage: "review",
        what: "Gives the independent human review the money fix needs (gate G4). The agent already reviewed it; for risk-high work a second person is required.",
      },
      {
        time: "16:00",
        stage: "pull-request",
        what: "Answers a question on PR #433: is streaming the CSV fine for 50,000 invoices? Yes, as long as it does not load them all into memory.",
      },
    ],
    decisions: [
      {
        situation: "The discount bug fix is three lines. The developer asks to skip the second review.",
        decision: "No. It is risk-high (money), so it needs a second person's review and tests for failure, retry and idempotency.",
        why: "Three lines of money code can still charge a customer twice. The rule is in SDLC.md's risk-high table.",
      },
      {
        situation: "Two agents disagree whether the CSV export is risk-medium or risk-high.",
        decision: "risk-high: an export reads data across a scope (company), which SDLC.md lists under data scoping.",
        why: "When signals conflict, pick the higher label and say why.",
      },
    ],
    never: [
      "Rubber-stamps the agent's review for risk-high work: the gate is an independent human look.",
      "Writes every spec by hand: the agent drafts it, Ada writes or approves it.",
    ],
    favouriteSkills: ["om-verify-in-repo", "om-spec-writing", "om-auto-write-spec", "om-auto-review-pr", "om-code-review"],
  },
  {
    id: "designer",
    title: "Designer",
    person: "Iga",
    initials: "DS",
    emoji: "🎨",
    oneLiner: "Decides how the screens behave (including the empty, loading and error states) before code exists.",
    owns: "The flow and the screen states before code exists (product layer).",
    optionalNote: "Optional, declared during om-setup-discovery-pipeline. Without one, SDLC.md's Design stage can be done by om-ux-shape or a human.",
    repoGuide: { label: "docs/roles/designer.md", href: `${GUIDES}/designer.md` },
    colors: {
      chip: "bg-pink-500/15 text-pink-800 dark:text-pink-300",
      solid: "bg-pink-600 text-white",
      border: "border-l-pink-600",
    },
    day: [
      {
        time: "09:00",
        stage: "discovery",
        what: "Shapes the export flow: where the button lives, what happens with zero invoices, what a user without permission sees.",
        command: '/om-ux-shape "Export the invoice list as CSV"',
      },
      {
        time: "11:00",
        stage: "discovery",
        what: "Asks for a clickable prototype to try the flow with Priya before anything is built.",
        command: '/om-mockup-prototype .ai/specs/product-brief.md --flow "export invoices"',
      },
      {
        time: "15:00",
        stage: "implement",
        what: "Answers the developer's question: the export button goes in the list toolbar, secondary style, not a primary button.",
      },
      {
        time: "17:00",
        stage: "review",
        what: "Runs a design pass on PR #433. One finding: the error toast says “Error 500”; it should tell the user what to do.",
        command: "/om-ux-review-pr 433",
      },
    ],
    decisions: [
      {
        situation: "The developer wants a spinner for the export.",
        decision: "Fine for under 2 seconds; for longer exports show “Preparing 12,400 invoices…” with a progress count.",
        why: "The loading state is part of the flow she owns, decided before code, not discovered in QA.",
      },
    ],
    never: [
      "Holds the merge with the design pass: om-ux-review-pr is advisory. The objective checks (the state matrix) are run by QA.",
    ],
    favouriteSkills: ["om-ux-shape", "om-ux-setup", "om-mockup-prototype", "om-ux-review-pr"],
  },
  {
    id: "developer",
    title: "Developer",
    person: "Sam",
    initials: "DV",
    emoji: "🛠️",
    oneLiner: "Drives the coding agent instead of typing every line, and is accountable for what it produces.",
    owns: "The change, from claim to a merge-ready PR.",
    repoGuide: { label: "docs/roles/developer.md", href: `${GUIDES}/developer.md` },
    colors: {
      chip: "bg-violet-500/15 text-violet-800 dark:text-violet-300",
      solid: "bg-violet-600 text-white",
      border: "border-l-violet-600",
    },
    day: [
      {
        time: "09:00",
        stage: "claim",
        what: "Starts the agent on bug #418. It triages, claims the issue (assignee + in-progress label + 🤖 comment) and starts working.",
        command: "/om-auto-fix-issue 418",
      },
      {
        time: "09:40",
        stage: "implement",
        what: "Reads the agent's root-cause note and checks it makes sense: the discount is applied in two places. Watches the regression test go from red to green.",
      },
      {
        time: "10:15",
        stage: "pull-request",
        what: "Reads PR #431's description before anyone else does. Rewrites one sentence so a reviewer understands why the fix is safe.",
      },
      {
        time: "13:00",
        stage: "review",
        what: "The review asks for an idempotency test. Sam agrees, lets the agent add it, and politely disagrees with a naming nit, explaining why.",
        command: "/om-auto-continue-pr 431",
      },
      {
        time: "15:00",
        stage: "implement",
        what: "Starts the CSV feature from its approved spec.",
        command: "/om-auto-implement-spec 2026-10-17-invoice-csv-export",
      },
    ],
    decisions: [
      {
        situation: "The agent proposes refactoring the whole pricing module while fixing the discount bug.",
        decision: "No: smallest change that fixes it, plus a regression test. The refactor becomes a follow-up issue.",
        why: "A small diff is easier to review and safer to ship; om-fix is built around the minimal change surface.",
      },
    ],
    never: [
      "Applies qa-approved to their own PR. Authoring skills never grant QA approval.",
      "Merges their own PR around a red gate. Blocked work cannot merge.",
      "Force-pushes or skips the checks to get to green.",
    ],
    favouriteSkills: ["om-auto-fix-issue", "om-auto-create-pr", "om-auto-implement-spec", "om-open-pr", "om-check-and-commit", "om-auto-continue-pr"],
  },
  {
    id: "qa",
    title: "QA / Tester",
    person: "Quinn",
    initials: "QA",
    emoji: "🔬",
    oneLiner: "Tries the change like a real user would, in a real browser, and decides whether it passes.",
    owns: "Testing and QA approval.",
    repoGuide: { label: "docs/roles/qa.md", href: `${GUIDES}/qa.md` },
    colors: {
      chip: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
      solid: "bg-emerald-600 text-white",
      border: "border-l-emerald-600",
    },
    day: [
      {
        time: "08:45",
        stage: "implement",
        what: "Boots the app once for the day. Every QA skill reuses this running app instead of starting its own.",
        command: "/om-prepare-test-env",
      },
      {
        time: "10:30",
        stage: "qa",
        what: "Picks up PR #431 (needs-qa): moves it from merge-queue to qa, so everyone sees a tester is on it.",
      },
      {
        time: "10:35",
        stage: "qa",
        what: "Lets the agent walk the checkout in a browser: screenshots, a pass/fail table. Then tries the nasty cases herself: double-click on Pay, back button, expired coupon.",
        command: "/om-auto-qa-pr 431",
      },
      {
        time: "11:30",
        stage: "qa",
        what: "All good: applies qa-approved with a comment carrying the line QA head: 9f3c2ab, the exact commit she tested (gate G6).",
      },
      {
        time: "15:00",
        stage: "cleanup",
        what: "Testing the CSV export, she noticed the column headers are English-only. Out of scope for this PR, so it becomes a follow-up issue.",
        command: "/om-followup-issue-from-pr 433",
      },
    ],
    decisions: [
      {
        situation: "Quinn is on holiday; a small risk-low copy fix waits for QA.",
        decision: "An engineer may self-sign it with evidence: qa-approved plus qa-self-verified, so the exception is visible.",
        why: "The self-QA exception exists for risk-low and risk-medium work only.",
      },
      {
        situation: "The same week, the discount fix (risk-high) is ready.",
        decision: "It waits for Quinn, or a maintainer's written exception on the PR.",
        why: "No self-QA on risk-high. Money is never self-signed.",
      },
    ],
    never: [
      "Approves on a green CI alone: needs-qa cannot merge without qa-approved, however green the checks.",
      "Lets an old approval stand after new commits: qa-approved is pinned to the tested commit (QA head).",
    ],
    favouriteSkills: ["om-prepare-test-env", "om-auto-qa-pr", "om-qa-buddy", "om-integration-tests", "om-followup-issue-from-pr"],
  },
  {
    id: "maintainer",
    title: "Maintainer",
    person: "Max",
    initials: "MT",
    emoji: "🗝️",
    oneLiner: "Owns the process itself and the merge button: sets up the skills, signs the merge, keeps the tracker tidy.",
    owns: "Context engineer (SDLC.md, config, skills, overrides) and release manager (merge and the changelog).",
    repoGuide: { label: "docs/roles/release-manager.md", href: `${GUIDES}/release-manager.md` },
    colors: {
      chip: "bg-slate-500/15 text-slate-800 dark:text-slate-300",
      solid: "bg-slate-600 text-white",
      border: "border-l-slate-500",
    },
    day: [
      {
        time: "Once",
        stage: "discovery",
        what: "Set the whole thing up: the config, SDLC.md, labels, then the product layer. Every other skill reads that config.",
        command: "/om-setup-agent-pipeline   then   /om-setup-discovery-pipeline",
      },
      {
        time: "09:00",
        stage: "merge",
        what: "Asks what can merge today. Gets a table: ready, almost ready, blocked, each with the reason.",
        command: "/om-merge-buddy",
      },
      {
        time: "12:00",
        stage: "merge",
        what: "PR #431 has every gate green, including qa-approved on the current head. Signs the merge (gate G7).",
        command: "/om-approve-merge-pr 431",
      },
      {
        time: "16:00",
        stage: "cleanup",
        what: "Closes the issues the merged PRs fixed, reads the new follow-ups and gives each a priority.",
        command: "/om-close-fixed-issues",
      },
      {
        time: "Friday",
        stage: "cleanup",
        what: "Drafts the changelog for the week; fills in the Highlights by hand.",
        command: "/om-auto-update-changelog",
      },
    ],
    decisions: [
      {
        situation: "A ticket lacks “out of scope”, but it is a one-line typo fix.",
        decision: "Waives the readiness item and writes “ready as is: typo fix, no scope to discuss” on the ticket.",
        why: "Waivers are allowed, but they are recorded where everyone can see them.",
      },
      {
        situation: "Review approved PR #433, but QA marked it qa-failed.",
        decision: "Gates conflict, Max has the last word: qa-failed is a hard block. Back to the developer.",
        why: "Blocked work cannot merge, whatever else is green.",
      },
    ],
    never: [
      "Merges a needs-qa PR without qa-approved, even when every check is green.",
      "Closes an issue labelled do-not-close; the housekeeping skills only ever read that label.",
    ],
    favouriteSkills: [
      "om-setup-agent-pipeline",
      "om-setup-discovery-pipeline",
      "om-merge-buddy",
      "om-approve-merge-pr",
      "om-close-fixed-issues",
      "om-auto-update-changelog",
      "om-review-prs",
      "om-pr-autopilot",
    ],
  },
];

export const ROLE_BY_ID = Object.fromEntries(ROLES.map((r) => [r.id, r])) as Record<RoleId, Role>;
