# SHIFT RWA — UX / Frontend Architecture Audit

**Auditor:** ArchitectUX
**Date:** 2026-04-24
**Scope:** Next.js 16.2.2 App Router, React 19, Tailwind v4, shadcn/ui (base-nova), Framer Motion via `motion/react` w/ LazyMotion.
**Live URL:** https://shift-rwa.vercel.app/
**Local codebase:** /Users/tomer/dev/shift-rwa

---

## TL;DR — The honest verdict

The site looks OK at first glance because Space Grotesk + mint-on-midnight reads clean. But structurally it is **not** at a premium level, and most of that comes from four architectural problems:

1. **The landing ships the full Web3 wallet stack (wagmi + RainbowKit + WalletConnect) and recharts.** ~696 KB of JS / ~2 MB decoded is served on a marketing page that has no wallet UI and no chart. This alone is the biggest single quality gap between "looks clean" and "feels premium".
2. **The design system exists in `globals.css` but is not actually used.** There are **67** hardcoded hex occurrences of brand colors and **15+** hardcoded mint `rgba(38,200,184,…)` usages scattered across components — inline styles, arbitrary Tailwind classes, `[#0A2730]`, `[#07638C]`. The tokens aren't a system, they're a suggestion.
3. **Type scale in CSS custom properties (`--step-0..6`) is declared but never consumed anywhere.** Every component re-invents its heading scale with arbitrary Tailwind values like `text-[44px]`, `md:text-[72px]`, `text-[36px]`. There is no typography rhythm.
4. **Almost every section component is `"use client"`** including static content like FAQ, ComparisonTable, TractionStrip, Partners, Team — because they use `<Reveal>` / `<StaggerChildren>`. Motion primitives are forcing client-component boundaries that shouldn't exist.

Everything else below is a symptom of these four things, plus a handful of discrete a11y / perf bugs.

---

## Methodology

- Read `layout.tsx`, `page.tsx`, `globals.css`, all of `src/components/landing/**`, `src/components/motion/**`, `src/components/nav/**`, `src/components/ui/**` used on landing, `src/data/**`, `src/lib/**`.
- Loaded live site via Playwright MCP (desktop 1280×720 and mobile 390×844) and measured from Performance API: LCP, CLS, transferred bytes per chunk, resource count, font loading.
- Downloaded the three largest JS chunks and grep'd their minified bodies to identify which libraries are inlined into the landing bundle.
- Ran DOM audits: heading hierarchy, landmark roles, focus-visible coverage, backdrop-filter count, `will-change` count, active `document.getAnimations()` count.

### Live measurements (landing page, cold load, Vercel Edge)

| Metric | Desktop | Mobile |
|---|---|---|
| LCP | 184 ms | 200 ms |
| CLS | 0.0001 | 0 |
| FCP | 136 ms | ~200 ms |
| Total JS (gzipped) | 696 KB | 696 KB |
| Total JS (decoded) | ~2.0 MB | ~2.0 MB |
| CSS | 25 KB | 25 KB |
| Fonts (2× woff2) | 53 KB | 53 KB |
| Resources | 90 | 90 |
| Active CSS animations | 19 | 19 |
| backdrop-filter nodes | 10 | 10 |

Vercel's Edge hides the JS cost on Lab metrics (LCP 184 ms on a gigabit connection). On a real 4G device this JS payload will cost you INP, TBT, and a visible hydration delay on every page transition.

---

# Findings (31 total)

Severity key: **P0** correctness/blocker · **P1** performance or a11y impact · **P2** DX / maintainability

---

## Architecture & Rendering

### F1 — [P0] Wagmi + RainbowKit + WalletConnect on the landing page
**File:** `src/components/providers.tsx:1-51`, `src/app/layout.tsx:132-146`

`Providers` is `"use client"` and imports `RainbowKitProvider`, `WagmiProvider`, `QueryClientProvider`. It wraps `{children}` inside `RootLayout`, so **every route** ships the wallet stack — including `/`, `/blog`, `/blog/[slug]`, `/team`, `/learn`, `/disclaimer`, `/privacy`, `/terms`.

Confirmed via chunk inspection: the largest chunk (`0~pgtxvie4s0b.js`, 146 KB gzip / 456 KB decoded) contains `wagmi` (14 occurrences), `rainbowkit` (23), `walletconnect` (56), tanstack query (88). None of these are needed to render the marketing pages.

