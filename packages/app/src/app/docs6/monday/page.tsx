import Link from "../_components/link";
import { Frame } from "../_components/frame";
import { cn } from "../_components/cx";
import { Callout, Cmd, H2, PERSON } from "../_components/marks";
import { Md } from "../_components/md";
import { meta } from "../_data/nav";
import { ROLES } from "../_data/roles";

export const metadata = meta("Your first week");

const STEPS: { title: string; who: string; body: string; cmds?: string }[] = [
  {
    title: "Install and configure, once per repo",
    who: "Maintainer",
    body: "Install all the skills (they compose, and each is small until invoked), then let the setup skill inspect the repo and ask its few questions. Review what it detected before it writes anything, then commit the config, the descriptors and `SDLC.md`.",
    cmds: "npx skills add open-mercato/skills --skill '*'\n/om-setup-agent-pipeline",
  },
  {
    title: "Read SDLC.md together",
    who: "Everyone",
    body: "It is the human half of the rulebook: the ticket lifecycle, the label state machine, the QA gate and the claim protocol, written for your repo. Twenty minutes with the team saves a month of “why did the bot do that?”.",
  },
  {
    title: "Send one small thing down the road",
    who: "Developer",
    body: "Pick a low-risk chore and watch the trail form on the tracker: the plan commit, the draft PR, progress ticks, labels with their reasons, the review, the flip to ready.",
    cmds: '/om-auto-create-pr "fix the typo in the signup confirmation email"',
  },
  {
    title: "Take it through the gates by hand",
    who: "Reviewer, QA, Maintainer",
    body: "Read the review, look at the evidence, and merge it yourselves. Merging is a person's step on purpose.",
    cmds: "/om-merge-buddy\n/om-approve-merge-pr <PR number>",
  },
  {
    title: "Then the real work",
    who: "Product person, Developer",
    body: "File one real issue through `om-prepare-issue` (or let `om-auto-manage-issues` tidy existing ones), and hand it to `om-auto-fix-issue`.",
  },
];

const HABITS = [
  "To see where any work stands, read its labels and its newest 🤖 comment.",
  "Look before you leap: `--dry-run` exists on `om-auto-manage-issues`, `om-backlog`, `om-pr-autopilot`, `om-close-fixed-issues` and `om-auto-update-changelog`.",
  "Answer the assumptions comments. Every autonomous guess you correct is one the build will not run on.",
  "Never remove a claim (`in-progress`) you do not own; if it looks dead, a maintainer may clear it.",
  "Want a skill to behave differently here? Write a repo-local override, not a fork.",
];

export default function MondayPage() {
  return (
    <Frame
      href="/docs6/monday"
      title="Your first week"
      idea="Configure once, read the rulebook together, then send one small, safe piece of work all the way down the road before trusting it with real work."
      lead={<p>The repo’s quickstart is three commands. The order below adds the human steps that make them stick.</p>}
    >
      <section className="flex flex-col gap-3">
        <ol className="flex flex-col gap-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex min-w-0 gap-3 rounded-xl border bg-card p-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                {i + 1}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-semibold">{s.title}</span>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[11px]", PERSON)}>{s.who}</span>
                </p>
                <p className="text-sm leading-relaxed">
                  <Md text={s.body} />
                </p>
                {s.cmds && <Cmd>{s.cmds}</Cmd>}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <H2>Your own first Monday</H2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((r) => (
            <li key={r.id}>
              <Link href={`/docs6/people/${r.id}`} className="flex h-full min-w-0 flex-col gap-1 rounded-xl border bg-card p-3 text-sm transition-colors hover:bg-muted/50">
                <span className="font-semibold">
                  <span aria-hidden>{r.emoji}</span> {r.name}
                </span>
                <span className="text-muted-foreground">
                  <Md text={r.monday[0]} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Callout title="Five habits">
        <ul className="flex list-disc flex-col gap-1 pl-4">
          {HABITS.map((h) => (
            <li key={h}>
              <Md text={h} />
            </li>
          ))}
        </ul>
      </Callout>
    </Frame>
  );
}
