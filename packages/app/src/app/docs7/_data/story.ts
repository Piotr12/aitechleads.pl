/** The cast and the chapters of "the first month". The team and its product are invented; the skills are not. */

export type PersonId = "developer" | "reviewer" | "product" | "designer" | "qa" | "maintainer";

export type Person = {
  id: PersonId;
  name: string;
  role: string;
  /** The role as SDLC.md / the README role guides name it. */
  repoRole: string;
  initial: string;
  tone: string;
};

export const PEOPLE: Person[] = [
  { id: "maintainer", name: "Ola", role: "Maintainer", repoRole: "Maintainer (and release manager)", initial: "O", tone: "bg-violet-600" },
  { id: "developer", name: "Bartek", role: "Developer", repoRole: "Author", initial: "B", tone: "bg-sky-600" },
  { id: "reviewer", name: "Tomek", role: "Reviewer", repoRole: "Reviewer", initial: "T", tone: "bg-teal-600" },
  { id: "product", name: "Kasia", role: "Product", repoRole: "Product manager / product owner", initial: "K", tone: "bg-amber-600" },
  { id: "designer", name: "Marek", role: "Designer", repoRole: "Designer", initial: "M", tone: "bg-pink-600" },
  { id: "qa", name: "Zofia", role: "QA", repoRole: "QA reviewer", initial: "Z", tone: "bg-emerald-600" },
];

export const PERSON: Record<PersonId, Person> = Object.fromEntries(PEOPLE.map((p) => [p.id, p])) as Record<
  PersonId,
  Person
>;

export type Chapter = {
  n: number;
  slug: string;
  when: string;
  title: string;
  /** The one idea of the page, in a sentence. */
  idea: string;
  cast: PersonId[];
};

export const CHAPTERS: Chapter[] = [
  { n: 1, slug: "day-0", when: "Day 0", title: "One command sets the table", idea: "Setup writes one committed config and a process document the whole team agrees to; every other skill reads them.", cast: ["maintainer", "product", "designer", "qa"] },
  { n: 2, slug: "first-ticket", when: "Day 1", title: "The first bug, by hand", idea: "A bug fix is four small skills passing notes to each other; only the steps that change things claim the issue.", cast: ["developer"] },
  { n: 3, slug: "first-review", when: "Day 2", title: "Labels say where a PR stands", idea: "A PR carries exactly one pipeline label at a time, and review is what moves it.", cast: ["reviewer", "developer"] },
  { n: 4, slug: "autonomy-dial", when: "Week 1", title: "Turning the dial", idea: "The same work can run one step at a time or as one command; you choose how much to hand over.", cast: ["developer", "reviewer", "product"] },
  { n: 5, slug: "shaping", when: "Week 2", title: "Big work starts as a conversation", idea: "A fuzzy idea becomes either a parked issue or a spec on its own PR, and people answer what only people can.", cast: ["product", "designer", "reviewer"] },
  { n: 6, slug: "big-build", when: "Week 2", title: "The plan is the save point", idea: "Every autonomous build writes its plan first, so any run can stop and another can pick it up.", cast: ["developer"] },
  { n: 7, slug: "guardrails", when: "Week 2, Thursday", title: "The day two agents met", idea: "Claims, human-only labels and a short list of never-do rules keep agents from colliding or overruling people.", cast: ["developer", "reviewer", "maintainer", "product"] },
  { n: 8, slug: "qa", when: "Week 3", title: "QA finds its rhythm", idea: "A needs-qa PR cannot merge until a person grants qa-approved for the exact commit they tested.", cast: ["qa", "designer"] },
  { n: 9, slug: "merge-day", when: "Week 3, Friday", title: "Merging is its own step", idea: "Merging is a separate, deliberate act that re-checks every gate, and agents prepare it without doing it.", cast: ["maintainer"] },
  { n: 10, slug: "housekeeping", when: "Week 4", title: "Tidy up after yourself", idea: "After the merge, the tracker is made true again: issues closed, follow-ups filed, the changelog drafted.", cast: ["maintainer", "reviewer"] },
  { n: 11, slug: "retro", when: "Day 30", title: "The process changes itself", idea: "A retro measures what rework cost, and the team changes the process in the same files that defined it.", cast: ["maintainer", "developer", "product", "designer", "qa", "reviewer"] },
];

export const CHAPTER_BY_SLUG: Record<string, Chapter> = Object.fromEntries(CHAPTERS.map((c) => [c.slug, c]));

export function chapter(slug: string): Chapter {
  const c = CHAPTER_BY_SLUG[slug];
  if (!c) throw new Error(`docs7: unknown chapter ${slug}`);
  return c;
}

export const chapterHref = (c: Chapter) => `/docs7/month/${c.slug}`;