Also:
- `@rainbow-me/rainbowkit/styles.css` is imported globally so RainbowKit CSS ships too.
- `recharts` (chunk #2, 112 KB gzip / 392 KB decoded) is included in the bundle despite not being on the landing page — it's only used in `/trade` and `/portfolio`. This is almost certainly `next-themes` or another shared dep pulling it through a non-tree-shaken import path; audit via `@next/bundle-analyzer`.

**Fix:**
```tsx
// Split providers into marketing vs app
// src/components/web3-providers.tsx — keep wagmi/rainbow here
// src/components/providers.tsx — keep only TooltipProvider + Toaster

// src/app/layout.tsx — only the marketing-safe providers wrap everything
// src/app/(app)/layout.tsx — new route group, adds <Web3Providers>
// Move /trade, /portfolio, /history, /leaderboard, /rewards, /referrals into (app).
// Landing, /blog, /team, /learn, /legal stay on marketing layout.
```
This one change will cut landing JS from ~696 KB gzip to ~250 KB gzip.

---

### F2 — [P1] Almost every landing section is a client component unnecessarily
**Files:**
- `src/components/landing/traction-strip.tsx:1`
- `src/components/landing/partners.tsx:1`
- `src/components/landing/comparison-table.tsx:1`
- `src/components/landing/team-section.tsx:1`
- `src/components/landing/faq.tsx:1`
- `src/components/landing/thesis-sequence.tsx:1`
- `src/components/landing/farm-section.tsx:1`
- `src/components/landing/connect-section.tsx` — not client but uses `useLocalStorage` via `WelcomeModal`? (actually server — good)

Everything with a `<Reveal>` gets marked `"use client"` because `<Reveal>` is itself a client component, and client-ness propagates up. Partners, Team, FAQ, and TractionStrip are pure presentation over static data; they should be server components.

**Fix:** refactor `<Reveal>` / `<StaggerChildren>` to accept an *already-rendered* server subtree as `children`, and apply the motion wrapper only on the client side. Pattern:

```tsx
// Keep server parents server-side. Only the <Reveal> primitive is client.
// In section components, DO NOT put "use client" at the top — leave it off.
// <Reveal> is already a client-boundary island; its children can be server RSC.
```

Currently the *entire section* becomes a client island, even though only the opacity/translate wrapper needs to be. Removing `"use client"` from ~7 components will reclaim the 300-500 ms of hydration work that's currently forced on every landing visit.

---

### F3 — [P1] Landing `page.tsx` imports 11 sections synchronously
**File:** `src/app/page.tsx:1-29`

No dynamic imports. All 11 landing sections (hero, traction, partners, why, comparison, team, markets, farm, blog-featured, connect, faq) are in the initial module graph, including Farm's orbit math and ThesisSequence's sticky scroll that only matters past the fold.

**Fix:** below-the-fold sections should be split via `next/dynamic` with `ssr: true, loading: () => <div className="min-h-[600px]" />` to preserve SEO + prevent CLS.

```tsx
import dynamic from "next/dynamic";
const LandingFarm = dynamic(() => import("@/components/landing/farm-section").then(m => ({ default: m.LandingFarm })));
const LandingFaq  = dynamic(() => import("@/components/landing/faq").then(m => ({ default: m.LandingFaq })));
```

---

## Design tokens & CSS architecture

### F4 — [P1] Declared type scale `--step-0..6` is never used
**File:** `src/app/globals.css:51-71`

`--step-0..6` are defined with a thoughtful comment block explaining the 7-step scale. Then **not one component uses them.** Grep returns zero hits outside globals.css.

Instead components use: `text-[44px] sm:text-5xl md:text-7xl lg:text-[72px]` (hero.tsx:29), `text-4xl md:text-6xl` (why-shift.tsx:30, farm-section.tsx:54, connect-section.tsx:137), `text-[36px]` (connect-section.tsx:61), `text-3xl md:text-[2.5rem]` (blog/[slug]/page.tsx:127), `text-[17px] md:text-[18px]` (blog/[slug]/page.tsx:161).

There is no type rhythm and no semantic heading level. Every author picked different sizes.

**Fix:** consume the scale through Tailwind's `@theme`:

```css
/* globals.css — inside @theme inline { ... } */
--text-step-0: var(--step-0);
--text-step-1: var(--step-1);
--text-step-2: var(--step-2);
--text-step-3: var(--step-3);
--text-step-4: var(--step-4);
--text-step-5: var(--step-5);
--text-step-6: var(--step-6);
```

Now `text-step-6` is a Tailwind utility. Then replace every hero's `text-[44px] sm:text-5xl md:text-7xl lg:text-[72px]` with `text-step-5 md:text-step-6` and codify responsive jumps in one place.

Consider also fluid typography with `clamp()`:
```css
--step-6: clamp(2.75rem, 1.5rem + 5vw, 4.5rem);
```
That removes every `sm:`/`md:`/`lg:` text-size breakpoint in the hero/section H2s.

---

### F5 — [P1] 67 hardcoded hex + 15+ hardcoded mint rgba bypass the token system
**Files (partial):**
- `src/components/landing/hero.tsx:15,34,82`
- `src/components/landing/why-shift.tsx:35,73,102,108`
- `src/components/landing/thesis-sequence.tsx:24,47,76,82,100,122,248`
- `src/components/landing/farm-section.tsx:30,40,59,108`
- `src/components/landing/connect-section.tsx:37,41,77,80,142,171`
- `src/components/landing/comparison-table.tsx:107`
- `src/components/landing/team-section.tsx:73`
- `src/components/landing/blog-featured.tsx:33,60,71` (`bg-[#0A2730]`)
- `src/app/blog/page.tsx:33,137` (`bg-[#0A2730]`, `border-l-[#4CC8E8]`)
- `src/app/blog/[slug]/page.tsx:47,96,146,239,241,249,279`

These are values that already exist as CSS custom properties (`--card` = `#0A2730`, `--tidal-steel-adj` = `#07638C`). Using arbitrary Tailwind hexes means:
- No theming later. If SHIFT ever ships a light mode (the ArchitectUX playbook requires one), every one of these must be re-audited.
- `bg-card` would have handled it — it's literally `#0A2730`.

**Fix — highest-leverage single PR:**
1. Grep-replace `bg-[#0A2730]` → `bg-card`, `bg-[#0a2730]` → `bg-card`, `bg-[#021C24]` → `bg-background`, `bg-[#07638C]/20` → `bg-[--color-tidal-steel-adj]/20` (or add a `tidal-steel-adj` theme token).
2. Extract the mint→tidal gradient that appears **11 times** as `linear-gradient(135deg, #26C8B8 0%, #07638C 100%)` into a utility:

```css
@layer utilities {
  .text-gradient-mint {
    background: linear-gradient(135deg, var(--mint) 0%, var(--tidal-steel-adj) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .bg-gradient-mint {
    background: linear-gradient(135deg, var(--mint) 0%, var(--tidal-steel-adj) 100%);
  }
}
```

Every `<span className="bg-clip-text text-transparent" style={{backgroundImage: "linear-gradient(...)"}}>` becomes `<span className="text-gradient-mint">`. That's hero.tsx:31-38, why-shift.tsx:33-38, comparison-table.tsx:105-110, team-section.tsx:20-25, farm-section.tsx:57-60, connect-section.tsx:140-145, thesis-sequence.tsx:98-105,246-250. Seven files, one utility.

---

### F6 — [P1] Mint glow shadows are literals too
**Files:** hero.tsx:55, farm-section.tsx:72, connect-section.tsx:171, blog/[slug]/page.tsx:279

`shadow-[0_0_30px_rgba(38,200,184,0.25)]` and variants appear verbatim in 5+ places. Each author picked a slightly different opacity (0.25, 0.3, 0.45, 0.5).

**Fix:** add shadow tokens:
```css
@theme inline {
  --shadow-mint-sm: 0 0 20px rgba(38, 200, 184, 0.2);
  --shadow-mint: 0 0 30px rgba(38, 200, 184, 0.3);
  --shadow-mint-lg: 0 0 60px rgba(38, 200, 184, 0.45);
}
```
Now `shadow-mint` is a utility.

---

### F7 — [P2] `--font-mono` is overridden by literal string in `@theme`
**File:** `src/app/globals.css:10`

```css
--font-mono: "Geist Mono", "JetBrains Mono", ui-monospace, monospace;
```
`layout.tsx:18-23` loads JetBrains Mono via `next/font/google` and assigns it to `--font-mono`. But the `@theme` block **replaces** the var with a hardcoded fallback string. Result: the 32 KB JetBrains Mono woff2 is loaded but the CSS `font-mono` utility never references it — it falls back to the OS font.

**Fix:**
```css
--font-mono: var(--font-mono-next), "JetBrains Mono", ui-monospace, monospace;
```
And rename the next/font injection to `--font-mono-next` in layout.tsx, OR drop the JetBrains next/font import entirely to save the woff2 download.

---

### F8 — [P2] Dead dependency: `@fontsource/space-grotesk`
**File:** `package.json:15`

`@fontsource/space-grotesk` is in dependencies at 5.2.10. Grep shows it's never imported (`next/font/google` handles Space Grotesk instead). Remove it — cuts 400 KB from node_modules and 2 MB+ from install time.

```bash
pnpm remove @fontsource/space-grotesk
```

---

### F9 — [P2] Space Grotesk loaded with 5 weights, mono with 3 — both probably overweight
**File:** `src/app/layout.tsx:11-23`

`weight: ["300", "400", "500", "600", "700"]` means 5 woff2 subsets for Space Grotesk. At runtime the live site only serves 2 woff2 (next/font smart-prunes), but the preload hints still reference all 5. Audit which weights are actually used: grep shows `font-semibold` (600), `font-bold` (700), `font-medium` (500), `font-normal` (400). Weight 300 is never used — drop it.

Mono is similar: grep for `font-mono` returns 10 files, mostly `tabular-nums` cases that don't need a distinct mono font. Consider removing JetBrains Mono entirely and using `font-feature-settings: "tnum"` on numeric displays.

---

### F10 — [P2] Radius scale works but is never leveraged
**File:** `globals.css:44-48`, components

Radius tokens are declared (`--radius-sm…--radius-2xl`). Components use `rounded-2xl`, `rounded-3xl`, `rounded-full`, `rounded-[48px]` (connect-section phone), `rounded-[36px]`, `rounded-[inherit]`. The arbitrary ones (`rounded-[48px]`) should either become a new token or use `--radius-2xl` (= 1.575rem ≈ 25px — not the same but close).

---

## Components & boundaries

### F11 — [P1] `WhyShift` is a god-section (2 grids + 4 subcomponents + thesis sequence)
**File:** `src/components/landing/why-shift.tsx:1-126`

One file, 126 lines, imports `TiltCard` and `ThesisSequence`, defines `ROW_1`, `ROW_2`, renders:
- Eyebrow + H2
- `<ThesisSequence>` (which is itself a 268-line file with sticky scrollytelling + static fallback)
- 4 tiles × `ConceptTile`
- 7 tiles × `TokenTile`
- 3 tiles × `FeatureCard`

Three inline subcomponents (`ConceptTile`, `TokenTile`, `FeatureCard`) with near-identical patterns that don't reuse `<Card>` from `src/components/ui/card.tsx`. The shadcn Card is sitting unused.

**Fix:** break into:
```
src/components/landing/why-shift/
├── index.tsx              # section header + composition
├── concept-tile.tsx
├── token-tile.tsx
└── feature-card.tsx
```
Or better: deprecate inline subcomponents in favor of a single `<PremiumCard variant="concept|token|feature">` that uses the shadcn `<Card>` with `data-variant`.

---

### F12 — [P2] `shadcn/ui Card` is imported nowhere on the landing
**File:** `src/components/ui/card.tsx`

`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` exist and are unused outside trade/portfolio subsystems. Every landing tile reinvents its own card with `rounded-3xl border border-border bg-gradient-to-b from-card to-background`. Those reinventions drift — e.g. team cards use `rounded-2xl`, why-shift tiles use `rounded-3xl`, partners use `rounded-2xl`, blog cards use `rounded-2xl`.

**Fix:** either standardize on `<Card>` or delete the unused shadcn component — right now it creates the illusion of a system that doesn't exist.

---

### F13 — [P2] `TractionStrip` duplicates its own children in the mobile marquee
**File:** `src/components/landing/traction-strip.tsx:37-55`

The motion-ok marquee renders `<StatNodes />` then re-lists the same 4 stats inline, instead of just rendering `<StatNodes />` twice. Bug risk: when someone edits `StatNodes`, the duplicated list goes stale. This has already happened — `countTo={2}` and `countTo={40}` are duplicated verbatim at lines 47 and 49.

**Fix:**
```tsx
<div className="flex items-center gap-10 ..." style={{...}}>
  <StatNodes />
  <StatNodes aria-hidden="true" />
</div>
```

---

### F14 — [P1] Comparison table reinvents IntersectionObserver + stagger that `StaggerChildren` already does
**File:** `src/components/landing/comparison-table.tsx:80-91, 133-139`

The component wires up a `useRef` + `useEffect` + `IntersectionObserver` just to toggle a class that drives a CSS keyframe stagger (`vt-row-animate` from globals.css:188-191). `StaggerChildren` already solves this and uses motion's viewport once-trigger under the hood.

**Fix:** replace the manual IO with `<StaggerChildren as="tbody">` and `<RevealChild as="tr">` — and delete the `.vt-row-animate` and `.vt-rows-in` CSS from globals.css. Duplicated implementation of a solved primitive.

---

### F15 — [P0] Tooltip content isn't keyboard-triggerable on the comparison table
**File:** `src/components/landing/comparison-table.tsx:141-153`

`<TooltipTrigger>` wraps the label text with `cursor-help` but the trigger is not a button or link. Base-UI's Tooltip on a non-focusable element means keyboard users never see the tooltip explanation for "Liquidation risk" etc. This is the core explanation of SHIFT's differentiation — hidden behind a mouse hover.

**Fix:**
```tsx
<TooltipTrigger render={<button type="button" className="underline decoration-dotted decoration-foreground/30 cursor-help text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint rounded" />}>
  {row.label}
</TooltipTrigger>
```
Same fix applies to any info-tooltip pattern used on /trade.

---

### F16 — [P1] `WelcomeModal` fires `setTimeout(400ms)` on every load, every page
**File:** `src/components/onboarding/welcome-modal.tsx:27-37`, `layout.tsx:142`

`WelcomeModal` is rendered in the root layout, so it mounts on every page. It uses `useLocalStorage` to persist `seen`, but the localStorage read happens client-side, so during hydration `seen` is `false` and the 400 ms timer starts on every page. For users who have *not* dismissed it, it pops up on the disclaimer page, the blog, anywhere. This is technically correct for first visit — but the modal is a landing-only onboarding.

**Fix:** move `<WelcomeModal />` out of root layout and into `src/app/page.tsx` only, so the localStorage check and timer aren't on every route.

---

### F17 — [P1] `TopNav` uses `m.span` animated underline in a sticky header — extra hydration work
**File:** `src/components/nav/top-nav.tsx:51-61`

The nav is `"use client"` because of the Sheet dialog. Fine. But it also uses `m.span` with `initial={scaleX:0}`/`animate={scaleX:1}` for the active-link underline — animating on every mount. This is invisible to the user (the underline is barely visible anyway) but runs per-navigation. Replace with a pure CSS transition on the `.active` state.

---

## Motion

### F18 — [P1] `LazyMotion` uses `domAnimation`, not `domMax` — fine, but scroll primitives still bundle `useScroll` and `useTransform`
**File:** `src/components/motion/lazy-motion-provider.tsx:11`

`LazyMotion features={domAnimation}` is the leaner set (excludes `drag`, `layout`). Good. But `useScroll`, `useSpring`, `useTransform`, `useMotionValue` are still imported directly in `farm-section.tsx:9`, `thesis-sequence.tsx:6`, `scroll-progress.tsx:3`, `count-up.tsx:4`, `tilt-card.tsx:4`. These are fine — hooks are tree-shaken. But they force every section to be a client component (see F2).

No direct `framer-motion` imports — all `motion/react`. Good.

---

### F19 — [P1] `useMotionOk` returns `false` on SSR → every motion-gated UI flashes "static" for ~1 frame
**File:** `src/hooks/use-motion-ok.ts:14-40`

```ts
const [motionOk, setMotionOk] = useState(false);
useEffect(() => { ... setMotionOk(!osReduced && !appReduced); }, []);
```

This means `<ThesisSequence>` renders `<StaticSequence>` on SSR, hydrates, then flips to `<AnimatedSequence>` — a layout swap. Ditto `<TractionStrip>` (static stack → marquee) and `<LandingFarm>` (static radial → parallax). Actual measured CLS was 0.0001 on landing because the hero doesn't suffer from this, but downstream sections do — worth measuring with DevTools Perf on mobile 4G.

**Fix:** persist the last-known motion preference in a cookie read by a server component, or use `useSyncExternalStore` + server snapshot to return a stable value. Or — more pragmatic — render the animated DOM and use a `.reduce-motion` class on `<html>` (set via inline script in `<head>` before React mounts) to *disable* animations via CSS. No React re-render, no flash.

```html
<!-- In <head>, inline -->
<script>
  (function(){
    var r = matchMedia('(prefers-reduced-motion: reduce)').matches ||
            localStorage.getItem('shift:reducedMotion') === 'true';
    if (r) document.documentElement.classList.add('reduce-motion');
  })();
</script>
```
Then guard animations in CSS with `html:not(.reduce-motion) .foo { animation: ... }`.

---

### F20 — [P1] `ThesisSequence` uses `height: 300vh` for sticky scroll — thrashes mobile scroll performance
**File:** `src/components/landing/thesis-sequence.tsx:174-204`

The sticky technique creates a 300vh outer wrapper with a 60vh sticky inner, backed by `useScroll` + 3 sets of `useTransform`. On iOS Safari this forces a big compositing region and the parallax stutters on real devices. Compounds with `<TiltCard>` nested *inside* Beat3 — nested `useSpring` inside a scroll-observed sticky section.

**Fix:**
- Drop `<TiltCard>` inside Beat3's token grid during animated sequence (only the main beats need motion).
- Consider CSS `@scroll-timeline` / view-timeline (now shipped in Chrome/Edge/Safari Tech Preview) instead of JS `useTransform` — it runs on the compositor.
- At minimum, add `will-change: opacity, transform` ONLY while the section is visible (use `IntersectionObserver` to toggle it), currently it's permanent via motion.

---

### F21 — [P1] `shift-orbit-1..5` and `shift-chip-orbit-0..4` are always-running animations
**File:** `src/app/globals.css:155-219`, `src/components/landing/farm-section.tsx:90-135`

10 infinite animations with `rotate` from 12s to 60s, running even when the farm section is off-screen. Combined with `will-change` and `transform` they keep the GPU warm indefinitely. On laptops that's wasted battery; on mobile it's active jank.

**Fix:**
```css
.shift-orbit-1 { animation: shift-orbit-1 60s linear infinite; animation-play-state: paused; }
.farm-in-view .shift-orbit-1 { animation-play-state: running; }
```
And toggle `.farm-in-view` via IntersectionObserver at section level.

---

### F22 — [P2] `RouteProgress` fires 700 ms timer on every route change, even same-URL re-renders
**File:** `src/components/motion/route-progress.tsx:19-24`

`usePathname()` re-triggers on every render where `pathname` string identity changes, which in Next 16 is stable — but the `setKey`/`setVisible` pair means a real route change shows a top bar for 700 ms. Combined with Next.js 16's native `@view-transition { navigation: auto }` (globals.css:132) you now have **two** competing transition systems: view-transitions fade the root AND a mint bar sweeps. Pick one.

**Fix:** delete `RouteProgress` — view-transitions already signal navigation. Or keep RouteProgress and disable the root view-transition.

---

### F23 — [P1] `@view-transition { navigation: auto }` ships but no route-specific named transitions exist for the home page → everything fades fully
**File:** `src/app/globals.css:132-141`

Blog posts have shared-element morphs via `viewTransitionName: blog-title-${slug}` (good!). But the landing page → `/markets` transition is just a 200 ms fade because no shared asset names exist on the home. This is a **polish opportunity**: the token tiles in `WhyShift` and the market cards on `/markets` use the same asset images. Add `viewTransitionName: asset-${ticker}` on both sides and the tokens will morph across the navigation. The CSS already reserves `::view-transition-old(asset-*)` (globals.css:140-141) but no component emits those names.

---

## Accessibility

### F24 — [P0] No skip-to-content link
**File:** `src/app/layout.tsx:132-148`

Keyboard users landing on the page must tab through TopNav (8 links + Launch App + hamburger) before reaching content. WCAG 2.4.1.

**Fix:**
```tsx
<body className="min-h-screen flex flex-col">
  <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-mint focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded">
    Skip to content
  </a>
  <LazyMotionProvider>
    ...
    <main id="main" className="flex-1">{children}</main>
```

---

### F25 — [P1] Heading hierarchy skips on landing (h1 → h3 → h3 → h2)
**Live measured.** DOM sequence:
1. `<h1>Wall Street For Crypto.`
2. `<h3>The capital and conviction behind SHIFT.` (Partners)
3. `<h3>Plugged into where capital already flows.` (Partners)
4. `<h2>Two broken extremes…` (WhyShift)

Partners section sits between hero and WhyShift but uses `<h3>` — skipping `<h2>`. Same skip happens in BlogFeatured → Connect where the blog post titles are `<h3>` but the section header is `<h2>` (correct). The hero-to-partners skip is the violation.

**Fix:** Either demote WhyShift to `<h3>` and use `<h2>` for every section header uniformly, OR promote Partners eyebrow-heading to `<h2>` (line 48 of partners.tsx). The more scalable answer: lock the section-title tag at `<h2>` and card titles at `<h3>`.

---

### F26 — [P1] Tooltip triggers + decorative buttons lack focus rings
**Live measured:** 33 of 40 sampled `<a>`/`<button>` elements on the landing have no `focus-visible:` classes. TopNav and Footer handle focus explicitly (good), but section-level CTAs like:
- `src/components/landing/hero.tsx:53-66` — "Launch App" / "How it works" have no `focus-visible:ring-*`
- `src/components/landing/farm-section.tsx:70-77` — "Join the rewards program"
- `src/components/landing/connect-section.tsx:169-176` — "Connect wallet"

...rely on browser defaults (usually blue rings on non-mint brand). On a dark mint palette the default ring is nearly invisible.

**Fix:** add a global base layer rule:
```css
@layer base {
  a:focus-visible, button:focus-visible {
    outline: 2px solid var(--mint);
    outline-offset: 2px;
    border-radius: 4px;
  }
}
```
Then remove per-component `focus-visible:ring-*` duplication.

---

### F27 — [P2] Images in BlogFeatured have `alt=""` — correct when decorative, but `getThumbnail` is the primary visual
**File:** `src/components/landing/blog-featured.tsx:67`

The alt is empty but the image *is* the visual hook. If it's meaningful content, `alt={post.title}` is better for SEO/screen readers.

Inconsistent with blog/page.tsx:143 which uses `alt={post.title}`. Pick one behavior.

---

### F28 — [P2] `aria-current="page"` on TopNav links — good, but the mint underline pseudo-state isn't communicated to the active button in the mobile sheet
**File:** `src/components/nav/top-nav.tsx:102`

Mobile Sheet correctly sets `aria-current` but visually the active state uses `bg-mint/10 text-mint` — legible. No bug here; the desktop underline (lines 51-61) doesn't announce state change either but `aria-current` carries it. Keep.

---

## Images & media

### F29 — [P1] Hero has no `priority` image and no LCP image — but LCP is H1 text. That's fine *today*. Worth locking down.
**Files:** hero.tsx, layout.tsx

Landing LCP = H1 (`"Wall Street For Crypto."`). No image is tagged `priority`. Good — because adding one now would regress LCP. However, the team cards (team-section.tsx:63) and token tiles (why-shift.tsx:102) load eagerly without `sizes` or `loading="lazy"`. Some of these are above-the-fold on long laptops.

**Fix per team-section.tsx:62-69 and why-shift.tsx:97-109:**
```tsx
<Image ... sizes="(min-width: 1024px) 200px, (min-width: 640px) 33vw, 50vw" loading="lazy" />
```
Not adding `sizes` means Next emits a 3840w srcset for small cards (measured: `w=3840` in URL for 68×68 news images). Waste.

Example: live measurement showed `news-1.png?w=3840` requested for an element rendered at 68×68 px. That's 50× oversized.

---

### F30 — [P1] Farm section uses raw `<img>` for the SHIFT mark — bypasses Next Image optimization
**File:** `src/components/landing/farm-section.tsx:111-112`

```tsx
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src="/brand/shift-mark-white.png" alt="SHIFT" className="w-3/5 h-auto opacity-95 drop-shadow-2xl" />
```
ESLint is explicitly silenced. This ships a non-optimized PNG at full resolution. No obvious reason this needs to be a bare `<img>`.

**Fix:** use `<Image>` with explicit width/height or fill. If there's a reason (the drop-shadow clipping or fill animation), document it; otherwise fix.

---

### F31 — [P1] `dangerouslyAllowSVG: true` in next.config with a wildcard remote pattern
**File:** `next.config.ts:6-13`

```ts
images: {
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  remotePatterns: [
    { protocol: "https", hostname: "**.yimg.com" },
    { protocol: "https", hostname: "s.yimg.com" },
    { protocol: "https", hostname: "media.zenfs.com" },
    { protocol: "https", hostname: "**" },   // ← wildcard
  ],
}
```
`hostname: "**"` is a blanket allow — any remote image via `next/image`. Combined with SVG-allowed, this is a minor security/abuse vector (attackers who can influence image URLs can embed SVG payloads). The CSP header mitigates script execution inside the SVG, but still — wildcard hostnames are almost never intentional.

**Fix:** enumerate expected remote image hosts explicitly. If the site serves only local images and the YAhoo-ish hostnames are legacy, remove them entirely.

---

## SEO / metadata

### F32 — [P2] `metadataBase` is set, canonicals mostly present, but OG images are per-route only on layout + blog post. Missing per-route OG for /team, /learn, /markets.
**Files:** `src/app/layout.tsx:80-88`, `src/app/blog/page.tsx:17-22`, `src/app/blog/[slug]/page.tsx:19-37`

Blog handles OG correctly (per-post URL canonical + per-post OG override). Landing OG uses `/opengraph-image` (good, dynamic). But `/team`, `/markets`, `/learn`, `/rewards`, `/portfolio` inherit the site-wide default OG — every share looks the same.

**Fix:** add `generateMetadata` or `metadata` exports to those pages with their own `openGraph.images` referencing `/<route>/opengraph-image`. Next 16 supports per-route `opengraph-image.tsx`.

---

## Summary matrix

| # | Severity | Area | Fix effort |
|---|---|---|---|
| F1 | P0 | Wallet stack on landing | L — route groups refactor |
| F2 | P1 | Unnecessary client components | M — remove `"use client"` from 7 files |
| F3 | P1 | No code splitting | S — 3 `next/dynamic` calls |
| F4 | P1 | Unused type scale | M — introduce utilities, refactor callsites |
| F5 | P1 | 67 hardcoded hexes | M — grep + replace, add gradient utility |
| F6 | P1 | Hardcoded glow shadows | S — 3 shadow tokens |
| F7 | P2 | Broken `--font-mono` | XS — 1 line |
| F8 | P2 | Dead `@fontsource` dep | XS — `pnpm remove` |
| F9 | P2 | Font weight overload | S — drop weight 300, audit mono |
| F10 | P2 | Radius scale underused | S |
| F11 | P1 | God-component WhyShift | M — split |
| F12 | P2 | `<Card>` unused | M — adopt or delete |
| F13 | P2 | TractionStrip duplicated children | XS |
| F14 | P1 | ComparisonTable re-implements stagger | S |
| F15 | P0 | Tooltip triggers not keyboardable | S |
| F16 | P1 | WelcomeModal on every page | XS |
| F17 | P1 | Animated underline in sticky nav | XS |
| F18 | P1 | Scroll primitives bundled per-section | M |
| F19 | P1 | `useMotionOk` SSR-false causes flash | M |
| F20 | P1 | ThesisSequence 300vh sticky jank | M |
| F21 | P1 | Farm orbits always running | S |
| F22 | P2 | RouteProgress vs view-transitions | XS — pick one |
| F23 | P1 | Unused named view-transitions | S — polish opportunity |
| F24 | P0 | No skip link | XS |
| F25 | P1 | Heading hierarchy skip | XS |
| F26 | P1 | Missing focus rings | S — base layer rule |
| F27 | P2 | Inconsistent blog image alt | XS |
| F28 | P2 | Mobile nav aria — OK, note only | — |
| F29 | P1 | Images without `sizes` — 3840w for 68px | S |
| F30 | P1 | Raw `<img>` in Farm | XS |
| F31 | P1 | Wildcard remote image hostname | XS |
| F32 | P2 | OG not per-route | M |

---

## The 10 things to do this week, ordered by ROI

1. **F1** — Route-group the app. Kill 450 KB gzip off the landing page.
2. **F5** — Replace arbitrary hex classes. One grep-replace PR — makes tokens real.
3. **F4** — Wire the type scale to Tailwind `@theme`. Refactor hero/H2s to consume it.
4. **F24** — Add a skip link.
5. **F2** — Remove `"use client"` from the 7 section components that don't need it.
6. **F26** — Add a global `:focus-visible` mint ring in base layer.
7. **F15** — Make tooltip triggers `<button>`s so the comparison-table explanations are keyboardable.
8. **F29** — Add `sizes` to every `<Image>` on the landing. Stop serving 3840w images to 68px slots.
9. **F16** — Move WelcomeModal to page.tsx only.
10. **F21** — Pause `.shift-orbit-*` animations when the Farm section is off-screen.

Budget: roughly 2-3 days of focused work by one engineer to close all P0s and the top P1s. Result: a landing that loads ~2.5× faster on mobile, passes WCAG AA, and actually uses the design system it advertises.
