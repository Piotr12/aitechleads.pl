import type { Metadata } from "next";

// Hidden section: never indexed, never linked from the rest of the site.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Docs1Layout({ children }: LayoutProps<"/docs1">) {
  return children;
}
