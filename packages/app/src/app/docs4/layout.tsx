import type { Metadata } from "next";
import { ROBOTS } from "./_data";

export const metadata: Metadata = {
  title: { default: "One appointment, ten stages", template: "%s · One appointment, ten stages" },
  robots: ROBOTS,
};

export default function Docs4Layout({ children }: LayoutProps<"/docs4">) {
  return <div className="mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10">{children}</div>;
}
