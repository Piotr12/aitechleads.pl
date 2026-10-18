import { Fragment } from "react";

/**
 * Renders a plain string, turning `backtick` spans into inline code and **double stars** into bold.
 * Keeps the content modules as plain strings, so they stay easy to check against the source repo.
 */
export function Md({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("`") && p.endsWith("`") && p.length > 1) {
          return (
            <code key={i} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] break-words">
              {p.slice(1, -1)}
            </code>
          );
        }
        if (p.startsWith("**") && p.endsWith("**") && p.length > 3) {
          return (
            <strong key={i} className="font-semibold">
              {p.slice(2, -2)}
            </strong>
          );
        }
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}
