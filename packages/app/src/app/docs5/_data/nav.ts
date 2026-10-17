import { ROLES } from "./roles";
import { STAGES } from "./stages";

/** The guide's reading order. Every page knows its place from this list alone. */

export type TrackId = "start" | "zoom" | "seats" | "ask" | "stops" | "more";

export type Track = { id: TrackId; name: string; emoji: string; href: string; blurb: string };

export const TRACKS: Track[] = [
  { id: "start", name: "Start", emoji: "👋", href: "/docs5", blurb: "Three things to know, and how this guide works." },
  { id: "zoom", name: "Zoom in", emoji: "🔎", href: "/docs5/zoom/road", blurb: "Seven short pages; each adds one idea to the same picture." },
  { id: "seats", name: "Your seat", emoji: "💺", href: "/docs5/seats", blurb: "Pick what you do, see only your own moments and handoffs." },
  { id: "ask", name: "Questions", emoji: "❓", href: "/docs5/ask", blurb: "Six everyday questions, one small page each." },
  { id: "stops", name: "Stop by stop", emoji: "🚏", href: "/docs5/stops", blurb: "Every stop on the road: who is there, which skills run." },
  { id: "more", name: "Further", emoji: "📚", href: "/docs5/further", blurb: "Upstream docs, and where the chart and the repo differ." },
];

export type ZoomLevel = { slug: string; title: string; idea: string };

export const ZOOM: ZoomLevel[] = [
  { slug: "road", title: "One road", idea: "Every piece of work travels the same road." },
  { slug: "stops", title: "Ten stops", idea: "The road has ten stops, each with a “done when”." },
  { slug: "hands", title: "Who does the work", idea: "Agents do the work; people decide." },
  { slug: "people", title: "Seven people", idea: "Each person stands at only a few stops." },
  { slug: "gates", title: "Seven red lights", idea: "At seven points a named person must say yes." },
  { slug: "skills", title: "42 skills, 5 drawers", idea: "Skills sort into the leg of the road they serve." },
  { slug: "map", title: "The whole chart", idea: "Put together, it is the chart you were afraid of." },
];

export const QUESTIONS = [
  { slug: "who-approves", title: "Who says yes to what?", emoji: "✋" },
  { slug: "which-skill", title: "Which skill do I run?", emoji: "🧰" },
  { slug: "after-the-pr", title: "I opened a PR. Now what?", emoji: "📬" },
  { slug: "bug-or-feature", title: "Bug or feature: which way does it go?", emoji: "🔀" },
  { slug: "risky-work", title: "What changes when work is risky?", emoji: "⚠️" },
  { slug: "agents-never", title: "What do agents never do?", emoji: "🚫" },
] as const;

export type NavPage = { href: string; title: string; track: TrackId };

export const SEQUENCE: NavPage[] = [
  { href: "/docs5", title: "Start here", track: "start" },
  { href: "/docs5/guide", title: "How this guide works", track: "start" },
  ...ZOOM.map((z, i) => ({ href: `/docs5/zoom/${z.slug}`, title: `Zoom ${i + 1}: ${z.title}`, track: "zoom" as const })),
  { href: "/docs5/seats", title: "Pick your seat", track: "seats" },
  ...ROLES.map((r) => ({ href: `/docs5/seats/${r.id}`, title: `Seat: ${r.name}`, track: "seats" as const })),
  { href: "/docs5/ask", title: "Questions", track: "ask" },
  ...QUESTIONS.map((q) => ({ href: `/docs5/ask/${q.slug}`, title: q.title, track: "ask" as const })),
  { href: "/docs5/stops", title: "All stops", track: "stops" },
  ...STAGES.map((s) => ({ href: `/docs5/stops/${s.id}`, title: `Stop: ${s.name}`, track: "stops" as const })),
  { href: "/docs5/further", title: "Further reading", track: "more" },
];

export type Position = {
  page: NavPage;
  prev: NavPage | undefined;
  next: NavPage | undefined;
  track: Track;
  inTrack: NavPage[];
  indexInTrack: number;
  globalIndex: number;
  total: number;
};

export function position(href: string): Position {
  const i = SEQUENCE.findIndex((p) => p.href === href);
  if (i < 0) throw new Error(`docs5: ${href} is not in the reading order`);
  const page = SEQUENCE[i];
  const track = TRACKS.find((t) => t.id === page.track) ?? TRACKS[0];
  const inTrack = SEQUENCE.filter((p) => p.track === page.track);
  return {
    page,
    prev: i > 0 ? SEQUENCE[i - 1] : undefined,
    next: i < SEQUENCE.length - 1 ? SEQUENCE[i + 1] : undefined,
    track,
    inTrack,
    indexInTrack: inTrack.findIndex((p) => p.href === href),
    globalIndex: i,
    total: SEQUENCE.length,
  };
}
