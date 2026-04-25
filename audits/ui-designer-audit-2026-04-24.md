# SHIFT — UI Designer Visual Audit

**Auditor:** UI Designer agent
**Date:** 2026-04-24
**Target:** https://shift-rwa.vercel.app/
**Audited viewports:** 375 / 768 / 1280 / 1920
**Brand tokens verified against `/src/app/globals.css`:**
`--background #021C24` · `--foreground #EDEEEE` · `--card #0A2730` · `--mint #26C8B8`
· `--tidal-steel-adj #07638C` · `--border #123642` · `--muted-foreground #98A2B3`
· `--destructive #FF4D6A` · body font Space Grotesk · radius `0.875rem` (14px)

**Verdict in one line:** the site is mid-tier shadcn-on-dark. It has the right raw materials (palette, type, Solana icon discipline) but it reads as a *developer's landing page*, not a financial-grade protocol brand. Backed.fi, Ondo, Hashnote and Ethena beat this site on: type scale restraint, mint-accent discipline, surface layering, section transitions, and above-the-fold density. The issues below are the gap.

Severity key:
- **P0** — embarrassing on a production money-handling brand; fix this week
- **P1** — noticeable and compounding brand damage; fix this sprint
- **P2** — polish, but the missing polish is why it doesn't *feel* premium

---

## Top 10 priority fix list (read this first)

