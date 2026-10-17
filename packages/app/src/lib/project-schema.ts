import { z } from "zod";
import { PROJECT_STATUSES, type ProjectInput } from "@atl/db";

export const MAX_TAGS = 8;

/** Empty → `null`; anything else must be an http(s) URL (never `javascript:`). */
const optionalUrl = z
  .string()
  .trim()
  .max(500, "That URL is longer than the Librarian's patience.")
  .transform((value) => value || null)
  .pipe(
    z
      .url({ protocol: /^https?$/, error: "A proper http(s):// link, please. No carrier swallows." })
      .nullable(),
  );

/** "LLM, RAG ,  agents" → ["llm", "rag", "agents"] */
const tags = z
  .string()
  .transform((value) => [
    ...new Set(
      value
        .split(",")
        .map((tag) =>
          tag
            .trim()
            .toLowerCase()
            .replace(/[^\p{L}\p{N}+#.\s-]/gu, "")
            .replace(/\s+/g, "-"),
        )
        .filter(Boolean),
    ),
  ])
  .pipe(
    z
      .array(z.string().max(24, "Tags up to 24 characters. This is not a German compound noun."))
      .max(MAX_TAGS, `At most ${MAX_TAGS} tags. Even the Spanish Inquisition had only three weapons.`),
  );

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "A title of at least 3 characters. 'Ni' is not enough, however loudly you say it.")
    .max(100, "100 characters at most. It's a title, not a saga."),
  summary: z
    .string()
    .trim()
    .min(10, "Tell us a bit more: at least 10 characters.")
    .max(280, "280 characters at most. Brevity is the soul of wit, and of summaries."),
  description: z
    .string()
    .trim()
    .max(5000, "5000 characters at most. Save the rest for the sequel.")
    .transform((value) => value || null),
  repoUrl: optionalUrl,
  demoUrl: optionalUrl,
  status: z.enum(PROJECT_STATUSES, { error: "Pick a status. Any status. Not that one." }),
  tags,
}) satisfies z.ZodType<ProjectInput, unknown>;

export type ProjectFormField = keyof z.input<typeof projectSchema>;
export type ProjectFormValues = Partial<Record<ProjectFormField, string>>;

export interface ProjectFormState {
  /** Bumped on every failed submit so the form remounts with the submitted values. */
  attempt: number;
  values?: ProjectFormValues;
  errors?: Partial<Record<ProjectFormField, string[]>>;
  message?: string;
}

const FIELDS: ProjectFormField[] = ["title", "summary", "description", "repoUrl", "demoUrl", "status", "tags"];

export function formValues(formData: FormData): ProjectFormValues {
  return Object.fromEntries(FIELDS.map((field) => [field, String(formData.get(field) ?? "")]));
}
