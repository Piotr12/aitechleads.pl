import type { Metadata } from "next";
import Link from "next/link";
import { ROLES } from "../_data/roles";
import { cellsForRole } from "../_data/raci";
import { Legend, PageIntro, RoleAvatar } from "../_components/bits";
import { RoleLane } from "../_components/raci-views";

export const metadata: Metadata = {
  title: "Who's who",
  robots: { index: false, follow: false },
};

export default function RolesIndex() {
  return (
    <main className="flex flex-col gap-10">
      <PageIntro eyebrow="🧑‍🤝‍🧑 Who's who" title="Seven roles, seven different days">
        <p>
          Each role touches the road at different stages. Below, every row is one role: a coloured box means they
          take part at that stage, a dashed box means they don&apos;t. Open a role for “a day in the life”.
        </p>
      </PageIntro>

      <Legend />

      <ul className="flex flex-col gap-6">
        {ROLES.map((r) => {
          const cells = cellsForRole(r.id);
          const gates = cells.flatMap((c) => c.gates);
          return (
            <li key={r.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-3">
                <RoleAvatar role={r.id} size="lg" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <h2 className="text-lg font-semibold">
                    {r.title} <span className="font-normal text-muted-foreground">· {r.person}</span>
                  </h2>
                  <p className="text-sm text-muted-foreground">{r.oneLiner}</p>
                </div>
                <div className="flex flex-col items-start gap-1 text-xs sm:items-end">
                  <span className="text-muted-foreground">
                    {cells.length} of 10 stages{gates.length > 0 ? ` · decides at ${gates.join(", ")}` : ""}
                  </span>
                  <Link href={`/docs3/roles/${r.id}`} className="font-medium hover:underline">
                    A day in the life of {r.person} →
                  </Link>
                </div>
              </div>
              <RoleLane role={r.id} />
            </li>
          );
        })}
      </ul>
    </main>
  );
}