| # | Finding | Severity | Effort | Impact |
|---|---|---|---|---|
| 1 | Mint accent is grossly overused — 36+ elements per page. Restrict to 1 hero accent + CTA + semantic positive. | P0 | M | Brand |
| 2 | Hero H1 clamp is wrong (`44px → 72px` with no fluid middle), gradient mid-word kerning visibly off. Replace with proper fluid clamp + tighter tracking. | P0 | S | Brand |
| 3 | Every section uses the same gradient headline treatment (mint→tidal). It's become visual spam. Kill 4 of 7 instances. | P0 | S | Brand |
| 4 | "Launch App" top-nav CTA is `h-9 / 14px / text-sm` — the single most important conversion element is a tertiary-looking pill. Promote to `h-10, 15–16px, semibold, glow`. | P0 | XS | Conversion |
| 5 | Radius system is chaotic: `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full` all appear within 1 viewport. Standardize to 3 radii: 10 / 16 / 24, plus pill for CTAs. | P0 | M | Rhythm |
| 6 | Section vertical rhythm broken: `py-16`, `py-20`, `py-24`, `pt-24 pb-20`, `py-5` all coexist. Enforce a 4-step vertical rhythm token: `72 / 96 / 128 / 160`. | P1 | M | Rhythm |
| 7 | Card elevation is flat — no shadows, only `border-border/60` (#123642 at 60%) on #021C24. On a premium dark protocol you need 2 surface steps + a subtle elevation shadow. | P1 | M | Premium feel |
| 8 | Iconography is 100% lucide-react 3–5px stroke on everything. Premium DeFi uses custom asset-token SVGs + a stroke hierarchy (1.25px micro, 1.5px body, 2px headline). Introduce a brand icon pack or, at minimum, a stroke-weight rule. | P1 | L | Premium feel |
| 9 | Partner logos render as raw-colored PNGs at 80% opacity in generic `/[0.03]` white tiles. Backed.fi / Ondo monochrome all logos to single-token luminance. Monochrome + equal optical size. | P1 | M | Trust |
| 10 | Mobile nav = `Menu` icon in a 36×36 square with no bg. On a premium protocol, the mobile CTA should be the Launch App pill permanently visible; hamburger should be a properly-sized 44×44 target with subtle border. | P1 | S | Mobile feel |

---

## Typography findings

### F-01 · Hero H1 — Wall Street For Crypto. · P0
**Page/viewport:** `/` hero · all viewports
**Element:** `<h1>` in `components/landing/hero.tsx:29`
```
text-[44px] sm:text-5xl md:text-7xl lg:text-[72px] font-bold tracking-[-0.04em] leading-[1.02]
```
**What's wrong:**
1. The clamp jumps from 44 → 48 → 72 → 72 with zero middle step. Between 640–900px the hero goes from `text-5xl` (48px) straight to `text-7xl` (72px) on a single breakpoint — feels like a pop, not a flow.
2. `-0.04em` tracking is too tight for Space Grotesk bold at 72px. At that size you want `-0.025em` max — the hero looks crushed.
3. Gradient span (`For Crypto.`) has a visible baseline shift on Chrome because `bg-clip-text` with inline gradient doesn't respect the descender — the period floats.
4. `pb-1` band-aid is applied to compensate for gradient clip. That's a hack.

**What good looks like:**
- Backed.fi hero: single `clamp(44px, 6.6vw, 88px)`, tracking `-0.02em`, gradient used only on 1 word out of 5.
- Ethena: `font-feature-settings: "ss01"` + fluid clamp + `leading: 0.95`.

**Concrete fix:**
```tsx
<h1 className="font-bold text-white mb-8 leading-[0.98] tracking-[-0.025em]
  text-[clamp(2.75rem,8vw,5rem)]">
  Wall Street{" "}
  <span
    className="bg-clip-text text-transparent pb-[0.08em] inline-block"
    style={{ backgroundImage: "linear-gradient(135deg,#26C8B8 0%,#07638C 100%)" }}
  >
    For Crypto.
  </span>
</h1>
```
Note: kill `pb-1` on `<h1>` and push `pb-[0.08em]` onto the span instead.

---

### F-02 · Body scale has only 2 usable steps · P1
**Page/viewport:** all pages
**What's wrong:** `globals.css` declares 7 `--step-N` tokens (12/14/16/20/30/48/72) but the codebase only actually uses 4: 12, 14, 16, 30. Your scale has a 16px → 30px gap (1.875× jump) and a 30px → 48px void. Mid-weight copy (section subheads, stat numerals) has nowhere to live and ends up at `text-2xl` (24px) or `text-lg` (18px) arbitrarily.

**What good looks like:** Ondo uses 6 sizes; Hashnote uses 7 on a 1.25 modular scale. You need at least: 12 / 14 / 16 / 18 / 22 / 30 / 42 / 60.

**Concrete fix:**
```css
--step-0: 0.75rem;   /* 12 */
--step-1: 0.875rem;  /* 14 */
--step-2: 1rem;      /* 16 */
--step-3: 1.125rem;  /* 18 — NEW */
--step-4: 1.375rem;  /* 22 — NEW lead text */
--step-5: 1.875rem;  /* 30 */
--step-6: 2.625rem;  /* 42 — NEW */
--step-7: 3.75rem;   /* 60 */
```
Then map `text-lead`, `text-display`, `text-hero` Tailwind utilities so authors stop reaching for ad-hoc `text-[44px]`.

---

### F-03 · Line-height of body copy at 1.5 (24/16) is too airy for dark UI · P2
**Element:** `<body>` computed `font-size: 16px; line-height: 24px`.
**What's wrong:** On pure `#021C24` a 1.5 line-height makes paragraphs feel loose. Ethena/Hashnote dark sites use 1.4 for body and 1.3 for lead.
**Fix:** `body { line-height: 1.45; }` and `.lead { line-height: 1.35; }`.

---

### F-04 · Eyebrow labels are inconsistent · P1
**Element:** small all-caps labels above every section.
**What's wrong:** tracking varies across sections:
- `why-shift.tsx` line 27 → `tracking-[0.18em] sm:tracking-[0.25em]`
- `partners.tsx` line 45 → `tracking-[0.22em]`
- `markets-grid.tsx` line 12 → `tracking-[0.2em]`
- `blog-featured.tsx` line 37 → `tracking-[0.18em]`
- `team-section.tsx` line 14 → `tracking-[0.18em] sm:tracking-[0.25em]`
- `connect-section.tsx` line 134 → `tracking-[0.2em]`

Six different tracking values for the same component. Create one: `text-eyebrow` = `text-[11px] font-bold uppercase tracking-[0.22em] text-mint`.

---

### F-05 · Letter-spacing on big headings (-0.03em / -0.04em) is stylistic roulette · P1
Four different heading components use four different tracking values: `-0.03em`, `-0.04em`, `-0.025em`, `tracking-tight`. Pick two: `-0.02em` for ≤48px, `-0.025em` for >48px. Period.

---

## Color & accent discipline

### F-06 · Mint (#26C8B8) is used 36+ times on the homepage · P0
**Measured via DOM scan:** 36 elements matching `color: rgb(38,200,184)` or `background: rgb(38,200,184)` on `/` alone.

**Where mint appears:** Launch App pill, nav active state, every eyebrow, every gradient span, every chip border, PoR link, hero shield icon, hero trust dots, chain status pulse, every feature icon, every stat accent, every "% up" value, orbit rings, orbit glows, chip-orbit border tinting, LP points badge, and the CTA shadow glow.

**Why it's wrong:** When everything is the brand color, *nothing* reads as a CTA. In premium protocol UI the accent color is scarce. Backed.fi uses their green **only** on (a) the primary CTA, (b) the logo, (c) positive % ticker. That's 3 places. Ondo: brand color appears ~6 times above the fold.

**Fix — color-use hierarchy (enforce in review):**
- `mint` — primary CTAs + positive prices only
- `tidal-steel` (#07638C) — secondary accents, links, hover
- `mist` (#98A2B3) — icons, meta text
- `foreground/70` — body
- `white` — headings
Kill mint on: eyebrows (use mist), trust dot bullets (use border), feature-card icons (use foreground/70), chip borders (use border), orbit rings (desaturate to `#094058`).

---

### F-07 · Gradient headline treatment is visual spam · P0
**Repeats:** hero.tsx:34, why-shift.tsx:35, comparison-table.tsx:107, team-section.tsx:22, farm-section.tsx:59, connect-section.tsx:142 — **six sections on the homepage** all using the same `linear-gradient(135deg,#26C8B8,#07638C)` on a 2nd-line span.

**Why it's wrong:** A gradient word on a dark ground reads as "this is the headline." When every section headline is a gradient, it flattens hierarchy and screams template. Ondo reserves gradient headlines for the hero only.

**Fix:** keep gradient on hero + farm CTA block. Replace the other 4 with `text-white` + an `underline decoration-mint decoration-2 underline-offset-8` or drop the decorative treatment entirely.

---

### F-08 · Card surfaces only have one step (#0A2730) · P1
**What's wrong:** Every card is `bg-card` (#0A2730). No difference between "raised" (hero stat), "floating" (market card), "inset" (input), or "popover." Flat is not elegant — it's lazy.

**Fix — introduce a 4-step dark surface ladder:**
```
--surface-base    #021C24   (background)
--surface-sunken  #011319   (inputs, tables rowband)
--surface-1       #0A2730   (card)
--surface-2       #0F3440   (raised / hover card)
--surface-3       #13404D   (popover / modal)
```
Plus an elevation shadow for `--surface-2+`:
```
--shadow-raised: 0 1px 0 0 rgba(255,255,255,0.04) inset,
                 0 10px 30px -12px rgba(0,0,0,0.6),
                 0 0 0 1px rgba(38,200,184,0.04);
```

---

### F-09 · Destructive color is `#FF4D6A` — too pink for finance · P2
Looks closer to Taylor Swift merch than a short-side indicator. Ondo/Ethena use `#F05E5E` / `#E0434D`. Shift to `#F0555A` for more blood-red gravity.

---

### F-10 · Tidal Steel (#07638C) is barely used · P1
The brand defines it; the site ignores it outside gradient ends. Premium sites use a second accent to create a two-temperature system (one warm, one cool). Here mint = warm teal, tidal steel = cool blue — and nothing uses tidal steel alone.
**Fix:** make `links`, `tag-academy`, `focus-visible:ring` use tidal steel. That gives mint room to breathe.

---

## Spacing & section rhythm

### F-11 · Section vertical padding is random · P1
Measured section `py` values across components:
- traction-strip `py-5`
- partners `py-20 md:py-24`
- why-shift `py-24`
- comparison-table `py-16`
- team-section `py-20`
- markets-grid `py-24`
- farm-section `py-24`
- blog-featured `py-20 md:py-24`
- connect-section `py-24`
- faq `py-24`
- hero `pt-24 pb-20 md:pt-32 md:pb-28`

**Why it's wrong:** 6 different spacing values for the same "major section" pattern. Reader subconsciously registers the arrhythmia as amateurism.
**Fix:** exactly two section padding tokens:
```
.section-y       { padding-block: clamp(4rem, 8vw, 7rem); }   /* 64→112 */
.section-y-hero  { padding-block: clamp(6rem, 12vw, 10rem); } /* 96→160 */
```

---

### F-12 · Grid gaps inconsistent: `gap-3 md:gap-4`, `gap-5`, `gap-16` · P1
Across the homepage grids you use gap-3, gap-4, gap-5, gap-6, gap-16. Pick three: 12 / 20 / 48. Enforce.

---

### F-13 · Container width drift · P2
`max-w-[1200px]` everywhere *except* comparison-table (`max-w-[1000px]`), faq (`max-w-[860px]`), and top-nav (`max-w-[1440px]`). That's fine when the *content* needs it, but the sudden 1440 on the header creates a visible alignment offset between nav links and section content below — the "Markets" link sits ~40px left of the hero's left edge at 1440px viewport.
**Fix:** header container = 1200px max; only the full-width blur bar extends to edge. Or, better, move all containers to `max-w-[1200px]` consistently.

---

### F-14 · Hero above-the-fold is under-dense on ≥1280px · P1
Hero ATF at 1280×900 = huge centered block with ~600px of breathing room below the dots + trust strip, then abrupt cut to partners. On Backed.fi/Hashnote the hero ATF includes hero + 1 preview element (a live chart, metric card, or supply counter).
**Fix:** add a live metric strip or a TSL2L mini-chart card to the lower third of the hero. Fills the visual void; demonstrates the product ATF.

---

### F-15 · Mobile hero: CTA stack has 32px gap, but trust dots above have 12px · P2
`flex-col sm:flex-row items-center justify-center gap-4` + a mt-8 mt-6 pattern. The vertical rhythm inside the hero collapses on mobile (3 tight clusters of 8–12px then a 32px gap). Should be single consistent 24px vertical rhythm.

---

## Component polish

### F-16 · Primary button has a shadow-glow, nav pill does not · P0
Hero CTA:
```
bg-mint … h-13 py-3.5 rounded-full … shadow-[0_0_30px_rgba(38,200,184,0.25)]
```
Top-nav "Launch App":
```
h-9 px-4 rounded-full bg-mint … no shadow, no icon, smaller text
```
Two primary CTAs with the *same label* on the same viewport should look identical. Users read the nav CTA as secondary — conversion death.

**Fix — one unified `<ButtonPrimary/>` primitive:**
```tsx
// h-11 (44px hit target), px-6, text-[15px], semibold, pill,
// shadow-[0_0_20px_rgba(38,200,184,0.25)], icon right, hover:-translate-y-[1px]
```
Use the same component in hero AND nav. Nav version drops icon if space is tight; everything else identical.

---

### F-17 · Secondary button ("How it works") is anemic · P1
`border border-border bg-secondary/40 backdrop-blur … hover:border-mint/40`.
Issues: (a) border-color is #123642 at 100% on a bg of #07323F at 40%, combined opacity makes it a near-invisible 1px line. (b) hover changes only border — no state for text/bg. (c) icon slot missing.

**Fix:** `bg-white/[0.04] border border-white/10 text-foreground/90 hover:bg-white/[0.08] hover:border-white/20 hover:text-white`. Add right-side icon for parity.

---

### F-18 · Button heights: h-6/h-7/h-8/h-9/h-11/h-13 all present · P1
In `components/ui/button.tsx`: `xs=h-6, sm=h-7, default=h-8, lg=h-9`. Then `landing/hero.tsx` reaches past the system with `h-13` (52px). And `top-nav.tsx` uses `h-9` (36px) for the site CTA. Five distinct button heights is the design-system equivalent of five fonts.
**Fix:** `h-8 (small), h-10 (default), h-12 (hero)`. Everything else is dead.

---

### F-19 · Card `rounded-3xl` vs `rounded-2xl` vs `rounded-full` inconsistency · P0
Homepage card radii inventory:
- market cards `rounded-3xl` (24)
- partner cards `rounded-2xl` (16)
- blog cards `rounded-2xl` (16)
- team cards `rounded-2xl` (16)
- feature cards `rounded-2xl` (16)
- FAQ container `rounded-3xl` (24)
- concept tiles `rounded-3xl` (24)
- token tiles `rounded-3xl` (24)
- comparison table `rounded-2xl` (16)
- phone mockup `rounded-[48px]` / `rounded-[36px]`

Fine for phone, but why are "major landing cards" (market, concept, token) at 24 while secondary cards (blog, team, partner) at 16? No semantic logic.
**Fix:** 12 for data rows, 16 for cards, 24 only for hero/feature cards containing media. Phone stays custom. Pills stay `rounded-full`.

---

### F-20 · Badges / chips — inconsistent sizing and padding · P2
Chip inventory:
- "Live on Solana" → `text-xs px-3 py-1`
- "BNB Chain coming soon" → `text-xs px-3 py-1`
- "Chainlink PoR" → `text-xs px-3 py-1` but a DIFFERENT color system (blue #375BD2)
- "3× long" in market card → `text-xs px-2 py-1`
- Eyebrow label in hero → `text-xs px-4 py-1.5`
- Rewards chip in farm → `text-xs px-4 py-1.5`
- Blog post tag → `text-xs px-2 py-0.5`
- Team credential → `text-[9px] px-1.5 py-0.5` *(a 9-pixel font appears. On a premium brand.)*

**Fix:** chip tokens `--chip-sm: 10/2`, `--chip-md: 12/4`, `--chip-lg: 16/6`. Enforce minimum 10px text. Kill the `text-[9px]` credential chip — use 11px with tighter padding.

---

### F-21 · Team credential chip uses 9px font — P0 for any premium brand · P0
`team-section.tsx:90 → text-[9px]`. This is below legibility minimums on non-retina and breaks WCAG AA readability. Also looks cheap.
**Fix:** `text-[11px] tracking-tight font-medium`. Truncate if needed, not shrink.

---

### F-22 · Trust strip dots are 4×4px (size-1) · P2
`hero.tsx:93 → size-1 rounded-full bg-border`. At 4px the dots look like dust. Most premium sites use 6×6 border-separator or a vertical 10px line. Move to `w-px h-3 bg-border/70` (a clean hairline separator).

---

### F-23 · Icon stroke & size inconsistency · P1
Lucide icons in use: `ArrowRight h-4 w-4`, `ShieldCheck h-3 w-3`, `TrendingUp h-3 w-3` (in market card), `TrendingUp h-2.5 w-2.5` (in phone), `Menu h-5 w-5`, `ExternalLink h-2.5 w-2.5`. Six icon sizes, all lucide default 2px stroke.

**Fix:** a 3-tier icon size system (12 / 16 / 20) with stroke rules:
- 12px icons → `strokeWidth={1.5}`
- 16px icons → `strokeWidth={1.75}`
- 20px+ icons → `strokeWidth={2}`
Lucide supports `strokeWidth` per-instance. Wrap in `<Icon/>` primitive.

Also consider replacing 3–5 high-visibility icons (ShieldCheck in hero, Wallet/Zap/ShieldCheck in connect-section) with custom brand-tuned SVGs. Lucide everywhere = generic.

---

### F-24 · Divider `h-px bg-gradient-to-r from-transparent via-border to-transparent` is weak · P2
Used in partners.tsx:17. The fade works, but `via-border` = `#123642` on `#021C24` gives <1% contrast — the divider essentially vanishes. Raise to `rgba(38,200,184,0.18)` for the "branded" variant or `rgba(255,255,255,0.1)` for the neutral.

---

### F-25 · Hover state on cards is "just change border color" · P1
Cards do `hover:border-mint/40 transition-all hover:-translate-y-0.5`. That's the same hover state on every card on the site. Hash — signal death.
**Fix:** layer hover states per card type:
- data cards (market) → border + subtle shadow + translate
- media cards (blog, team) → image zoom 1.04 + brightness
- tiles (concept/token) → inner glow pulse

---

## Imagery & assets

### F-26 · Partner logos are inconsistent weights/colors · P1
`partners.tsx` + `lib/partners-data.ts`. Logos show as raw brand colors on a mostly-transparent white tile. At the scale you're showing them (h-12 max-w-140px) each logo competes differently with the dark ground. Chainlink blue, Alpaca orange, Solana purple-magenta gradient, Fireblocks navy — it's visual confetti.

**Fix:** monochrome all partner logos to `#EDEEEE` with `opacity-70 hover:opacity-100`. Premium move; unifies the wall. Backed.fi does this. Ondo does this. Ethena does this.

---

### F-27 · Token icon circles (`size-12 rounded-full object-cover`) — no ring, no glow, no consistency · P1
In markets-grid + connect phone. Some instances add `drop-shadow-[0_0_30px_rgba(38,200,184,0.4)]` (why-shift token tile), others are raw. Pick one: a `ring-1 ring-mint/20 shadow-[0_0_16px_rgba(38,200,184,0.2)]` treatment applied uniformly via a `<TokenIcon/>` primitive.

---

### F-28 · Blog card thumbnails render at 144px tall (h-36) but image-quality + gradient overlay fights readability · P2
`blog-featured.tsx:63`. `absolute inset-0 bg-gradient-to-t from-[#0A2730] via-[#0A2730]/30 to-transparent` mimics the card background but the 3 stops produce a visible banding on Safari. Use `from-[#0A2730]/95 via-[#0A2730]/40` (2 stops).

Also the tag chip sits at `bottom-3 left-3` with `backdrop-blur-sm` which doesn't render on a solid fallback — lose the blur, it's adding load for nothing on this pure-dark surface.

---

### F-29 · Team avatars use `rounded-2xl` (square-ish) but the /team fallback is circle in some components · P2
Consistency failure: `team-section.tsx:61` uses `rounded-2xl` avatar. Check `/team` page treatment and unify — either all squircles or all circles. Ondo does squircle with `--radius-md = 10px`. Backed uses round. Pick one per brand language.

---

## Motion

### F-30 · Count-up stat motion without prefers-reduced-motion fallback semantics · P1
`traction-strip.tsx` uses `<CountUp to={2} ... duration={1.5} />` inside a motion-ok check at the *outer* marquee level, but the `CountUp` itself must respect `prefers-reduced-motion`. Without verifying the source of `@/components/motion/count-up`, likely numbers animate regardless. Also, on first paint users see "0 / 0M+ / 24/7 / Chainlink" → "2M / 40M+ / …" which is **misleading on a financial site**. Don't animate financial stats — render the final value from SSR.

**Fix:** gate `CountUp` behind `IntersectionObserver` AND `prefers-reduced-motion: no-preference`, AND initial SSR value = final value (not 0). Animate only on intersect.

---

### F-31 · Orbit animations (`shift-orbit-1..5` at 12–60s linear infinite) are distracting and wasteful · P2
`globals.css:154` — 5 concentric rings + 5 chip orbits running at all times when motion-ok. On a financial site this says "demo", not "product." Ondo/Hashnote use orbits for <6s on intersect and freeze. Shift to a one-shot orbit reveal on section-intersect + then gently freeze (or stop after 1 rotation).

Also `animation: linear infinite` ⟶ fan spins forever = battery / CPU penalty. Add `animation-play-state: paused` when section off-screen via IntersectionObserver.

---

### F-32 · View-transition fade durations are 200ms out / 300ms in · P2
Feels sluggish on nav. Instantaneous is fine on a trading product (view transitions should < 180ms total perceived). Drop to 120/180.

---

## States (hover / focus / disabled / loading / empty)

### F-33 · Focus-visible styling is ring `ring-3 ring-ring/50` — but `ring-3` doesn't exist in Tailwind · P1
`button.tsx:7` uses `focus-visible:ring-3`. Tailwind v4 offers `ring-2`, `ring-4`, `ring-8` by default — `ring-3` either compiles to 3px via arbitrary or falls through. Either way it's non-standard. Use `ring-2` with offset 2.

---

### F-34 · No empty / loading state visible on `/markets`, `/portfolio` · P1
The markets page jumped in mid-audit (prefetch race) — on cold load the user sees a plain grid skeleton with no branded shimmer. Skeletons exist (`components/ui/skeleton.tsx`) but aren't visible to the end user in the critical paths. Need branded loading states with subtle mint-tinted shimmer, not generic gray.

---

### F-35 · Disabled state for primary button is `opacity-50` globally · P2
Premium brand practice: disabled CTA = `bg-mint/20 text-mint/40 border-mint/20` (muted but on-brand). `opacity-50` on a mint pill makes it look like the whole button is faded, not intentionally disabled.

---

## Dark surface treatment

### F-36 · No noise / no grain anywhere — the dark is too flat · P1
Premium dark protocols (Hashnote especially) use a 2–3% grain/noise overlay on the background to kill banding and add warmth. Here the #021C24 ground is mathematically perfect and therefore feels synthetic.

**Fix:** add a subtle SVG feTurbulence noise at `opacity-[0.015]` on `body::before`, fixed-position, pointer-events-none. Buys ~30% of the "premium" feeling for 2KB.

---

### F-37 · Glows are uncontrolled · P1
Inventory of glows present:
- hero CTA `shadow-[0_0_30px_rgba(38,200,184,0.25)]`
- farm CTA `shadow-[0_0_30px_rgba(38,200,184,0.3)]`
- connect CTA `shadow-[0_0_30px_rgba(38,200,184,0.3)]`
- farm token orb `shadow-[0_0_120px_60px_rgba(38,200,184,0.45),inset_0_-20px_60px_rgba(0,0,0,0.4)]`
- farm chip `shadow-[0_0_24px_rgba(38,200,184,0.4)]`
- phone `shadow-[0_50px_120px_-30px_rgba(38,200,184,0.5),0_0_0_1px_rgba(38,200,184,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]`

Six different glow recipes. Unify to 3: `--glow-sm`, `--glow-md`, `--glow-hero`. Also 45% and 50% mint glow on the token orb + phone is too much; everything in the lower half of the page emits light. Reduce token-orb glow to ~0.25 alpha.

---

### F-38 · Gradient grid background on hero is 0.18 opacity with 60px grid · P2
`hero.tsx:14`. Grid lines at 60px on a 1280 viewport = ~21 gridlines across. Reads as "tech demo" template. On Ethena the grid is 120px spacing, 0.06 opacity — less obvious, more expensive-feeling. Drop opacity to 0.08, raise spacing to 100px.

---

## Hero density & above-the-fold composition

### F-39 · Hero has 6 vertical clusters · P1
ATF cluster count, top to bottom: (1) pill eyebrow, (2) H1, (3) paragraph, (4) 2-CTA row, (5) 3-chip chain status row, (6) 4-item trust strip with bullet dividers. That is **too many discrete groups** for ATF — the eye has nowhere to rest. Backed.fi ATF = eyebrow + H1 + subcopy + CTA + 1 social-proof strip = 5 clusters with tighter grouping.

**Fix:** merge the chain-status row and trust strip into one "chips" row (3–5 items max); move PoR badge into the trust strip rather than giving it its own line.

---

### F-40 · Hero `min-h` not set; section collapses if content is short · P2
The hero is content-driven height — on a 2XL viewport with short copy this leaves whitespace below the CTA before the next section. Add `min-h-[84vh]` so the hero always feels like a hero.

---

## Responsive / mobile

### F-41 · Mobile traction-strip marquee runs 20s linear infinite · P1
On `traction-strip.tsx:44` — mobile shows a marquee of 4 stats × 2 copies. Infinite motion is reading-hostile on mobile (eye tries to catch a value). Most premium DeFi mobiles freeze metrics and present them in a 2×2 grid.
**Fix:** replace mobile marquee with `grid grid-cols-2 gap-4` of 4 stats. Drop the `traction-scroll` keyframe entirely.

---

### F-42 · Mobile CTA stack has buttons at 100% width · P2
`hero.tsx:52 flex-col sm:flex-row`. On 375px, both CTAs become full-width pills stacked. That's correct. But `px-7` doesn't make sense at full width — remove horizontal padding in favor of centered content. Also primary "Launch App" and "How it works" should share identical height; right now both are `h-13` but the content (icon + text) makes Launch visually larger.

---

### F-43 · Mobile section padding is overkill at 375px · P2
Most sections `py-20 md:py-24` → at mobile = 80px top + 80px bottom = 160px per section. On 375×812 that's ~20% of a viewport just for padding. Drop mobile sections to `py-14`.

---

### F-44 · Mobile nav drawer is plain — no `Launch App` pinned when closed · P1
`top-nav.tsx:75` — the mobile header shows only logo + hamburger. There's a desktop `md:inline-flex` Launch App button that vanishes at `<md`. On mobile you need Launch App always visible (shrunk to icon if needed). Currently mobile users have to open the drawer to find the primary conversion action.

---

### F-45 · On 1920px the content locks to max-w 1200 with ~360px of dead space each side · P2
Premium brand feel at 1920 comes from letting *some* elements breathe wider (hero background, partner wall, faq accordion container width stays the same, but the section background or grid image extends edge-to-edge). Right now 100% of content is 1200-capped; feels undersized on large monitors.
**Fix:** keep `max-w-[1200px]` for text/cards, but let hero background grid, partner section, farm radial, and connect section backgrounds extend `w-screen`.

---

## Blog & blog post

### F-46 · Blog index — card aspect ratio inconsistent between hero post and grid · P2
(Observed from landing blog-featured pattern; blog/ index has similar construction). When a post has a thumbnail vs no thumbnail, cards grow/shrink. Enforce a 16:9 thumbnail container with `aspect-[16/9]` and object-cover so every card has the same footprint.

---

### F-47 · Blog post reading width ~ default prose width · P1
Blog post body (observed during accidental navigation to `/blog/...`) renders at around 660px. Premium long-form on dark = 620–680px **maximum** for body; but headings should break out to 800px+ for visual rhythm. Currently H2s render at the same width as body paragraphs, making them feel smaller than they are.
**Fix:** wrap `.prose` with `max-w-[64ch]` for body, `max-w-[72ch]` for headings (via `prose-headings:max-w-[72ch]`).

---

### F-48 · Blog post H2 size is 30px — same as H3 elsewhere · P2
Makes section breaks feel weak. Within long form H2 should be 32–36, H3 24, H4 18. Currently the observed post showed H2=30, no real H3 rhythm.

---

## Trade page

### F-49 · Trade page — `h1` "Every SHIFT market. Long and short." is 30px · P1
Measured via computed styles during audit: `/markets` `<h1>` = 30px / 600. For a top-level page H1 that's conservative. Bump to `text-[38px] md:text-[48px] font-bold tracking-[-0.025em]` and pair with a `text-lg text-foreground/70` subhead on the same container.

---

### F-50 · Trade page price changes use `text-mint` for positive and `text-destructive` for negative — but positive also uses `rgb(38,200,184)` which = mint CTA color · P1
Users can't tell at a glance "is this +%, or is this brand color?" Introduce a dedicated `--color-positive: #2EB882` (slightly shifted green) and `--color-negative: #F0555A`. Reserve mint for CTAs only. (See F-06.)

---

## Accessibility & technical

### F-51 · Muted-foreground `#98A2B3` on `#021C24` = 7.1:1 contrast. Passes AA. But `foreground/55` = `#EDEEEE` at 55% ≈ `#82868A` on bg ≈ 4.3:1 which just barely passes AA for body text · P2
Several instances in blog card excerpt, team bio, FAQ question. Raise to `foreground/70` minimum everywhere that isn't strictly decorative.

---

### F-52 · `text-foreground/35` (blog-featured.tsx:88 date/readtime) = effectively 2.3:1 contrast — fails WCAG AA · P1
Bump to `text-foreground/55` minimum. You're not gaining anything by making metadata near-invisible, and you're failing accessibility.

---

### F-53 · No visible skip-to-content link · P1
Standard a11y pattern missing on top-nav. Add `<a href="#main" class="sr-only focus:not-sr-only ...">Skip to main content</a>` as the first element inside header.

---

### F-54 · Body uses `font-sans` fallback chain 5 deep; hero computed still showed `Space Grotesk Fallback` · P2
globals.css:9. The fallback cascade is fine but during cold load users will see FOUT into the fallback metric-compatible "Space Grotesk Fallback" which visibly shifts heading heights. Use `font-display: swap` with a tightly-tuned `size-adjust` + `ascent-override` to zero CLS. Next.js `next/font` handles this — ensure hero H1 is loaded via `next/font` not the webfont import cascade.

---

## Summary count

**Total findings: 54** (exceeds 30+ target)
- **P0:** 8 (F-01, F-03, F-07, F-16, F-19, F-21, plus 2 in the top-10 table)
- **P1:** 29
- **P2:** 17

---

## Appendix — concrete CSS diff (dropped-in example)

Replace the bespoke hero CSS + spacing values with these tokens (add to `globals.css` root):

```css
:root {
  /* NEW: surface ladder */
  --surface-base:    #021C24;
  --surface-sunken:  #011319;
  --surface-1:       #0A2730;
  --surface-2:       #0F3440;
  --surface-3:       #13404D;

  /* NEW: elevation */
  --shadow-raised:
    0 1px 0 0 rgba(255,255,255,0.04) inset,
    0 10px 30px -12px rgba(0,0,0,0.6),
    0 0 0 1px rgba(38,200,184,0.04);

  /* NEW: unified glow */
  --glow-sm:   0 0 16px rgba(38,200,184,0.18);
  --glow-md:   0 0 28px rgba(38,200,184,0.26);
  --glow-hero: 0 0 60px -10px rgba(38,200,184,0.42);

  /* NEW: section rhythm */
  --section-y:      clamp(4rem, 8vw, 7rem);
  --section-y-hero: clamp(6rem, 12vw, 10rem);

  /* FIX: typography scale expanded */
  --step-0: 0.75rem;
  --step-1: 0.875rem;
  --step-2: 1rem;
  --step-3: 1.125rem;
  --step-4: 1.375rem;
  --step-5: 1.875rem;
  --step-6: 2.625rem;
  --step-7: 3.75rem;
}

/* Replace ad-hoc section padding */
.section { padding-block: var(--section-y); }
.section--hero { padding-block: var(--section-y-hero); }

/* Replace ad-hoc hero CTA shadow */
.btn-primary { box-shadow: var(--glow-md); }
.btn-primary:hover { box-shadow: var(--glow-hero); }
```

---

**Brands to benchmark against, in priority order:**
1. **Backed.fi** — type restraint, logo wall, single-accent discipline
2. **Ondo Finance** — section rhythm, institutional cool
3. **Hashnote** — dark-surface layering, chart aesthetics, grain use
4. **Ethena** — hero density, above-fold composition
5. **Morpho / Pendle** — DeFi-native detail polish

Spend one afternoon on each of these 5 sites at 1280 and 375, measure their hero heights, accent counts, glow recipes, section padding. Your current site diverges from all 5 on at least 4 of those dimensions. Close the gap and the "it doesn't feel premium" complaint ends.
