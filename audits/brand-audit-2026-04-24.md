# SHIFT Brand Consistency Audit

**Auditor:** Brand Guardian
**Date:** 2026-04-24
**Scope:** `https://shift-rwa.vercel.app/` — `/`, `/trade/TSL2L`, `/rewards`, `/blog`, `/blog/shift-academy-1-breaking-down-tokenized-stocks`, `/team`. Desktop 1440×900 and mobile 390×844.
**Brand tokens under audit:** Midnight `#021C24`, Protocol Mint `#26C8B8`, Tidal Steel `#07638C`, Off-White `#EDEEEE`. Ticker `SHFT`. Marshall Islands ART framework. Positioning tier: Ondo / Hashnote / Backed.fi (sophisticated RWA infrastructure, not memecoin).

Severity legend: **P0** = dilutes brand or signals "amateur"; **P1** = inconsistent / inharmonious; **P2** = polish.

---

## Executive summary

The visual system (colors, spacing, ticker card design, type scale) is already premium and on-brand — the skeleton is there. The damage is done almost entirely in **writing** and **casing**: the product is referred to by at least **five different names** in copy ("SHIFT", "Shift", "SHIFT Finance", "SHIFT Platform", "Shift Academy"), tickers are formatted three different ways ("SHFT", "$SHFT", "SHIFT token"), trading hours are claimed two different ways ("24/7" vs "24/5"), and category labels disagree between the filter row and the cards ("Signal / Academy / General" vs "The SHIFT Signal / Shift Academy / General"). A Tier-1 RWA protocol should read like it was written by one senior editor. Today it reads like four contractors shipped copy into the same CMS and nobody QA'd the terminology sheet.

Secondarily: AI-generated blog thumbnails feel visibly "AI", the header logo is a rasterized gradient PNG (not SVG), one team photo is broken, and mint is slightly overused on secondary/tertiary actions where Tidal Steel would carry the job better and make the mint CTA feel more valuable.

---

## P0 — Findings that dilute brand

### P0-1. Brand name used in five different forms across the same site
**Where:** Throughout. Examples on `/blog/shift-academy-1-…` single page:
- "Shift Academy" (pill and H1)
- "Shift Stocks" ("…Shift Stocks make sense…")
- "SHIFT Stocks" ("Every SHIFT Stocks token is backed…")
- "the Shift ecosystem" next to "SHIFT Ecosystem's growth" in the same paragraph
- "the SHIFT platform" vs footer "SHIFT Finance"
- Home hero `<img alt="SHIFT Finance">`, page title "SHIFT Finance", body uses bare "SHIFT"

**Why it hurts:** A premium RWA protocol (Ondo, Backed, Hashnote) writes its own name the same way every time. Five casings inside one blog post reads as if no editorial brief exists.

**Fix:** Lock one style guide rule and enforce via a lint:
- Corporate / legal entity: **SHIFT Finance**
- Product / protocol brand in prose: **SHIFT** (all caps, always)
- Never: "Shift", "Shift Finance", "the SHIFT Platform"
- Sub-brands: **SHIFT Signal**, **SHIFT Academy** (not "Shift Academy")
- Product nouns: **SHIFT Stocks** (not "Shift Stocks")
Ship a repo-level grep CI rule: `grep -RInE "\bShift (Academy|Stocks|Signal|Finance|platform|ecosystem)\b" src/` must return 0.

---

### P0-2. Blog category filter labels don't match the cards
**Where:** `/blog` filter row buttons: **All | Signal | Academy | General**. Cards show pills: **The SHIFT Signal | Shift Academy | General**. Filter button "Academy" is lowercase-title, card pill is "Shift Academy" (mixed casing).

**Why it hurts:** The user clicks "Signal" expecting to see a category and the card is called "The SHIFT Signal" — that's three different surface forms of the same taxonomy value. For a product whose value prop is **trust and transparency** (RWAs), this reads sloppy.

**Fix:** One canonical set:
- **The SHIFT Signal** (long) / **Signal** (short pill/filter)
- **SHIFT Academy** (long) / **Academy** (short)
- **RWA Market** (rename "General" — "General" is a CMS default, not a brand category)
Filter buttons display the short form. Cards display short form on pill. Article titles never embed the category.

