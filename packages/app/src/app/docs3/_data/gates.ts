/** The seven approval gates, each with a "passes" and a "doesn't pass" example. */
import type { RoleId } from "./roles";
import type { GateId, StageId } from "./stages";

export type Gate = {
  id: GateId;
  name: string;
  stage: StageId;
  decider: RoleId;
  deciderLabel: string;
  question: string;
  checks: string[];
  passes: { title: string; detail: string };
  fails: { title: string; detail: string };
  ifFails: string;
};

export const GATES: Gate[] = [
  {
    id: "G1",
    name: "Product brief",
    stage: "discovery",
    decider: "product-owner",
    deciderLabel: "Product Owner",
    question: "Do we understand the problem well enough to plan work for it?",
    checks: [
      "The problem and who has it come from real material (interviews, data, documents), each claim tagged with its source.",
      "Decisions have a named owner; anything unconfirmed stays a “proposal”.",
      "Scope is split into Now, Later and Not doing (non-goals).",
    ],
    passes: {
      title: "“3 of 5 accountants we interviewed copy invoices into a spreadsheet by hand every month [interview].”",
      detail: "Sourced, specific, owned. The brief also says what is NOT being built (N02: no scheduled exports).",
    },
    fails: {
      title: "“Users will love exporting.”",
      detail: "No source, no user, no number. om-discover keeps it as an [assumption] or puts it on a collection plan; it never counts as evidence.",
    },
    ifFails: "The brief can still be written honestly incomplete, with a collection plan naming what to go and find out.",
  },
  {
    id: "G2",
    name: "Backlog",
    stage: "discovery",
    decider: "product-owner",
    deciderLabel: "Product Owner",
    question: "Is this the right set of epics and stories to file?",
    checks: [
      "The whole tree is shown first (dry run); nothing is filed before a yes.",
      "Every story has acceptance criteria and points back to the brief's ids.",
      "Existing issues are adopted, not duplicated.",
    ],
    passes: {
      title: "E3 Invoice export → S3.1 Export filtered list as CSV, S3.2 Credit notes as negative rows.",
      detail: "Priya reads the tree, says yes; om-backlog files each story through om-prepare-issue.",
    },
    fails: {
      title: "A brief whose main problem is still only [assumption].",
      detail: "om-backlog refuses to plan delivery on assumptions and offers a research backlog instead.",
    },
    ifFails: "Nothing is filed. Go back to discovery or file research tasks.",
  },
  {
    id: "G3",
    name: "Definition of Ready",
    stage: "intake",
    decider: "product-owner",
    deciderLabel: "Product Owner",
    question: "Could someone start this ticket without guessing?",
    checks: [
      "The problem or need, and who has it.",
      "The expected outcome, and how it will be checked.",
      "What is out of scope.",
      "Open questions marked blocking or non-blocking; no blocking one unanswered.",
      "Any agent assumption confirmed by a human.",
    ],
    passes: {
      title: "#412: “Accountants at multi-company customers need the filtered invoice list as CSV for month-end. Done when the file opens in a spreadsheet with the columns in the spec. Out: XLSX, scheduled exports.”",
      detail: "Who, what result, how checked, what is out. Ready.",
    },
    fails: {
      title: "#415: “export pls”",
      detail: "om-auto-manage-issues posts a 🤖 not-ready comment naming what is missing; om-auto-fix-issue will not build a feature from it.",
    },
    ifFails: "The author adds the missing answers, or a maintainer writes “ready as is” to waive (with the reason).",
  },
  {
    id: "G4",
    name: "Independent review",
    stage: "review",
    decider: "architect",
    deciderLabel: "Architect / Tech Lead",
    question: "Has a second, independent person checked this sensitive change?",
    checks: [
      "Required for risk-high work: auth and sessions, data scoping, money, schema migrations, shared contracts.",
      "The evidence SDLC.md asks for is in the PR (e.g. failure, retry and idempotency tests for money).",
      "Any blocker, or any major finding without a documented waiver, means “request changes”.",
    ],
    passes: {
      title: "PR #431 (discount fix): agent review approved, then Ada reviews independently and approves.",
      detail: "The PR has a test proving a retried checkout does not apply the discount again.",
    },
    fails: {
      title: "Same PR, without the idempotency test.",
      detail: "om-code-review marks it a blocker: risk-high money change without evidence. Verdict: request changes.",
    },
    ifFails: "Label goes to changes-requested; the developer's agent (om-auto-continue-pr) adds the test and asks for another review.",
  },
  {
    id: "G5",
    name: "Decision change",
    stage: "review",
    decider: "domain-expert",
    deciderLabel: "Owner of the decision (Product Owner or Domain Expert)",
    question: "Does this PR change something we decided on purpose, and did the decision's owner agree?",
    checks: [
      "Non-goals (N…), business rules (R…) and decisions (D…) in product-brief.md are a protected contract.",
      "A PR that contradicts one needs a superseding entry, approved by the entry's owner, in the same PR.",
      "The fix is never “delete the code” by default: it is “change the decision explicitly”, or drop the change.",
    ],
    passes: {
      title: "PR adds XLSX export and, in the same PR, a row D09 superseding D04, approved by Priya.",
      detail: "The decision changed in the open, with an owner and a reason.",
    },
    fails: {
      title: "PR converts every amount to PLN, contradicting rule R07, with no superseding entry.",
      detail: "Review blocker quoting R07 and its owner. Diego declines, the conversion is removed.",
    },
    ifFails: "The PR cannot pass review until the conflict is resolved; the maintainer arbitrates a dispute.",
  },
  {
    id: "G6",
    name: "Test approval",
    stage: "qa",
    decider: "qa",
    deciderLabel: "QA / Tester",
    question: "Did a person (or the permitted exception) actually exercise it and see it work?",
    checks: [
      "A PR labelled needs-qa cannot merge without qa-approved, even with every check green.",
      "UI changes include the state matrix: default, empty, loading, error, no permission, long content, narrow screen.",
      "qa-approved is pinned to a commit: the comment carries “QA head: <sha>”.",
      "Self-QA only on risk-low / risk-medium, with evidence, and the extra label qa-self-verified.",
    ],
    passes: {
      title: "Quinn tests PR #431 at commit 9f3c2ab, attaches screenshots, applies qa-approved with “QA head: 9f3c2ab”.",
      detail: "The approval names exactly what was tested.",
    },
    fails: {
      title: "The CSV export shows a blank page when a company has zero invoices.",
      detail: "A missing empty state fails QA. Label qa-failed, back to the developer.",
    },
    ifFails: "qa-failed is a hard block. After the fix, QA re-tests (and a new QA head is recorded).",
  },
  {
    id: "G7",
    name: "Merge",
    stage: "merge",
    decider: "maintainer",
    deciderLabel: "Maintainer",
    question: "Is every gate green on the current commit, so this can go into main?",
    checks: [
      "Approving review; required CI checks green; no merge conflict.",
      "None of changes-requested, qa-failed, blocked, do-not-merge, in-progress.",
      "needs-qa → qa-approved present, and its QA head matches the PR head.",
    ],
    passes: {
      title: "#431: approved, CI green, qa-approved at the head commit.",
      detail: "om-approve-merge-pr approves and squash-merges it. Max signs.",
    },
    fails: {
      title: "#433: one commit pushed after QA tested it.",
      detail: "om-merge-buddy reports “QA evidence older than head”; om-approve-merge-pr asks for confirmation instead of merging.",
    },
    ifFails: "Fix the named gate (re-test, fix CI with om-auto-fix-pr --ci-only, resolve conflicts), then try again.",
  },
];

export const GATE_BY_ID = Object.fromEntries(GATES.map((g) => [g.id, g])) as Record<GateId, Gate>;
