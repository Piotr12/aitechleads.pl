import { MarkDot, Remember, RoleChip, SkillChip, StopChip } from "../../_components/marks";
import { H2, Prose, ZoomFrame } from "../../_components/zoom";
import { meta } from "../../_data/meta";
import type { Mark, RoleId } from "../../_data/roles";
import type { StageId } from "../../_data/stages";

export const metadata = meta("Zoom 3: Who does the work");

const SCALE: {
  mark: Mark;
  title: string;
  says: string;
  example: { role?: RoleId; stage: StageId; skill: string; text: string };
}[] = [
  {
    mark: "agent",
    title: "Agents do delegated work",
    says: "An agent does a job someone handed it: searching, drafting, checking, filing.",
    example: {
      role: "qa",
      stage: "implement",
      skill: "om-prepare-test-env",
      text: "QA asks for a running copy of the app; an agent boots it once, and every later check reuses it.",
    },
  },
  {
    mark: "supervises",
    title: "A person supervises",
    says: "The agent works on its own; a person keeps an eye on it and can take over at any moment.",
    example: {
      role: "developer",
      stage: "implement",
      skill: "om-auto-implement-spec",
      text: "The agent finds the cause, changes the code and runs the tests. The developer steers and checks it against the spec.",
    },
  },
  {
    mark: "decides",
    title: "A person decides",
    says: "A named person says yes or no. An agent may prepare the evidence, but never gives the answer.",
    example: {
      role: "qa",
      stage: "qa",
      skill: "om-auto-qa-pr",
      text: "The agent walks the change in a browser and posts screenshots. The tester decides: approved or failed.",
    },
  },
];

export default function ZoomHands() {
  return (
    <ZoomFrame slug="hands" title="Agents do the work, people decide">
      <section aria-labelledby="scale" className="flex flex-col gap-3">
        <H2 id="scale">Three marks, from “agent alone” to “person decides”</H2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground" aria-hidden>
          <span>agent alone</span>
          <span className="h-px flex-1 bg-linear-to-r from-muted-foreground/30 via-foreground to-destructive" />
          <span>person decides</span>
        </div>
        <ol className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {SCALE.map((s) => (
            <li key={s.mark} className="flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-5">
              <span className="flex items-center gap-3">
                <MarkDot mark={s.mark} size="lg" />
                <span className="font-semibold">{s.title}</span>
              </span>
              <p className="text-sm">{s.says}</p>
              <div className="mt-auto flex flex-col gap-2 rounded-lg bg-muted/50 p-3 text-sm">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">For example</span>
                <span className="flex flex-wrap gap-1.5">
                  <StopChip stage={s.example.stage} />
                  {s.example.role && <RoleChip role={s.example.role} />}
                  <SkillChip name={s.example.skill} />
                </span>
                <span className="text-muted-foreground">{s.example.text}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Prose>
        <p>
          On the real chart most stops carry <em>two</em> marks: a person&apos;s dot and an agent&apos;s ring. The
          agent does the legwork, the person is responsible for it. A dashed circle{" "}
          <MarkDot mark="plain" className="inline-block align-middle" /> means a person is only asked or told, with no
          work of their own at that stop.
        </p>
        <p>
          Why bother? Because an agent can write a thousand lines before lunch, and somebody still has to own the
          consequences. In this process the owner always has a name, and it is never the agent.
        </p>
      </Prose>

      <Remember>If a decision has a name on it, it belongs to a person. Agents prepare; people decide.</Remember>
    </ZoomFrame>
  );
}
