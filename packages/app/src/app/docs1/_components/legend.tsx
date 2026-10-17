import { cn } from "@atl/ui/lib/utils";
import { GateTag, ModeDot, RaciLetters } from "./marks";

/** The chart legend: dots, RACI letters and gate markers. */
export function Legend({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-4 rounded-xl border bg-card p-4 text-sm sm:grid-cols-3", className)}>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Who acts</p>
        <ul className="flex flex-col gap-1.5">
          <li className="flex items-start gap-2">
            <ModeDot mode="decides" className="mt-1" />
            <span>
              <span className="font-medium">Human decides</span>
              <span className="text-muted-foreground"> at a gate.</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ModeDot mode="supervises" className="mt-1" />
            <span>
              <span className="font-medium">Human supervises</span>
              <span className="text-muted-foreground">: the agent works alone, a human can take over.</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ModeDot mode="agent" className="mt-1" />
            <span>
              <span className="font-medium">Agent does</span>
              <span className="text-muted-foreground"> delegated work. People own decisions and approvals.</span>
            </span>
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">RACI</p>
        <ul className="flex flex-col gap-1.5">
          <li className="flex items-center gap-2">
            <RaciLetters raci={["R"]} /> Responsible: does the work
          </li>
          <li className="flex items-center gap-2">
            <RaciLetters raci={["A"]} /> Accountable: owns the outcome
          </li>
          <li className="flex items-center gap-2">
            <RaciLetters raci={["C"]} /> Consulted
          </li>
          <li className="flex items-center gap-2">
            <RaciLetters raci={["I"]} /> Informed
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Gates</p>
        <div className="flex items-start gap-2">
          <GateTag id="G6" link={false} />
          <span className="text-muted-foreground">
            A human approval gate. Blocked work cannot merge.
          </span>
        </div>
        <p className="text-muted-foreground">
          Deployment and operations follow the team&apos;s own release process.
        </p>
      </div>
    </div>
  );
}
