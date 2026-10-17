import Link from "../../_components/link";
import { Frame } from "../../_components/frame";
import { SkillPicker } from "../../_components/skill-picker";
import { meta } from "../../_data/meta";

export const metadata = meta("Which skill do I run?");

export default function WhichSkill() {
  return (
    <Frame
      href="/docs5/ask/which-skill"
      kicker="❓ Question 2 of 6"
      title="Which skill do I run?"
      lead={
        <p>
          Start from what is in front of you, not from the list of 42. Pick one; the panel names the single skill to
          start with, what it runs by itself, and what you end up with.
        </p>
      }
    >
      <SkillPicker />
      <p className="text-sm text-muted-foreground">
        The skills chain: every skill that produces a PR ends with a line naming it, and the next skill picks that PR up
        instead of opening a second one. So you rarely need to know what comes after; see the whole chest on{" "}
        <Link href="/docs5/zoom/skills" className="underline underline-offset-4">
          zoom 6
        </Link>
        .
      </p>
    </Frame>
  );
}
