import type { Metadata } from "next";

// Hidden section: never indexed, never linked from the rest of the site. Every page repeats this too.
export const metadata: Metadata = {
  title: { default: "Follow the work", template: "%s · Follow the work" },
  robots: { index: false, follow: false },
};

export default function Docs6Layout({ children }: LayoutProps<"/docs6">) {
  return children;
}
