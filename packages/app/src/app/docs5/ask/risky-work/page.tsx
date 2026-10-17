import { Frame } from "../../_components/frame";
import { Ext, Label } from "../../_components/marks";
import { UPSTREAM } from "../../_data/links";
import { meta } from "../../_data/meta";

export const metadata = meta("What changes when work is risky?");

const AREAS = [
  { area: "Login, sessions, permissions", needs: "a test for the denied path and the wrong-scope read; a second person's review" },
  { area: "Data scoping (who may see whose data)", needs: "a test proving one scope cannot read another" },
  { area: "Money", needs: "tests for failure, retry and double-charge (idempotency); a second person's review" },
  { area: "Database schema changes", needs: "a migration test up and down, and a rollback plan in the PR" },
  { area: "Shared contracts (APIs others rely on)", needs: "the consuming side exercised too" },
];

export default function RiskyWork() {
  return (
    <Frame
      href="/docs5/ask/risky-work"
      kicker="❓ Question 5 of 6"
      title="What changes when work is risky?"
      lead={
        <p>
          Every PR gets a risk label: how badly it could hurt if it shipped broken. Most work is medium. A{" "}
          <Label tone="bad">risk-high</Label> label is not advice; it switches on extra gates.
        </p>
      }
    >
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Risk levels">
        <li className="flex flex-col gap-2 rounded-xl border bg-card p-4">
          <Label tone="good">risk-low</Label>
          <p className="text-sm text-muted-foreground">Docs, tests only, a typo, an isolated cosmetic change.</p>
          <p className="text-sm">Self-QA allowed.</p>
        </li>
        <li className="flex flex-col gap-2 rounded-xl border bg-card p-4">
          <Label tone="wait">risk-medium</Label>
          <p className="text-sm text-muted-foreground">An ordinary change in one area, with tests. The default.</p>
          <p className="text-sm">Self-QA allowed.</p>
        </li>
        <li className="flex flex-col gap-2 rounded-xl border-2 border-destructive/60 bg-destructive/5 p-4">
          <Label tone="bad">risk-high</Label>
          <p className="text-sm text-muted-foreground">Auth, data scoping, money, schema changes, shared contracts, broad edits.</p>
          <p className="text-sm font-medium">No self-QA. A real tester, or a maintainer&apos;s written exception.</p>
        </li>
      </ol>

      <section aria-labelledby="areas" className="flex flex-col gap-3">
        <h2 id="areas" className="text-xl font-semibold">
          What a risk-high PR must carry
        </h2>
        <ul className="flex flex-col divide-y rounded-xl border bg-card">
          {AREAS.map((a) => (
            <li key={a.area} className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-[16rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-medium">{a.area}</span>
              <span className="text-sm text-muted-foreground">{a.needs}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          Plus, for any risk-high PR that users will see: <Label tone="wait">needs-qa</Label>. The review blocks
          without the evidence above, unless a maintainer waives it on the PR.
        </p>
      </section>

      <section className="flex flex-col gap-2 rounded-xl border bg-card p-4 text-sm">
        <p className="font-semibold">Risk is not priority</p>
        <p className="text-muted-foreground">
          Priority says how <em>urgent</em> the work is; risk says how <em>dangerous</em> it is to ship. A one-line fix
          for an outage can be priority-extreme and risk-low; a big auth refactor that can wait is priority-low and
          risk-high. When unsure, pick the higher label and say why.
        </p>
      </section>

      <p className="text-xs text-muted-foreground">
        Source: <Ext href={UPSTREAM.sdlcSection.labels}>SDLC.md, label state machine</Ext> and{" "}
        <Ext href={UPSTREAM.sdlcSection.qaGate}>the QA gate</Ext>
      </p>
    </Frame>
  );
}
