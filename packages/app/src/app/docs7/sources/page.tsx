import { Frame } from "../_components/frame";
import { Ext, SectionTitle } from "../_components/marks";
import { meta, skillSource, UP } from "../_data/links";

export const metadata = meta("Read the source");

const GROUPS: { name: string; why: string; links: { label: string; href: string; note: string }[] }[] = [
  {
    name: "Start here",
    why: "The three documents everything in this guide comes from.",
    links: [
      { label: "README.md", href: UP.readme, note: "install, the pipeline, the catalogue, workflows by role, labels and the QA gate" },
      { label: "SDLC.md", href: UP.sdlc, note: "the process document setup generates: roles, lifecycle, labels, QA gate, claims" },
      { label: "Skill cards", href: UP.cards, note: "one page per skill with its parameters and companions" },
    ],
  },
  {
    name: "Role guides",
    why: "The upstream version of the people pages.",
    links: [
      { label: "Developer", href: UP.roles.developer, note: "docs/roles/developer.md" },
      { label: "Product manager", href: UP.roles.productManager, note: "docs/roles/product-manager.md" },
      { label: "Designer", href: UP.roles.designer, note: "docs/roles/designer.md" },
      { label: "QA", href: UP.roles.qa, note: "docs/roles/qa.md" },
      { label: "Release manager", href: UP.roles.releaseManager, note: "docs/roles/release-manager.md" },
    ],
  },
  {
    name: "The rules underneath",
    why: "Where the guardrails of chapter 7 are written down.",
    links: [
      { label: "Shared rules", href: UP.rules, note: "the autonomous-run contract, label discipline, markers, secrets" },
      { label: "Claim protocol", href: UP.claim, note: "three signals, hand-offs, stale locks, --force" },
      { label: "SDLC.md: the QA gate", href: UP.sdlcAt.qaGate, note: "qa-approved, QA head, self-QA, risk-high" },
      { label: "SDLC.md: label state machine", href: UP.sdlcAt.labels, note: "who moves which label" },
      { label: "Setup questions", href: UP.setupQuestions, note: "what om-setup-agent-pipeline asks" },
    ],
  },
  {
    name: "The skills chapter 1 to 11 lean on most",
    why: "Read these SKILL.md files first if you read any.",
    links: [
      "om-setup-agent-pipeline",
      "om-auto-fix-issue",
      "om-auto-create-pr",
      "om-auto-review-pr",
      "om-auto-qa-pr",
      "om-approve-merge-pr",
      "om-pr-autopilot",
      "om-pipeline-retro",
    ].map((s) => ({ label: s, href: skillSource(s), note: `skills/${s}/SKILL.md` })),
  },
  {
    name: "History and change",
    why: "Why things are the way they are, and how to upgrade.",
    links: [
      { label: "DECISIONS.md", href: UP.decisions, note: "deliberate choices, dated" },
      { label: "UPGRADE_NOTES.md", href: UP.upgradeNotes, note: "what to migrate by hand after an upgrade" },
      { label: "CHANGELOG.md", href: UP.changelog, note: "releases, written by om-auto-update-changelog" },
      { label: "CODE_REVIEW.md", href: UP.codeReview, note: "the review rules of the skills repo itself" },
    ],
  },
];

export default function Sources() {
  return (
    <Frame
      href="/docs7/sources"
      kicker="Reference"
      title="Read the source"
      lead={
        <>
          This guide is built from the <Ext href={UP.repo}>open-mercato/skills</Ext> repository alone (commit 7c662b0).
          The team, its product and every example comment are invented and marked as illustrative; the skills, flags,
          labels, files and rules are the repository&apos;s.
        </>
      }
    >
      {GROUPS.map((g) => (
        <section key={g.name} className="flex flex-col gap-3">
          <SectionTitle>{g.name}</SectionTitle>
          <p className="-mt-1 text-sm text-muted-foreground">{g.why}</p>
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {g.links.map((l) => (
              <li key={l.href} className="flex min-w-0 flex-col gap-0.5 rounded-xl border bg-card p-3">
                <span className="font-medium break-words">
                  <Ext href={l.href}>{l.label}</Ext>
                </span>
                <span className="text-sm break-words text-muted-foreground">{l.note}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="rounded-xl border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
        <p>
          <span className="font-semibold text-foreground">Where this guide says less than it could.</span> The skills
          disagree on one small number: how old a claim must be before it counts as stale (the shared claim reference
          says 24 hours; two skills use shorter windows of their own), so the guide never quotes one. The README counts
          forty-one skills; the folder holds 42. The skill index lists <span className="font-mono">om-review-prs</span>{" "}
          and <span className="font-mono">om-close-fixed-issues</span> as interactive while the README&apos;s table
          puts them with the autonomous ones; the guide follows the naming rule and calls them sweeps.
        </p>
      </section>
    </Frame>
  );
}
