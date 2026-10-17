import type { ProjectStatus } from "@atl/db";

/** How each project status is presented. Keys are what the database stores. */
export const STATUS_INFO: Record<
  ProjectStatus,
  { label: string; hint: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  idea: {
    label: "(Idea) Merely an idea",
    hint: "Not dead yet. Feeling much better, actually.",
    variant: "outline",
  },
  "in-progress": {
    label: "(Ongoing) 'Tis but a scratch",
    hint: "Being built. Bleeding a bit. Refusing to yield.",
    variant: "secondary",
  },
  shipped: {
    label: "(Shipped) Shrubbery delivered",
    hint: "Done. One that looks nice, and not too expensive.",
    variant: "default",
  },
  abandoned: {
    label: "(Abandoned) Pining for the fjords",
    hint: "Not abandoned. Just resting. Beautiful plumage.",
    variant: "destructive",
  },
};
