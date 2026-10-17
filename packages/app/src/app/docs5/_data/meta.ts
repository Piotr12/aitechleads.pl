import type { Metadata } from "next";

/** Per-page metadata: a title, and the "hidden section" robots rule on every single page. */
export function meta(title: string): Metadata {
  return { title, robots: { index: false, follow: false } };
}
