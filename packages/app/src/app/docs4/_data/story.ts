/**
 * The story: one team, one piece of work, from an idea to merged and cleaned up.
 *
 * Everything here is invented: Kinetik, its clinics, the people, the issue and PR numbers, the commits and
 * every figure. The shapes (labels, markers such as "QA head:", the output lines, the order of the steps)
 * follow SDLC.md and the SKILL.md files in the open-mercato/skills repository.
 *
 * In `text`, `backticks` mark code; an `om-…` name in backticks becomes a link to the skills index.
 */
import type { GateId, RoleId, SkillId, StageId } from "./types";

export const PRODUCT = {
  name: "Kinetik",
  blurb: "the booking app of a network of fourteen physiotherapy clinics",
  issue: 231,
  issueTitle: "Patients can move their own appointment",
  specPr: 240,
  pr: 248,
};

/** How a person is on stage in a chapter. */
export type Presence = "decides" | "supervises" | "consulted" | "informed";

export interface CastMember {
  role: RoleId;
  as: Presence;
  note: string;
}

export interface AgentTurn {
  skill: SkillId;
  did: string;
}

export type ArtefactKind = "terminal" | "comment" | "review" | "file" | "plan" | "report";

export interface Artefact {
  kind: ArtefactKind;
  title: string;
  /** Where it lives and who posted it. */
  meta: string;
  labels?: string[];
  body: string;
}

export interface Chapter {
  slug: string;
  number: number;
  title: string;
  /** The stages the chapter covers; the first is its home on the rail. */
  stages: StageId[];
  when: string;
  gates: GateId[];
  logline: string;
  cast: CastMember[];
  agents: AgentTurn[];
  text: string[];
  artefacts: Artefact[];
  decided: string[];
  delegated: string[];
  /** Where the chart and the repo tell this part differently. */
  repoNote?: string;
}

