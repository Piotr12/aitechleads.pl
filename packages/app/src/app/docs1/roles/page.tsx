import type { Metadata } from "next";
import Link from "@/app/docs1/_components/link";
import { RoleLane } from "../_components/diagrams";
import { Legend } from "../_components/legend";
import { GateTag, LayerTag } from "../_components/marks";
import { DocsShell, PageHeader, Section } from "../_components/shell";
import { ROLES, gatesOwnedBy, href } from "../_data";

export const metadata: Metadata = {
  title: "Roles · AI SDLC skills guide",
  robots: { index: false, follow: false },
};

export default function RolesIndex() {
  return (
    <DocsShell active="roles" crumbs={[{ label: "Guide", href: href.home }, { label: "Roles" }]}>
      <PageHeader
        title="Roles"
        lead="Seven actors take part. Each lane below shows the stages an actor touches, how (decides, supervises, or delegates to an agent) and which gates they own."
      />

      <Legend />

      <Section title="Lanes">
        <ul className="flex flex-col gap-6">
          {ROLES.map((role) => (
            <li key={role.id} className="flex flex-col gap-3 rounded-xl border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={href.role(role.id)} className="text-base font-semibold hover:underline">
                  {role.name}
                </Link>
                <LayerTag layer={role.layer} />
                {gatesOwnedBy(role.id).map((g) => (
                  <GateTag key={g.id} id={g.id} withName />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {role.tagline}. {role.summary}
              </p>
              <RoleLane role={role.id} />
            </li>
          ))}
        </ul>
      </Section>
    </DocsShell>
  );
}
