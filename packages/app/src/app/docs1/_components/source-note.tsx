import { Info } from "lucide-react";

/** Notes on how the chart and the skills repository relate on a given page. */
export function SourceNote({ notes, title = "Note on sources" }: { notes: string[]; title?: string }) {
  return (
    <aside className="flex gap-3 rounded-xl border bg-muted/30 p-4 text-sm">
      <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="flex flex-col gap-1.5">
        <p className="font-medium">{title}</p>
        {notes.map((n) => (
          <p key={n} className="text-muted-foreground">
            {n}
          </p>
        ))}
      </div>
    </aside>
  );
}
