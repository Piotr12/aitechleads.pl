import type { Metadata } from "next";
import { ROBOTS } from "./_data/links";

// Hidden section: never indexed, never linked from the rest of the site. Every page repeats the robots rule too.
export const metadata: Metadata = {
  title: { default: "The first month", template: "%s · The first month" },
  robots: ROBOTS,
};

export default function Docs7Layout({ children }: LayoutProps<"/docs7">) {
  return children;
}
