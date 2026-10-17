/** Views of the RACI chart: one role's lane, one stage's cast, and the full matrix. */
import Link from "@/app/docs3/_components/link";
import { cellAt, cellsForStage, type RaciCell } from "../_data/raci";
import { ROLE_BY_ID, ROLES, type RoleId } from "../_data/roles";
import { STAGES, type StageId } from "../_data/stages";
import { MarkDot, RaciLetters, RoleAvatar, RoleChip, SkillChip } from "./bits";
import { cn } from "./cx";

/** One role across the ten stages: where they show up, and how. */
export function RoleLane({ role }: { role: RoleId }) {
  const r = ROLE_BY_ID[role];
  return (
    <ol className="grid grid-cols-5 gap-1.5 sm:gap-2 lg:grid-cols-10">
      {STAGES.map((s) => {
        const cell = cellAt(role, s.id);
        return (
          <li key={s.id}>
            <Link
              href={`/docs3/story/${s.id}`}
              className={cn(
                "flex h-full min-h-24 flex-col gap-1.5 rounded-lg border p-2 text-xs transition-colors",
                cell ? cn("border-l-4 bg-card hover:bg-muted/40", r.colors.border) : "border-dashed text-muted-foreground/70 hover:bg-muted/30",
              )}
            >
              <span className="flex items-center gap-1">
                <span aria-hidden>{s.emoji}</span>
                <span className="truncate font-medium">{s.name.replace(" & Design", "")}</span>
              </span>
              {cell ? (
                <>
                  <span className="flex flex-wrap items-center gap-1">
                    {cell.human && <MarkDot mark={cell.human.mark} />}
                    {cell.agent && <MarkDot mark="agent" />}
                    <RaciLetters letters={cell.letters} />
                  </span>
                  {cell.gates.length > 0 && (
                    <span className="font-mono text-[10px] font-semibold text-red-600 dark:text-red-400">
                      ⚑ {cell.gates.join(" ")}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[11px]">not involved</span>
              )}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

function CellBody({ cell }: { cell: RaciCell }) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      {cell.human && (
        <p className="flex gap-2">
          <MarkDot mark={cell.human.mark} className="mt-1.5" />
          <span>
            <RaciLetters letters={cell.human.letters} className="mr-1.5 align-middle" />
            {cell.human.text}
          </span>
        </p>
      )}
      {cell.agent && (
        <p className="flex gap-2 text-muted-foreground">
          <MarkDot mark="agent" className="mt-1.5" />
          <span>
            <span className="mr-1.5 font-medium text-foreground">Agent (R):</span>
            {cell.agent}
          </span>
        </p>
      )}
      {cell.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {cell.skills.map((sk) => (
            <SkillChip key={sk} name={sk} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Everyone who appears in one stage, as cards. */
export function StageCast({ stage }: { stage: StageId }) {
  const cells = cellsForStage(stage);
  const weight = (c: RaciCell) =>
    (c.letters.includes("A") ? 0 : c.letters.includes("R") ? 1 : c.letters.includes("C") ? 2 : 3) +
    (c.gates.length ? -0.5 : 0);
  const sorted = [...cells].sort((a, b) => weight(a) - weight(b));
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {sorted.map((cell) => {
        const r = ROLE_BY_ID[cell.role];
        return (
          <li key={cell.role} className={cn("flex flex-col gap-3 rounded-xl border border-l-4 bg-card p-4", r.colors.border)}>
            <div className="flex flex-wrap items-center gap-2">
              <RoleChip role={cell.role} />
              {cell.gates.map((g) => (
                <Link
                  key={g}
                  href={`/docs3/gates#${g}`}
                  className="rounded bg-red-500/15 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-red-700 hover:underline dark:text-red-300"
                >
                  ⚑ {g}
                </Link>
              ))}
            </div>
            <CellBody cell={cell} />
          </li>
        );
      })}
    </ul>
  );
}

/** The whole chart: roles down, stages across. */
export function RaciMatrix() {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <table className="w-full min-w-[980px] border-collapse text-left text-xs">
        <thead>
          <tr className="border-b bg-muted/40">
            <th scope="col" className="sticky left-0 z-10 w-36 bg-muted p-2 font-medium">
              Who ↓ / Stage →
            </th>
            {STAGES.map((s) => (
              <th key={s.id} scope="col" className="p-2 align-bottom font-medium">
                <Link href={`/docs3/story/${s.id}`} className="flex flex-col gap-0.5 hover:underline">
                  <span aria-hidden>{s.emoji}</span>
                  <span>{s.name}</span>
                  {s.gates.length > 0 && (
                    <span className="font-mono text-[10px] text-red-600 dark:text-red-400">⚑ {s.gates.join(" ")}</span>
                  )}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROLES.map((role) => (
            <tr key={role.id} className="border-b last:border-b-0">
              <th scope="row" className="sticky left-0 z-10 bg-card p-2 align-top font-medium">
                <Link href={`/docs3/roles/${role.id}`} className="flex items-center gap-2 hover:underline">
                  <RoleAvatar role={role.id} size="sm" />
                  <span className="leading-tight">
                    {role.title}
                    <span className="block text-[10px] font-normal text-muted-foreground">{role.person}</span>
                  </span>
                </Link>
              </th>
              {STAGES.map((s) => {
                const cell = cellAt(role.id, s.id);
                return (
                  <td
                    key={s.id}
                    className={cn("p-2 align-top", !!cell && cell.gates.length > 0 && "bg-red-500/5")}
                  >
                    {cell ? (
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1">
                          {cell.human && <MarkDot mark={cell.human.mark} />}
                          {cell.agent && <MarkDot mark="agent" />}
                          <RaciLetters letters={cell.letters} />
                        </span>
                        <span className="text-[11px] leading-snug text-muted-foreground">
                          {cell.human?.text ?? cell.agent}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/40">·</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
