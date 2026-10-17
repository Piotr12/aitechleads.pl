"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Alert, AlertDescription } from "@atl/ui/components/alert";
import { Button } from "@atl/ui/components/button";
import { Input } from "@atl/ui/components/input";
import { Label } from "@atl/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@atl/ui/components/select";
import { Textarea } from "@atl/ui/components/textarea";
// Type-only imports: the schema module pulls in the database package, which must stay on the server.
import type { ProjectFormField, ProjectFormState, ProjectFormValues } from "@/lib/project-schema";
import { STATUS_INFO } from "@/lib/statuses";

type Action = (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;

export function ProjectForm({
  action,
  initial,
  submitLabel,
  cancelHref,
}: {
  action: Action;
  initial: ProjectFormValues;
  submitLabel: string;
  cancelHref: string;
}) {
  const [state, formAction, pending] = useActionState(action, { attempt: 0 });
  const values = state.values ?? initial;
  const error = (field: ProjectFormField) => state.errors?.[field]?.[0];

  return (
    // Remount after each failed submit so the inputs show what was submitted, not the defaults.
    <form key={state.attempt} action={formAction} className="flex flex-col gap-6">
      {state.message && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <Field label="Title" name="title" error={error("title")}>
        <Input id="title" name="title" defaultValue={values.title} required maxLength={100} aria-invalid={!!error("title")} />
      </Field>

      <Field
        label="Summary"
        name="summary"
        hint="One or two sentences for the project list. What is it, and why does it matter?"
        error={error("summary")}
      >
        <Textarea id="summary" name="summary" defaultValue={values.summary} required maxLength={280} rows={2} aria-invalid={!!error("summary")} />
      </Field>

      <Field
        label="Description"
        name="description"
        hint="Optional. The longer story: approach, stack, what you've learned, what help you'd like."
        error={error("description")}
      >
        <Textarea id="description" name="description" defaultValue={values.description} maxLength={5000} rows={8} aria-invalid={!!error("description")} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Status" name="status" hint={STATUS_INFO[(values.status as keyof typeof STATUS_INFO) ?? "idea"]?.hint} error={error("status")}>
          <Select name="status" defaultValue={values.status || "idea"}>
            <SelectTrigger id="status" className="w-full" aria-invalid={!!error("status")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_INFO).map(([key, info]) => (
                <SelectItem key={key} value={key}>
                  {info.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Tags" name="tags" hint="Comma-separated, e.g. agents, rag, evals." error={error("tags")}>
          <Input id="tags" name="tags" defaultValue={values.tags} aria-invalid={!!error("tags")} />
        </Field>

        <Field label="Repository" name="repoUrl" hint="Optional link to the code." error={error("repoUrl")}>
          <Input id="repoUrl" name="repoUrl" type="url" placeholder="https://github.com/…" defaultValue={values.repoUrl} aria-invalid={!!error("repoUrl")} />
        </Field>

        <Field label="Demo" name="demoUrl" hint="Optional link to something people can try." error={error("demoUrl")}>
          <Input id="demoUrl" name="demoUrl" type="url" placeholder="https://…" defaultValue={values.demoUrl} aria-invalid={!!error("demoUrl")} />
        </Field>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Consulting the bridgekeeper…" : submitLabel}
        </Button>
        <Button asChild variant="ghost">
          <Link href={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  hint,
  error,
  children,
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        hint && <p className="text-sm text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
