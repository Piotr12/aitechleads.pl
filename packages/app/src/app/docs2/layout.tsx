import type { Metadata } from "next";
import { ROBOTS } from "./_data/model";

export const metadata: Metadata = {
  title: "AI SDLC TL;DR",
  robots: ROBOTS,
};

export default function Docs2Layout({ children }: LayoutProps<"/docs2">) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">{children}</main>
  );
}
