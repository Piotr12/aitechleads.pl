import NextLink from "next/link";
import type { ComponentProps } from "react";

/**
 * `next/link` without prefetching. The guide pages are link-dense: prefetching every visible link costs
 * 6–26 requests per page view, which eats the per-IP limit in proxy.ts (120/min) after a few quick clicks.
 * The pages are prerendered, so a click without prefetch is one cheap request.
 */
export default function Link(props: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={false} {...props} />;
}
