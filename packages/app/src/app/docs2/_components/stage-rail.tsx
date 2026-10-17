import { STAGES, gatesAt, type Cell, type StageId } from "../_data/model";
import { cx } from "./cx";
import { CellMarks, GateTag } from "./marks";

/**
 * The 10-stage rail with gates. Two rows of five on phones, one row of ten from `sm`.
 * Pass `cells` to overlay one actor's involvement (stages they don't touch are dimmed).
 */
export function StageRail({
  cells,
  anchorPrefix,
}: {
  cells?: Partial<Record<StageId, Cell>>;
  anchorPrefix?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-3 sm:p-4">
      <div className="mb-2 hidden grid-cols-10 gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:grid">
        <div className="rounded-sm bg-muted px-1.5 py-0.5 text-center">product</div>
        <div className="col-span-9 rounded-sm bg-muted px-1.5 py-0.5 text-center">
          delivery · ticket → merged PR
        </div>
      </div>
      <ol className="grid grid-cols-5 gap-y-4 sm:grid-cols-10">
        {STAGES.map((stage, i) => {
          const cell = cells?.[stage.id];
          const dim = cells !== undefined && !cell;
          const gates = gatesAt(stage.id);
          const lineCls = cx(
            "absolute top-3 h-0.5 bg-border",
            i === 0 ? "left-1/2" : "left-0",
            i === STAGES.length - 1 ? "right-1/2" : "right-0",
            i === 4 && "max-sm:right-1/2",
            i === 5 && "max-sm:left-1/2",
          );
          const node = (
            <>
              <span aria-hidden className={lineCls} />
              <span
                className={cx(
                  "relative z-10 grid size-6 place-items-center rounded-full border-2 bg-card font-mono text-[11px] font-semibold",
                  stage.layer === "product" ? "border-dashed" : "",
                  gates.length > 0 ? "border-red-600 dark:border-red-500" : "border-foreground/60",
                  dim && "opacity-40",
                )}
              >
                {stage.n}
              </span>
              <span
                className={cx(
                  "mt-1 text-center text-[11px] leading-tight font-medium",
                  dim && "text-muted-foreground opacity-60",
                )}
              >
                {stage.short}
              </span>
              {gates.length > 0 && (
                <span className="mt-1 flex flex-wrap justify-center gap-0.5">
                  {gates.map((g) => (
                    <GateTag key={g.id} id={g.id} href={false} />
                  ))}
                </span>
              )}
              {cells && (
                <span className="mt-1.5 flex min-h-4 justify-center">
                  {cell ? <CellMarks cell={cell} /> : <span className="text-[10px] text-muted-foreground/60">·</span>}
                </span>
              )}
            </>
          );
          return (
            <li key={stage.id} className="relative flex flex-col items-center px-0.5" title={stage.name}>
              {cell && anchorPrefix ? (
                <a href={`#${anchorPrefix}${stage.id}`} className="flex flex-col items-center rounded-md hover:bg-muted/60">
                  {node}
                </a>
              ) : (
                node
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