---

### P0-3. Ticker `$SHFT` vs `SHFT` vs "SHIFT token" — three forms, no rule
**Where:**
- Home hero farm section: "Earn **$SHFT** tomorrow"
- Home phone mock + rewards headline: "Earn **$SHFT**"
- Blog post: "**$SHFT** is the native utility token", then "**$SHFT** tokens" and "rack up your **$SHFT** points"
- Blog card: "**$SHFT** and SHIFT Stocks"
- Home social block: "convert to **$SHFT** tokens at TGE" (double noun — $SHFT already means the token)
- Footer alt: "SHIFT Finance" img but no token mention anywhere in the footer

**Why it hurts:** Retail crypto uses the `$` sigil; institutional RWA buyers don't. The protocol is positioned at Ondo tier, so the sigil shouldn't show up in prose/headlines. The word "SHIFT token" appears nowhere explicit, so the ticker *is* the brand reference.

**Fix:** Adopt a **typographic ticker rule**:
- In body prose: "the **SHFT** token" (no `$`, no italics, mono optional)
- In prices/tables/tickers: plain `SHFT` (like `TSL2L`)
- Reserve `$SHFT` only for social posts / CTAs aimed at crypto-native farms
- Never say "SHIFT token" (conflates brand with ticker)
- Fix the tautology "$SHFT tokens" → "SHFT"

---

### P0-4. "24/7" vs "24/5" — same page, contradictory
**Where:** Home hero: "24/7 permissionless", "24/7 settlement"; trade page: "24/7 permissionless trading"; **but** blog post `/shift-academy-1` step 7: "SHIFT Stocks holders can redeem assets **24/5** on the issuer platform"; home also says "Custody via Alpaca Markets — **24/5** mint-and-burn rails backing every token".

**Why it hurts:** For a regulated RWA protocol this is a material disclosure question, not stylistic. One is the Solana DEX surface (truly 24/7); the other is mint/burn against the custodian (market hours + after-hours, i.e., 24/5). Mixing them tells sophisticated users you don't understand your own product.

**Fix:** Single rule: **"24/7 trading. 24/5 mint & redeem."** Write it exactly that way everywhere. Never say "24/7 permissionless" without the accompanying mint/burn caveat.

---

### P0-5. `<title>` tags are inconsistent across pages
**Where:**
- Home: `SHIFT — 3× & 2× Bi-Directional Tokenized Stocks. No Liquidations.` (em dash, no "Finance")
- Trade: `TSL2L · TSLA long 2 · SHIFT Finance` (middle dots)
- Rewards: `Rewards — Earn $SHFT · SHIFT Finance` (em dash + middle dot + `$`)
- Blog: `Blog · SHIFT Finance`
- Blog post: `Shift Academy #1: Breaking Down The Tokenized Stocks — SHIFT Finance · SHIFT Finance` — **brand doubled**
- Team: `Team | SHIFT · SHIFT Finance` (pipe + middle dot + brand **shortened**)

**Why it hurts:** SERP snippets and browser tabs. Doubled brand ("SHIFT Finance · SHIFT Finance") is an obvious bug. Three different separators (`—`, `·`, `|`) across six pages.

**Fix:** One template: `{Page Title} · SHIFT` — drop "Finance" everywhere except legal. Use only `·` (middle dot) as separator. Root home is `SHIFT — Leveraged tokenized stocks, zero liquidation` (no brand suffix). Add a Next.js `metadata.title.template = "%s · SHIFT"` in the root layout; remove hard-coded titles on blog/post/team pages.

---

### P0-6. Header logo is a rasterized gradient PNG
**Where:** `/_next/image?url=%2Fbrand%2Fshift-lockup-gradient-light.png&w=128&q=75` — served at 123.6 × 28 CSS px from a 128×? PNG. On retina or 2×, it's already sub-sharp; on mobile 390px it renders at 123.6 × 28 from a 128w source — visibly soft.

**Why it hurts:** A tier-1 RWA protocol's wordmark is the single most reused brand surface. Ondo, Hashnote, Backed all use SVG wordmarks. A blurry gradient PNG is the single fastest brand-tier downgrade on the site.

