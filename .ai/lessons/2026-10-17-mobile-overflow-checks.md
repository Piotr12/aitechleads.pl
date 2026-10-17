# Checking pages for horizontal overflow on mobile

**Date:** 2026-10-17

## What happened

The `/docs1`–`/docs3` guides looked fine on desktop. On a 375px phone, four pages were 6–120px wider than
the screen, so the whole page could be scrolled sideways:

- `docs2/[role]`: `grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]`. Below `lg` the grid has a single
  implicit `auto` column, which sizes to its widest min-content child (here a list item containing
  `.ai/skills/<name>/SKILL.md`). Fix: `grid-cols-1` (= `minmax(0, 1fr)`) as the base.
- `docs3/roles/[role]`: a `flex-1` card and a grid child without `min-w-0`, holding a `whitespace-pre` command
  line, and a 5-column lane whose cells held two dots and two letter chips on one row. Fix: `min-w-0`,
  `break-words`, and `flex-wrap` on the chip row.

## How to check

- `chrome --headless=new --window-size=390,…` does **not** give a 390px viewport: headless Chrome's minimum
  window width is 500px, so the screenshot is a crop, and it looks like overflow even on pages that are fine.
- Use mobile emulation through the DevTools protocol instead (`Emulation.setDeviceMetricsOverride` with
  `width: 375, mobile: true`), then compare `document.documentElement.scrollWidth` with `innerWidth`.
  With `mobile: true` the layout viewport grows to fit overflowing content, so `innerWidth > 375` means the page
  overflows. To find the cause, rerun with `mobile: false` and list elements whose right edge passes 375 while
  their parent's doesn't.
- Pace any sweep: the proxy allows 120 requests per minute per IP, and each page view with `<Link>`
  prefetching costs roughly 6–26 of them. Past the limit you are screenshotting the 429 page, which has no
  viewport meta and reports 981px.
