import type { Metadata } from "next";

/** Upstream links into the open-mercato/skills repository (the guide's only source of truth). */
export const REPO = "https://github.com/open-mercato/skills";
const BLOB = `${REPO}/blob/main`;

export const UP = {
  repo: REPO,
  readme: `${BLOB}/README.md`,
  sdlc: `${BLOB}/SDLC.md`,
  codeReview: `${BLOB}/CODE_REVIEW.md`,
  compat: `${BLOB}/BACKWARD_COMPATIBILITY.md`,
  decisions: `${BLOB}/DECISIONS.md`,
  upgradeNotes: `${BLOB}/UPGRADE_NOTES.md`,
  changelog: `${BLOB}/CHANGELOG.md`,
  cards: `${BLOB}/docs/skills/README.md`,
  rules: `${BLOB}/skills/om-auto-create-pr/references/rules.md`,
  claim: `${BLOB}/skills/om-auto-create-pr/references/claim-pr.md`,
  setupQuestions: `${BLOB}/skills/om-setup-agent-pipeline/references/interview-questions.md`,
  setupSkill: `${BLOB}/skills/om-setup-agent-pipeline/SKILL.md`,
  roles: {
    productManager: `${BLOB}/docs/roles/product-manager.md`,
    designer: `${BLOB}/docs/roles/designer.md`,
    developer: `${BLOB}/docs/roles/developer.md`,
    qa: `${BLOB}/docs/roles/qa.md`,
    releaseManager: `${BLOB}/docs/roles/release-manager.md`,
  },
  sdlcAt: {
    roles: `${BLOB}/SDLC.md#roles`,
    lifecycle: `${BLOB}/SDLC.md#ticket-lifecycle`,
    ready: `${BLOB}/SDLC.md#definition-of-ready`,
    decisions: `${BLOB}/SDLC.md#product-decisions-as-a-protected-contract`,
    labels: `${BLOB}/SDLC.md#label-state-machine`,
    qaGate: `${BLOB}/SDLC.md#the-qa-gate`,
    claim: `${BLOB}/SDLC.md#the-claim-protocol`,
    automation: `${BLOB}/SDLC.md#the-automation-contract`,
    amending: `${BLOB}/SDLC.md#amending-this-process`,
  },
  readmeAt: {
    pipeline: `${BLOB}/README.md#-the-pipeline`,
    roles: `${BLOB}/README.md#-workflows-by-role`,
    stack: `${BLOB}/README.md#-works-with-any-stack`,
    makeItYours: `${BLOB}/README.md#-make-it-yours`,
    overrides: `${BLOB}/README.md#repo-local-skill-overrides`,
    update: `${BLOB}/README.md#-update-an-existing-installation`,
  },
} as const;

/** The skill's card in docs/skills/, or its SKILL.md for om-qa-buddy, the one skill without a card. */
export function skillUrl(name: string): string {
  return name === "om-qa-buddy" ? `${BLOB}/skills/${name}/SKILL.md` : `${BLOB}/docs/skills/${name}.md`;
}

export function skillSource(name: string): string {
  return `${BLOB}/skills/${name}/SKILL.md`;
}

/** Every page is hidden: never indexed, never followed. */
export const ROBOTS = { index: false, follow: false } as const;

export function meta(title: string): Metadata {
  return { title, robots: ROBOTS };
}
