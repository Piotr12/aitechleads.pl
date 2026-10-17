"use client";

import Link from "@/app/docs3/_components/link";
import { usePathname } from "next/navigation";
import { cn } from "./cx";

const ITEMS = [
  { href: "/docs3", label: "Welcome", emoji: "👋", exact: true },
  { href: "/docs3/story", label: "The story", emoji: "🗺️" },
  { href: "/docs3/roles", label: "Who's who", emoji: "🧑‍🤝‍🧑" },
  { href: "/docs3/gates", label: "The 7 gates", emoji: "⚑" },
  { href: "/docs3/chart", label: "The chart", emoji: "📊" },
  { href: "/docs3/glossary", label: "Glossary", emoji: "📖" },
  { href: "/docs3/quiz", label: "Self-check", emoji: "✅" },
];

/** Reads the current path to highlight the active section. Wrap in <Suspense> with DocsNavList. */
export function DocsNav() {
  return <DocsNavList pathname={usePathname()} />;
}

/** The plain list; with no pathname nothing is highlighted (used as the Suspense fallback). */
export function DocsNavList({ pathname }: { pathname?: string }) {
  return (
    <nav aria-label="Guide sections" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex min-w-max gap-1">
        {ITEMS.map((item) => {
          const active =
            pathname !== undefined && (item.exact ? pathname === item.href : pathname.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
                  active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span aria-hidden>{item.emoji}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
