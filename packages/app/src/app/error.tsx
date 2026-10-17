"use client";

import { Button } from "@atl/ui/components/button";

export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-4 px-4 py-24 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Something went wrong.</h1>
      <p className="text-muted-foreground">
        Nobody expected that. Our chief weapon was surprise, and it has been turned against us.
        Ponder Stibbons suspects a quantum thing.
      </p>
      <div>
        <Button onClick={() => retry()}>Try again</Button>
      </div>
    </main>
  );
}
