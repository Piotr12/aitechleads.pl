import Link from "../_components/link";
import { Frame } from "../_components/frame";
import { MarkLegend, RoleAvatar } from "../_components/marks";
import { PresenceStrip } from "../_components/road";
import { meta } from "../_data/meta";
import { isActive, ROLES } from "../_data/roles";

export const metadata = meta("Pick your seat");

export default function SeatsPage() {
  return (
    <Frame
      href="/docs5/seats"
      kicker="💺 Your seat"
      title="What do you do?"
      lead={
        <p>
          Pick the description closest to your job. Your page shows only your own moments on the road, in order, and
          the other people appear only where they hand you something or you hand it on.
        </p>
      }
    >
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {ROLES.map((r) => (
          <li key={r.id}>
            <Link
              href={`/docs5/seats/${r.id}`}
              className="flex h-full min-w-0 flex-col gap-3 rounded-xl border-2 bg-card p-5 transition-colors hover:border-foreground/60 hover:bg-muted/40"
            >
              <span className="flex items-center gap-3">
                <RoleAvatar role={r.id} size="lg" />
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm text-muted-foreground">I am the…</span>
                  <span className="text-lg font-semibold break-words">
                    {r.name}
                    {r.optional && <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>}
                  </span>
                </span>
              </span>
              <span className="text-sm">…{r.youAre}.</span>
              <span className="flex flex-col gap-1">
                <PresenceStrip role={r.id} />
                <span className="text-xs text-muted-foreground">
                  {r.moments.filter(isActive).length} stops where you act
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <MarkLegend />
      <p className="text-sm text-muted-foreground">
        Several hats? Common in small teams. Read each page; the handoffs between them are the ones you hand to
        yourself.
      </p>
    </Frame>
  );
}