**Fix:** Export lockup + isolated mark as **SVG** with the gradient as an inline `<linearGradient>` using brand tokens (mint → tidal-steel). Set a minimum height of 20px, horizontal clear space = cap-height of "S", enforce via a `<Logo size="sm|md|lg">` component so sizing cannot drift per page. Keep a monochrome off-white variant for dark-on-image contexts.

---

### P0-7. One team photo is 404 / 0×0 broken
**Where:** `/team` — `Sudip Banerjee` image `<img src="/team/sudip.jpg">` reports `naturalWidth: 0, naturalHeight: 0`. All nine other team photos are 200×200. Advisor row therefore has one empty-frame card.

**Why it hurts:** A missing team photo on an RWA protocol's "Leadership" page is a trust hit. Users reading team/advisor pages are due-diligence users (investors, partners, BD).

**Fix:** Immediate: upload `/public/team/sudip.jpg` at 400×400 JPG, same framing/treatment as siblings. Longer: add a visual regression test that asserts every `<img>` in `team-section` has `naturalWidth > 0`.

---

### P0-8. AI-generated blog thumbnails feel off-brand
**Where:** `/blog` — 17 cards, all with hero images at uniform aspect ratio. Several thumbnails (e.g., "The 99 Ways to Go…", "Tokenized Commodities…", "The SHIFT Signal #3…") look distinctly like Midjourney / SDXL renders — soft-focus towers, glowing coins, generic "financial future" imagery. They clash with the Midnight/Mint/Tidal-Steel discipline shown in the product UI.

**Why it hurts:** Every tier-1 RWA competitor uses either (a) editorial photography of real people/infrastructure, (b) custom abstract geometric illustration, or (c) no hero image at all. Glossy AI slop immediately brands you as meme-coin tier.

**Fix:** Kill AI-generated photoreal thumbnails entirely. Replace with one of three systems, pick one and hold:
1. **Geometric / data-viz** — abstract charts, token diagrams, Solana grids, in brand palette only. One template per category.
2. **Typographic** — giant title over Midnight with a Tidal Steel → Mint gradient bar. Zero imagery. This is the lowest-effort, highest-taste path.
3. **Editorial photography** — commissioned or licensed, real people / real objects, desaturated and tinted with a 10% Midnight overlay.
Enforce via `getBlogThumbnail(category)` returning the same geometric template pattern per category.

---

## P1 — Inconsistent

### P1-9. Mint is overused on tertiary actions
**Where:** `/` — mint appears on: primary CTA (correct), "Full team + advisors" link, "See all markets" link, "View all" link, FAQ open icons, checkmark rows, live status dot, wallet-card accents, trade chart buttons, badge icons. Count: **11+ distinct elements** color-coded mint on the homepage alone.

**Why it hurts:** Mint is your scarcest, most signature color. If every link is mint, the mint **CTA button** stops feeling like an action and starts feeling like chrome.

