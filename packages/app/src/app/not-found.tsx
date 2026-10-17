import Link from "next/link";
import { Button } from "@atl/ui/components/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-4 px-4 py-24 sm:px-6">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">This page has ceased to be.</h1>
      <p className="text-muted-foreground">
        It is no more. It has expired and gone to meet its maker. Or it was never here: million-to-one
        chances crop up nine times out of ten, and this wasn&apos;t one of them.
      </p>
      <div>
        <Button asChild>
          <Link href="/">Back to the projects</Link>
        </Button>
      </div>
    </main>
  );
}
