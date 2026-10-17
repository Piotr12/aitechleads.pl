/** Upstream links into the open-mercato/skills repository. */
export const REPO = "https://github.com/open-mercato/skills";
const BLOB = `${REPO}/blob/main`;

export const UPSTREAM = {
  repo: REPO,
  readme: `${BLOB}/README.md`,
  sdlc: `${BLOB}/SDLC.md`,
  codeReview: `${BLOB}/CODE_REVIEW.md`,
  decisions: `${BLOB}/DECISIONS.md`,
  skillCards: `${BLOB}/docs/skills/README.md`,
  roles: {
    productManager: `${BLOB}/docs/roles/product-manager.md`,
    designer: `${BLOB}/docs/roles/designer.md`,
    developer: `${BLOB}/docs/roles/developer.md`,
    qa: `${BLOB}/docs/roles/qa.md`,
    releaseManager: `${BLOB}/docs/roles/release-manager.md`,
  },
  sdlcSection: {
    roles: `${BLOB}/SDLC.md#roles`,
    lifecycle: `${BLOB}/SDLC.md#ticket-lifecycle`,
    ready: `${BLOB}/SDLC.md#definition-of-ready`,
    decisions: `${BLOB}/SDLC.md#product-decisions-as-a-protected-contract`,
    labels: `${BLOB}/SDLC.md#label-state-machine`,
    qaGate: `${BLOB}/SDLC.md#the-qa-gate`,
    claim: `${BLOB}/SDLC.md#the-claim-protocol`,
    automation: `${BLOB}/SDLC.md#the-automation-contract`,
  },
} as const;

/** Every skill has a docs card except om-qa-buddy, which only has its SKILL.md. */
export function skillUrl(name: string): string {
  return name === "om-qa-buddy" ? `${BLOB}/skills/${name}/SKILL.md` : `${BLOB}/docs/skills/${name}.md`;
}
