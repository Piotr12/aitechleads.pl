import type { User } from "@atl/db";
import { Avatar, AvatarFallback, AvatarImage } from "@atl/ui/components/avatar";

export function UserChip({ user }: { user: User }) {
  return (
    <a
      href={`https://github.com/${user.login}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
    >
      <Avatar className="size-5">
        {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
        <AvatarFallback className="text-[10px]">{user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span>{user.name ?? user.login}</span>
    </a>
  );
}