**Fix:** Hierarchy rule:
- **Mint (#26C8B8):** reserved for primary CTA buttons + live/positive status only
- **Off-white (#EDEEEE) at 90%:** secondary text links
- **Off-white with mint underline on hover:** tertiary text links ("Full team", "See all markets", "View all")
- **Tidal Steel (#07638C):** icon accents, non-actionable highlights, bullet checks
Visually: roughly 70% off-white, 20% tidal-steel, 10% mint.

---

### P1-10. Voice swings between institutional and memey
**Where:** Home section headers demonstrate the spread:
- Institutional & specific: "Built by operators, not just builders.", "Trade the names that actually move.", "Three ways to get leverage. Only one keeps you in the trade." ← on-brand
- Aggressive / retail-crypto: "Boring spot stocks crawl 1% a day. Perps blow you up on a wick.", "One 5% wick. Gone.", "Perps blow you out at the exact bottom." ← tonal mismatch with team/backer copy
- Hype / founder-deck: **"Wall Street For Crypto."** (hero H1) ← broad claim, no specificity, reads like a pitch deck headline not a product

**Why it hurts:** The product page (`/trade/TSL2L`) uses careful language about "daily reset and compounding" and Direxion warnings. The hero contradicts that register with "Wall Street For Crypto." The reader pattern-matches to "meme." Ondo's hero: "The gateway to tokenized real-world assets." Backed's: "Real World Assets, tokenized." They are specific and under-hyped on purpose.

**Fix:**
- Replace hero H1 with a specific, technical claim. Suggested: **"Leveraged tokenized stocks without the liquidation engine."** Sub: "3× and 2×, long or short, fully on-chain, 24/7 on Solana."
- Keep the "broken extremes" comparison but tone down — "Perps liquidate you on a 5% wick" reads more credible than "blow you up / blow you out" (twice).
- Ban "the future of finance" / "Wall Street for X" framing protocol-wide.

---

### P1-11. "DeFAI SuperApp" clashes with the rest of the register
**Where:** `/blog/shift-academy-1` final section: _"SHIFT is building the product that sits at that exact moment of transition: a **DeFAI SuperApp** that scans DeFi for the best LP yields on tokenized stock positions…"_

**Why it hurts:** "DeFAI" and "SuperApp" are both 2024 crypto Twitter jargon. The rest of the post is careful (Chainlink PoR, Marshall Islands ART, McKinsey RWA projections). One phrase breaks the voice and tells an institutional reader "they're chasing a narrative."

**Fix:** Replace with substance: "an on-chain execution layer that routes leveraged RWA positions across DEX liquidity on Solana." Ban the term "SuperApp" from the editorial style guide.

---

### P1-12. Competitor language is hostile where it should be educational
**Where:** "Perps" section: "Liquidating. One 5% wick. Gone." / comparison table labeled "Perps" with ✗s. "Boring. Tesla moves 1.4% a day. That's not a market. That's a savings account."

**Why it hurts:** The audience SHIFT wants — sophisticated derivatives traders who already use perps — will read this as "they don't respect my product." Educational positioning ("perps are a great tool for X; leveraged tokens solve Y") builds credibility and doesn't alienate the user cohort you'd most want converting from Hyperliquid / dYdX.

**Fix:** Soften to product-neutral comparative:
- "Spot stocks" → "Spot ETFs → daily beta of ~1%. Fine for long-duration holders."
- "Perps" → "Perps → unlimited leverage, funding fees, liquidation risk."
- "SHIFT" → "2× and 3× daily target, no liquidation engine, SPL token you hold in any wallet."
Neutral comparative tables are a standard Tier-1 move (Ondo does this; so does Backed).

---

### P1-13. Backer and integration logos are a size / treatment mishmash
**Where:** Home "Backed by" row mixes full rectangular logos (SNZ Holding, Chainlink), all-text blocks (PRIM3 VC — no image), lockup-with-tagline cards ("Founder of GMX", "US CEO of Kraken"). "Plugged into where capital already flows" row mixes bright brand-color marks (Jupiter, Meteora) with white monochrome marks (Solana, Chainlink).

**Why it hurts:** Two problems. First, the "Backed by" row mixes three **semantic types** — VCs, exchanges, individual-angel callouts like "Founder of GMX" — in the same visual row with no separation. Reader can't tell if Kraken is a backer, an integration, or an advisor. Second, the integrations row mixes colored and mono marks so the eye ends up on whatever is brightest (Jupiter, OKX) rather than the most meaningful (Chainlink, Solana).

**Fix:**
- Split "Backed by" into **two sub-sections**: "Investors" (SNZ, PRIM3, ChainGPT) and "Angels & Operator Backers" (GMX founder, dAppRadar founder, Kraken US CEO, etc.). Individual angels get a uniform portrait-and-role card; institutions get logo-only cards.
- Force all integration logos to a single monochrome off-white treatment with 70% opacity, hover reveals brand color. All heights normalized to 24px. This is the Ondo/Backed standard.

---

### P1-14. Icon system is consistent (lucide) — except where it isn't
**Where:** 84 lucide imports across 50 components (good). But several places use inline `<svg>` or `<img>` with custom SVGs: trade chart iframe's own icon set (TradingView, out of our control — ok), backer/integration logos as `<img>` of `.svg` (ok), **but** home "Two broken extremes" cards each have a unique illustration asset (`/spot-stocks-illustration.svg`-style), and the Live/positive indicators, shield icons, and zap icons are all rendered with lucide — consistent. Airdrop / referrals / settings use lucide. The issue is primarily that the one-off illustrations in the "extremes" cards aren't part of a named illustration system.

**Why it hurts:** P1, not P0 — the baseline is good. But the three illustration assets (spot / perps / SHIFT) don't have a stated style and are fragile if a fourth ever has to join.

**Fix:** Document a 1-line illustration rule: "All editorial illustrations are flat, 2-tone (Off-White + one accent), stroke 1.5px, rendered via React components in `/components/illustrations/`. No raster assets except the favicon." Add new illustrations through the component API.

---

### P1-15. Trade page has two different token-card styles
**Where:** `/trade/TSL2L` header shows the ticker as `TSL2L | $175.60 | ▲ +2.41% 24h | Underlying: TSLL | Chainlink oracle` — horizontal inline pills. Home "SHIFT fixes both" card shows tickers as vertical chips (icon + ticker + leverage label). Home "Trade the names that actually move" card shows tickers as large rows (icon + leverage pill + ticker + description + price + delta).

**Why it hurts:** Three different treatments of the same entity (a SHIFT Stock ticker) on three adjacent surfaces. Each alone is fine; together they look like different products.

**Fix:** Define a **`<TickerCard size="xs|sm|md|lg">`** primitive. All four sizes show the same elements in the same order (symbol icon → ticker mono → leverage pill → optional price → optional underlying). Ban bespoke token displays.

---

### P1-16. Underlying ticker convention is unclear
**Where:** `/trade/TSL2L` says `Underlying: TSLL` (Direxion's 2× Tesla ETF). Homepage tiles say "TSLA long 2", "S&P 500 long 3", "Semiconductor long 3". Blog says "a TSLA" ("When SHIFT issues a token — say, a TSLA…"). So the same concept appears as `TSLL` (ETF), `TSLA` (underlying), and informal "Tesla".

**Why it hurts:** The ART framework (Marshall Islands) treats the backing asset as a legal disclosure. Calling it TSLA on the home page and TSLL on the trade page sounds like a bug to anyone reading closely — and the SEC/MFSA would read it as a material statement inconsistency.

**Fix:** Ticker nomenclature rule to be written once and QA-enforced:
- **SHIFT ticker** (what we issue): e.g., `TSL2L`
- **Backing asset** (what we custody): e.g., Direxion TSLL ETF
- **Reference underlying** (what the ETF tracks): e.g., TSLA
All three always displayed in that order in legal / fact-sheet surfaces. Marketing surfaces can use only the first two.

---

### P1-17. Blog author is always "The SHIFT Team"
**Where:** Every one of the 17 blog posts lists author as "The SHIFT Team". Trade-education + regulatory RWA pieces benefit from named authorship (especially with an ex-Israel Securities Authority counsel and an ex-Flow Traders CTO on staff).

**Why it hurts:** E-E-A-T for SEO, trust for compliance readers, and on-brand for a team that's positioning "built by operators." Competitor pages (Ondo blog, Galaxy research) sign posts by name and role.

**Fix:** Add `author: { name, role, linkedin }` to blog frontmatter. Ghost-write under SHIFT Team only for announcements; all educational and market-commentary posts get signed by Daniel / Thomas / Shoham. Surface the author photo in the card and post hero.

---

### P1-18. Read-time and date formats drift
**Where:** Home blog block: `Jan 14, 2026 · 7 min`. Blog index: `January 14, 2026 · 7 min read`. Blog post page: `January 28, 2026 · 8 min read`. Related posts on post page: `March 1, 2026 · 6 min read`.

**Why it hurts:** Short vs long month name, "min" vs "min read" — two formats for the same meta strip.

**Fix:** One format globally: `Jan 14, 2026 · 7 min read`. Define in `formatPostMeta(post)`; remove all ad-hoc formatters. Short month, with "min read" always.

---

### P1-19. "Launch App" vs "Open the app" vs "Connect wallet" — one primary action, three labels
**Where:** Home nav button: "Launch App". Home hero: "Launch App". Home connect section: "Connect wallet". Blog post CTA: "Open the app". Rewards: "Notify me at TGE" (different action, that's fine).

**Why it hurts:** These are the three labels for the **same link** (`/app`). Brand voice is about repetition; one action = one label.

**Fix:** Canonical label = **"Launch app"** (lowercase app). "Connect wallet" only inside the app once the user has already clicked Launch. Blog post CTA at the end → "Launch app →" to match.

---

### P1-20. `/rewards` page feels written by a different hand
**Where:** Rewards page copy: "Earn from every shift." "Every trade earns on-chain XP. XP unlocks fee rebates, tighter spreads…" Badges labeled "Navigator / Operator / Strategist / Sovereign" — capitalized like a game tier. Disclaimer at the bottom: "Program parameters are not final. Badges, XP rates, and rebates may change before launch."

**Why it hurts:** "Earn from every shift" is a **pun on the brand name**. Premium brands don't pun on themselves. "Sovereign" tier is a real stretch for a fee-rebate program. Combined with the home hero claim "Wall Street For Crypto", the site's voice is slipping into retail-gamified territory that undermines the Ondo-tier positioning.

**Fix:**
- Replace "Earn from every shift." with "Rewards accrue on every trade."
- Rename tiers to something earned, not royal: **Trader / Pro / Principal / Desk**. "Desk" implies OTC access (which the current top tier actually offers).
- Keep the parameters-not-final disclaimer but move it up next to the waitlist form (trust-forward placement, not buried).

---

### P1-21. Home "Live markets" shows demo prices as if they're live
**Where:** Home markets grid: "$175.60 +2.41%", "$42.77 -2.41%" — notice TSL2L long is +2.41 and TSL1S short is exactly -2.41. Also SPX3L/SPX3S are exactly +0.84/-0.74 (not mirrored but symmetric). These are clearly static demo values.

**Why it hurts:** The section header says "Live markets". A sophisticated user will see the perfectly symmetric values and know instantly that this is a mock. Kills trust on a page that otherwise claims "Chainlink Proof-of-Reserves".

**Fix:** Either (a) wire to live price feed with a last-updated timestamp, or (b) change the label to "Example markets" / "Live on app →" and remove dollar figures from the card. The second is cheaper and still on-brand.

---

### P1-22. Phone mockup ("Total Net Worth $87,218.18") is a stock-photo
**Where:** Home "Connect your wallet" section shows a phone with a demo portfolio: `$87,218.18` with `+2.41%` (again +2.41). It's a nice mock but it's also obviously static — and the dollar amount is high enough to read as aspirational / promotional.

**Why it hurts:** Same problem as P1-21 — static fake portfolio numbers on a page that sells itself on on-chain transparency. Tier-1 protocols typically show either (a) real aggregated protocol TVL, or (b) no dollar value at all, just UI shape.

**Fix:** Replace `$87,218.18` with a generic `$—,———.——` shimmer placeholder or, better, render the real demo wallet's value pulled from devnet. If that's too expensive, change the portfolio to a de-emphasized grey layout with "Your portfolio, on-chain" centered.

---

## P2 — Polish

### P2-23. "Att." title prefix looks odd to US readers
**Where:** Team page — "Att. Daniel Liven", "Att. Shoham Ben Rubi". "Att." is common in parts of EU/Israel (Attorney) but reads as an abbreviation typo to US readers.

**Fix:** Either spell it out — "Daniel Liven, Esq." or "Daniel Liven (Attorney)" — or drop the prefix entirely and rely on the role label below the name. Consistency with the non-lawyer team members (no prefix) is the stronger move.

### P2-24. Footer legal copy is pragmatic but bland
**Where:** `© 2026 SHIFT Finance. Trading involves risk. Not investment advice.`

**Fix:** A tier-1 RWA protocol footer is an opportunity to surface Marshall Islands ART framework + Chainlink PoR link + Alpaca custody link + audit reports. Those are trust signals, not legal burden. Add a compact "Regulated under Marshall Islands ART · Chainlink PoR · Alpaca Markets custody" row above the copyright.

### P2-25. "Frequently asked." (H2 with trailing period)
**Where:** Home FAQ header. Trailing periods are used on some headlines ("Wall Street For Crypto.", "Boring.", "Frequently asked.") and not others ("Two broken extremes." has one but "The team behind the technology." also has one — this is consistent-ish, but "Read the SHIFT thesis." and "Read next." both have one). The rule here is soft but visible.

**Fix:** Keep the period style — it's distinctive — but document it explicitly: "All H1/H2 end in a period. H3 never do." Audit for stragglers.

### P2-26. `All systems operational` status pill is hardcoded
**Where:** Every page footer shows the pill, green dot. If the product ever has an incident, this string is a lie until someone manually changes it. Not a brand issue today; a brand credibility issue on the first outage.

**Fix:** Wire to `/status` endpoint; fall back to "Status →" link without a color claim.

### P2-27. Favicon is a single emoji / simple mark
**Where:** `/favicon.ico`, `/icon.tsx`, `/apple-icon.tsx` — good that these exist as Next.js routes. Visually the mark is simple and reads. No issue; flagging for completeness.

**Fix:** None needed. Maintain SVG source.

### P2-28. "SHIFT Signal" newsletter CTA appears on blog index + every blog post — same block
**Where:** Identical "Subscribe to the SHIFT Signal" form at bottom of `/blog` and at bottom of every post.

**Fix:** Not a bug. But consider personalizing the post-variant: "Liked this Academy piece? Get the next one in your inbox." Small tonal lift.

### P2-29. `Launch App` capitalization in nav button
**Where:** Nav button: "Launch App" (Title Case). Body CTAs: "Launch App" too. Blog post: "Open the app" (sentence case).

**Fix:** Covered in P1-19. Pick sentence case ("Launch app") — it's more premium and matches Linear/Vercel-tier SaaS conventions.

### P2-30. Social share image inconsistency
**Where:** `opengraph-image.tsx` exists at root, `/blog`, `/blog/[slug]` — good. Not audited visually yet, but given the rest of the system I'd expect these to be on-template.

**Fix:** Manually verify that OG cards across the three scopes share the exact same layout, type, and palette. Lock via a shared `<OgCard>` JSX helper.

### P2-31. "Seed Closed" and "Seed raised" appear with slightly different labels
**Where:** Home "$2M / Seed Closed" vs farm section "$2M / Seed raised".

**Fix:** One label: "$2M seed raised" (sentence case). Apply everywhere.

### P2-32. "Liquidity Raised" vs "Liquidity raised"
**Where:** Home stat: "$40M+ · Liquidity Raised" (title case). Farm section: "$40M+ · Liquidity raised" (sentence).

**Fix:** All stat labels in sentence case. No title case in stat chrome.

---

## Top priorities (first two sprints)

1. **Terminology lock-down** (P0-1, P0-3, P0-4, P0-5, P1-17, P1-18, P1-19, P2-31, P2-32) — write a 2-page editorial style guide; add repo grep CI; single `metadata.title.template`.
2. **Logo & visual primitives** (P0-6, P0-7, P1-15) — ship SVG logo, `<Logo>` and `<TickerCard>` primitives, fix Sudip photo.
3. **Voice & positioning rewrite** (P1-10, P1-11, P1-12, P1-20) — new hero H1, soften comparison table, de-pun the rewards page.
4. **Blog thumbnail system** (P0-8) — pick typographic-only or geometric-only; ban AI photoreal.
5. **Taxonomy unification** (P0-2) — Signal / Academy / RWA Market; rename "General".

---

## Appendix: brand token audit pass

Confirmed in `src/app/globals.css`:

- `--midnight: #021C24` ✓ matches spec
- `--mint: #26C8B8` ✓ matches spec
- `--tidal-steel: #094058` and `--tidal-steel-adj: #07638C` — **note:** spec says Tidal Steel = `#07638C`; CSS defines **two** variants (`#094058` base, `#07638C` "adjusted"). Pick one canonical — recommend `#07638C` per spec and rename to `--tidal-steel` outright; move `#094058` to `--tidal-steel-900` if retained as a shade.
- `--off-white: #EDEEEE` ✓
- `--destructive: #FF4D6A` — adds a color not in the spec; coral-red clashes with the mint/steel/midnight system on an otherwise cool palette. Consider a muted warning color like `#F4A15D` (amber) that lives in the same warmth region, or a desaturated `#C44A5E`.
- Chart palette uses only cool tones (✓) — good, matches spec.

Type scale is 7-step and sound (12 / 14 / 16 / 20 / 30 / 48 / 72). The hero currently uses the 72px step for "Wall Street For Crypto." — visual treatment is on-spec; only the copy is off (see P1-10).
