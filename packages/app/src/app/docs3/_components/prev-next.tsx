import Link from "@/app/docs3/_components/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Target = { href: string; label: string; hint?: string };

export function PrevNext({ prev, next }: { prev?: Target; next?: Target }) {
  return (
    <nav aria-label="Previous and next" className="grid gap-3 border-t pt-6 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col gap-1 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
            {prev.hint ?? "Previous"}
          </span>
          <span className="font-medium">{prev.label}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next && (
        <Link
          href={next.href}
          className="group flex flex-col items-end gap-1 rounded-xl border bg-card p-4 text-right transition-colors hover:bg-muted/40"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            {next.hint ?? "Next"}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
          <span className="font-medium">{next.label}</span>
        </Link>
      )}
    </nav>
  );
}
