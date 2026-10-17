import { Remember } from "../../_components/marks";
import { Road } from "../../_components/road";
import { Prose, ZoomFrame } from "../../_components/zoom";
import { meta } from "../../_data/meta";

export const metadata = meta("Zoom 1: One road");

export default function ZoomRoad() {
  return (
    <ZoomFrame slug="road" title="One road, four legs">
      <Road />
      <Prose>
        <p>
          Forget the skills and the people for a moment. Any change to the software, whether a new feature or a typo
          fix, goes through four legs, always in this order:{" "}
          <strong className="text-foreground">decide what</strong> to do,{" "}
          <strong className="text-foreground">build it</strong>, <strong className="text-foreground">check it</strong>
          , <strong className="text-foreground">land it</strong>.
        </p>
        <p>
          Work can join the road at different points. A product idea starts at the very beginning; a bug report from
          support skips straight to the ticket; a developer with a quick task in their head can start at “build it”.
          But nothing skips the checks, and everything lands the same way.
        </p>
        <p>
          The road ends when the change is merged into <code className="font-mono text-foreground">main</code>, the
          shared main branch of the code. Getting it to users (deploying, monitoring) is the team&apos;s own release
          process, a different road.
        </p>
      </Prose>
      <Remember>Every piece of work travels the same road. Only the place where it joins differs.</Remember>
    </ZoomFrame>
  );
}
