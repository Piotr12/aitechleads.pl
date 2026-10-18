import type { Metadata } from "next";
import { ROLES } from "./roles";
import { STATIONS } from "./stations";

/** The guide's reading order. Every page finds its place, prev and next from this list alone. */

export type PartId = "start" | "kit" | "journey" | "onramps" | "hood" | "people" | "monday";

export type Part = { id: PartId; name: string; emoji: string; href: string; blurb: string };

export const PARTS: Part[] = [
  { id: "start", name: "Start", emoji: "📦", href: "/docs6", blurb: "The whole trip on one page." },
  { id: "kit", name: "The kit", emoji: "🧰", href: "/docs6/kit", blurb: "The moving parts, and how to read a hand-off." },
  { id: "journey", name: "The journey", emoji: "🛣️", href: "/docs6/journey/idea", blurb: "Nine hand-offs, one piece of work, idea to tidied." },
  { id: "onramps", name: "Other on-ramps", emoji: "🔀", href: "/docs6/onramps", blurb: "Bugs, products and stalled PRs join the same road." },
  { id: "hood", name: "Under the hood", emoji: "⚙️", href: "/docs6/hood/rulebook", blurb: "The rulebook, labels, markers, locks, and loops." },
  { id: "people", name: "People", emoji: "👥", href: "/docs6/people", blurb: "Who touches the work where, and what they decide." },
  { id: "monday", name: "Monday", emoji: "☕", href: "/docs6/monday", blurb: "Your first week, a self-check, and every skill." },
];

export type NavPage = { href: string; title: string; part: PartId };

export const SEQUENCE: NavPage[] = [
  { href: "/docs6", title: "Follow the work", part: "start" },
  { href: "/docs6/kit", title: "Five kinds of moving parts", part: "kit" },
  { href: "/docs6/kit/handoff", title: "How to read a hand-off", part: "kit" },
  ...STATIONS.map((s) => ({ href: `/docs6/journey/${s.id}`, title: `${s.n}. ${s.title}`, part: "journey" as const })),
  { href: "/docs6/onramps", title: "Seven ways onto one road", part: "onramps" },
  { href: "/docs6/onramps/bug", title: "A bug report takes the short road", part: "onramps" },
  { href: "/docs6/onramps/product", title: "Before the first idea: a product brief", part: "onramps" },
  { href: "/docs6/onramps/stalled", title: "A PR that stalled halfway", part: "onramps" },
  { href: "/docs6/hood/rulebook", title: "The rulebook every skill reads first", part: "hood" },
  { href: "/docs6/hood/labels", title: "Labels are the PR's state machine", part: "hood" },
  { href: "/docs6/hood/markers", title: "How a skill says “your turn”", part: "hood" },
  { href: "/docs6/hood/locks", title: "Who is holding it right now", part: "hood" },
  { href: "/docs6/hood/loops", title: "The road repairs itself", part: "hood" },
  { href: "/docs6/people", title: "Six people along the road", part: "people" },
  ...ROLES.map((r) => ({ href: `/docs6/people/${r.id}`, title: `${r.emoji} ${r.name}`, part: "people" as const })),
  { href: "/docs6/people/red-lines", title: "Where people decide, what agents never do", part: "people" },
  { href: "/docs6/monday", title: "Your first week", part: "monday" },
  { href: "/docs6/check", title: "Check yourself", part: "monday" },
  { href: "/docs6/skills", title: "Every skill, by where it touches the work", part: "monday" },
];

export function position(href: string) {
  const i = SEQUENCE.findIndex((p) => p.href === href);
  if (i < 0) throw new Error(`docs6: ${href} is not in SEQUENCE`);
  const page = SEQUENCE[i];
  const part = PARTS.find((p) => p.id === page.part)!;
  const inPart = SEQUENCE.filter((p) => p.part === page.part);
  return {
    page,
    part,
    inPart,
    indexInPart: inPart.findIndex((p) => p.href === href),
    prev: SEQUENCE[i - 1] as NavPage | undefined,
    next: SEQUENCE[i + 1] as NavPage | undefined,
    index: i,
    total: SEQUENCE.length,
  };
}

export const GUIDE = "Follow the work";

/** Every page's metadata: its title, and never indexed or followed. */
export function meta(title: string, description?: string): Metadata {
  return { title, description, robots: { index: false, follow: false } };
}
