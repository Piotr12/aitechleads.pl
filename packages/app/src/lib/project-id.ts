/** "42" → 42; anything else ("abc", "042", "1e3", "-1") → null, so the page can 404. */
export function parseProjectId(value: string): number | null {
  if (!/^[1-9]\d{0,15}$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}
