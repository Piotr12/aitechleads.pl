/** Joins class names, skipping falsy values. (Local so docs3 needs no extra dependency.) */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
