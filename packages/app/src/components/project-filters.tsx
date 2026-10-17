import Link from "next/link";
import { Button } from "@atl/ui/components/button";
import { Input } from "@atl/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@atl/ui/components/select";
import type { ProjectFilter } from "@atl/db";
import { STATUS_INFO } from "@/lib/statuses";

/** A plain GET form, so filtered lists have shareable URLs. */
export function ProjectFilters({ filter }: { filter: ProjectFilter }) {
  const active = !!(filter.q || filter.status || filter.tag);

  return (
    <form action="/" className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Input
        name="q"
        defaultValue={filter.q}
        placeholder="Search titles and summaries…"
        aria-label="Search"
        className="sm:max-w-xs"
      />
      <Select name="status" defaultValue={filter.status ?? "all"}>
        <SelectTrigger aria-label="Status" className="sm:w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any status</SelectItem>
          {Object.entries(STATUS_INFO).map(([key, info]) => (
            <SelectItem key={key} value={key}>
              {info.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {filter.tag && <input type="hidden" name="tag" value={filter.tag} />}
      <div className="flex gap-2">
        <Button type="submit" variant="secondary">
          Search
        </Button>
        {active && (
          <Button asChild variant="ghost">
            <Link href="/">Clear{filter.tag ? ` #${filter.tag}` : ""}</Link>
          </Button>
        )}
      </div>
    </form>
  );
}
