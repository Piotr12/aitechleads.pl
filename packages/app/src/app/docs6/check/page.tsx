import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@atl/ui/components/accordion";
import Link from "../_components/link";
import { Frame } from "../_components/frame";
import { H2 } from "../_components/marks";
import { Md } from "../_components/md";
import { meta } from "../_data/nav";

export const metadata = meta("Check yourself");

type QA = { q: string; a: string; href: string; where: string };

const BIG: QA[] = [
  {
    q: "What does this system do, in one sentence?",
    a: "It carries one piece of work from an idea to a merged, tidied change through a chain of agent skills, with people deciding at a few named points.",
    href: "/docs6",
    where: "Follow the work",
  },
  {
    q: "What are its moving parts?",
    a: "Skills (42, `om-auto-*` autonomous, the rest interactive), the artefacts the work becomes and leaves behind, labels that hold its state, the rulebook (`.ai/agentic.config.json` and `SDLC.md`), and six kinds of people.",
    href: "/docs6/kit",
    where: "Five kinds of moving parts",
  },
  {
    q: "How does one piece of work travel, and who carries it?",
    a: "Idea (`om-brainstorm`) → issue (`om-prepare-issue`) → spec PR (`om-auto-write-spec`) → routed (`om-auto-fix-issue`) → plan, branch and PR (`om-auto-implement-spec`, `om-auto-create-pr`) → review loop (`om-auto-review-pr`) → QA (`om-auto-qa-pr` plus a person) → merge (`om-approve-merge-pr`, started by a person) → tidy-up (`om-close-fixed-issues`, follow-ups, changelog, retro).",
    href: "/docs6/journey/idea",
    where: "The journey",
  },
  {
    q: "Where must a person decide, and what may agents never do?",
    a: "People confirm the routing, supply the Definition of Ready, correct spec assumptions, grant `qa-approved`, start the merge, and own the rulebook. Agents never merge on their own, never grant QA approval outside the self-QA exception, never set `qa`, never fake green CI, never force-push unasked.",
    href: "/docs6/people/red-lines",
    where: "Red lines",
  },
  {
    q: "I'm a developer / product person / QA / reviewer / maintainer / designer: what do I run, and when?",
    a: "Each person page lists your stops in order, the exact commands, and what only you can decide there.",
    href: "/docs6/people",
    where: "Six people along the road",
  },
  {
    q: "What would I do first on Monday?",
    a: "Maintainer: install and run `/om-setup-agent-pipeline`. Everyone: read the generated `SDLC.md` together. Then send one small, low-risk chore through `/om-auto-create-pr` and take it through review, QA and merge by hand.",
    href: "/docs6/monday",
    where: "Your first week",
  },
];

const CASES: QA[] = [
  {
    q: "A PR carries `merge-queue` and `needs-qa`, every check is green, but there is no `qa-approved`. Can it merge?",
    a: "No. `merge-queue` is routing, not proof of QA. With the QA gate on, `om-approve-merge-pr` refuses until a QA reviewer (or the self-QA exception) adds `qa-approved`.",
    href: "/docs6/journey/qa",
    where: "QA: the one hard gate",
  },
  {
    q: "An issue has `in-progress`, is assigned to the bot account, and has a 🤖 claim comment from five minutes ago. Should you start on it?",
    a: "No: that is a live claim. Leave it, or talk to whoever runs the bot. Skills back off the same way; only `--force` overrides, and it says so in a comment.",
    href: "/docs6/hood/locks",
    where: "Who is holding it",
  },
  {
    q: "A PR carries `ci-monitoring` and nothing else of the sort. Is it locked?",
    a: "No. The work is done and reported; only a CI-result comment is still owed. Anyone may act on it.",
    href: "/docs6/hood/locks",
    where: "Who is holding it",
  },
  {
    q: "An autonomous run died halfway through building a PR. How do you pick it up?",
    a: "`/om-auto-continue-pr <PR>`. It reads the `Tracking plan:` line, opens the plan, and resumes at the first unchecked step. (A loop-engine run: `om-auto-continue-pr-loop`.)",
    href: "/docs6/journey/build",
    where: "Stop 5",
  },
  {
    q: "The team switches from npm to pnpm. Where does every skill learn the new test commands?",
    a: "`validation.commands` in `.ai/agentic.config.json`, changed together with the validation section of `SDLC.md`. Not in the skills.",
    href: "/docs6/hood/rulebook",
    where: "The rulebook",
  },
  {
    q: "An issue describes a crash and also asks for a new export button. What happens on `om-auto-fix-issue`?",
    a: "It stops and asks a person to split the issue, rather than guessing which route to take.",
    href: "/docs6/journey/pickup",
    where: "Stop 4",
  },
];

function Block({ items, prefix }: { items: QA[]; prefix: string }) {
  return (
    <Accordion type="multiple" className="rounded-xl border bg-card px-4">
      {items.map((x, i) => (
        <AccordionItem key={x.q} value={`${prefix}-${i}`}>
          <AccordionTrigger className="text-left text-base">
            <span>
              <Md text={x.q} />
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 text-sm leading-relaxed">
              <p>
                <Md text={x.a} />
              </p>
              <p className="text-xs text-muted-foreground">
                Read more:{" "}
                <Link href={x.href} className="underline">
                  {x.where}
                </Link>
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default function CheckPage() {
  return (
    <Frame
      href="/docs6/check"
      title="Check yourself"
      idea="If you can answer these without opening the answers, you have a working model of the system."
      lead={<p>Try each question in your head first, then open it. Every answer links to the page that explains it.</p>}
    >
      <section className="flex flex-col gap-3">
        <H2>The six big questions</H2>
        <Block items={BIG} prefix="big" />
      </section>
      <section className="flex flex-col gap-3">
        <H2>Six small situations</H2>
        <Block items={CASES} prefix="case" />
      </section>
    </Frame>
  );
}
