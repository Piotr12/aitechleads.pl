import { Fragment, type ReactNode } from "react";
import Link from "@/app/docs1/_components/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@atl/ui/components/breadcrumb";
import { cn } from "@atl/ui/lib/utils";
import { ROLES, STAGES, href } from "../_data";

export interface Crumb {
  label: string;
  href?: string;
}

type NavItem = { key: string; label: string; href: string; children?: NavItem[] };

const NAV: NavItem[] = [
  { key: "home", label: "Overview", href: href.home },
  { key: "flows", label: "Flows & entry paths", href: href.flows },
  {
    key: "stages",
    label: "Stages",
    href: href.stages,
    children: STAGES.map((s) => ({
      key: `stage:${s.id}`,
      label: `${s.number}. ${s.name}`,
      href: href.stage(s.id),
    })),
  },
  {
    key: "roles",
    label: "Roles",
    href: href.roles,
    children: ROLES.map((r) => ({ key: `role:${r.id}`, label: r.name, href: href.role(r.id) })),
  },
  { key: "gates", label: "Approval gates", href: href.gates },
  { key: "skills", label: "Skills catalogue", href: href.skills },
  { key: "matrix", label: "RACI matrix", href: href.matrix },
];

function isActive(item: NavItem, active: string) {
  return item.key === active || item.children?.some((c) => c.key === active);
}

/** Page frame for every /docs1 page: section navigation, breadcrumb and content column. */
export function DocsShell({
  active,
  crumbs,
  children,
}: {
  active: string;
  crumbs: Crumb[];
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
      <aside className="hidden lg:block">
        <nav aria-label="Guide sections" className="sticky top-6 flex flex-col gap-1 text-sm">
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            AI SDLC skills guide
          </p>
          {NAV.map((item) => (
            <div key={item.key} className="flex flex-col">
              <Link
                href={item.href}
                aria-current={item.key === active ? "page" : undefined}
                className={cn(
                  "rounded-md px-2 py-1 transition-colors hover:bg-muted",
                  isActive(item, active) ? "font-medium text-foreground" : "text-muted-foreground",
                  item.key === active && "bg-muted",
                )}
              >
                {item.label}
              </Link>
              {item.children && isActive(item, active) ? (
                <div className="my-1 ml-3 flex flex-col border-l pl-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.key}
                      href={child.href}
                      aria-current={child.key === active ? "page" : undefined}
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[13px] transition-colors hover:bg-muted",
                        child.key === active ? "bg-muted font-medium text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col gap-8">
        <nav aria-label="Guide sections" className="-mx-4 overflow-x-auto px-4 lg:hidden">
          <ul className="flex w-max gap-1.5 text-sm">
            {NAV.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex rounded-full border px-3 py-1 whitespace-nowrap transition-colors hover:bg-muted",
                    isActive(item, active) ? "bg-muted font-medium" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, i) => (
              <Fragment key={`${crumb.label}-${i}`}>
                {i > 0 ? <BreadcrumbSeparator /> : null}
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {children}
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: ReactNode;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3">
      {eyebrow ? <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">{eyebrow}</div> : null}
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {lead ? <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">{lead}</p> : null}
      {children}
    </header>
  );
}

export function Section({
  id,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("flex scroll-mt-6 flex-col gap-4", className)}>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description ? <p className="max-w-3xl text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function Pager({
  prev,
  next,
}: {
  prev?: { label: string; href: string };
  next?: { label: string; href: string };
}) {
  return (
    <nav aria-label="Previous and next" className="grid gap-3 border-t pt-6 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-muted"
        >
          <ChevronLeft className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="flex flex-col">
            <span className="text-xs text-muted-foreground">Previous</span>
            <span className="font-medium">{prev.label}</span>
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="flex items-center justify-end gap-3 rounded-xl border p-4 text-right transition-colors hover:bg-muted"
        >
          <span className="flex flex-col">
            <span className="text-xs text-muted-foreground">Next</span>
            <span className="font-medium">{next.label}</span>
          </span>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </Link>
      ) : null}
    </nav>
  );
}

export function ExternalLink({ href: url, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={cn("font-medium underline underline-offset-4 hover:text-foreground", className)}
    >
      {children}
    </a>
  );
}
