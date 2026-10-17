import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { DocsNav, DocsNavList } from "./_components/docs-nav";

export const metadata: Metadata = {
  title: { default: "The AI SDLC, explained with examples", template: "%s · AI SDLC for newcomers" },
  robots: { index: false, follow: false },
};

export default function Docs3Layout({ children }: LayoutProps<"/docs3">) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground">
          <Link href="/docs3" className="font-medium text-foreground hover:underline">
            The AI SDLC, explained with examples
          </Link>{" "}
          · a beginner&apos;s guide to the{" "}
          <a
            href="https://github.com/open-mercato/skills"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            open-mercato/skills
          </a>{" "}
          process
        </p>
        <Suspense fallback={<DocsNavList />}>
          <DocsNav />
        </Suspense>
      </div>
      {children}
    </div>
  );
}
