import type { ReactNode } from "react";
import Link from "next/link";
import { ROLES, neighbours } from "../_data/model";
import { cx } from "./cx";

const SECTIONS = [
  { href: "/docs2", label: "Overview" },
  { href: "/docs2/gates", label: "Gates" },
  { href: "/docs2/handoffs", label: "Handoffs" },
  { href: "/docs2/cheatsheet", label: "Cheatsheet" },
];

/** Section nav + role switcher. `current` is the href of the page rendering it. */
export function DocsNav({ current }: { current: string }) {
  return (
    <nav aria-label="Docs" className="flex flex-col gap-2 border-b pb-3">
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
        <span className="mr-2 font-mono text-xs font-semibold text-muted-foreground">AI SDLC · TL;DR</span>
        {SECTIONS.map((s) => (
          <NavLink key={s.href} href={s.href} active={current === s.href}>
            {s.label}
          </NavLink>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1 text-xs">
        <span className="mr-1 text-muted-foreground">Role:</span>
        {ROLES.map((r) => {
          const href = `/docs2/${r.id}`;
          const active = current === href;
          return (
            <Link
              key={r.id}
              href={href}
              aria-current={active ? "page" : undefined}
              title={r.name}
              className={cx(
                "rounded-md border px-1.5 py-0.5 font-mono font-semibold",
                active ? "border-foreground bg-foreground text-background" : "hover:bg-muted",
              )}
            >
              {r.code}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "rounded-md px-2 py-1",
        active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export function Pager({ current }: { current: string }) {
  const { prev, next } = neighbours(current);
  return (
    <nav aria-label="Pages" className="mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-sm">
      {prev ? (
        <Link href={prev.href} className="rounded-lg border p-3 hover:bg-muted">
          <span className="block text-xs text-muted-foreground">← prev</span>
          <span className="font-medium">{prev.label}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="rounded-lg border p-3 text-right hover:bg-muted">
          <span className="block text-xs text-muted-foreground">next →</span>
          <span className="font-medium">{next.label}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{children}</h2>
      {aside}
    </div>
  );
}
