import { CHAPTERS, PEOPLE } from "./story";

/** The guide's reading order. Every page finds its place, its part and its neighbours from this list. */

export type PartId = "month" | "picture" | "reference";

export type Part = { id: PartId; name: string; href: string };

export const PARTS: Part[] = [
  { id: "month", name: "The month", href: "/docs7" },
  { id: "picture", name: "The whole picture", href: "/docs7/picture" },
  { id: "reference", name: "Reference", href: "/docs7/people" },
];

export type NavPage = { href: string; title: string; short: string; part: PartId };

export const SEQUENCE: NavPage[] = [
  { href: "/docs7", title: "Before the month", short: "Start", part: "month" },
  ...CHAPTERS.map((c) => ({
    href: `/docs7/month/${c.slug}`,
    title: `${c.when}: ${c.title}`,
    short: c.title,
    part: "month" as const,
  })),
  { href: "/docs7/picture", title: "The whole picture", short: "The whole picture", part: "picture" },
  { href: "/docs7/people", title: "Who runs what", short: "People", part: "reference" },
  ...PEOPLE.map((p) => ({
    href: `/docs7/people/${p.id}`,
    title: `${p.role}: ${p.name}'s flow`,
    short: p.role,
    part: "reference" as const,
  })),
  { href: "/docs7/skills", title: "All 42 skills by purpose", short: "Skills", part: "reference" },
  { href: "/docs7/glossary", title: "Labels, files and words", short: "Glossary", part: "reference" },
  { href: "/docs7/sources", title: "Read the source", short: "Sources", part: "reference" },
];

export type Position = {
  page: NavPage;
  prev?: NavPage;
  next?: NavPage;
  part: Part;
  inPart: NavPage[];
  indexInPart: number;
  index: number;
  total: number;
};

export function position(href: string): Position {
  const index = SEQUENCE.findIndex((p) => p.href === href);
  if (index < 0) throw new Error(`docs7: ${href} is not in the reading order`);
  const page = SEQUENCE[index];
  const part = PARTS.find((p) => p.id === page.part) ?? PARTS[0];
  const inPart = SEQUENCE.filter((p) => p.part === page.part);
  return {
    page,
    prev: SEQUENCE[index - 1],
    next: SEQUENCE[index + 1],
    part,
    inPart,
    indexInPart: inPart.findIndex((p) => p.href === href),
    index,
    total: SEQUENCE.length,
  };
}
