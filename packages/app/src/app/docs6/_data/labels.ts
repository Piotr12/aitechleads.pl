/** The label taxonomy from SDLC.md "Label state machine" and the config schema in om-setup-agent-pipeline. */

export type LabelGroup = "pipeline" | "category" | "meta" | "priority" | "risk" | "issue";

export const LABEL_GROUPS: { group: LabelGroup; name: string; rule: string; labels: string[] }[] = [
  {
    group: "pipeline",
    name: "Pipeline",
    rule: "one at a time, PRs only: where the PR sits in the flow",
    labels: ["review", "changes-requested", "qa", "qa-failed", "merge-queue", "blocked", "do-not-merge"],
  },
  {
    group: "category",
    name: "Category",
    rule: "additive: what kind of change",
    labels: ["bug", "feature", "refactor", "security", "dependencies", "documentation"],
  },
  {
    group: "meta",
    name: "Meta",
    rule: "additive: process signals",
    labels: ["needs-qa", "skip-qa", "qa-approved", "qa-self-verified", "in-progress", "ci-monitoring"],
  },
  {
    group: "priority",
    name: "Priority",
    rule: "one at a time; unset reads as medium: how urgent",
    labels: ["priority-low", "priority-medium", "priority-high", "priority-extreme"],
  },
  {
    group: "risk",
    name: "Risk",
    rule: "one at a time; unset reads as medium: how dangerous to ship",
    labels: ["risk-low", "risk-medium", "risk-high"],
  },
];

const GROUP_OF: Record<string, LabelGroup> = Object.fromEntries(
  LABEL_GROUPS.flatMap((g) => g.labels.map((l) => [l, g.group] as const)),
);

export function labelGroup(label: string): LabelGroup {
  return GROUP_OF[label] ?? "issue";
}
