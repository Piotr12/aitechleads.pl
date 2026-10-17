import Link from "@/app/docs2/_components/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@atl/ui/components/table";
import { ROLES, STAGES, gatesAt } from "../_data/model";
import { cx } from "./cx";
import { CellMarks, GateTag } from "./marks";

/** The whole RACI chart, compressed: 7 actors × 10 stages. Every cell links to the actor's flow. */
export function RaciMatrix() {
  return (
    <div className="rounded-xl border bg-card">
      <Table className="min-w-[760px] table-fixed text-xs">
        <colgroup>
          <col className="w-36" />
          {STAGES.map((s) => (
            <col key={s.id} />
          ))}
        </colgroup>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-auto py-2 text-[11px] text-muted-foreground">actor ↓ · stage →</TableHead>
            {STAGES.map((s) => (
              <TableHead
                key={s.id}
                className={cx("h-auto px-1 py-2 text-center align-top", s.layer === "product" && "bg-muted/60")}
              >
                <span className="block font-mono text-[10px] text-muted-foreground">{s.n}</span>
                <span className="block text-[11px] leading-tight whitespace-normal">{s.short}</span>
                <span className="mt-1 flex min-h-4 flex-wrap justify-center gap-0.5">
                  {gatesAt(s.id).map((g) => (
                    <GateTag key={g.id} id={g.id} />
                  ))}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROLES.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="py-1.5">
                <Link href={`/docs2/${role.id}`} className="group flex items-baseline gap-1.5">
                  <span className="w-8 shrink-0 font-mono text-[11px] font-semibold">{role.code}</span>
                  <span className="truncate text-muted-foreground group-hover:text-foreground group-hover:underline">
                    {role.name}
                  </span>
                </Link>
              </TableCell>
              {STAGES.map((s) => {
                const cell = role.cells[s.id];
                return (
                  <TableCell
                    key={s.id}
                    className={cx("px-1 py-1.5 text-center", s.layer === "product" && "bg-muted/60")}
                  >
                    {cell ? (
                      <Link
                        href={`/docs2/${role.id}#stage-${s.id}`}
                        title={[cell.human, cell.agent].filter(Boolean).join(" · ")}
                        className="inline-flex flex-col items-center gap-0.5 rounded-md px-1 py-0.5 hover:bg-muted"
                      >
                        <CellMarks cell={cell} />
                        {cell.gates && (
                          <span className="flex gap-0.5">
                            {cell.gates.map((g) => (
                              <GateTag key={g} id={g} href={false} />
                            ))}
                          </span>
                        )}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground/40">·</span>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
