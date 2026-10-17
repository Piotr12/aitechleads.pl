import type { Metadata } from "next";

// Hidden section: never indexed, never linked from the rest of the site. Every page repeats this too.
export const metadata: Metadata = {
  title: { default: "The AI SDLC, gently", template: "%s · The AI SDLC, gently" },
  robots: { index: false, follow: false },
};

export default function Docs5Layout({ children }: LayoutProps<"/docs5">) {
  return children;
}
