import type { Metadata } from "next";
import Link from "@/app/docs4/_components/link";
import { ROBOTS, ROLES, chaptersForRole, gatesOwnedBy, href, type Role } from "../_data";
import { LaneHeader, RoleLane } from "../_components/lane";
import { Avatar, Dot, GateFlag, Legend, PageHeader, PrevNext, SectionNav, SectionTitle, cx } from "../_components/ui";

export const metadata: Metadata = {
  title: "Perspectives",
  robots: ROBOTS,
};

const COLUMNS: { key: "decides" | "supervises" | "delegates" | "offTheDesk"; title: string; mark?: "decides" | "supervises" | "agent" }[] = [
  { key: "decides", title: "Decides", mark: "decides" },
  { key: "supervises", title: "Supervises", mark: "supervises" },
  { key: "delegates", title: "Delegates", mark: "agent" },
  { key: "offTheDesk", title: "Off the desk" },
];

function Perspective({ role }: { role: Role }) {
  const gates = gatesOwnedBy(role.id);
  const chapters = chaptersForRole(role.id);
  return (
    <article id={role.id} className="flex min-w-0 scroll-mt-6 flex-col gap-4 rounded-2xl border bg-card p-4 sm:p-5">
      <header className="flex min-w-0 flex-wrap items-start gap-3">
        <Avatar role={role.id} size="lg" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="text-lg font-semibold">
            {role.name} <span className="font-normal text-muted-foreground">· played by {role.person}</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Owns {role.owns.charAt(0).toLowerCase() + role.owns.slice(1)}.{role.optional && " An optional role."}
          </p>
          <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            {gates.length > 0 ? (
              <>
                Gates:{" "}
                {gates.map((g) => (
                  <span key={g.id} className="inline-flex items-center gap-1">
                    <GateFlag id={g.id} /> {g.name}
                  </span>
                ))}
              </>
            ) : (
              "Holds no gate of their own."
            )}
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-1">
        <LaneHeader />
        <RoleLane role={role.id} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((col) => (
          <section key={col.key} className="flex min-w-0 flex-col gap-1.5">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {col.mark ? <Dot kind={col.mark} /> : <span aria-hidden className="inline-block size-2.5 rounded-sm border border-dashed border-foreground/40" />}
              {col.title}
            </h3>
            <ul className="flex flex-col gap-1 text-sm">
              {role[col.key].map((item) => (
                <li key={item} className={cx("border-l-2 pl-2", col.key === "offTheDesk" && "text-muted-foreground")}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-sm">
        <span className="text-muted-foreground">
          In the story:{" "}
          {chapters.map((c, i) => (
            <span key={c.slug}>
              {i > 0 && ", "}
              <Link href={href.chapter(c.slug)} className="underline underline-offset-2 hover:text-foreground">
                {c.number}
              </Link>
            </span>
          ))}
        </span>
        <Link href={href.role(role.id)} className="font-medium hover:underline">
          Full flow and skills →
        </Link>
      </footer>
    </article>
  );
}

export default function PerspectivesPage() {
  return (
    <>
      <SectionNav part="perspectives" />
      <PageHeader
        eyebrow="Part 3"
        title="Seven chairs, one journey"
        lead="The same ten stages, seen from each seat at the table. Each lane shows where the person decides, where they supervise an agent, where they are only consulted or informed, and which gates are theirs."
      />

      <section className="flex flex-col gap-3">
        <SectionTitle>All seven lanes at once</SectionTitle>
        <div className="flex flex-col gap-3 rounded-2xl border bg-card p-3 sm:p-4">
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-end">
            <span className="hidden sm:block" />
            <LaneHeader />
          </div>
          {ROLES.map((r) => (
            <div key={r.id} className="grid grid-cols-1 gap-1 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center">
              <a href={`#${r.id}`} className="flex min-w-0 items-center gap-2 text-sm hover:underline">
                <Avatar role={r.id} size="sm" />
                <span className="min-w-0 truncate">
                  {r.person} <span className="text-muted-foreground">· {r.short}</span>
                </span>
              </a>
              <RoleLane role={r.id} />
            </div>
          ))}
        </div>
        <Legend />
        <p className="max-w-3xl text-sm text-muted-foreground">
          Letters are the chart&apos;s RACI where there is no dot: A owns the outcome, C is consulted, I is informed. A
          red border marks a cell where the person decides. Every cell links to its stage.
        </p>
      </section>

      <div className="flex flex-col gap-5">
        {ROLES.map((r) => (
          <Perspective key={r.id} role={r} />
        ))}
      </div>

      <PrevNext
        prev={{ href: href.overview, label: "The 30,000-foot view", hint: "Part 2" }}
        next={{ href: href.details, label: "Details", hint: "Part 4" }}
      />
    </>
  );
}
