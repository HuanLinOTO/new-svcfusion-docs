# 2026-02-14 Homepage Missing Points Design

## Goal

Complete the homepage "missing points" listed in `a.txt` by porting the *behavior and data flow* from the original project (`ori/`), while **preserving the current Next.js + shadcn + Tailwind visual language** (no 1:1 style copy).

Missing points to close:

- Clickable rotating sponsor `Banner`
- `HeroVisual` (floating cards + center logo ring)
- `ActionButtons` (latest version logic + "NEW" badge window + dynamic label)
- `CommunityModal` details (sponsor notice, avatars, recommended tag, member progress, tips)
- `NewYearEffects` (fireworks, falling items, bottom banner, corner decorations)
- Section interaction parity: `ToolsSection`, `ModelsSection`, `ComparisonTable` (entrance triggers, small interactions, feature link)

## Non-Goals

- Do not replicate the original gradients/typography/layout 1:1.
- Do not introduce a new design system; keep current tokens and shadcn components.
- Do not require a build-time placeholder replacement pipeline.

## Constraints

- Next.js app router.
- Current site look is defined by shadcn components + Tailwind + `app/globals.css` CSS variables and background.
- Prefer reduced motion support; avoid heavy animations on low-end devices.

## Source Of Truth ("Original project method")

We reuse the original project's runtime sources, but consume them in a Next-friendly way.

### Latest Version Data

- Source: `ori/version.json`.
- New source in this repo: `public/version.json` (copied from `ori/version.json`).
- The latest entry is the first element of the array.

Fields used:

- `version` (string)
- `link` (string)
- `date` (string, parsed by JS `Date`)

### Encoding

`ActionButtons` generates download URLs in the form:

`/download?link=<base64(link)>&version=<base64(version)>`

This matches the current decode behavior in `app/download/page.tsx`.

### Community Group Members

- Source: `https://syg.xdy.huanlin2026.me/api/groups`
- Fetch on-demand when modal opens.
- If fetch fails, fall back to static text.

## Component Architecture

Refactor `components/landing-page.tsx` into smaller, behavior-focused components, keeping styling consistent with existing patterns.

New components (React):

- `components/main-page/banner.tsx`
- `components/main-page/hero-visual.tsx`
- `components/main-page/action-buttons.tsx`
- `components/main-page/community-modal.tsx`
- `components/main-page/new-year-effects.tsx`

Keep section content in the existing landing page or move into:

- `components/main-page/comparison-table.tsx`
- `components/main-page/models-section.tsx`
- `components/main-page/tools-section.tsx`

The top-level page composition remains:

`NewYearEffects` -> `Banner` -> `Hero` -> `Comparison` -> `Models` -> `Tools` -> `CommunityModal`

## Styling Rules (Hard)

- Preserve the current palette, softness, and typography choices.
- Use shadcn primitives (`Card`, `Badge`, `Button`, `Separator`) where possible.
- No "big purple gradient" sections.
- Motion is purposeful and limited; respect `prefers-reduced-motion`.

## Behavior Specs

### Banner

- Two sponsors (AIGate + UCloud).
- Rotates every ~5s.
- Pauses when `document.hidden` and resumes when visible.
- Click opens sponsor link in a new tab.
- Optional analytics: if `window.gtag` exists, emit events similar to the original.

### HeroVisual

- Three floating mini-cards + center logo ring.
- On small screens, hide or render a static simplified version.
- Use low-amplitude transforms to avoid jank.

### ActionButtons

- Buttons: start docs, open community modal, download latest.
- "NEW" badge: shown if `ReleaseTime > now - 3 days`.
- Download label includes `latest.version`.

### CommunityModal

- Sponsor notice row.
- 3 group cards:
  - avatar
  - recommended tag (group 1)
  - member count + max tier + progress bar
  - tips section at bottom
- When modal opens, fetch group info and update UI; keep UI functional without network.

### NewYearEffects

Active only in New Year period (12/28 - next 3/1).

Layers:

- low-frequency fireworks canvas (desktop-first; mobile reduces intensity)
- falling items (15)
- corner decorations (top-left/top-right)
- bottom banner (clickable to close)

Bottom banner style:

- Card-like glass panel aligned with current site style (rounded, subtle border, warm background, minimal accent)
- small entrance animation; hover highlights; `prefers-reduced-motion` disables animation
- close is stored for the current session (optional localStorage follow-up)

### Tools / Models / Comparison

- Entrance animation triggered via `IntersectionObserver` (one-shot).
- Comparison table supports clickable feature link(s) and opens in a new tab.
- Keep layout structure; only add missing interactions.

## Performance & Accessibility

- Gate intensive animations behind `prefers-reduced-motion`.
- Ensure overlays are keyboard accessible:
  - close button has `aria-label`
  - modal traps focus (or at least focus is managed reasonably)
- Avoid layout thrash: prefer CSS animations over JS-driven per-frame DOM changes.

## Verification

- Manual:
  - banner rotates, pauses on tab blur, click opens link
  - download button shows NEW within 3 days of latest date
  - community modal fetch updates member counts; fallback shows when offline
  - new year effects show only in period; banner closes
- Commands:
  - `npm run dev`
  - `npm run build`
