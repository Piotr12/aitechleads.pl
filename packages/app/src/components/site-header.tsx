import { Suspense } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@atl/ui/components/avatar";
import { Button } from "@atl/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@atl/ui/components/dropdown-menu";
import { signOut } from "@/app/auth/actions";
import { getViewer } from "@/server/auth";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span aria-hidden>🥥</span>
          <span>AI Tech Leads</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/">Projects</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/projects/new">Add project</Link>
          </Button>
          <Suspense fallback={<div className="size-8" />}>
            <UserMenu />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}

async function UserMenu() {
  const viewer = await getViewer();
  if (!viewer) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/login">Sign in</Link>
      </Button>
    );
  }

  const { user, isAdmin } = viewer;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Account menu" className="rounded-full">
          <Avatar className="size-7">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
            <AvatarFallback>{user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="truncate">@{user.login}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/me">My quests</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/projects/new">Add project</Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin">The Patrician&apos;s office</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <form action={signOut}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full">
              Sign out (run away!)
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
