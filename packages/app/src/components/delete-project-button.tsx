"use client";

import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@atl/ui/components/alert-dialog";
import { Button } from "@atl/ui/components/button";

export function DeleteProjectButton({
  title,
  action,
  size = "default",
}: {
  title: string;
  action: () => Promise<void>;
  size?: "default" | "sm";
}) {
  const [pending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size={size} disabled={pending}>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Run away! Run away!</AlertDialogTitle>
          <AlertDialogDescription>
            This deletes “{title}” for good. Not even the Death of Rats can bring it back.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, I&apos;ll stay and fight</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => startTransition(action)}>
            Yes, delete it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
