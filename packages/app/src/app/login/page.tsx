import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Alert, AlertDescription } from "@atl/ui/components/alert";
import { Button } from "@atl/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@atl/ui/components/card";
import { getViewer, safeNextPath } from "@/server/auth";
import { getContainer } from "@/server/container";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  denied: "You declined GitHub's request. Brave Sir Robin would approve. Try again whenever you're ready.",
  state: "The login took a wrong turn somewhere (expired or mismatched state). Please try again.",
  github: "GitHub didn't answer as expected. It's probably resting. Try again in a moment.",
};

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Ook.</p>}>
        <Login searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Login({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  await connection();
  const params = await searchParams;
  const next = safeNextPath(typeof params.next === "string" ? params.next : null);
  if (await getViewer()) redirect(next);

  const { config } = (await getContainer()).cradle;
  const error = typeof params.error === "string" ? ERRORS[params.error] : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Stop! Who would cross the Bridge of Death…</CardTitle>
        <CardDescription>
          …must answer me these questions three. What is your name? What is your quest? What is
          your GitHub account?
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {config.github ? (
          <Button asChild size="lg" className="w-full">
            <a href={`/auth/github?next=${encodeURIComponent(next)}`}>Sign in with GitHub</a>
          </Button>
        ) : (
          <Alert>
            <AlertDescription>
              GitHub login isn&apos;t configured on this server yet. The site operator needs to
              set <code>AUTH_GITHUB_ID</code> and <code>AUTH_GITHUB_SECRET</code>.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        We only read your public GitHub profile: login, name and avatar. No repositories, no
        e-mail, no swallows.
      </CardFooter>
    </Card>
  );
}