export const CHAPTERS: Chapter[] = [
  // ────────────────────────────────────────────────────────────── 0
  {
    slug: "setting-the-stage",
    number: 0,
    title: "Setting the stage",
    stages: ["discovery"],
    when: "Some weeks earlier",
    gates: [],
    logline: "Before any work, the process itself is written down, in the repository, and agreed to.",
    cast: [
      { role: "maintainer", as: "decides", note: "Designs the process; nothing is written without her yes." },
      { role: "designer", as: "supervises", note: "Checks the design contract the agent extracts." },
    ],
    agents: [
      { skill: "om-setup-agent-pipeline", did: "Inspected the repo, asked questions, proposed the config and SDLC.md." },
      { skill: "om-setup-discovery-pipeline", did: "Added the product layer: one question per product role." },
      { skill: "om-ux-setup", did: "Extracted the design contract into .uxproof/." },
    ],
    text: [
      "Kinetik is the booking app of a network of fourteen physiotherapy clinics. The team that builds it is seven people and, depending on how you count, somewhere between none and forty-one agents.",
      "Before any of the story happens, Wanda sets up the process. She runs `om-setup-agent-pipeline` in the repository. It reads the default branch, the validation scripts and the labels already in use, asks her a handful of questions, and proposes two files: `.ai/agentic.config.json`, which every skill reads, and `SDLC.md`, which every person reads. Nothing is written until she says yes. She says no twice first: once to a label she does not want, once to the order of the validation commands.",
      "Then `om-setup-discovery-pipeline` adds the product layer. It asks one question per product role. Is there a domain expert who is not the product owner? Yes: Bogdan. Is there a designer who owns the flows before code exists? Yes: Lena. The names do not go into the process; the roles do. SDLC.md now has a Discovery stage, a Definition of Ready, and a section that turns the product's rules and decisions into a protected contract.",
      "Lena runs `om-ux-setup` once. It reads the components and tokens the app already uses and writes them down as the design contract in `.uxproof/`, so that later reviews can say “there is already a component for that” instead of quoting a style guide from memory. She corrects two of its guesses about spacing.",
      "The result is two files and a folder, all in the repository, all reviewed like any other change. Everything that follows runs on them.",
    ],
    artefacts: [
      {
        kind: "terminal",
        title: "om-setup-discovery-pipeline",
        meta: "Wanda's terminal",
        body: `🤖 om-setup-discovery-pipeline

Delivery layer found: .ai/agentic.config.json, SDLC.md.

1. Is there someone, other than the product owner, who owns
   the business rules and what the product will not do?
> yes, Bogdan (operations)
2. Is there a designer who owns the flows before code exists?
> yes

Planned changes
  .ai/agentic.config.json  "discovery": { "roles":
                             { "domainExpert": true, "designer": true } }
  SDLC.md                  Discovery stage, Definition of Ready,
                           product roles, protected product decisions
                           (between discovery markers)
Write these changes? (yes / no)
> yes`,
      },
    ],
    decided: [
      "Wanda: the labels, the validation commands, the process document, and which product roles exist.",
      "Lena: the design contract, as corrected.",
    ],
    delegated: [
      "Inspecting the repository and drafting the config and SDLC.md.",
      "Extracting the design system into a contract the reviews can read.",
    ],
    repoNote:
      "The chart files the setup skills under the Maintainer in its first column. They are one-off: run once per repository, again after an upgrade (om-apply-upgrade-notes), and tuned after a retro.",
  },

  // ────────────────────────────────────────────────────────────── 1
  {
    slug: "the-phones",
    number: 1,
    title: "The phones on Monday",
    stages: ["discovery"],
    when: "Days 1–3",
    gates: ["G1"],
    logline: "A problem is found in a call log, questioned, and written down with its evidence and its owners.",
    cast: [
      { role: "product-owner", as: "decides", note: "Answers the rounds and approves the brief (G1)." },
      { role: "domain-expert", as: "decides", note: "Owns the rules and non-goals the brief records." },
      { role: "architect", as: "consulted", note: "Asked what it costs and whether it is feasible." },
    ],
    agents: [
      { skill: "om-discover", did: "Read the material first, ran the question rounds, drafted the brief, called in a skeptic." },
      { skill: "om-synthetic-users", did: "Ran a persona panel on the flow; every finding tagged [SYNTHETIC]." },
    ],
    text: [
      "On a Monday in March the front desk of Kinetik's largest clinic took 212 phone calls. Marta knows because the receptionists tag every call with a reason, and 87 of them were tagged “reschedule”, second only to “where do I park”.",
      "She puts the call-log export, six receptionist interviews and four patient interviews in `.ai/specs/research/` and starts `om-discover --mode existing`. The agent reads all of it before it asks anything. Then it asks two or three questions a round, the kind that begin with “think of the last time”: the last time a patient moved an appointment by phone, what did the receptionist actually check before saying yes?",
      "Bogdan answers the questions about rules. A change less than 24 hours before the appointment counts as a late cancellation: that is how the clinics keep their physiotherapists' days full, and it is written into the patients' terms. The agent records it as business rule R04, with Bogdan as its owner. It records something else as a non-goal, N02: the app will not take payments or charge fees. Late-cancellation fees stay with the front desk.",
      "A second agent, a skeptic with a fresh context and no stake in the draft, reads the brief against the sources. It objects to one sentence: “patients prefer to reschedule online.” No patient said that. Receptionists said they would prefer patients to, which is a different sentence. The claim is retagged `[ASSUMPTION]` and gets a smallest test: the share of moves made online in the first month.",
      "Marta runs a synthetic panel on the flow. One persona, a patient in her seventies recovering from a hip replacement, gives up at the word “slot”. The finding is tagged `[SYNTHETIC]`: an idea worth checking with real patients, never evidence. It goes onto the question list for the next interviews.",
      "Tomasz is asked what it costs. The appointment API already exposes free times per physiotherapist; the expensive part is that the calendar is scoped per clinic and some patients are registered at two. “Cheap, if we are careful,” he says, which is how tech leads pronounce “medium”.",
      "Marta reads the decision summary, the scope (now: move an appointment; later: cancel one; not doing: fees), the owners and the open risks. She approves the brief. That is the first gate.",
    ],
    artefacts: [
      {
        kind: "file",
        title: ".ai/specs/product-brief.md (excerpt)",
        meta: "written by om-discover after Marta's confirmation",
        body: `Business rules
  R04  A change less than 24 h before the start is a late
       cancellation; it stays with the front desk.
       [DOCUMENT] patient terms §4.2 · owner: Bogdan · active

Non-goals
  N02  Taking payments or charging fees in the app.
       [DOCUMENT] D03 · owner: Bogdan · active

Riskiest assumptions
  A01  Patients prefer to reschedule online.  [ASSUMPTION]
       evidence today: receptionists said so; no patient did
       smallest test: share of moves made online, first month`,
      },
      {
        kind: "terminal",
        title: "om-discover, closing lines",
        meta: "Marta's terminal",
        body: `Product brief: .ai/specs/product-brief.md
Coverage: 34 claims — 29 sourced (interview 17, data 6, document 5, product 1, benchmark 0), 0 synthetic, 5 assumed
Collection plan: 1 entries waiting for material
Next: none`,
      },
    ],
    decided: [
      "Marta: the brief, its scope and its open risks (G1).",
      "Bogdan: rule R04 and non-goal N02, with his name on both.",
    ],
    delegated: [
      "Reading the material before asking; running the rounds; recording each answer with its evidence tag.",
      "The skeptic's independent reading of the draft.",
      "The persona panel, kept out of the evidence.",
    ],
  },

  // ────────────────────────────────────────────────────────────── 2
  {
    slug: "the-prototype",
    number: 2,
    title: "Clicking through a drawing",
    stages: ["discovery"],
    when: "Days 4–6",
    gates: ["G2"],
    logline: "The flow and its awkward states are tried on a prototype, and the backlog is shown before it is filed.",
    cast: [
      { role: "designer", as: "decides", note: "Defines the flow and the screen states." },
      { role: "product-owner", as: "decides", note: "Says yes to the backlog tree (G2)." },
    ],
    agents: [
      { skill: "om-mockup-prototype", did: "Built a neutral clickable prototype and checked it in a browser." },
      { skill: "om-synthetic-users", did: "Walked the prototype as the personas, with screenshots." },
      { skill: "om-discover", did: "Refreshed the brief with what was learnt, keeping every id." },
      { skill: "om-backlog", did: "Drafted the epic, stories and tasks as a dry run; filed them after the yes." },
    ],
    text: [
      "Marta asks for a prototype before a backlog. `om-mockup-prototype` builds a neutral, clickable version of the flow in the brief: find the appointment, pick a new time, confirm. It is deliberately plain; the detailed design belongs to the spec. It is checked in a real browser, including the back button and what happens to someone who leaves halfway.",
      "Lena walks it with Marta. The happy path is three screens and everyone agrees on it within a minute. The rest of the hour goes to the other states: what the screen says when the physiotherapist has nothing free for two weeks; when the appointment is tomorrow morning and R04 applies; when the time is taken by someone else between picking it and confirming it. Lena writes them down. This is the part of design that never appears in a screenshot of the happy path.",
      "The persona panel walks the prototype too. The patient in her seventies finds the confirm button below the fold on a small phone. Still `[SYNTHETIC]`, still a hypothesis, but a cheap one to check, so Lena checks it with two real patients the next morning. One finds the button. The other finds the clinic's phone number and calls it. Both observations go into the brief, this time as `[INTERVIEW]`.",
      "`om-discover --refresh` folds the findings back into the brief, keeping every id. Then `om-backlog --dry-run` drafts the tree: an epic for self-service changes, a story to move an appointment, a story to cancel one, a task to put the phone number in the confirmation e-mail. It shows the whole tree and writes nothing.",
      "Marta marks cancelling as “later”, as the brief says, and keeps the rest. She says yes to that tree, and only then are the issues filed. That is the second gate. A dry run is a look, not a licence.",
    ],
    artefacts: [
      {
        kind: "terminal",
        title: "om-backlog --dry-run",
        meta: "Marta's terminal · nothing filed yet",
        body: `🤖 om-backlog — dry run (nothing filed)

E3  Self-service changes to appointments
├── S3.1  Patients can move their own appointment
│         AC: own appointments only · same clinic · R04 respected
│             · time taken while confirming → clear message
├── S3.2  Patients can cancel their own appointment   (scope: later)
└── T3.3  Clinic phone number in the confirmation e-mail

Would file 3 issues through om-prepare-issue.
File this tree? (yes / edit / no)`,
      },
    ],
    decided: [
      "Lena: the flow and the states the screen must handle.",
      "Marta: which stories go into the backlog now, and which wait (G2).",
    ],
    delegated: [
      "Building and browser-checking the prototype.",
      "The persona walk and its screenshots.",
      "Refreshing the brief; drafting the tree; filing the issues after the yes.",
    ],
    repoNote:
      "The chart lists om-ux-shape with the Designer in Discovery. In SDLC.md, om-ux-shape drives a per-ticket Design stage after Claim, and om-mockup-prototype is the discovery-time prototype, run before the brief refresh and the backlog. The story follows SDLC.md: the per-ticket shaping comes in chapter 5.",
  },

  // ────────────────────────────────────────────────────────────── 3
  {
    slug: "the-ticket",
    number: 3,
    title: "A ticket that knows what it isn't",
    stages: ["intake"],
    when: "Day 7",
    gates: ["G3"],
    logline: "The issue is filed with its labels and sections, found not ready, and made ready by the people who can.",
    cast: [
      { role: "product-owner", as: "decides", note: "Checks the Definition of Ready (G3)." },
      { role: "domain-expert", as: "consulted", note: "Answers the blocking question; confirms no rule is broken." },
    ],
    agents: [
      { skill: "om-prepare-issue", did: "Deduplicated, wrote the ready sections, applied the SDLC labels." },
      { skill: "om-auto-manage-issues", did: "Checked readiness overnight and named the gap on the ticket." },
    ],
    text: [
      "`om-backlog` files each issue through `om-prepare-issue`, which searches the tracker first. It finds a closed issue from last year, #118, rejected because the API could not tell one clinic's calendar from another's. It links it: the reason it was rejected is now the riskiest part of the work.",
      "Issue #231 arrives with the sections the Definition of Ready asks for: who has the problem (patients with an existing appointment, and the receptionists who answer their calls), the expected outcome and how it will be checked, what is out of scope (cancelling, fees), and the open questions, each marked blocking or not. It carries `feature`, `priority-medium` and `risk-high`. The risk is inferred, not guessed: data scoping and a schema change are both on SDLC.md's risk-high list.",
      "`om-auto-manage-issues` runs over the backlog overnight. It records #231 as not ready and says why, in one comment addressed to the author: a question marked blocking has no answer. Can a patient move one appointment from a referral package, the series of ten sessions a clinic books on a doctor's referral?",
      "Marta does not know. Bogdan does: no. Package sessions are booked against the referral's dates, and the clinic moves them, not the patient. Marta writes the answer on the ticket and adds package sessions to “out of scope”. Bogdan confirms that, as now written, the story breaks none of his rules. On its next pass the agent finds the gap closed and records the ticket as ready.",
      "Marta's yes is the third gate. Wanda could have waived the question instead, writing her reason on the ticket. Nobody needed her to, which is the best kind of waiver.",
    ],
    artefacts: [
      {
        kind: "comment",
        title: "Issue #231 · comment",
        meta: "posted by om-auto-manage-issues",
        labels: ["feature", "priority-medium", "risk-high"],
        body: `🤖 om-auto-manage-issues — not ready

@marta this ticket is not ready for implementation yet.
Missing (ticket level, SDLC.md › Definition of Ready):
  • Q2 is marked blocking and has no answer:
    “Can a patient move one appointment from a referral package?”

Decisions in play: R04 late cancellation (owner: Bogdan) · N02 no fees
Spec: none yet; the feature route will draft one.`,
      },
    ],
    decided: [
      "Bogdan: package sessions are not movable by patients.",
      "Marta: the ticket is ready (G3).",
    ],
    delegated: [
      "Dedupe, linking the old issue, the ready sections and the labels with their rationale.",
      "The overnight readiness check and the not-ready comment.",
    ],
  },

  // ────────────────────────────────────────────────────────────── 4
  {
    slug: "whose-is-it",
    number: 4,
    title: "Real, unclaimed, and riskier than it looks",
    stages: ["triage", "claim"],
    when: "Day 8, morning",
    gates: [],
    logline: "The agent checks it may take the work, takes it visibly, and a person settles how risky it is.",
    cast: [
      { role: "developer", as: "supervises", note: "Starts the agent instead of taking the ticket by hand." },
      { role: "architect", as: "supervises", note: "Settles the dispute about the risk label." },
      { role: "maintainer", as: "consulted", note: "Consulted on the risk; sees the claim comment." },
      { role: "product-owner", as: "informed", note: "Told the triage outcome." },
    ],
    agents: [
      { skill: "om-auto-fix-issue", did: "Checked for other claims, classified the issue, ran the feature triage gate, claimed it." },
      { skill: "om-verify-in-repo", did: "On another issue, found the bug already fixed on main and stopped cleanly." },
    ],
    text: [
      "On the eighth morning Kuba starts `om-auto-fix-issue 231`. The first thing it does is decide whether it may take the issue at all: no assignee, no `in-progress` label, no recent claim comment from anyone else, no open PR that closes it. Then it classifies. The ticket carries `feature` and describes something that does not exist yet, so it takes the feature route. The bug route's first question, “is this defect real?”, would be the wrong question.",
      "The feature route has its own triage gate: is this already built, or already in flight, and does the ticket pass the Definition of Ready? It is not, and it does. Marta is told the outcome, and there is nothing for her to do.",
      "Then the claim, in three signals: the issue is assigned, it gets the `in-progress` label, and a comment beginning with 🤖 says who is working on it and what they are doing. When the overnight `om-auto-manage-issues` reaches #231 again, it sees the claim and leaves the ticket alone. Agents back off from each other the way polite people do in a corridor: by looking first.",
      "Kuba questions the `risk-high` label. The migration adds one nullable column; surely that is medium. Tomasz settles it: the column is not the risk. A patient registered at two clinics must never see the other clinic's calendar, and that is data scoping, which is high. Wanda agrees, and points out what follows from it: no self-signed QA on this one, later.",
      "The same morning, Kuba's agent picks up a bug as well: #229, appointment times shown in UTC in the confirmation e-mail. `om-verify-in-repo` reads the code on main and the recent merges, finds that #226 fixed it two days ago, and stops with `NO_ACTION_NEEDED`. Nothing is claimed, so nothing has to be released. A triage that ends with nothing to do is a triage that worked.",
    ],
    artefacts: [
      {
        kind: "comment",
        title: "Issue #231 · comment",
        meta: "posted by om-auto-fix-issue through Kuba's account",
        labels: ["feature", "priority-medium", "risk-high", "in-progress"],
        body: `🤖 om-auto-fix-issue — claimed

Working on this issue: feature route (spec, then implementation).
Signals: assigned to @kuba · label in-progress · this comment.
Other agents: please back off. The lock is released when the run ends,
on success or failure.`,
      },
      {
        kind: "report",
        title: "Issue #229 · om-verify-in-repo",
        meta: "read-only triage, nothing claimed",
        body: `NO_ACTION_NEEDED
Already fixed on main by #226 (merged two days ago): the e-mail
template formats times in the clinic's time zone.
Evidence: src/mail/confirmation.tsx, commit 4be71a2.`,
      },
    ],
    decided: [
      "Kuba: to drive an agent on this ticket rather than take it by hand.",
      "Tomasz: the risk stays high, and why.",
    ],
    delegated: [
      "The concurrency check, the classification and the feature triage gate.",
      "The three claim signals.",
      "The read-only verification that closed #229 without work.",
    ],
    repoNote:
      "The chart's Triage skill is om-verify-in-repo, which is the bug route's gate. For a feature, om-auto-fix-issue runs an equivalent check of its own (already built? in flight? ready?) before it claims anything.",
  },

  // ────────────────────────────────────────────────────────────── 5
  {
    slug: "the-spec",
    number: 5,
    title: "The spec, and the argument about locks",
    stages: ["implement"],
    when: "Days 8–9",
    gates: [],
    logline: "An agent writes the spec and lists its guesses; people accept some, reject one, and miss one.",
    cast: [
      { role: "architect", as: "supervises", note: "Approves the spec and writes an ADR; rejects one assumption." },
      { role: "designer", as: "decides", note: "Settles the states for this ticket (SDLC.md's Design stage)." },
      { role: "domain-expert", as: "consulted", note: "Should have been asked about A3. Was not." },
      { role: "developer", as: "supervises", note: "Follows the spec PR; his agent will build from it." },
    ],
    agents: [
      { skill: "om-auto-write-spec", did: "Wrote the spec, attached mockups and screenshots, posted its assumptions." },
      { skill: "om-auto-review-pr", did: "Gave the spec a specification review rather than a code review." },
      { skill: "om-ux-shape", did: "Turned Lena's states into an interaction contract for this ticket." },
    ],
    text: [
      "No spec covers #231, so the feature route hands over to `om-auto-write-spec`. It writes `.ai/specs/2026-03-19-patient-reschedule.md` with the sections a careful engineer would ask for: data model, API, permissions, the happy path and the unhappy ones, Risks & Impact, a phased plan, and a section called Decisions in play that quotes R04 and N02 by id. It boots the app, screenshots the current appointment page, adds mockups of the new one, and opens spec-only PR #240, `Refs #231`.",
      "Where the ticket left questions open, the agent did not stop to ask. It chose the most reversible answer and posted every choice as a numbered assumption, so that a person can overrule it. There are four. A1: the 24-hour window is measured in the clinic's time zone. A2: double booking is prevented by a version column on the time slot, retried on conflict. A3: moving to another time on the same day with the same physiotherapist is allowed inside 24 hours, because receptionists do it (interview 4). A4: the original appointment is kept and marked as moved.",
      "Tomasz reads the spec the way he would read anyone's. He accepts A1. He accepts A4 and turns it into an ADR: a reschedule is a move, not a cancellation plus a booking, so the history and the referral link survive. He rejects A2. Two patients confirming the same time is exactly the race a version column handles badly under retries; he wants a unique constraint on physiotherapist and start time, and the losing confirmation turned into a clear message rather than an error. The agent amends the spec.",
      "`om-auto-review-pr` gives spec PR #240 a specification review: what can go wrong, what it breaks, what is missing, and whether there is a simpler way. Among its minor findings: “A3 touches R04; confirm with the rule's owner.” Tomasz confirms A3 himself, on the grounds that it sounds sensible. It does sound sensible. Bogdan is not asked. Hold that thought.",
      "Meanwhile Lena settles the states for this ticket with `om-ux-shape`: the smallest coherent scope, the interaction contract, and the states the screen must handle (loading, nothing free, time just taken, inside 24 hours, no permission), plus the one assumption most likely to be wrong, which she has already tested on the prototype. SDLC.md calls this the Design stage and places it between Claim and Implement.",
    ],
    artefacts: [
      {
        kind: "comment",
        title: "Spec PR #240 · comment, with the replies folded in",
        meta: "posted by om-auto-write-spec; replies by Tomasz",
        body: `🤖 om-auto-write-spec — Open Questions (autonomous defaults)

A1  24 h window measured in the clinic's time zone
    → confirmed (Tomasz)
A2  Double booking prevented by a version column, retried
    → REJECTED (Tomasz): unique (practitioner_id, starts_at);
      the losing confirmation shows “that time was just taken”
A3  Same-day move, same physiotherapist, allowed inside 24 h
    → confirmed (Tomasz)      ⓘ touches R04 (owner: Bogdan)
A4  The original appointment is kept, marked as moved
    → confirmed; recorded as ADR-012

Reply here to override any default.`,
      },
    ],
    decided: [
      "Tomasz: the spec, ADR-012, and the unique constraint instead of the version column.",
      "Lena: the interaction contract and the states.",
      "A3, confirmed by someone who did not own the rule it touched.",
    ],
    delegated: [
      "Drafting the spec, the mockups and the current-app screenshots.",
      "Listing every guess as an assumption to overrule.",
      "The specification review and the amendments.",
    ],
    repoNote:
      "The chart puts the spec skills under the Architect at Implement. The repo has no Architect role; the spec PR is reviewed like any other PR, and SDLC.md's Design stage (om-ux-shape) sits between Claim and Implement.",
  },

  // ────────────────────────────────────────────────────────────── 6
  {
    slug: "driving",
    number: 6,
    title: "Driving, not typing",
    stages: ["implement", "pull-request"],
    when: "Day 10",
    gates: [],
    logline: "The agent plans, builds and opens the PR; the developer reads the plan early enough for it to matter.",
    cast: [
      { role: "developer", as: "supervises", note: "Reads the plan, stops the run, adds a step, resumes it." },
      { role: "designer", as: "consulted", note: "Answers one design question while the screens are built." },
      { role: "qa", as: "supervises", note: "Has the app booted once for every later check." },
      { role: "architect", as: "consulted", note: "Asks for one more test on data scoping." },
    ],
    agents: [
      { skill: "om-auto-implement-spec", did: "Resolved the spec and handed the build to the PR engine." },
      { skill: "om-auto-create-pr", did: "Planned, opened a draft PR, built phase by phase, ran the gate, finished the PR." },
      { skill: "om-auto-continue-pr", did: "Resumed the run at the first unchecked step after Kuba's edit." },
      { skill: "om-prepare-test-env", did: "Booted the app once and wrote the shared environment descriptor." },
    ],
    text: [
      "Kuba runs `om-auto-implement-spec 2026-03-19-patient-reschedule`. It hands the build to `om-auto-create-pr`, which writes an execution plan, commits it as the first commit on `feat/patient-reschedule`, and opens draft PR #248 straight away, so the run can be watched from the tracker. The plan has eleven steps in four phases; each step is a checkbox that gets a commit hash when it lands.",
      "Kuba reads the plan before anything else. It is a good plan with one hole: step 2.2 enforces the 24-hour window in the form, and nowhere else. Anyone with a browser console could move tomorrow's appointment. He stops the run, adds step 2.3 (enforce the window in the endpoint, with a test that calls it directly) and resumes with `om-auto-continue-pr 248`, which picks up at the first unchecked box. This is most of what driving means here: the agent types, and the person reads the plan early enough for the reading to matter.",
      "Lena gets one question, through Kuba: when the patient's own physiotherapist has nothing free, should the picker offer the others? Yes, at the same clinic only; other clinics are a different conversation. The answer goes into the spec, and from the spec into the code.",
      "Ola ran `om-prepare-test-env` earlier in the week. The app boots once, a descriptor says where it is and how to log in, and every later check (the agent's own screenshots, QA, the integration tests) reuses the same environment instead of building its own.",
      "The run passes the validation gate and finishes the PR: the body says what changed and why, lists the decisions touched (R04), and carries `Closes #231`; the labels are `review`, `feature`, `needs-qa`, `priority-medium` and `risk-high`, each with a one-line reason. Kuba rewrites the “why” paragraph in his own words, since he will be the one answering for it. Tomasz, consulted on the risky parts, asks for one more test: from the first clinic's page, a patient registered at two clinics must see none of the second clinic's times. It goes in.",
      "The run's last step is a review of its own PR. That is the next chapter.",
    ],
    artefacts: [
      {
        kind: "plan",
        title: ".ai/runs/2026-03-20-patient-reschedule.md › Progress",
        meta: "the tracking plan on draft PR #248",
        body: `### Phase 1: Data
- [x] 1.1 Migration: moved_from_id; unique (practitioner_id, starts_at) — 3e1a9c0
- [x] 1.2 Migration test — 77b0d12
### Phase 2: API
- [x] 2.1 POST /appointments/:id/move, own appointments only — a41c5e8
- [x] 2.2 24 h window check in the reschedule form — c09f3b1
- [ ] 2.3 Enforce the 24 h window in the endpoint; test calls it directly
### Phase 3: Screens
- [ ] 3.1 Time picker, same clinic only
- [ ] 3.2 States: loading, nothing free, just taken, inside 24 h, no permission
…`,
      },
    ],
    decided: [
      "Kuba: the plan was wrong in one place, and how to fix it; the “why” of the PR.",
      "Lena: other physiotherapists, same clinic only.",
      "Tomasz: one more isolation test.",
    ],
    delegated: [
      "The plan, the worktree, the phase-by-phase commits and their tests.",
      "Running the validation gate; booting the shared environment.",
      "Opening the PR with its body, its labels and their reasons.",
    ],
  },

  // ────────────────────────────────────────────────────────────── 7
  {
    slug: "the-rule",
    number: 7,
    title: "Two reviewers and a rule",
    stages: ["review"],
    when: "Day 11",
    gates: ["G4", "G5"],
    logline: "The review blocks on a protected rule; the rule's owner changes it on the record; a person reviews the risky parts.",
    cast: [
      { role: "developer", as: "decides", note: "Answers the review in his own words, then asks the rule's owner." },
      { role: "domain-expert", as: "decides", note: "Approves a superseding rule (G5)." },
      { role: "product-owner", as: "consulted", note: "Agrees the change keeps the value of the feature." },
      { role: "architect", as: "decides", note: "Reviews the risk-high change independently (G4)." },
      { role: "designer", as: "supervises", note: "Gives the advisory design pass." },
    ],
    agents: [
      { skill: "om-auto-review-pr", did: "Ran the gate and the checklist, blocked on R04, fixed what was actionable." },
      { skill: "om-code-review", did: "The checklist behind the review: correctness, contracts, protected decisions." },
      { skill: "om-auto-continue-pr", did: "Made the agreed fixes and asked for another review." },
      { skill: "om-ux-review-pr", did: "Walked the changed screens; ranked findings by how much a patient would mind." },
    ],
    text: [
      "The review arrives four minutes after the run asks for it and reads like a review: one blocker, one major, two minors, a nit. It ran the full validation gate first, so the findings are about the change, not about whether it builds.",
      "The blocker quotes R04 by id. The code lets a patient move tomorrow's 9:00 to tomorrow's 15:00 with the same physiotherapist, inside 24 hours, and R04 says such a change is a late cancellation that stays with the front desk. There is no superseding entry in the PR, so the review blocks. It does not suggest deleting the code. SDLC.md is precise about this: the way out is to change the decision explicitly, with its owner's approval, or to drop the exception, and the choice is not the agent's to make.",
      "The major is the migration. The PR changes the schema, and a risk-high schema change must carry a migration test both ways and a rollback plan in the PR body. There is a test for up. There is no test for down, and no plan.",
      "The fix loop handles what it can and stops at what it cannot: it sets `changes-requested`, hands the PR back to Kuba and says, in a separate comment, that the blocker needs a person. Kuba answers in his own words. The same-day swap is what receptionists do every day; it is in interview 4; Tomasz confirmed A3. All true. None of it is Bogdan.",
      "So Kuba asks Bogdan, which is what the gate is for. Bogdan reads R04, the interview and the PR, and sides with the receptionists: a move on the same day to the same physiotherapist leaves no hole in anyone's diary, and a hole in the diary is what R04 protects against. He approves a superseding entry, R09; Marta agrees it does not change what the feature is for. The PR adds R09 to the brief, and the blocker is cleared by changing the decision, on the record, with its owner's name on it. That is the fifth gate.",
      "`om-auto-continue-pr` makes the agreed fixes: the down migration and its test, the rollback plan, the two minors. The re-review approves, moves the PR to `merge-queue` and, because it carries `needs-qa`, posts manual-QA instructions ranked P0 to P2 for whoever tests it.",
      "Then Tomasz reviews it himself. The team's policy asks for an independent human review of risk-high changes, and he reads what an agent reads, only differently: the unique constraint, the isolation test for the patient registered at two clinics, the endpoint check Kuba added. He approves. That is the fourth gate; the gates are numbered by where they sit in the process, not by the order they happen to close in.",
      "Lena's pass is the last and the mildest. `om-ux-review-pr` walks the changed screens against the design contract and ranks what it finds by user impact: inside 24 hours, the “please call the clinic” message gives no phone number (high); when one clinic is full, the picker could offer another (low, and out of scope). The pass is advisory: it informs the review and does not hold the merge. Kuba adds the phone number. The other clinics become a follow-up.",
    ],
    artefacts: [
      {
        kind: "review",
        title: "PR #248 · review",
        meta: "posted by om-auto-review-pr",
        labels: ["changes-requested", "feature", "needs-qa", "priority-medium", "risk-high"],
        body: `🤖 om-auto-review-pr — CHANGES REQUESTED

Blocker  src/appointments/move.ts:48
  Contradicts R04 (owner: Bogdan): a same-day move inside 24 h
  is allowed, and the PR has no superseding entry.
  Way out: a superseding row approved by R04's owner, or drop
  the exception. Needs a person; not fixed automatically.
Major    migrations/0042_appointment_moves.ts
  risk-high schema change: no down-migration test and no
  rollback plan in the PR body (SDLC.md › risk-high).
Minor    src/appointments/move.test.ts:112 …
Minor    src/appointments/slots.ts:30 …
Nit      …

Validation gate: lint ✓  typecheck ✓  test ✓  build ✓`,
      },
      {
        kind: "file",
        title: ".ai/specs/product-brief.md, added in PR #248",
        meta: "approved by Bogdan",
        body: `R09  A move to another time on the same day with the same
     practitioner is not a late cancellation.
     Supersedes: R04 (in part) · owner: Bogdan · active
     Source: [INTERVIEW] receptionists, interview 4; approved in #248`,
      },
    ],
    decided: [
      "Bogdan: R09 supersedes part of R04 (G5).",
      "Tomasz: the independent review of the risk-high change (G4).",
      "Kuba: the reply, and the question to the right person.",
      "Lena: which design findings matter now.",
    ],
    delegated: [
      "The checklist review, the validation gate and the ranked findings.",
      "The actionable fixes, the re-review, the labels and the QA instructions.",
      "Walking the screens against the design contract.",
    ],
    repoNote:
      "The chart gives the independent review (G4) to the Architect. The repo has no Architect role: SDLC.md requires a second person's review for auth and money, and om-code-review blocks a risk-high PR that lacks the required evidence. Here the tech lead is that second person.",
  },

  // ────────────────────────────────────────────────────────────── 8
  {
    slug: "no-then-yes",
    number: 8,
    title: "No, then yes",
    stages: ["qa"],
    when: "Day 12",
    gates: ["G6"],
    logline: "QA fails a missing state, then approves one exact commit; the product owner accepts the value.",
    cast: [
      { role: "qa", as: "decides", note: "Fails the PR, then approves it at a pinned commit (G6)." },
      { role: "product-owner", as: "consulted", note: "Accepts the value against the brief, not the code." },
      { role: "maintainer", as: "informed", note: "Could have granted a QA exception; none was asked for." },
      { role: "designer", as: "informed", note: "Hears about the UI findings." },
      { role: "developer", as: "informed", note: "Gets the result, and the bug." },
    ],
    agents: [
      { skill: "om-qa-buddy", did: "Wrote the brief, the plan and a runbook Ola could start on at once." },
      { skill: "om-auto-qa-pr", did: "Walked the change in a browser and posted screenshots and a report." },
      { skill: "om-integration-tests", did: "Turned the race into an end-to-end test against the live app." },
    ],
    text: [
      "Ola moves #248 from `merge-queue` to `qa`, which tells everyone, people and agents alike, that a tester is on it and nobody merges under her. She starts `om-qa-buddy 248`. Before booting anything it writes a plain-language brief of what a patient will see differently (no file names in it), a short prioritised test plan seeded by the review's P0–P2 instructions, and a runbook she can start clicking through at once, in parallel with the agent.",
      "She takes the cases nobody scripts. Two browsers, two test patients, the same time, confirm at the same moment. The database does its job: the unique constraint holds and one booking wins. The screen does not: the losing patient sees “Something went wrong” instead of the “that time was just taken” state Lena designed. In this process a missing state fails QA, the same as a crash.",
      "Ola applies `qa-failed` with the steps to reproduce. The PR goes back; Kuba's agent adds the state and a test for it, and pushes. Any earlier QA evidence would now be stale by definition: approval is pinned to a commit, and this is a different one.",
      "Second pass. `om-auto-qa-pr 248` walks the change in a real browser and posts screenshots and a pass/fail report, changing no labels; the race now ends in Lena's message. Ola walks the state matrix herself: default, empty, loading, error, no permission, long content, a narrow phone. Then she applies `qa-approved` with the line `QA head: 9c41f07`, the commit she tested.",
      "Self-QA was never on the table. SDLC.md lets an engineer, or `om-auto-qa-pr --self-qa-signoff`, sign off risk-low or risk-medium work, with evidence, when no tester has time. This PR is risk-high, so it needed Ola or a written exception from Wanda. It got Ola.",
      "Marta looks at the preview with the brief open beside it. She is not testing the code; she is checking that a patient whose dentist has moved can move her physio without phoning anyone. She can. The race is worth keeping, so `om-integration-tests` turns it into an end-to-end test written against the live app, with real locators. Ola also found something unrelated: the opening-hours page still shows the winter hours. She notes it for cleanup.",
    ],
    artefacts: [
      {
        kind: "comment",
        title: "PR #248 · QA comment",
        meta: "Ola, with the evidence from om-auto-qa-pr",
        labels: ["merge-queue", "qa-approved", "needs-qa", "risk-high"],
        body: `QA — approved

Scope: move an appointment (P0–P2 from the review), state matrix,
two browsers racing for one time.
Environment: shared test env, seed “two-clinic patient”.
Result: pass. The race ends in “That time was just taken” (shot 4).
Negative cases: someone else's appointment (403); clinic B times on
clinic A's page (none); inside 24 h, other physio (blocked).

QA head: 9c41f07`,
      },
    ],
    decided: [
      "Ola: fail on a missing state; approve at commit 9c41f07 (G6).",
      "Marta: the feature does what the brief asked for.",
    ],
    delegated: [
      "The QA brief, the plan and the runbook.",
      "Browser walks with screenshots and a pass/fail report.",
      "The end-to-end test for the race.",
    ],
  },

  // ────────────────────────────────────────────────────────────── 9
  {
    slug: "wanda-signs",
    number: 9,
    title: "Wanda signs",
    stages: ["merge"],
    when: "Day 12, afternoon",
    gates: ["G7"],
    logline: "An agent lists what can merge and re-checks every gate; a person signs.",
    cast: [
      { role: "maintainer", as: "decides", note: "Signs the merge (G7)." },
      { role: "architect", as: "consulted", note: "Would be asked if two gates disagreed. They did not." },
      { role: "developer", as: "informed", note: "Told it merged." },
      { role: "product-owner", as: "informed", note: "Told it merged; shipping is the release process." },
    ],
    agents: [
      { skill: "om-merge-buddy", did: "Read every open PR and sorted them into ready, almost ready and blocked." },
      { skill: "om-approve-merge-pr", did: "Re-checked every gate, approved and squash-merged." },
    ],
    text: [
      "Wanda starts the afternoon with `om-merge-buddy`, which reads every open PR and answers one question: what can merge right now? It merges nothing, comments on nothing and labels nothing. It is a list.",
      "#248 is ready: approved, required checks green (counted from the runs on the head commit, not inferred from an empty list), no conflicts, no blocking labels, `needs-qa` with `qa-approved`, and the QA head is the head. #244, a dependency bump, is almost ready: its QA evidence is older than its head. #239 is blocked: someone put `do-not-merge` on it, and only a person can take that off.",
      "She runs `om-approve-merge-pr 248`. It re-checks every gate rather than trusting a list from an hour ago, approves, and squash-merges. Had anything been out of place (a red check, a `qa-failed`, a tester still on it) it would have refused, and said why.",
      "Wanda's signature is the seventh gate, and the shortest. The work that makes it short happened at the six before it.",
      "Merge is where this process ends. Deployment, smoke tests and rollback follow the team's release process, which at Kinetik means Thursday evening, a checklist, and a person watching the dashboards. Kuba and Marta are told it merged.",
    ],
    artefacts: [
      {
        kind: "report",
        title: "om-merge-buddy",
        meta: "Wanda's terminal · read-only",
        body: `🤖 om-merge-buddy — 3 open PRs

Ready (1)
  #248  Patients can move their own appointment
        next: om-approve-merge-pr 248
Almost ready (1)
  #244  Bump date-fns to 4.2
        QA evidence older than head (tested 1d2e3f4, head 5a6b7c8)
Blocked (1)
  #239  Clinic export v2: do-not-merge (set by a person)`,
      },
    ],
    decided: ["Wanda: the merge (G7); #239 stays blocked until a person lifts the label."],
    delegated: ["The readiness report.", "The gate re-check, the approval and the squash-merge."],
  },

  // ────────────────────────────────────────────────────────────── 10
  {
    slug: "sweeping-up",
    number: 10,
    title: "Sweeping up",
    stages: ["cleanup"],
    when: "Day 13, and a month later",
    gates: [],
    logline: "The tracker is made to tell the truth, the leftovers get owners, and the process learns from the second pass.",
    cast: [
      { role: "maintainer", as: "supervises", note: "Reads the follow-ups, sets priority, guards do-not-close, tunes the process." },
      { role: "qa", as: "supervises", note: "Files what the test found outside the scope." },
      { role: "developer", as: "informed", note: "Follow-ups from review and QA." },
      { role: "product-owner", as: "informed", note: "Follow-ups filed." },
    ],
    agents: [
      { skill: "om-close-fixed-issues", did: "Closed the issue the merged PR fixed; left do-not-close alone." },
      { skill: "om-followup-issue-from-pr", did: "Turned two leftovers into tracked, assigned issues." },
      { skill: "om-auto-update-changelog", did: "Drafted the release entry and left the highlights to a person." },
      { skill: "om-pipeline-retro", did: "Ranked what the second passes cost, a month on." },
    ],
    text: [
      "`om-close-fixed-issues` closes #231, because the merged PR said `Closes #231` in so many words; it never closes on a bare mention. It leaves alone anything labelled `do-not-close`, which is why epic E3, still half open, stays open: Wanda put the label on it.",
      "`om-followup-issue-from-pr` turns two leftovers into tracked issues, each assigned to the right person: #252, offer another clinic's times when one is full (from Lena's review), and #253, the opening-hours page shows the winter hours (from Ola's session). Wanda reads both. She makes #253 `priority-high`, because the clocks change at the end of the month and the clinics open earlier, and leaves #252 for Marta's next discovery round.",
      "At release time `om-auto-update-changelog` drafts the entry for everything merged since the last release, credits the authors, and leaves the Highlights paragraph for a person. Wanda writes one sentence: “Patients can now move their own appointments.” The front desk suggests adding “finally”.",
      "A month later Wanda runs `om-pipeline-retro`. It sorts the finished runs into clean single passes and second passes and ranks the causes by the hours they cost. #248 is a second pass with a recorded cause: an assumption that touched a protected rule, confirmed by someone who did not own the rule. Two other PRs share the cause. Wanda files it with `om-prepare-issue`, and then changes the process: a repo-local override of `om-auto-write-spec` now marks any assumption that touches a protected entry `⚠ NEEDS HUMAN CONFIRMATION`, which keeps the spec PR a draft until the entry's owner answers.",
      "So the story ends where it began: with Wanda changing a file in the repository, reviewed like any other change.",
    ],
    artefacts: [
      {
        kind: "report",
        title: "om-pipeline-retro --since 2026-03-01",
        meta: "Wanda's terminal · read-only",
        body: `🤖 om-pipeline-retro

Runs: 31 · clean single pass: 22 (71%) · second pass: 9
Causes, by hours beyond the median clean run
  1. Assumption touching a protected rule, confirmed by a non-owner
     3 PRs (#248, #255, #261) · 19.5 h
  2. Flaky end-to-end job              2 PRs · 6 h
  3. Cause not recorded                2 PRs
File cause 1 with om-prepare-issue? (yes / no)`,
      },
    ],
    decided: [
      "Wanda: the priorities, the do-not-close guard, the highlights, and the change to the process.",
      "Ola: what counted as outside the scope.",
    ],
    delegated: [
      "Closing the fixed issue; filing and assigning the follow-ups.",
      "Drafting the changelog.",
      "Classifying the finished runs and ranking the causes.",
    ],
  },
];
