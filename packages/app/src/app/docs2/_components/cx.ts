/** Joins class names, dropping falsy ones. (No tailwind-merge: callers don't pass conflicting classes.) */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
